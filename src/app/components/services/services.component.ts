import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {

  services = [
    { icon: 'bi-window', title: 'Página profesional', description: 'Una presencia digital clara para mostrar tus servicios, generar confianza y recibir consultas.' },
    { icon: 'bi-calendar2-check', title: 'Reservas y turnos', description: 'Permite que tus clientes consulten disponibilidad y reserven sin depender de mensajes manuales.' },
    { icon: 'bi-kanban', title: 'Sistemas y paneles', description: 'Herramientas para organizar clientes, reservas, servicios, empleados y operaciones.' },
    { icon: 'bi-plug', title: 'Integraciones', description: 'Conectamos WhatsApp, pagos, mapas, formularios y otras herramientas que ya utilizas.' },
    { icon: 'bi-robot', title: 'Automatización e IA', description: 'Agentes y flujos automáticos para responder consultas y ahorrar tiempo en tareas repetitivas.' },
    { icon: 'bi-shield-lock', title: 'Acompañamiento', description: 'Te acompaño desde la idea y el lanzamiento hasta las mejoras que tu negocio necesite.' }
  ];
}

