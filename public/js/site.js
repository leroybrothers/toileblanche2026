/**
 * Toile Blanche – Site JavaScript
 * Replaces Webflow's IX2 interactions and slider functionality
 */

(function () {
  'use strict';

  // ─── Page Loader ───────────────────────────────────────────────────────────
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s ease';
      setTimeout(function () {
        loader.style.display = 'none';
        revealHero();
      }, 500);
    });
    // Fallback in case load fires before script
    if (document.readyState === 'complete') {
      loader.style.display = 'none';
      revealHero();
    }
  }

  function revealHero() {
    const hero = document.getElementById('hero');
    const heroContent = document.getElementById('hero-content');
    const heroArrow = document.getElementById('hero-arrow');
    if (hero) {
      hero.style.transition = 'opacity 0.8s ease';
      hero.style.opacity = '1';
    }
    if (heroContent) {
      heroContent.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }
    if (heroArrow) {
      heroArrow.style.transition = 'transform 1s ease 0.8s';
      heroArrow.style.transform = 'translateY(0)';
    }
  }

  // ─── Hero slideshow ────────────────────────────────────────────────────────
  function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length === 0) return;
    let current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      if (current === 0) {
        slides[0].setAttribute('aria-label', 'Toile Blanche, Saint-Paul de Vence');
      } else {
        slides[current].removeAttribute('aria-label');
      }
    }, 5000);
  }

  // ─── Navigation Menu ───────────────────────────────────────────────────────
  function initNavigation() {
    const toggleBtns = document.querySelectorAll('.js-menu-toggle');
    const navLinks = document.querySelectorAll('.js-nav-links');

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        const newState = !isOpen;

        // Toggle all menus together
        toggleBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', String(newState));
          b.classList.toggle('is-open', newState);
        });

        navLinks.forEach(function (nav) {
          if (newState) {
            nav.removeAttribute('hidden');
            nav.style.display = 'grid';
          } else {
            nav.setAttribute('hidden', '');
            nav.style.display = '';
          }
        });

        // Prevent body scroll when menu is open
        document.body.style.overflow = newState ? 'hidden' : '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        toggleBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          b.classList.remove('is-open');
        });
        navLinks.forEach(function (nav) {
          nav.setAttribute('hidden', '');
          nav.style.display = '';
        });
        document.body.style.overflow = '';
      }
    });

    // Close menu on nav link click
    document.querySelectorAll('.js-nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          b.classList.remove('is-open');
        });
        navLinks.forEach(function (nav) {
          nav.setAttribute('hidden', '');
          nav.style.display = '';
        });
        document.body.style.overflow = '';
      });
    });
  }

  // ─── Sticky / Scroll Nav ───────────────────────────────────────────────────
  function initScrollNav() {
    const navDark = document.getElementById('nav-dark');
    const navLight = document.getElementById('nav-light');
    if (!navDark || !navLight) return;

    // Show dark nav by default on hero pages; show light nav on scroll
    navLight.style.display = 'none';

    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY > 80;
      navDark.style.display = scrolled ? 'none' : '';
      navLight.style.display = scrolled ? '' : 'none';
    }, { passive: true });
  }

  // ─── Suite Slider ──────────────────────────────────────────────────────────
  function initSliders() {
    document.querySelectorAll('.js-slider').forEach(function (sliderEl) {
      const wrapper = sliderEl.closest('.home-room-slider-wrapper');
      const track = sliderEl.querySelector('.js-slider-track');
      const slides = sliderEl.querySelectorAll('.js-slide');
      const prevBtn = sliderEl.querySelector('.js-slider-prev');
      const nextBtn = sliderEl.querySelector('.js-slider-next');
      const dots = wrapper ? wrapper.querySelectorAll('.js-slider-dot') : [];

      if (!track || slides.length === 0) return;

      let current = 0;
      let isAnimating = false;

      function updateDots() {
        dots.forEach(function (dot, i) {
          dot.setAttribute('aria-current', i === current ? 'true' : null);
          dot.classList.toggle('is-active', i === current);
        });
      }

      function goTo(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Clamp / wrap
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        slides[current].classList.remove('is-active');
        current = index;
        slides[current].classList.add('is-active');

        // Translate the track
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';

        updateDots();

        setTimeout(function () { isAnimating = false; }, 650);
      }

      // Set up initial state
      slides[0].classList.add('is-active');
      updateDots();

      // Recalculate on resize
      window.addEventListener('resize', function () {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';
      }, { passive: true });

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      // Pagination dots
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
      });

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      sliderEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderEl.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? current + 1 : current - 1);
        }
      }, { passive: true });
    });
  }

  // ─── Scroll-triggered Fade-In ──────────────────────────────────────────────
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.overlap-image-wrapper, .card-image-wapper, .heading-wrapper, .feature-paragraph'
    );

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('tb-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) {
      el.classList.add('tb-fade-in');
      observer.observe(el);
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initHeroSlideshow();
    initNavigation();
    initScrollNav();
    initSliders();
    initScrollAnimations();
  });

})();
