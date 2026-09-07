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
    { number: 1, title: 'Descubrimiento', description: 'Relevamos objetivos, alcance, restricciones y definimos el MVP.' },
    { number: 2, title: 'Propuesta', description: 'Plan por hitos con tiempos, inversión y entregables verificables.' },
    { number: 3, title: 'Desarrollo', description: 'Sprints cortos, demos frecuentes y control de calidad continuo.' },
    { number: 4, title: 'Despliegue & Soporte', description: 'Release a producción, monitoreo, mejoras y soporte post-lanzamiento.' }
  ];
}
