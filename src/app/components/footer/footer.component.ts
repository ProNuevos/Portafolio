import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EstimateDialogService } from '../../services/estimate-dialog.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private readonly estimateDialog: EstimateDialogService) {}

  openContactDialog() { this.estimateDialog.open(); }
}
