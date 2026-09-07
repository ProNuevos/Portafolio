import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingWaComponent } from './floating-wa.component';
import { EstimateDialogService } from '../../services/estimate-dialog.service';

describe('FloatingWaComponent', () => {
  let component: FloatingWaComponent;
  let fixture: ComponentFixture<FloatingWaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingWaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloatingWaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requests the estimate modal when clicked without opening a new tab', () => {
    const request = spyOn(TestBed.inject(EstimateDialogService), 'open');
    const openWindow = spyOn(window, 'open');
    fixture.nativeElement.querySelector('button').click();
    expect(request).toHaveBeenCalledTimes(1);
    expect(openWindow).not.toHaveBeenCalled();
  });
});
