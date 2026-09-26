import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WhatsAppService } from '../../services/whats-app.service';

@Component({
  selector: 'app-floating-wa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-wa.component.html',
  styleUrl: './floating-wa.component.scss'
})
export class FloatingWaComponent {
  constructor(private whatsAppService: WhatsAppService) {}
  openWhatsApp() {
    this.whatsAppService.openNative();
  }
}

