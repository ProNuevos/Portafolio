import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WhatsAppService } from '../../services/whats-app.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ContactDialogService } from '../../services/contact-dialog.service';
import { EstimateDialogService } from '../../services/estimate-dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { argentinaUruguayPhoneValidator, normalizePhone } from '../../services/contact-validation';

@Component({ selector: 'app-contact', standalone: true, imports: [CommonModule, ReactiveFormsModule, RevealOnScrollDirective], templateUrl: './contact.component.html', styleUrls: ['./contact.component.scss'] })
export class ContactComponent {
  @ViewChild('contactDialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(ContactDialogService);
  private previousOverflow = '';
  private returnFocus: HTMLElement | null = null;
  contactForm = this.fb.group({ nombre: ['', [Validators.required, Validators.maxLength(100)]], whatsapp: ['', [Validators.maxLength(30), argentinaUruguayPhoneValidator]], mensaje: ['', [Validators.required, Validators.maxLength(1000)]] });
  contactStatus = '';
  isSubmitting = false;

  constructor(private fb: FormBuilder, private whatsAppService: WhatsAppService, private estimateDialog: EstimateDialogService) {
    this.dialogService.openRequests$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.openContact());
  }
  openEstimate() { this.estimateDialog.open(); }
  openEmail(event: MouseEvent) { event.preventDefault(); window.location.href = 'mailto:leodanismiranda@gmail.com'; }
  openContact() { if (this.dialog.nativeElement.open) return; this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null; this.previousOverflow = document.body.style.overflow; this.dialog.nativeElement.showModal(); document.body.style.overflow = 'hidden'; }
  closeContact() { this.dialog.nativeElement.close(); this.contactForm.reset({ nombre: '', whatsapp: '', mensaje: '' }); this.contactStatus = ''; this.isSubmitting = false; document.body.style.overflow = this.previousOverflow; this.returnFocus?.focus(); }
  onBackdropClick(event: MouseEvent) { const dialog = this.dialog.nativeElement; const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) this.closeContact(); }
  onSubmit() {
    if (this.isSubmitting) return;
    for (const [key, value] of Object.entries(this.contactForm.getRawValue())) { let normalized = (value ?? '').trim(); if (key === 'whatsapp' && normalized) normalized = normalizePhone(normalized); this.contactForm.get(key)?.setValue(normalized, { emitEvent: false }); }
    if (this.contactForm.invalid) { this.contactForm.markAllAsTouched(); this.contactStatus = 'Completá los campos obligatorios correctamente.'; return; }
    const payload = this.contactForm.value as { nombre: string; whatsapp: string; mensaje: string };
    this.isSubmitting = true; this.contactStatus = 'Preparando tu consulta…';
    const whatsAppLink = this.buildWhatsMsg(payload);
    // Se ejecuta durante el clic del usuario para que el sistema permita abrir la app nativa.
    this.whatsAppService.open(whatsAppLink);
    this.whatsAppService.updateWaLink(whatsAppLink);
    this.contactStatus = 'Consulta preparada. Podés continuar por WhatsApp.';
    this.isSubmitting = false;
  }
  buildWhatsMsg(data: { nombre?: string | null; whatsapp?: string | null; mensaje?: string | null }) { const lines = ['Hola Órbita, me interesan sus servicios.']; for (const [label, value] of [['Nombre', data.nombre], ['WhatsApp', data.whatsapp], ['Mensaje', data.mensaje]]) if (value?.trim()) lines.push(label + ': ' + value.trim()); return this.whatsAppService.buildLink(lines.join('\n')); }
  getNombreError() { const c = this.contactForm.get('nombre'); return c?.hasError('maxlength') ? 'Máximo 100 caracteres.' : c?.hasError('required') ? 'El nombre es obligatorio.' : ''; }
  getWhatsAppError() { const c = this.contactForm.get('whatsapp'); return c?.hasError('argentinaUruguayPhone') ? 'Ingresá un WhatsApp válido de Argentina o Uruguay.' : ''; }
  getMensajeError() { const c = this.contactForm.get('mensaje'); return c?.hasError('maxlength') ? 'Máximo 1000 caracteres.' : c?.hasError('required') ? 'El mensaje es obligatorio.' : ''; }
}


