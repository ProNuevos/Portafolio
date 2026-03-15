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
      bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920&auto=format&fit=crop',
      title: 'METRO APP',
      sub: 'La gema en nuestras manos. Una plataforma de exito internacional.',
      modalId: 'modal1',
      modalTitle: 'METRO APP, nuestro primer gran exito',
      modalDesc: 'Una de las plataformas mas elegidas por los constructores de toda Argentina. Unica en su tipo, ha crecido exponencialmente en muy poco tiempo. Se abre paso internacional con una vision solida y estrategia de vanguardia.',
      gallery: [
        { src: 'https://picsum.photos/seed/p1/1200/800', alt: 'Dashboard', capTitle: 'Dashboard', capSub: 'KPIs en tiempo real.' },
        { src: 'https://picsum.photos/seed/p2/1200/800', alt: 'Presupuestos', capTitle: 'Presupuestos', capSub: 'Listas de precios dinamicas.' },
        { src: 'https://picsum.photos/seed/p3/1200/800', alt: 'Logistica', capTitle: 'Logistica', capSub: 'Seguimiento de entregas.' },
        { src: 'https://picsum.photos/seed/p4/1200/800', alt: 'Finanzas', capTitle: 'Finanzas', capSub: 'Margenes y cashflow.' }
      ]
    },
    {
      bg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop',
      title: 'SUPERSORTEO',
      sub: 'Un proyecto innovador destinado al exito.',
      modalId: 'modal2',
      modalTitle: 'Participa y gana con SUPERSORTEO',
      modalDesc: '',
      gallery: [
        { src: 'https://picsum.photos/seed/c1/1200/800', alt: 'Descuentos', capTitle: 'Descuentos', capSub: 'Ofertas en comercios adheridos.' },
        { src: 'https://picsum.photos/seed/c2/1200/800', alt: 'Eventos', capTitle: 'Eventos', capSub: 'Charlas y capacitaciones.' },
        { src: 'https://picsum.photos/seed/c3/1200/800', alt: 'Networking', capTitle: 'Networking', capSub: 'Conecta con colegas del rubro.' },
        { src: 'https://picsum.photos/seed/c4/1200/800', alt: 'Beneficios exclusivos', capTitle: 'Beneficios exclusivos', capSub: 'Acceso a convenios especiales.' }
      ]
    },
    {
      bg: '/portfolio/gestorqr-dashboard.svg',
      title: 'GESTORQR',
      sub: 'Gestion de empleados con control y trazabilidad mediante QR.',
      modalId: 'modal3',
      modalTitle: 'GESTORQR - Gestion inteligente de empleados',
      modalDesc: 'Plataforma para administrar empleados, registrar accesos y simplificar procesos diarios de la empresa con flujos basados en QR.',
      gallery: [
        {
          src: '/portfolio/gestorqr-dashboard.svg',
          alt: 'Panel principal de GestorQR',
          capTitle: 'Dashboard operativo',
          capSub: 'Vision centralizada de actividad, estado y metricas del personal.'
        },
        {
          src: '/portfolio/gestorqr-qr-checkin.svg',
          alt: 'Check-in por QR en GestorQR',
          capTitle: 'Check-in con QR',
          capSub: 'Registro rapido de ingresos y egresos con escaneo seguro.'
        },
        {
          src: '/portfolio/gestorqr-team-admin.svg',
          alt: 'Administracion de equipo en GestorQR',
          capTitle: 'Gestion de empleados',
          capSub: 'Altas, bajas, roles y seguimiento de todo el equipo.'
        },
        {
          src: '/portfolio/gestorqr-security.svg',
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
