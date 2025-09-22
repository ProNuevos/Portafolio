import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead.service'; // Importa el nuevo servicio
import { WhatsAppService } from '../../services/whats-app.service';
import { FormDataService } from '../../services/form-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  estimateForm = this.fb.group({
    tipo: ['', Validators.required],
    alcance: ['Mediano'],
    mensaje: [''],
    contacto: ['', [Validators.required, Validators.pattern(/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+\d{8,15})$/)]]


  });

  estimateResult: string = '';
  waLink: string = '';

  private weights: { [key: string]: number } = {
    'Landing / Sitio institucional': 1,
    'Web App (SPA/MPA)': 3,
    'E-commerce': 2.5,
    'API / Backend': 2,
    'Integraciones (Mercado Pago / AFIP / etc.)': 1.5,
    'Automatizaciones / Scripts': 1.2
  };

  private alcanceMul: { [key: string]: number } = {
    'Pequeño': 1,
    'Mediano': 1.6,
    'Grande': 2.4
  };

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private whatsAppService: WhatsAppService,
    private formDataService: FormDataService) {

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
      this.estimateForm.reset({
        tipo: '',
        alcance: 'Mediano',
        mensaje: '',
        contacto: ''
      });
      this.estimateResult = '';
     // this.formDataService.updateEstimateFormValid(this.estimateForm.valid);
       // console.log('Formulario de Hero reseteado');

    }
  });


}

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    this.appearElements.forEach((element) => observer.observe(element.nativeElement));
  }


scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }



onSubmit() {
    if (this.estimateForm.valid) {
      const { tipo, alcance, contacto, mensaje } = this.estimateForm.value as { tipo: string; alcance: string; contacto: string; mensaje: string };
      const baseUSD = 600;
      const hits = Math.ceil((this.weights[tipo] || 1) * (this.alcanceMul[alcance] || 1.6));
      const estimado = baseUSD * hits;

      this.estimateResult = `✅ Estimación referencial: ~USD ${estimado.toLocaleString()} en ${hits} hitos.\nTe escribimos a: ${contacto}.`;

      const now = new Date();
      const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

      const lead = {
        fecha,
        tipo,
        alcance,
        contacto,
        mensaje,
        hits,
        estimado
      };

      console.log('Payload enviado al backend:', JSON.stringify(lead, null, 2));

      this.leadService.saveLead(lead).subscribe({
        next: (response) => {
          console.log('Lead guardado en el backend:', response);
          this.estimateResult += '\n✅ Lead enviado exitosamente al servidor.\n📲 Haz clic en el ícono de WhatsApp para contactarnos.';
        },
        error: (error) => {
          console.error('Error al enviar lead:', error);
          this.estimateResult = '❌ Error al enviar el lead. Por favor, inténtalo de nuevo.';
        }
      });

      this.waLink = this.buildWhatsMsg({
        nombre: 'Nuevo lead',
        email: contacto,
        whatsapp: contacto,
        mensaje: `[Estimación] Tipo: ${tipo} | Alcance: ${alcance} | Hits: ${hits} | Estimación ~USD ${estimado}`
      });
      console.log('waLink generado en HeroComponent:', this.waLink); // Depuración
      this.whatsAppService.updateWaLink(this.waLink);
      // this.formDataService.updateEstimateFormValid(true);
    } else {
      this.estimateForm.markAllAsTouched();
      this.estimateResult = '❌ Por favor, completa los campos obligatorios correctamente.';
      //this.formDataService.updateEstimateFormValid(false);
    }
  }




  buildWhatsMsg({ nombre = '', email = '', whatsapp = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const phone = '5491128634744'; // TODO: Reemplazar con el número real de WhatsApp de Órbita Software (sin '+')

    // Determinar si el contacto es un número de teléfono o un email
    const isPhone = /^\+\d{8,15}$/.test(email); // Usa el mismo patrón que el formulario

    // Construir el mensaje condicionalmente
    let message = `🚀 Quiero comunicarme con los administradores de Órbita, me interesa sus servicios 🌟\n` +
                  `👤 Nombre: ${nombre || '—'}\n`;

    if (isPhone) {
      message += `📱 WhatsApp: ${whatsapp || '—'}\n`;
    } else {
      message += `📩 Email: ${email || '—'}\n`;
    }

    message += `💬 Mensaje: ${mensaje || '—'}`;

    const txt = encodeURIComponent(message);
    const waLink = `whatsapp://send?phone=${phone}&text=${txt}`;
    console.log('Mensaje codificado:', txt); // Depuración
    console.log('URL generada en buildWhatsMsg:', waLink); // Depuración
    return waLink;
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
