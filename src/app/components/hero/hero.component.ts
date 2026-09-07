import { Component, AfterViewInit, ElementRef, OnInit, QueryList, ViewChildren, ViewChild, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EstimateDialogService } from '../../services/estimate-dialog.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead.service';
import { WhatsAppService } from '../../services/whats-app.service';
import { FormDataService } from '../../services/form-data.service';
import { finalize, timeout } from 'rxjs';
import { submissionError } from '../../services/form-utils';
import { emailOrPhoneValidator, normalizePhone } from '../../services/contact-validation';

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

  estimateForm = this.fb.group({
    tipo: ['', Validators.required],
    alcance: ['Mediano', Validators.required],
    mensaje: ['', Validators.maxLength(2000)],
    contacto: ['', [Validators.maxLength(500), emailOrPhoneValidator]]
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
    private leadService: LeadService,
    private whatsAppService: WhatsAppService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    this.dialogService.openRequests$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.openEstimate());
    this.destroyRef.onDestroy(() => this.restorePage());
    this.formDataService.resetHeroForm$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(reset => {
      if (reset) {
        this.estimateForm.reset({ tipo: '', alcance: 'Mediano', mensaje: '', contacto: '' });
        this.estimateResult = '';
        this.estimateWaLink = '';
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
    this.estimateForm.reset({ tipo: '', alcance: 'Mediano', mensaje: '', contacto: '' });
    this.estimateResult = '';
    this.estimateWaLink = '';
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
    if (this.estimateWaLink) this.whatsAppService.open(this.estimateWaLink);
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (this.isSubmitting) return;
    for (const [key, value] of Object.entries(this.estimateForm.getRawValue())) {
      let normalized = (value ?? '').trim();
      if (key === 'contacto' && normalized && !normalized.includes('@')) normalized = normalizePhone(normalized);
      this.estimateForm.get(key)?.setValue(normalized, { emitEvent: false });
    }
    if (this.estimateForm.invalid) {
      this.estimateForm.markAllAsTouched();
      this.estimateResult = '❌ Por favor, completa los campos obligatorios correctamente.';
      return;
    }

    const { tipo, alcance, contacto, mensaje } = this.estimateForm.value as { tipo: string; alcance: string; contacto: string; mensaje: string };
    const hits = Math.ceil((this.weights[tipo] ?? 1) * (this.alcanceMul[alcance] ?? 1.6));
    const estimado = this.baseUSD * hits;

    this.estimateResult = `Estimación referencial: ~USD ${estimado.toLocaleString()} en ${hits} hitos.\nEnviando tu consulta…`;
    this.isSubmitting = true;

    this.leadService.saveLead({ tipo, alcance, contacto, mensaje, hits, estimado }).pipe(timeout(20000), finalize(() => this.isSubmitting = false)).subscribe({
      next: () => {
        this.estimateResult = `✅ Estimación referencial: ~USD ${estimado.toLocaleString()} en ${hits} hitos.\nConsulta enviada. Te escribimos a: ${contacto}.\nTambién podés continuar por WhatsApp.`;
      },
      error: (error: unknown) => {
        this.estimateResult = submissionError(error);
      }
    });

    this.estimateWaLink = this.buildWhatsMsg({
      email: contacto,
      whatsapp: contacto,
      mensaje: `[Estimación] Tipo: ${tipo} | Alcance: ${alcance} | Hitos: ${hits} | Estimación ~USD ${estimado}\n${mensaje}`
    });
    this.whatsAppService.updateWaLink(this.estimateWaLink);
  }

  buildWhatsMsg({ email = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const label = email.startsWith('+') ? 'WhatsApp' : 'Email';
    return this.whatsAppService.buildLink('Hola Órbita, me interesan sus servicios.\n' + label + ': ' + email + '\nMensaje: ' + mensaje);
  }

  getTipoError(): string {
    const tipoControl = this.estimateForm.get('tipo');
    return tipoControl?.hasError('required') ? 'El tipo de proyecto es obligatorio.' : '';
  }

getContactoError(): string {
    const contactoControl = this.estimateForm.get('contacto');
    if (contactoControl?.hasError('maxlength')) return 'Máximo 500 caracteres.';
    if (contactoControl?.hasError('required')) {
      return 'El email o WhatsApp es obligatorio.';
    } else if (contactoControl?.hasError('contactFormat')) {
      return 'Ingresa un email válido (ejemplo@dominio.com) o un número de WhatsApp válido (e.g., +54 9 11 26911817).';
    }
    return '';
  }
}
