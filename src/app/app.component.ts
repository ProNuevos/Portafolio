import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { CasesComponent } from './components/cases/cases.component';
import { ProcessComponent } from './components/process/process.component';
import { TechnologiesComponent } from './components/technologies/technologies.component';
import { CtaComponent } from './components/cta/cta.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingWaComponent } from './components/floating-wa/floating-wa.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    CasesComponent,
    ProcessComponent,
    TechnologiesComponent,
    CtaComponent,
    ContactComponent,
    FooterComponent,
    FloatingWaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular17';
}
