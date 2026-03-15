import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WhatsAppService } from '../../services/whats-app.service';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contact.service';
import { environment } from '../../../environments/environment';

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

  contactStatus = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private whatsAppService: WhatsAppService
  ) {}

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

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
      return;
    }

    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    const now = new Date();
    const fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    this.isSubmitting = true;
    this.contactService.saveContact({ ...payload, fecha }).subscribe({
      next: () => {
        this.contactStatus = '✅ Mensaje enviado. Te escribimos pronto.\n📲 También podés contactarnos por WhatsApp.';
        this.whatsAppService.updateWaLink(this.buildWhatsMsg(payload));
        this.isSubmitting = false;
      },
      error: () => {
        this.contactStatus = '❌ Error al enviar el contacto. Por favor, intentalo de nuevo.';
        this.isSubmitting = false;
      }
    });
  }

  onWhatsAppClick() {
    if (this.contactForm.invalid || !this.contactForm.get('nombre')?.value) {
      this.contactForm.markAllAsTouched();
      this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de continuar por WhatsApp.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    const waLink = this.buildWhatsMsg(payload);
    if (waLink) {
      window.location.href = waLink;
      this.contactStatus = '✅ Abriendo WhatsApp...';
      setTimeout(() => {
        if (!document.hidden) {
          Swal.fire({
            title: 'WhatsApp no disponible',
            text: 'Asegurate de tener WhatsApp instalado.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }
      }, 3000);
    }
  }

  buildWhatsMsg({ nombre = '', email = '', whatsapp = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    if (!nombre) return '';
    const isPhone = /^\+\d{8,15}$/.test(whatsapp);
    let message = `🚀 ¡Hola Orbita!, me interesan sus servicios\n👤 Nombre: ${nombre}\n`;
    message += isPhone ? `📱 WhatsApp: ${whatsapp || '—'}\n` : `📩 Email: ${email || '—'}\n`;
    message += `💬 Mensaje: ${mensaje || '—'}`;
    return `whatsapp://send?phone=${environment.waPhone}&text=${encodeURIComponent(message)}`;
  }

  getNombreError(): string {
    const c = this.contactForm.get('nombre');
    return c?.hasError('required') ? 'El nombre es obligatorio.' : '';
  }

  getEmailError(): string {
    const c = this.contactForm.get('email');
    if (c?.hasError('required')) return 'El email es obligatorio.';
    if (c?.hasError('email')) return 'Ingresa un email valido (ejemplo@dominio.com).';
    return '';
  }

  getWhatsAppError(): string {
    const c = this.contactForm.get('whatsapp');
    if (c?.hasError('required')) return 'El numero de WhatsApp es obligatorio.';
    if (c?.hasError('pattern')) return 'Formato valido: +54911XXXXXXXX';
    return '';
  }

  getMensajeError(): string {
    const c = this.contactForm.get('mensaje');
    return c?.hasError('required') ? 'El mensaje es obligatorio.' : '';
  }
}
