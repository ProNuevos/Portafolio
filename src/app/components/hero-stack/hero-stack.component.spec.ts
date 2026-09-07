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

  it('renders a labelled projects section with one card per project', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#proyectos h2')?.textContent).toContain('Proyectos');
    expect(compiled.querySelectorAll('#proyectos article.hero-banner').length).toBe(component.banners.length);
    expect(compiled.querySelectorAll('#proyectos article.hero-banner').length).toBe(4);
  });
});
