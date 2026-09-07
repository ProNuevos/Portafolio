import { HttpErrorResponse } from '@angular/common/http';

export function submissionError(error: unknown): string {
  if (error instanceof HttpErrorResponse && error.status === 400) {
    const messages: unknown = error.error?.mensajes;
    if (Array.isArray(messages) && messages.length && messages.every(message => typeof message === 'string')) {
      return '❌ Revisá los datos:\n' + messages.join('\n');
    }
    return '❌ Revisá los datos del formulario. El servidor no pudo validarlos.';
  }
  return '❌ No pudimos confirmar el envío. Tus datos siguen aquí; podés reintentar o escribirnos por WhatsApp.';
}
