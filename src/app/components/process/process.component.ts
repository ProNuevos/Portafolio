import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  steps = [
    { number: 1, title: 'Descubrimiento', description: 'Relevamos objetivos, alcance, restricciones y definimos el MVP.' },
    { number: 2, title: 'Propuesta', description: 'Plan por hitos con tiempos, inversión y entregables verificables.' },
    { number: 3, title: 'Desarrollo', description: 'Sprints cortos, demos frecuentes y control de calidad continuo.' },
    { number: 4, title: 'Despliegue & Soporte', description: 'Release a producción, monitoreo, mejoras y soporte post-lanzamiento.' }
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
