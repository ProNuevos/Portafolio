import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroComponent } from './hero.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WhatsAppService } from '../../services/whats-app.service';
import { FloatingWaComponent } from '../floating-wa/floating-wa.component';
import { EstimateDialogService } from '../../services/estimate-dialog.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function fill() {
    component.estimateForm.setValue({ tipo: 'API / Backend', alcance: 'Mediano', mensaje: 'Integrar catálogo & pedidos' });
  }

  it('sends one request, confirms only after success and opens WhatsApp without a name', () => {
    const floating = new FloatingWaComponent(TestBed.inject(EstimateDialogService));
    const open = spyOn(TestBed.inject(WhatsAppService), 'open');
    floating.openEstimate();
    expect(component.dialog.nativeElement.open).toBeTrue();
    expect(open).not.toHaveBeenCalled();
    fill(); component.onSubmit(); component.onSubmit(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    expect(component.estimateResult).not.toContain('Te escribimos');
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/leads'));
    expect(req.request.body.contacto).toBe('');
    req.flush({});
    expect(component.isSubmitting).toBeFalse();
    expect(component.estimateResult).toContain('Consulta enviada');
    component.continueWhatsApp();
    const link = new URL(open.calls.mostRecent().args[0]);
    expect(link.hostname).toBe('wa.me');
    expect(link.searchParams.get('text')).toContain('Integrar catálogo & pedidos');
    expect(link.searchParams.get('text')).not.toContain('Nombre: —');
    component.closeEstimate();
  });

  it('closes with Escape, restores scrolling and resets the form when reopened', () => {
    const previousOverflow = document.body.style.overflow;
    fill();
    component.openEstimate();
    expect(document.body.style.overflow).toBe('hidden');
    component.dialog.nativeElement.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(component.dialog.nativeElement.open).toBeFalse();
    expect(document.body.style.overflow).toBe(previousOverflow);
    component.openEstimate();
    expect(component.estimateForm.value.tipo).toBe('');
    expect(component.estimateForm.value.alcance).toBe('Mediano');
    component.closeEstimate();
  });

  it('closes on backdrop clicks and restores focus to the opener', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus(); component.openEstimate();
    const dialog = component.dialog.nativeElement;
    expect(dialog.open).toBeTrue();
    dialog.dispatchEvent(new MouseEvent('click', { clientX: -1, clientY: -1, bubbles: true }));
    expect(dialog.open).toBeFalse();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('rejects oversized messages', () => {
    fill(); component.estimateForm.patchValue({ mensaje: 'a'.repeat(2001) }); component.onSubmit();
    expect(component.estimateForm.controls.mensaje.hasError('maxlength')).toBeTrue();
    TestBed.inject(HttpTestingController).expectNone(r => r.url.endsWith('/leads'));
  });

  it('keeps data and releases the form when the server does not respond', fakeAsync(() => {
    fill(); component.onSubmit();
    const req = TestBed.inject(HttpTestingController).expectOne(r => r.url.endsWith('/leads'));
    tick(20001);
    expect(req.cancelled).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
    expect(component.estimateResult).toContain('No pudimos confirmar');
    expect(component.estimateForm.value.mensaje).toBe('Integrar catálogo & pedidos');
  }));
});
