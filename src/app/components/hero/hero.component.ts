import { Component, AfterViewInit, ElementRef, OnInit, QueryList, ViewChildren, ViewChild, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EstimateDialogService } from '../../services/estimate-dialog.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WhatsAppService } from '../../services/whats-app.service';
import { FormDataService } from '../../services/form-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;
  @ViewChild('estimateDialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(EstimateDialogService);
  private previousOverflow = '';
  private returnFocus: HTMLElement | null = null;
  private scrollLocked = false;
  estimateWaLink = '';
  estimateEmailLink = '';

  estimateForm = this.fb.group({
    tipo: ['', Validators.required],
    alcance: ['Mediano', Validators.required],
    mensaje: ['', Validators.maxLength(2000)]
  });

  estimateResult = '';
  isSubmitting = false;

  private readonly weights: Record<string, number> = {
    'Landing / Sitio institucional': 1,
    'Web App (SPA/MPA)': 3,
    'E-commerce': 2.5,
    'API / Backend': 2,
    'Integraciones (Mercado Pago / AFIP / etc.)': 1.5,
    'Automatizaciones / Scripts': 1.2
  };

  private readonly alcanceMul: Record<string, number> = {
    'Pequeño': 1,
    'Mediano': 1.6,
    'Grande': 2.4
  };

  private readonly baseUSD = 600;

  constructor(
    private fb: FormBuilder,
    private whatsAppService: WhatsAppService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    this.dialogService.openRequests$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.openEstimate());
    this.destroyRef.onDestroy(() => this.restorePage());
    this.formDataService.resetHeroForm$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reset => {
      if (reset) {
        this.estimateForm.reset({ tipo: '', alcance: 'Mediano', mensaje: '' });
        this.estimateResult = '';
        this.estimateWaLink = '';
        this.estimateEmailLink = '';
      }
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    this.appearElements.forEach((element) => observer.observe(element.nativeElement));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  openEstimate() {
    if (this.dialog.nativeElement.open) return;
    this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.previousOverflow = document.body.style.overflow;
    this.dialog.nativeElement.showModal();
    document.body.style.overflow = 'hidden';
    this.scrollLocked = true;
  }

  closeEstimate() {
    this.dialog.nativeElement.close();
    this.resetEstimateForm();
    this.restorePage();
  }

  private resetEstimateForm() {
    this.estimateForm.reset({ tipo: '', alcance: 'Mediano', mensaje: '' });
    this.estimateResult = '';
    this.estimateWaLink = '';
    this.estimateEmailLink = '';
    this.isSubmitting = false;
  }

  restorePage() {
    if (!this.scrollLocked) return;
    document.body.style.overflow = this.previousOverflow;
    this.scrollLocked = false;
    this.returnFocus?.focus();
  }

  onBackdropClick(event: MouseEvent) {
    const dialog = this.dialog.nativeElement;
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
      this.closeEstimate();
    }
  }

  continueWhatsApp() {
    if (!this.estimateWaLink) return;
    const url = new URL(this.estimateWaLink);
    this.whatsAppService.openNative(url.searchParams.get('text') ?? 'Me interesan tus servicios para crear una solución digital.');
  }

  continueEmail() {
    if (this.estimateEmailLink) window.open(this.estimateEmailLink, '_blank', 'noopener,noreferrer');
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (this.isSubmitting) return;
    for (const [key, value] of Object.entries(this.estimateForm.getRawValue())) {
      let normalized = (value ?? '').trim();
      this.estimateForm.get(key)?.setValue(normalized, { emitEvent: false });
    }
    if (this.estimateForm.invalid) {
      this.estimateForm.markAllAsTouched();
      this.estimateResult = '❌ Por favor, completa los campos obligatorios correctamente.';
      return;
    }

    const { tipo, alcance, mensaje } = this.estimateForm.value as { tipo: string; alcance: string; mensaje: string };
    const hits = Math.ceil((this.weights[tipo] ?? 1) * (this.alcanceMul[alcance] ?? 1.6));
    const estimado = this.baseUSD * hits;

    this.estimateResult = 'Preparando tu estimación…';
    this.estimateWaLink = '';
    this.estimateEmailLink = '';
    this.isSubmitting = true;

    const summary = `Me interesan tus servicios para crear ${tipo.toLowerCase()} con un alcance ${alcance.toLowerCase()}.${mensaje ? `\nDescripción: ${mensaje}` : ''}`;
    this.estimateWaLink = this.whatsAppService.buildLink(summary);
    this.whatsAppService.updateWaLink(this.estimateWaLink);
    this.estimateEmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(environment.contactEmail)}&su=${encodeURIComponent('Consulta de proyecto desde el sitio web')}&body=${encodeURIComponent(summary)}`;
    this.estimateResult = 'Estimación preparada. Elegí WhatsApp o email para enviarnos tu consulta.';
    this.isSubmitting = false;

  }

  buildWhatsMsg({ email = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const label = email.startsWith('+') ? 'WhatsApp' : 'Email';
    return this.whatsAppService.buildLink('Hola Órbita, me interesan sus servicios.\n' + label + ': ' + email + '\nMensaje: ' + mensaje);
  }

  getTipoError(): string {
    const tipoControl = this.estimateForm.get('tipo');
    return tipoControl?.hasError('required') ? 'El tipo de proyecto es obligatorio.' : '';
  }

}


