import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  services = [
    { icon: 'bi-window', title: 'Websites & Landings', description: 'Sitios veloces y accesibles con Bootstrap 5, SEO técnico y analytics listos.' },
    { icon: 'bi-kanban', title: 'Web Apps & Dashboards', description: 'SPAs con Angular/React, autenticación, roles, y experiencia de usuario cuidada.' },
    { icon: 'bi-hdd-network', title: 'APIs & Backends', description: 'Node/Spring Boot, REST/GraphQL, bases de datos SQL/NoSQL y tests automatizados.' },
    { icon: 'bi-plug', title: 'Integraciones', description: 'Mercado Pago, AFIP, Facturación electrónica, WhatsApp, Analytics, Maps, y más.' },
    { icon: 'bi-robot', title: 'Automatizaciones', description: 'Bots, scrapers responsables y tareas programadas para ahorrar tiempo real.' },
    { icon: 'bi-shield-lock', title: 'Soporte & Seguridad', description: 'Hardening, monitoreo, backups, y respuesta ante incidentes con prácticas DevSecOps.' }
  ];

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
}
