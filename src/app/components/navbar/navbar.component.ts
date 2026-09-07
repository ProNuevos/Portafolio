import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDialogService } from '../../services/contact-dialog.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private readonly contactDialog: ContactDialogService) {}

scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openContactDialog() { this.contactDialog.open(); }

}
