import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GsapAnimationsService {

  async init(): Promise<void> {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    await new Promise<void>(resolve => setTimeout(resolve, 80));

    const gsapModule = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default;
    gsap.registerPlugin(ScrollTrigger);

    this.heroEntrance(gsap);
    this.scrollReveals(gsap);
    this.hoverEffects(gsap);
    this.navbarScroll(ScrollTrigger);
  }

  // ── Hero entrance ──────────────────────────────────────────────────────────
  private heroEntrance(gsap: typeof import('gsap').default): void {
    gsap.timeline({ delay: 0.2 })
      .from('.hero-main-title', { y: 80, opacity: 0, duration: 1.6, ease: 'power4.out' })
      .from('.orb-hero .lead', { y: 50, opacity: 0, duration: 1.3, ease: 'power3.out' }, '-=0.8')
      .from('.orb-hero .d-flex .btn', { y: 38, opacity: 0, stagger: 0.2, duration: 1.1, ease: 'power3.out' }, '-=0.7')
      .from('.hero-proof span', { x: -22, opacity: 0, stagger: 0.14, duration: 0.85, ease: 'power2.out' }, '-=0.5');
  }

  // ── Scroll reveals ─────────────────────────────────────────────────────────
  private scrollReveals(gsap: typeof import('gsap').default): void {
    gsap.from('.portfolio-heading', {
      scrollTrigger: { trigger: '.portfolio-heading', start: 'top 82%', once: true },
      y: 55, opacity: 0, duration: 1.3, ease: 'power3.out'
    });

    document.querySelectorAll<Element>('.hero-banner').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        y: 75, opacity: 0, duration: 1.2, delay: i * 0.1, ease: 'power3.out'
      });
    });

    gsap.from('.needs-copy', {
      scrollTrigger: { trigger: '.needs-section', start: 'top 78%', once: true },
      x: -55, opacity: 0, duration: 1.3, ease: 'power3.out'
    });

    document.querySelectorAll<Element>('.needs-list div').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        x: -38, opacity: 0, duration: 0.95, delay: i * 0.1, ease: 'power2.out'
      });
    });

    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.from(serviceCards, {
        scrollTrigger: { trigger: '#servicios', start: 'top 72%', once: true },
        y: 70, opacity: 0, stagger: 0.13, duration: 1.1, ease: 'power3.out'
      });
    }

    document.querySelectorAll<Element>('.process-step').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        y: 65, opacity: 0, scale: 0.96, duration: 1.1, delay: i * 0.12, ease: 'power3.out'
      });
    });

    gsap.from('#tecnologias .col-lg-6', {
      scrollTrigger: { trigger: '#tecnologias', start: 'top 76%', once: true },
      y: 55, opacity: 0, stagger: 0.28, duration: 1.2, ease: 'power3.out'
    });

    gsap.from('.team-head', {
      scrollTrigger: { trigger: '.team-section', start: 'top 80%', once: true },
      y: 50, opacity: 0, duration: 1.2, ease: 'power3.out'
    });
    gsap.from('.team-card', {
      scrollTrigger: { trigger: '.team-section', start: 'top 72%', once: true },
      y: 90, opacity: 0, scale: 0.96, duration: 1.5, ease: 'power3.out'
    });

    gsap.from('.trust-heading', {
      scrollTrigger: { trigger: '.trust-section', start: 'top 80%', once: true },
      y: 45, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    document.querySelectorAll<Element>('.trust-grid article').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: '.trust-section', start: 'top 72%', once: true },
        y: 60, opacity: 0, duration: 1.05, delay: i * 0.14, ease: 'power3.out'
      });
    });

    gsap.from('.orb-cta', {
      scrollTrigger: { trigger: '.orb-cta', start: 'top 82%', once: true },
      scale: 0.95, opacity: 0, duration: 1.3, ease: 'power3.out'
    });
    gsap.from('.contact-aside', {
      scrollTrigger: { trigger: '#contacto', start: 'top 78%', once: true },
      x: -65, opacity: 0, duration: 1.3, ease: 'power3.out'
    });
    gsap.from('.footer-panel', {
      scrollTrigger: { trigger: '.footer-panel', start: 'top 88%', once: true },
      y: 40, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
  }

  // ── Hover effects ──────────────────────────────────────────────────────────
  private hoverEffects(gsap: typeof import('gsap').default): void {
    // Service cards
    document.querySelectorAll<HTMLElement>('.service-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, scale: 1.025, duration: 0.45, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.55, ease: 'power2.inOut' });
      });
    });

    // Process steps
    document.querySelectorAll<HTMLElement>('.process-step').forEach(step => {
      step.addEventListener('mouseenter', () => {
        gsap.to(step, { y: -8, scale: 1.02, duration: 0.4, ease: 'power2.out' });
      });
      step.addEventListener('mouseleave', () => {
        gsap.to(step, { y: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' });
      });
    });

    // Trust articles
    document.querySelectorAll<HTMLElement>('.trust-grid article').forEach(article => {
      article.addEventListener('mouseenter', () => {
        gsap.to(article, { y: -7, scale: 1.02, duration: 0.4, ease: 'power2.out' });
      });
      article.addEventListener('mouseleave', () => {
        gsap.to(article, { y: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' });
      });
    });

    // Portfolio banners
    document.querySelectorAll<HTMLElement>('.hero-banner').forEach(banner => {
      banner.addEventListener('mouseenter', () => {
        gsap.to(banner, { y: -6, scale: 1.015, duration: 0.4, ease: 'power2.out' });
      });
      banner.addEventListener('mouseleave', () => {
        gsap.to(banner, { y: 0, scale: 1, duration: 0.5, ease: 'power2.inOut' });
      });
    });

    // Needs list items
    document.querySelectorAll<HTMLElement>('.needs-list div').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { x: 8, duration: 0.35, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { x: 0, duration: 0.45, ease: 'power2.inOut' });
      });
    });

    // Team card — subtle float
    const teamCard = document.querySelector<HTMLElement>('.team-card');
    if (teamCard) {
      teamCard.addEventListener('mouseenter', () => {
        gsap.to(teamCard, { y: -10, scale: 1.015, duration: 0.55, ease: 'power2.out' });
      });
      teamCard.addEventListener('mouseleave', () => {
        gsap.to(teamCard, { y: 0, scale: 1, duration: 0.65, ease: 'power2.inOut' });
      });
    }

    // CTA block
    const cta = document.querySelector<HTMLElement>('.orb-cta');
    if (cta) {
      cta.addEventListener('mouseenter', () => {
        gsap.to(cta, { scale: 1.018, duration: 0.45, ease: 'power2.out' });
      });
      cta.addEventListener('mouseleave', () => {
        gsap.to(cta, { scale: 1, duration: 0.55, ease: 'power2.inOut' });
      });
    }
  }

  // ── Navbar scroll state ────────────────────────────────────────────────────
  private navbarScroll(ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger): void {
    ScrollTrigger.create({
      start: 'top -80', end: 'max',
      onUpdate: () => {
        const navbar = document.querySelector('.navbar') as HTMLElement | null;
        if (!navbar) return;
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 80);
      }
    });
  }
}
