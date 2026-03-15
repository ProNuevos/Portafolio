import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.scss']
})
export class TechnologiesComponent implements AfterViewInit {
  @ViewChildren('appearElement') appearElements!: QueryList<ElementRef>;

  stackTools = [
    'Bootstrap 5',
    'Angular',
    'PrimeNG',
    'java',
    'Spring Boot',
    'MySQL',
    'PostgressSQL',
    'Docker',
    //'NGINX',
    'Firebase',
    'Railway',
    'Jason Server'

  ];

  qualityChecklist = [
    'Rendimiento (Lighthouse) y accesibilidad AA',
    'Buenas prácticas de seguridad en front y back',
    'Documentación mínima y hand-off al cliente',
    'Backups y monitoreo básicos incluidos'
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
