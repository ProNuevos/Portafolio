import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!/^\+?[\d\s()\-]+$/.test(trimmed)) return trimmed;
  return (trimmed.startsWith('+') ? '+' : '') + trimmed.replace(/[^0-9]/g, '');
}

export function isArgentinaOrUruguayPhone(value: string): boolean {
  const number = normalizePhone(value).replace(/^\+/, '');
  return /^(?:54(?:9)?\d{10}|598(?:2|4|9)\d{7}|0?(?:(?:2|4|9)\d{7}|(?:11|[2-9]\d{2,3})(?:15)?\d{6,8}))$/.test(number);
}

export const argentinaUruguayPhoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return !value || isArgentinaOrUruguayPhone(value) ? null : { argentinaUruguayPhone: true };
};

export const emailOrPhoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || isArgentinaOrUruguayPhone(value) ? null : { contactFormat: true };
};

export const atLeastOneContactValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const email = String(group.get('email')?.value ?? '').trim();
  const whatsapp = String(group.get('whatsapp')?.value ?? '').trim();
  return email || whatsapp ? null : { contactRequired: true };
};
