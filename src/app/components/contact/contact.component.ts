import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead.service';
import { WhatsAppService } from '../../services/whats-app.service';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contact.service';

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
    email: ['', [Validators.required, Validators.email]],
    whatsapp: ['', [Validators.required, Validators.pattern(/^\+\d{8,15}$/)]],
    mensaje: ['', Validators.required]
  });

  contactStatus: string = '';
  waLink: string = '';

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private contactService: ContactService,
    private whatsAppService: WhatsAppService
  ) {}

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



  onSubmit() {
    if (this.contactForm.valid) {
      const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
      const now = new Date();
      const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

      const contact = {
        fecha,
        nombre: payload.nombre,
        email: payload.email,
        whatsapp: payload.whatsapp,
        mensaje: payload.mensaje
      };

      console.log('Payload enviado al backend:', JSON.stringify(contact, null, 2));

      this.contactService.saveContact(contact).subscribe({
        next: (response) => {
          console.log('Contact guardado en el backend:', response);
          this.contactStatus = '✅ Contact enviado exitosamente al servidor.\n📲 Haz clic en el ícono de WhatsApp para contactarnos.';

          this.waLink = this.buildWhatsMsg(payload);
          console.log('waLink generado en ContactComponent:', this.waLink); // Depuración
          this.whatsAppService.updateWaLink(this.waLink);
         // this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error al enviar contact:', error);
          this.contactStatus = '❌ Error al enviar el contacto. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
      this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
    }
  }


  onWhatsAppClick() {
    if (this.contactForm.valid && this.contactForm.get('nombre')?.value) {
      const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
      const waLink = this.buildWhatsMsg(payload);
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
      this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos obligatorios en el formulario de contacto.',
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
    const isPhone = /^\+\d{8,15}$/.test(whatsapp);
    let message = `🚀 ¡Hola Órbita!, me interesa sus servicios 🌟\n` +
                  `👤 Nombre: ${nombre}\n`;
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

  getNombreError(): string {
    const nombreControl = this.contactForm.get('nombre');
    return nombreControl?.hasError('required') ? 'El nombre es obligatorio.' : '';
  }

  getEmailError(): string {
    const emailControl = this.contactForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'El email es obligatorio.';
    } else if (emailControl?.hasError('email')) {
      return 'Ingresa un email válido (ejemplo@dominio.com).';
    }
    return '';
  }

  getWhatsAppError(): string {
    const whatsappControl = this.contactForm.get('whatsapp');
    if (whatsappControl?.hasError('required')) {
      return 'El número de WhatsApp es obligatorio.';
    } else if (whatsappControl?.hasError('pattern')) {
      return 'Ingresa un número de WhatsApp válido (e.g., +54 9 11 26911817).';
    }
    return '';
  }

  getMensajeError(): string {
    const mensajeControl = this.contactForm.get('mensaje');
    return mensajeControl?.hasError('required') ? 'El mensaje es obligatorio.' : '';
  }
}
