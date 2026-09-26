import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent {
  steps = [
    { number: 1, title: 'Descubrimiento', description: 'Relevamos objetivos, alcance, restricciones y definimos el MVP.', image: '/assets/step/descubrimiento.jpeg' },
    { number: 2, title: 'Propuesta', description: 'Definimos prioridades, alcance y entregables claros para avanzar con seguridad.', image: '/assets/step/propuesta.jpeg' },
    { number: 3, title: 'Desarrollo', description: 'Sprints cortos, demos frecuentes y control de calidad continuo.', image: '/assets/step/desarrollo.jpeg' },
    { number: 4, title: 'Lanzamiento y soporte', description: 'Publicamos tu solución, revisamos su funcionamiento y seguimos mejorándola contigo.', image: '/assets/step/despliegue.jpeg' }
  ];
}

