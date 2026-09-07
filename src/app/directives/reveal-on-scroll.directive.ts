import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly element: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const target = this.element.nativeElement;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      target.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        target.classList.add('is-visible');
        this.observer?.disconnect();
      }
    }, { threshold: 0.15 });

    this.observer.observe(target);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
