/**
 * Lenis smooth scroll + GSAP ScrollTrigger homepage reveals.
 * Respects prefers-reduced-motion. Restrained, brand-appropriate animations.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

function getScrollY(): number {
  return lenisInstance ? lenisInstance.scroll : window.scrollY;
}

function initLenis(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance.on('scroll', () => {
    ScrollTrigger.update();
  });

  function raf(time: number): void {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Ensure anchor links work with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenisInstance?.scrollTo(target, { offset: 0 });
        }
      }
    });
  });
}

function initScrollNav(): void {
  const navDark = document.getElementById('nav-dark');
  const navLight = document.getElementById('nav-light');
  if (!navDark || !navLight) return;

  navLight.style.display = 'none';

  function updateNav(): void {
    const scrollY = getScrollY();
    const scrolled = scrollY > 80;
    navDark.style.display = scrolled ? 'none' : '';
    navLight.style.display = scrolled ? '' : 'none';
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', updateNav);
  } else {
    window.addEventListener('scroll', updateNav, { passive: true });
  }
  updateNav();
}

function initScrollReveals(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const intro = document.querySelector('.tb-intro-section');
  const suites = document.querySelector('.tb-suites-section');
  const blocks = document.querySelectorAll('.tb-feature-block');

  if (!intro && !suites && blocks.length === 0) return;

  const fadeUp = {
    y: 32,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
  };

  if (intro) {
    gsap.from(intro.querySelectorAll('.tb-intro-block'), {
      scrollTrigger: { trigger: intro, start: 'top 85%', toggleActions: 'play none none none' },
      ...fadeUp,
    });
  }

  if (suites) {
    gsap.from('.home-room-slider-wrapper', {
      scrollTrigger: { trigger: suites, start: 'top 85%', toggleActions: 'play none none none' },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }

  blocks.forEach((block) => {
    const img = block.querySelector('.tb-feature-block-image');
    const content = block.querySelector('.tb-feature-block-content');
    if (img) {
      gsap.from(img, {
        scrollTrigger: { trigger: block, start: 'top 85%', toggleActions: 'play none none none' },
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
    if (content) {
      gsap.from(content.querySelectorAll('h2, p, a'), {
        scrollTrigger: { trigger: block, start: 'top 85%', toggleActions: 'play none none none' },
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.15,
      });
    }
  });
}

export function initSmoothScroll(): void {
  initLenis();
  initScrollNav();
  initScrollReveals();
}
