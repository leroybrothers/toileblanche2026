/**
 * Lenis smooth scroll + Intersection Observer fade-up.
 * Passalacqua-style: Lenis controls scroll pace, fade-up gives the eye something to follow.
 * No GSAP needed. Respects prefers-reduced-motion.
 */

type LenisInstance = import('lenis').default;
let lenisInstance: LenisInstance | null = null;
let rafId: number | null = null;

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

    function raf(time: number) {
      lenisInstance?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

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
    if (rafId != null) cancelAnimationFrame(rafId);
    document.documentElement.dataset.lenis = 'fallback';
  }
}

function initFadeUpObserver(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
}

export async function initSmoothScroll(): Promise<void> {
  async function run(): Promise<void> {
    await initLenis();
    initFadeUpObserver();
  }
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => run().catch((err) => console.error('[Toile Blanche] Smooth scroll init error:', err)));
  } else {
    run().catch((err) => console.error('[Toile Blanche] Smooth scroll init error:', err));
  }
}
