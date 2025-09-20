import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

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
    whatsapp: [''],
    mensaje: ['', Validators.required]
  });

  contactStatus: string = '';
  waLink: string = '';

  constructor(private fb: FormBuilder, private storageService: StorageService) {}

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

  onWhatsAppClick() {
    if (this.contactForm.valid) {
      this.waLink = this.buildWhatsMsg(this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string });
      window.open(this.waLink, '_blank');
    }
  }

  buildWhatsMsg({ nombre = '', email = '', whatsapp = '', mensaje = '' }: { nombre?: string; email?: string; whatsapp?: string; mensaje?: string }) {
    const phone = '5491112345678'; // TODO: Reemplazar con número real
    const txt = encodeURIComponent(
      `Hola Órbita Software, soy ${nombre || '—'}.\n` +
      `Email: ${email || '—'}\nWhatsApp: ${whatsapp || '—'}\n` +
      `Mensaje: ${mensaje || '—'}`
    );
    return `https://wa.me/${phone}?text=${txt}`;
  }
}
