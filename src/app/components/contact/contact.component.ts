import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { WhatsAppService } from '../../services/whats-app.service';
import { FormDataService } from '../../services/form-data.service';
import { LeadService } from '../../services/lead.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  contactForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.email]],
    //whatsapp: [''],
    whatsapp: ['', [Validators.pattern(/^\+\d{8,15}$/)]],
    mensaje: ['']
  });

  contactStatus: string = '';
  waLink: string = '';

  constructor(private fb: FormBuilder, private storageService: StorageService, private leadService: LeadService,private whatsAppService: WhatsAppService, private formDataService: FormDataService) {}

ngOnInit() {
this.formDataService.heroData$.subscribe(data => {
    if (data) {
      const isPhone = /^\+\d{8,15}$/.test(data.contacto);
      this.contactForm.patchValue({
        mensaje: data.mensaje, // Mensaje ingresado en Hero
        email: isPhone ? '' : data.contacto,
        whatsapp: isPhone ? data.contacto : ''
      });
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


    getNombreError(): string {
    const nombreControl = this.contactForm.get('nombre');
    return nombreControl?.hasError('required') ? 'El nombre es obligatorio.' : '';
  }

  onSubmit0() {
    if (this.contactForm.valid) {
      const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
      this.storageService.saveInbox({ t: Date.now(), ...payload });

      const subject = encodeURIComponent('Consulta desde Órbita Software');
      const body = encodeURIComponent(
        `Nombre: ${payload.nombre}\nEmail: ${payload.email}\nWhatsApp: ${payload.whatsapp || '-'}\n\nMensaje:\n${payload.mensaje}`
      );
      const mailto = `mailto:contacto@orbita.software?subject=${subject}&body=${body}`; // TODO: Reemplazar email
      window.location.href = mailto;

      this.contactStatus = 'Gracias, abrimos tu cliente de correo para enviar la consulta.';
    }
  }

onSubmit() {
  if (this.contactForm.valid) {
    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    const heroData = this.formDataService.heroDataSource.getValue();

    const lead = {
      ...heroData,
      nombre: payload.nombre,
      email: payload.email || (heroData && !/^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      whatsapp: payload.whatsapp || (heroData && /^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      mensaje: payload.mensaje || (heroData?.mensaje || '')
    };

    this.storageService.saveInbox({ t: Date.now(), ...payload });
    this.leadService.saveLead(lead).subscribe({
      next: (response) => {
        console.log('Lead guardado en el backend:', response);
        this.contactStatus = '✅ Lead enviado exitosamente al servidor.\n📲 Haz clic en el ícono de WhatsApp para contactarnos.';
        this.contactForm.reset(); // Resetear el formulario
        this.formDataService.clearHeroData();
        this.formDataService.triggerHeroFormReset();

      },
      error: (error) => {
        console.error('Error al enviar lead:', error);
        this.contactStatus = '❌ Error al enviar el lead. Por favor, inténtalo de nuevo.';
      }
    });

    const waMessage = {
      nombre: payload.nombre,
      email: payload.email || (heroData && !/^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      whatsapp: payload.whatsapp || (heroData && /^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      mensaje: payload.mensaje || (heroData ? `[Estimación] Tipo: ${heroData.tipo} | Alcance: ${heroData.alcance} | Hits: ${heroData.hits} | Estimación ~USD ${heroData.estimado}${heroData.mensaje ? '\nMensaje adicional: ' + heroData.mensaje : ''}` : '')
    };
    const waLink = this.buildWhatsMsg(waMessage);
    console.log('waLink generado en ContactComponent:', waLink); // Depuración
    this.whatsAppService.updateWaLink(waLink);
    this.contactStatus += '\n✅ Mensaje preparado. Haz clic en el ícono flotante de WhatsApp para enviar.';
  } else {
    this.contactForm.markAllAsTouched();
    this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
  }
}

onWhatsAppClick0() {
  if (this.contactForm.valid) {
    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    const heroData = this.formDataService.heroDataSource.getValue();
    const waMessage = {
      nombre: payload.nombre,
      email: payload.email,
      whatsapp: payload.whatsapp,
      mensaje: payload.mensaje
    };
    const waLink = this.buildWhatsMsg(waMessage);
    console.log('waLink generado en ContactComponent:', waLink); // Depuración
    this.whatsAppService.updateWaLink(waLink);
    this.contactStatus = '✅ Mensaje preparado. Haz clic en el ícono flotante de WhatsApp para enviar.';
  } else {
    this.contactForm.markAllAsTouched();
    this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
  }
}

onWhatsAppClick() {
  if (this.contactForm.valid && this.contactForm.get('nombre')?.value) {
    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    const heroData = this.formDataService.heroDataSource.getValue();
    const waMessage = {
      nombre: payload.nombre,
      email: payload.email || (heroData && !/^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      whatsapp: payload.whatsapp || (heroData && /^\+\d{8,15}$/.test(heroData.contacto) ? heroData.contacto : ''),
      mensaje: payload.mensaje || (heroData?.mensaje || '')
    };
    const waLink = this.buildWhatsMsg(waMessage);
    console.log('waLink generado en ContactComponent:', waLink); // Depuración
    if (waLink) {
      window.location.href = waLink; // Abrir WhatsApp directamente
      this.contactStatus = '✅ Mensaje enviado a WhatsApp.';
      setTimeout(() => {
        if (!document.hidden) {
          Swal.fire({
            title: 'Error',
            text: 'Asegúrate de tener WhatsApp instalado.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }, 3000);
    }
  } else {
    this.contactForm.markAllAsTouched();
    this.contactStatus = '❌ Por favor, completa el campo Nombre correctamente.';
    Swal.fire({
      title: 'Error',
      text: 'Por favor, complete el campo Nombre en el formulario de contacto.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}




 buildWhatsMsg({ nombre = '', email = '', whatsapp = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const phone = '5491128634744'; // TODO: Reemplazar con el número real
    if (!nombre) {
      console.log('Error: Nombre es obligatorio para el mensaje de WhatsApp');
      return ''; // No generar enlace si falta el nombre
    }
    const isPhone = /^\+\d{8,15}$/.test(whatsapp || email);
    let message = `🚀 ¡Hola Órbita Software! 🌟\n` +
                  `👤 Nombre: ${nombre}\n`;
    if (isPhone) {
      message += `📱 WhatsApp: ${whatsapp || email || '—'}\n`;
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

}
