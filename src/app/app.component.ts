import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { ProcessComponent } from './components/process/process.component';
import { TechnologiesComponent } from './components/technologies/technologies.component';
import { CtaComponent } from './components/cta/cta.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingWaComponent } from './components/floating-wa/floating-wa.component';
import { HeroStackComponent } from "./components/hero-stack/hero-stack.component";
import { TeamComponent } from './components/team/team.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    ProcessComponent,
    TechnologiesComponent,
    CtaComponent,
    ContactComponent,
    TeamComponent,
    FooterComponent,
    FloatingWaComponent, HeroStackComponent, AdminPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular17';
}
