import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WhatsAppService } from '../../services/whats-app.service';
import Swal from 'sweetalert2';

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
   this.whatsAppService.waLink$.subscribe(waLink => {
      this.waLink = waLink; // Actualiza waLink cuando cambie en el servicio
      console.log('waLink actualizado en FloatingWaComponent:', waLink);
    });
  }


  openWhatsApp0() {
    console.log('Intentando abrir WhatsApp con:', this.waLink); // Depuración
    window.location.href = this.waLink; // Intenta abrir WhatsApp app
    setTimeout(() => {
      if (!document.hidden) {
        console.log('WhatsApp no se abrió'); // Depuración
        //alert('Asegúrate de tener WhatsApp instalado.');
      }
    }, 5000); // Aumentado a 2 segundos para dar tiempo al diálogo
  }

 openWhatsApp() {
    console.log('Intentando abrir WhatsApp con:', this.waLink); // Depuración
    // Validar que el enlace contenga todos los datos
    const decodedMessage = decodeURIComponent(this.waLink.split('text=')[1] || '');
    if (!decodedMessage.includes('Nombre:') || decodedMessage.includes('Nombre: —') || !decodedMessage.includes('Mensaje:') || decodedMessage.includes('Mensaje: —')) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los datos, incluyendo el Nombre, en el formulario de contacto.',
        icon: 'warning',
        confirmButtonText: 'Ir a Contacto'
      }).then(() => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }
    window.location.href = this.waLink;

  }


}
