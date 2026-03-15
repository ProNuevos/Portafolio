import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

type TeamMember = {
  name: string;
  role: string;
  description: string;
  photo: string;
};

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  members: TeamMember[] = [
    {
      name: 'Danilo Roldan',
      role: 'CEO',
      description:
        'Define la vision del producto, alinea estrategia comercial y tecnica, y lidera la toma de decisiones para escalar el negocio con foco en resultados.',
      photo: '/assets/team/danilo-roldan.svg'
    },
    {
      name: 'Leodanis Miranda',
      role: 'Programador Principal',
      description:
        'Disena y desarrolla la arquitectura de las aplicaciones, implementa funcionalidades clave y asegura calidad tecnica, rendimiento y mantenibilidad.',
      photo: '/assets/team/leodanis-miranda.svg'
    }
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
      { threshold: 0.2 }
    );

    this.appearElements.forEach((element) => observer.observe(element.nativeElement));
  }
}
