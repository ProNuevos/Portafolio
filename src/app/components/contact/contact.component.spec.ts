import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WhatsAppService } from '../../services/whats-app.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function fill() {
    component.contactForm.setValue({ nombre: ' Ana ', email: ' ana@example.com ', whatsapp: ' +54 (9) 11-2863 4744 ', mensaje: ' Necesito una web ' });
  }

  it('normalizes input and sends only once while pending', () => {
    fill();
    component.onSubmit();
    component.onSubmit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/contacts'));
    expect(req.request.body).toEqual(jasmine.objectContaining({ nombre: 'Ana', email: 'ana@example.com', whatsapp: '+5491128634744', mensaje: 'Necesito una web' }));
    expect(component.contactStatus).not.toContain('Mensaje enviado');
    req.flush({});
    fixture.detectChanges();
    expect(component.contactStatus).toContain('Mensaje enviado');
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeFalse();
  });

  it('retains data after failure, displays validation details and allows retry', () => {
    fill(); component.onSubmit();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(r => r.url.endsWith('/contacts')).flush({ mensajes: ['email: inválido'] }, { status: 400, statusText: 'Bad Request' });
    expect(component.contactStatus).toContain('email: inválido');
    expect(component.contactForm.value.mensaje).toBe('Necesito una web');
    expect(component.isSubmitting).toBeFalse();
    component.onSubmit();
    http.expectOne(r => r.url.endsWith('/contacts')).flush({});
  });

  it('rejects blank names, excessive messages and malformed phones', () => {
    fill(); component.contactForm.patchValue({ nombre: '   ' }); component.onSubmit();
    expect(component.contactForm.controls.nombre.hasError('required')).toBeTrue();
    fill(); component.contactForm.patchValue({ mensaje: 'a'.repeat(1001) }); component.onSubmit();
    expect(component.getMensajeError()).toContain('1000');
    fill(); component.contactForm.patchValue({ whatsapp: '+54abc1128634744' }); component.onSubmit();
    expect(component.contactForm.controls.whatsapp.hasError('pattern')).toBeTrue();
    TestBed.inject(HttpTestingController).expectNone(r => r.url.endsWith('/contacts'));
  });

  it('opens WhatsApp without requiring form completion', () => {
    const open = spyOn(TestBed.inject(WhatsAppService), 'open');
    component.onWhatsAppClick();
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.calls.mostRecent().args[0]).toMatch(/^https:\/\/wa.me\//);
  });

  it('resets its fields when the dialog is closed', () => {
    fill();
    component.contactStatus = 'Mensaje pendiente';
    component.openContact();
    component.closeContact();
    expect(component.contactForm.getRawValue()).toEqual({ nombre: '', email: '', whatsapp: '', mensaje: '' });
    expect(component.contactStatus).toBe('');
  });
});
