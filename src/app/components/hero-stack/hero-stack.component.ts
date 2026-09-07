import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-stack.component.html',
  styleUrls: ['./hero-stack.component.scss']
})
export class HeroStackComponent implements AfterViewInit {
  @ViewChildren('galleryItem') galleryItems!: QueryList<ElementRef>;

  banners = [
    {
      bg: '/assets/portfolio/metro1.jpg',
      title: 'METRO APP',
      sub: 'La gema en nuestras manos. Una plataforma de exito internacional.',
      siteUrl: 'https://www.metroapp.site',
      siteLabel: 'Visitar sitio',
      modalId: 'modal1',
      modalTitle: 'METRO APP, nuestro primer gran exito',
      modalDesc: 'Una de las plataformas mas elegidas por los constructores de toda Argentina. Unica en su tipo, ha crecido exponencialmente en muy poco tiempo. Se abre paso internacional con una vision solida y estrategia de vanguardia.',
      gallery: [
        {
          src: '/assets/portfolio/metro1.jpg',
          alt: 'Vista principal de Metro App',
          capTitle: 'Vista principal',
          capSub: 'Pantalla inicial del producto con acceso rapido a los modulos clave.'
        },
        {
          src: '/assets/portfolio/metro2.jpg',
          alt: 'Panel de gestion de Metro App',
          capTitle: 'Panel de gestion',
          capSub: 'Operacion centralizada con informacion relevante para el seguimiento diario.'
        },
        {
          src: '/assets/portfolio/metro3.jpg',
          alt: 'Modulo operativo de Metro App',
          capTitle: 'Modulo operativo',
          capSub: 'Flujos pensados para agilizar tareas y mejorar el control del negocio.'
        },
        {
          src: '/assets/portfolio/metro4.jpg',
          alt: 'Vista complementaria de Metro App',
          capTitle: 'Vista complementaria',
          capSub: 'Experiencia visual consistente para consultar datos y ejecutar acciones rapidamente.'
        }
      ]
    },
    {
      bg: '/assets/portfolio/superrifa-hero.svg',
      title: 'SUPERSORTEO',
      sub: 'La siguiente generacion de rifas en linea para todo el mundo',
      siteUrl: 'https://supersorteo-7db83.web.app',
      siteLabel: 'Visitar sitio',
      modalId: 'modal2',
      modalTitle: 'Participa y gana con SUPERSORTEO',
      modalDesc: '',
      gallery: [
        {
          src: '/assets/portfolio/superrifa-hero.svg',
          alt: 'Vista principal de SuperSorteo',
          capTitle: 'Experiencia principal',
          capSub: 'Pantalla inicial del producto con enfoque promocional y acceso rapido al sorteo.'
        },
        {
          src: '/assets/portfolio/superrifa-dashboard.svg',
          alt: 'Dashboard de SuperSorteo',
          capTitle: 'Dashboard de gestion',
          capSub: 'Panel central para administrar sorteos, participantes y seguimiento general.'
        },
        {
          src: '/assets/portfolio/superrifa-live-draw.svg',
          alt: 'Sorteo en vivo de SuperSorteo',
          capTitle: 'Sorteo en vivo',
          capSub: 'Visualizacion del proceso de seleccion de ganadores en tiempo real.'
        },
        {
          src: '/assets/portfolio/superrifa-mobile-reservation.svg',
          alt: 'Reserva mobile de SuperSorteo',
          capTitle: 'Reserva desde movil',
          capSub: 'Flujo optimizado para que los usuarios participen y reserven numeros desde el telefono.'
        }
      ]
    },
    {
      bg: '/assets/portfolio/gestorqr-dashboard.svg',
      title: 'GESTORQR',
      sub: 'Gestion de empleados con control y trazabilidad mediante QR.',
      siteUrl: 'https://gestor-qr-afe03.web.app',
      siteLabel: 'Visitar sitio',
      modalId: 'modal3',
      modalTitle: 'GESTORQR - Gestion inteligente de empleados',
      modalDesc: 'Plataforma para administrar empleados, registrar accesos y simplificar procesos diarios de la empresa con flujos basados en QR.',
      gallery: [
        {
          src: '/assets/portfolio/gestorqr-dashboard.svg',
          alt: 'Panel principal de GestorQR',
          capTitle: 'Dashboard operativo',
          capSub: 'Vision centralizada de actividad, estado y metricas del personal.'
        },
        {
          src: '/assets/portfolio/gestorqr-qr-checkin.svg',
          alt: 'Check-in por QR en GestorQR',
          capTitle: 'Check-in con QR',
          capSub: 'Registro rapido de ingresos y egresos con escaneo seguro.'
        },
        {
          src: '/assets/portfolio/gestorqr-team-admin.svg',
          alt: 'Administracion de equipo en GestorQR',
          capTitle: 'Gestion de empleados',
          capSub: 'Altas, bajas, roles y seguimiento de todo el equipo.'
        },
        {
          src: '/assets/portfolio/gestorqr-security.svg',
          alt: 'Seguridad y auditoria en GestorQR',
          capTitle: 'Seguridad y auditoria',
          capSub: 'Control de accesos, trazabilidad de eventos e historial.'
        }
      ]
    },
    {
      bg: '/assets/portfolio/exellsior-overview.svg',
      title: 'EXELLSIOR',
      sub: 'Sistema integral para gestionar un car wash con foco en control, velocidad y calidad de servicio.',
      siteUrl: 'https://exellssior-app.web.app',
      siteLabel: 'Visitar sitio',
      modalId: 'modal4',
      modalTitle: 'EXELLSIOR - Gestion inteligente para lavaderos',
      modalDesc: 'Aplicacion web para centralizar operacion, clientes y reportes en un solo panel. Diseñada para equipos que necesitan visibilidad en tiempo real y procesos mas ordenados.',
      gallery: [
        {
          src: '/assets/portfolio/exellsior-spaces.svg',
          alt: 'Dashboard principal Exellsior',
          capTitle: 'Dashboard principal',
          capSub: 'Panel moderno con estado de espacios ocupados y libres, tarjetas de estado en tiempo real y vista general del negocio.'
        },
        {
          src: '/assets/portfolio/exellsior-clients.svg',
          alt: 'Gestion de clientes Exellsior',
          capTitle: 'Gestion de clientes',
          capSub: 'Registro de clientes, vehiculo y patente, notas internas, integracion con WhatsApp y acceso rapido por QR.'
        },
        {
          src: '/assets/portfolio/exellsior-reports.svg',
          alt: 'Reportes y estadisticas Exellsior',
          capTitle: 'Reportes y estadisticas',
          capSub: 'Metricas diarias y mensuales, ocupacion, ingresos y rendimiento de servicios para tomar decisiones con datos.'
        },
        {
          src: '/assets/portfolio/exellsior-overview.svg',
          alt: 'Vista operativa del negocio Exellsior',
          capTitle: 'Vista operativa del negocio',
          capSub: 'Flujo operativo completo del lavadero con soporte digital para recepcion, seguimiento y automatizacion de tareas.'
        }
      ]
    }
  ];

  ngAfterViewInit() {
    this.banners.forEach((b) => this.setupObserver(b.modalId));
  }

  setupObserver(modalId: string) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    modalEl.addEventListener('shown.bs.modal', () => {
      const items = modalEl.querySelectorAll('.gallery-item img, .caption');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { root: modalEl.querySelector('.modal-body'), threshold: 0.15 }
      );
      items.forEach((el) => observer.observe(el));
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      const items = modalEl.querySelectorAll('.gallery-item img, .caption');
      items.forEach((el) => el.classList.remove('visible'));
    });
  }
}
