import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WhatsAppService } from '../../services/whats-app.service';

@Component({
  selector: 'app-floating-wa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-wa.component.html',
  styleUrl: './floating-wa.component.scss'
})
export class FloatingWaComponent implements OnInit {
  waLink = 'whatsapp://send?phone=5491128634744&text=';

  constructor(private whatsAppService: WhatsAppService) {}

  ngOnInit(): void {
    this.whatsAppService.waLink$.subscribe((waLink) => {
      this.waLink = waLink;
      console.log('waLink actualizado en FloatingWaComponent:', waLink);
    });
  }

  openWhatsApp() {
    console.log('Intentando abrir WhatsApp con:', this.waLink);
    const decodedMessage = decodeURIComponent(this.waLink.split('text=')[1] || '');

    const missingNombre = !decodedMessage.includes('Nombre:') || decodedMessage.includes('Nombre: —');
    const missingMensaje = !decodedMessage.includes('Mensaje:') || decodedMessage.includes('Mensaje: —');

    if (missingNombre || missingMensaje) {
      void this.showAlert({
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los datos en el formulario de estimacion.',
        icon: 'warning',
        confirmButtonText: 'Ir a Contacto'
      }).then(() => {
        this.scrollToContactAfterModal();
      });
      return;
    }

    window.location.href = this.waLink;
  }

  private scrollToContactAfterModal() {
    // SweetAlert bloquea el scroll del body mientras el modal esta abierto.
    setTimeout(() => this.scrollToContact(), 180);
  }

  private async showAlert(options: {
    title: string;
    text: string;
    icon: 'warning';
    confirmButtonText: string;
  }) {
    const Swal = (await import('sweetalert2/dist/sweetalert2.esm.js')).default;
    return Swal.fire(options);
  }

  private scrollToContact() {
    const contactSection = document.querySelector('section#contacto') as HTMLElement | null;
    if (!contactSection) return;

    const navbar = document.querySelector('.navbar.sticky-top') as HTMLElement | null;
    const offset = (navbar?.offsetHeight ?? 0) + 12;
    const targetY = contactSection.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }
}
