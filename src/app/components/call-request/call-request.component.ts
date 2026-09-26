import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CallRequestService } from '../../services/call-request.service';
import { WhatsAppService } from '../../services/whats-app.service';

@Component({ selector: 'app-call-request', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './call-request.component.html', styleUrls: ['./call-request.component.scss'] })
export class CallRequestComponent {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;
  private readonly service = inject(CallRequestService);
  private readonly whatsapp = inject(WhatsAppService);
  form = inject(FormBuilder).group({ nombre: ['', [Validators.required, Validators.maxLength(100)]], negocio: ['', Validators.maxLength(120)], proyecto: ['', Validators.required], dia: ['', Validators.maxLength(80)], whatsapp: ['', [Validators.required, Validators.maxLength(30)]] });
  status = '';
  constructor() { this.service.openRequests$.pipe(takeUntilDestroyed()).subscribe(() => this.open()); }
  open() { this.status = ''; this.form.reset(); this.dialog.nativeElement.showModal(); }
  close() { this.dialog.nativeElement.close(); }
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const optional = [v.negocio ? `Negocio: ${v.negocio}` : '', v.dia ? `Día preferido: ${v.dia}` : ''].filter(Boolean).join('\n');
    const message = `Quiero solicitar una llamada.\n\nNombre: ${v.nombre}\nProyecto: ${v.proyecto}${optional ? `\n${optional}` : ''}\nWhatsApp: ${v.whatsapp}`;
    this.status = 'Solicitud preparada. Abriendo WhatsApp…';
    this.whatsapp.openNative(message);
  }
}
