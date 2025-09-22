import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroStackComponent } from './hero-stack.component';

describe('HeroStackComponent', () => {
  let component: HeroStackComponent;
  let fixture: ComponentFixture<HeroStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroStackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeroStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
