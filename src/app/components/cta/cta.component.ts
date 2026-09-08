import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { EstimateDialogService } from '../../services/estimate-dialog.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.scss']
})
export class CtaComponent {
  constructor(private readonly estimateDialog: EstimateDialogService) {}

  openContactDialog() { this.estimateDialog.open(); }
}
