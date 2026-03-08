/**
 * Lenis smooth scroll + GSAP ScrollTrigger homepage reveals.
 * Respects prefers-reduced-motion. Restrained, brand-appropriate animations.
 * Lenis is loaded via dynamic import to isolate production load failures.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type LenisInstance = import('lenis').default;
let lenisInstance: LenisInstance | null = null;

function getScrollY(): number {
  return lenisInstance ? lenisInstance.scroll : window.scrollY;
}

async function initLenis(): Promise<void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    const [lenisMod] = await Promise.all([
      import('lenis'),
      import('lenis/dist/lenis.css'),
    ]);
    const Lenis = lenisMod.default;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (lenisInstance) {
          if (arguments.length) lenisInstance.scrollTo(value);
          return lenisInstance.scroll;
        }
        return value;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

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

    document.documentElement.dataset.lenis = 'active';
  } catch (err) {
    console.warn('[Toile Blanche] Lenis smooth scroll failed, using native scroll:', err);
    lenisInstance = null;
    document.documentElement.dataset.lenis = 'fallback';
  }
}

function initScrollNav(): void {
  const navDark = document.getElementById('nav-dark');
  const navLight = document.getElementById('nav-light');
  if (!navDark || !navLight) return;

  navLight.style.display = 'none';

  function updateNav(scrollY?: number): void {
    const y = scrollY ?? getScrollY();
    const scrolled = y > 80;
    navDark.style.display = scrolled ? 'none' : '';
    navLight.style.display = scrolled ? '' : 'none';
  }

  if (lenisInstance) {
    lenisInstance.on('scroll', () => {
      requestAnimationFrame(() => updateNav(lenisInstance!.scroll));
    });
  } else {
    window.addEventListener('scroll', updateNav, { passive: true });
  }
  requestAnimationFrame(() => updateNav());
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

function initSuiteGalleryReveals(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const gallery = document.querySelector('.sd-gallery');
  const items = gallery?.querySelectorAll('.sd-gallery-item');
  if (!gallery || !items?.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: gallery,
      start: 'top 75%',
      end: 'bottom 25%',
      scrub: 1,
    },
  });

  items.forEach((item, i) => {
    tl.from(
      item,
      {
        y: 48,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      i * 0.1
    );
  });
}

export async function initSmoothScroll(): Promise<void> {
  async function run(): Promise<void> {
    await initLenis();
    initScrollNav();
    initScrollReveals();
    initSuiteGalleryReveals();
    ScrollTrigger.refresh();
  }
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => run().catch((err) => console.error('[Toile Blanche] Smooth scroll init error:', err)));
  } else {
    run().catch((err) => console.error('[Toile Blanche] Smooth scroll init error:', err));
  }
}
