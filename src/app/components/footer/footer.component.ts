import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CallRequestService } from '../../services/call-request.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private readonly callRequest: CallRequestService) {}

  openContactDialog() { this.callRequest.open(); }
  openEmail(event: MouseEvent) { event.preventDefault(); window.location.href = 'mailto:leodanismiranda@gmail.com'; }
}
