import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss']
})
export class TechnologiesComponent {
  stackTools = ['Bootstrap 5', 'Angular', 'PrimeNG', 'Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Docker', 'Firebase', 'Railway', 'JSON Server'];

  qualityChecklist = [
    'Rendimiento y accesibilidad AA',
    'Buenas prácticas de seguridad en front y back',
    'Documentación mínima y hand-off al cliente',
    'Backups y monitoreo básicos incluidos'
  ];
}
