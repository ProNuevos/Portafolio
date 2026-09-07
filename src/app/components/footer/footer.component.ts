import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDialogService } from '../../services/contact-dialog.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private readonly contactDialog: ContactDialogService) {}

  openContactDialog() { this.contactDialog.open(); }
}
