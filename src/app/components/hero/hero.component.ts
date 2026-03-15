import { Component, AfterViewInit, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead.service';
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

  estimateForm = this.fb.group({
    tipo: ['', Validators.required],
    alcance: ['Mediano'],
    mensaje: [''],
    contacto: ['', [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+\d{8,15})$/)]]
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
  ) {
    this.estimateForm.get('contacto')?.valueChanges.subscribe(value => {
      if (value && value.startsWith('+')) {
        const normalized = '+' + value.replace(/[^0-9]/g, '');
        this.estimateForm.get('contacto')?.setValue(normalized, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.formDataService.resetHeroForm$.subscribe(reset => {
      if (reset) {
        this.estimateForm.reset({ tipo: '', alcance: 'Mediano', mensaje: '', contacto: '' });
        this.estimateResult = '';
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
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (this.estimateForm.invalid) {
      this.estimateForm.markAllAsTouched();
      this.estimateResult = '❌ Por favor, completa los campos obligatorios correctamente.';
      return;
    }

    const { tipo, alcance, contacto, mensaje } = this.estimateForm.value as { tipo: string; alcance: string; contacto: string; mensaje: string };
    const hits = Math.ceil((this.weights[tipo] ?? 1) * (this.alcanceMul[alcance] ?? 1.6));
    const estimado = this.baseUSD * hits;

    this.estimateResult = `✅ Estimación referencial: ~USD ${estimado.toLocaleString()} en ${hits} hitos.\nTe escribimos a: ${contacto}.`;
    this.isSubmitting = true;

    const now = new Date();
    const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    this.leadService.saveLead({ fecha, tipo, alcance, contacto, mensaje, hits, estimado }).subscribe({
      next: () => {
        this.estimateResult += '\n✅ Lead enviado exitosamente.\n📲 Hacé clic en el ícono de WhatsApp para contactarnos.';
        this.isSubmitting = false;
      },
      error: () => {
        this.estimateResult = '❌ Error al enviar el lead. Por favor, intentalo de nuevo.';
        this.isSubmitting = false;
      }
    });

    this.whatsAppService.updateWaLink(this.buildWhatsMsg({
      email: contacto,
      whatsapp: contacto,
      mensaje: `[Estimación] Tipo: ${tipo} | Alcance: ${alcance} | Hits: ${hits} | Estimación ~USD ${estimado}`
    }));
  }

  buildWhatsMsg({ nombre = '', email = '', whatsapp = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const isPhone = /^\+\d{8,15}$/.test(email);
    let message = `🚀 Quiero comunicarme con los administradores de Órbita, me interesa sus servicios 🌟\n` +
                  `👤 Nombre: ${nombre || '—'}\n`;
    message += isPhone ? `📱 WhatsApp: ${whatsapp || '—'}\n` : `📩 Email: ${email || '—'}\n`;
    message += `💬 Mensaje: ${mensaje || '—'}`;
    return `whatsapp://send?phone=${environment.waPhone}&text=${encodeURIComponent(message)}`;
  }


getTipoError(): string {
    const tipoControl = this.estimateForm.get('tipo');
    return tipoControl?.hasError('required') ? 'El tipo de proyecto es obligatorio.' : '';
  }

getContactoError(): string {
    const contactoControl = this.estimateForm.get('contacto');
    if (contactoControl?.hasError('required')) {
      return 'El email o WhatsApp es obligatorio.';
    } else if (contactoControl?.hasError('pattern')) {
      return 'Ingresa un email válido (ejemplo@dominio.com) o un número de WhatsApp válido (e.g., +54 9 11 26911817).';
    }
    return '';
  }
}
