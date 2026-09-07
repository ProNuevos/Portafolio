import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WhatsAppService } from '../../services/whats-app.service';
import { ContactService } from '../../services/contact.service';
import { finalize, timeout } from 'rxjs';
import { submissionError } from '../../services/form-utils';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ContactDialogService } from '../../services/contact-dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  @ViewChild('contactDialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(ContactDialogService);
  private previousOverflow = '';
  private returnFocus: HTMLElement | null = null;

  contactForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    whatsapp: ['', [Validators.required, Validators.pattern(/^\+\d{8,15}$/)]],
    mensaje: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  contactStatus = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private whatsAppService: WhatsAppService
  ) {
    this.dialogService.openRequests$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.openContact());
  }

  openContact() {
    if (this.dialog.nativeElement.open) return;
    this.returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.previousOverflow = document.body.style.overflow;
    this.dialog.nativeElement.showModal();
    document.body.style.overflow = 'hidden';
  }

  closeContact() {
    this.dialog.nativeElement.close();
    this.resetContactForm();
    document.body.style.overflow = this.previousOverflow;
    this.returnFocus?.focus();
  }

  onBackdropClick(event: MouseEvent) {
    const dialog = this.dialog.nativeElement;
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) this.closeContact();
  }

  private resetContactForm() {
    this.contactForm.reset({ nombre: '', email: '', whatsapp: '', mensaje: '' });
    this.contactStatus = '';
    this.isSubmitting = false;
  }

  onSubmit() {
    if (this.isSubmitting) return;
    for (const [key, value] of Object.entries(this.contactForm.getRawValue())) {
      let normalized = (value ?? '').trim();
      if ((key === 'whatsapp' || key === 'contacto') && normalized.startsWith('+')) normalized = normalized.replace(/[\s()\-]/g, '');
      this.contactForm.get(key)?.setValue(normalized, { emitEvent: false });
    }
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.contactStatus = '❌ Por favor, completa los campos obligatorios correctamente.';
      return;
    }

    const payload = this.contactForm.value as { nombre: string; email: string; whatsapp: string; mensaje: string };
    this.isSubmitting = true;
    this.contactStatus = 'Enviando tu mensaje…';
    this.contactService.saveContact(payload).pipe(timeout(20000), finalize(() => this.isSubmitting = false)).subscribe({
      next: () => {
        this.contactStatus = '✅ Mensaje enviado. Te escribimos pronto.\n📲 También podés contactarnos por WhatsApp.';
        this.whatsAppService.updateWaLink(this.buildWhatsMsg(payload));
      },
      error: (error: unknown) => {
        this.contactStatus = submissionError(error);
      }
    });
  }

  onWhatsAppClick() {
    this.whatsAppService.open(this.buildWhatsMsg(this.contactForm.getRawValue()));
  }
  buildWhatsMsg(data: { nombre?: string | null; email?: string | null; whatsapp?: string | null; mensaje?: string | null }) {
    const lines = ['Hola Órbita, me interesan sus servicios.'];
    for (const [label, value] of [['Nombre', data.nombre], ['Email', data.email], ['WhatsApp', data.whatsapp], ['Mensaje', data.mensaje]]) {
      if (value?.trim()) lines.push(label + ': ' + value.trim());
    }
    return this.whatsAppService.buildLink(lines.join('\n'));
  }

  getNombreError(): string {
    const c = this.contactForm.get('nombre');
    if (c?.hasError('maxlength')) return 'Máximo 100 caracteres.';
    return c?.hasError('required') ? 'El nombre es obligatorio.' : '';
  }

  getEmailError(): string {
    const c = this.contactForm.get('email');
    if (c?.hasError('maxlength')) return 'Máximo 150 caracteres.';
    if (c?.hasError('required')) return 'El email es obligatorio.';
    if (c?.hasError('email')) return 'Ingresa un email valido (ejemplo@dominio.com).';
    return '';
  }

  getWhatsAppError(): string {
    const c = this.contactForm.get('whatsapp');
    if (c?.hasError('required')) return 'El numero de WhatsApp es obligatorio.';
    if (c?.hasError('pattern')) return 'Formato valido: +54911XXXXXXXX';
    return '';
  }

  getMensajeError(): string {
    const c = this.contactForm.get('mensaje');
    if (c?.hasError('maxlength')) return 'Máximo 1000 caracteres.';
    return c?.hasError('required') ? 'El mensaje es obligatorio.' : '';
  }
}
