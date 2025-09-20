import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingWaComponent } from './floating-wa.component';

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
});
