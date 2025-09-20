import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-floating-wa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-wa.component.html',
  styleUrl: './floating-wa.component.scss'
})
export class FloatingWaComponent {
waLink = 'https://wa.me/5491128634744'; // TODO: Reemplazar con número real
}
