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
      name: 'Leodanis Miranda',
      role: 'Desarrollador full stack · Fundador de Negocio Digital',
      description: 'Diseño y desarrollo soluciones digitales para negocios que necesitan una presencia profesional, procesos más simples y herramientas que realmente puedan usar todos los días. Trabajo desde la idea inicial hasta el despliegue y la mejora continua.',
      photo: '/assets/team/leo.jpeg'
    }
  ];
}
