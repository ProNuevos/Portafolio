import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

type TeamMember = {
  name: string;
  role: string;
  description: string;
  photo: string;
};

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent {
  members: TeamMember[] = [
    {
      name: 'Danilo Roldan',
      role: 'CEO',
      description: 'Define la vision del producto, alinea estrategia comercial y tecnica, y lidera la toma de decisiones para escalar el negocio con foco en resultados.',
      photo: '/assets/team/danilo.jpeg'
    },
    {
      name: 'Leodanis Miranda',
      role: 'Programador Principal',
      description: 'Disena y desarrolla la arquitectura de las aplicaciones, implementa funcionalidades clave y asegura calidad tecnica, rendimiento y mantenibilidad.',
      photo: '/assets/team/leo.jpeg'
    }
  ];
}
