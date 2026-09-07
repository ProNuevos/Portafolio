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
    { icon: 'bi-window', title: 'Websites & Landings', description: 'Sitios veloces y accesibles con Bootstrap 5, SEO técnico y analytics listos.' },
    { icon: 'bi-kanban', title: 'Web Apps & Dashboards', description: 'SPAs con Angular/React, autenticación, roles, y experiencia de usuario cuidada.' },
    { icon: 'bi-hdd-network', title: 'APIs & Backends', description: 'Node/Spring Boot, REST/GraphQL, bases de datos SQL/NoSQL y tests automatizados.' },
    { icon: 'bi-plug', title: 'Integraciones', description: 'Mercado Pago, AFIP, Facturación electrónica, WhatsApp, Analytics, Maps, y más.' },
    { icon: 'bi-robot', title: 'Automatizaciones', description: 'Bots, scrapers responsables y tareas programadas para ahorrar tiempo real.' },
    { icon: 'bi-shield-lock', title: 'Soporte & Seguridad', description: 'Hardening, monitoreo, backups, y respuesta ante incidentes con prácticas DevSecOps.' }
  ];
}
