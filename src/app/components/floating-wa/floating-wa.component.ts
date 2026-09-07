import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EstimateDialogService } from '../../services/estimate-dialog.service';

@Component({
  selector: 'app-floating-wa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-wa.component.html',
  styleUrl: './floating-wa.component.scss'
})
export class FloatingWaComponent {
  constructor(private estimateDialog: EstimateDialogService) {}
  openEstimate() { this.estimateDialog.open(); }
}
