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
      sub: 'La gema en nuestras manos. Una plataforma de éxito internacional.',
      modalId: 'modal1',
      modalTitle: 'METRO APP, nuestro primer gran éxito',
      modalDesc: 'Una de las plataformas más elegidas por los constructores de toda Argentina. Única en su tipo, ha crecido exponencialmente en muy poco tiempo. Se abre paso internacional con una visión sólida y estrategia de vanguardia.',
      gallery: [
        { src: 'https://picsum.photos/seed/p1/1200/800', alt: 'Dashboard', capTitle: 'Dashboard', capSub: 'KPIs en tiempo real.' },
        { src: 'https://picsum.photos/seed/p2/1200/800', alt: 'Presupuestos', capTitle: 'Presupuestos', capSub: 'Listas de precios dinámicas.' },
        { src: 'https://picsum.photos/seed/p3/1200/800', alt: 'Logística', capTitle: 'Logística', capSub: 'Seguimiento de entregas.' },
        { src: 'https://picsum.photos/seed/p4/1200/800', alt: 'Finanzas', capTitle: 'Finanzas', capSub: 'Márgenes y cashflow.' }
      ]
    },
    {
      bg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop',
      title: 'SUPERSORTEO',
      sub: 'Un proyecto innovador destinado al éxito.',
      modalId: 'modal2',
      modalTitle: 'Participa y gana con SUPERSORTEO',
      modalDesc: '',
      gallery: [
        { src: 'https://picsum.photos/seed/c1/1200/800', alt: 'Descuentos', capTitle: 'Descuentos', capSub: 'Ofertas en comercios adheridos.' },
        { src: 'https://picsum.photos/seed/c2/1200/800', alt: 'Eventos', capTitle: 'Eventos', capSub: 'Charlas y capacitaciones.' },
        { src: 'https://picsum.photos/seed/c3/1200/800', alt: 'Networking', capTitle: 'Networking', capSub: 'Conectá con colegas del rubro.' },
        { src: 'https://picsum.photos/seed/c4/1200/800', alt: 'Beneficios exclusivos', capTitle: 'Beneficios exclusivos', capSub: 'Acceso a convenios especiales.' }
      ]
    }
  ];

  ngAfterViewInit() {
    this.banners.forEach(b => this.setupObserver(b.modalId));
  }

  setupObserver(modalId: string) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    modalEl.addEventListener('shown.bs.modal', () => {
      const items = modalEl.querySelectorAll('.gallery-item img, .caption');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { root: modalEl.querySelector('.modal-body'), threshold: 0.15 }
      );
      items.forEach(el => observer.observe(el));
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
      const items = modalEl.querySelectorAll('.gallery-item img, .caption');
      items.forEach(el => el.classList.remove('visible'));
    });
  }
}
