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

  // ─── Suite Explorer (mobile menu swipeable carousel) ────────────────────────
  function initSuiteExplorer() {
    const explorers = document.querySelectorAll('.js-suite-explorer');
    explorers.forEach(function (explorer) {
      const track = explorer.querySelector('.js-suite-explorer-track');
      const slides = explorer.querySelectorAll('.js-suite-explorer-slide');
      const dots = explorer.querySelectorAll('.js-suite-explorer-dot');
      if (!track || slides.length === 0) return;

      let current = 0;
      let isAnimating = false;
      let pointerStartX = 0;
      let pointerStartY = 0;

      function updateUI() {
        const slideWidth = explorer.getBoundingClientRect().width;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(-' + current * slideWidth + 'px)';

        slides.forEach(function (slide, i) {
          slide.setAttribute('aria-hidden', i !== current);
        });
        dots.forEach(function (dot, i) {
          dot.setAttribute('aria-current', i === current ? 'true' : null);
          dot.classList.toggle('is-active', i === current);
        });
      }

      function goTo(index) {
        if (isAnimating) return;
        isAnimating = true;
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        current = index;
        updateUI();
        setTimeout(function () { isAnimating = false; }, 520);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          goTo(i);
        });
      });

      function handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? current + 1 : current - 1);
        }
      }

      explorer.addEventListener('touchstart', function (e) {
        pointerStartX = e.changedTouches[0].screenX;
        pointerStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      explorer.addEventListener('touchend', function (e) {
        handleSwipe(pointerStartX, e.changedTouches[0].screenX);
      }, { passive: true });

      explorer.addEventListener('mousedown', function (e) {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
      });

      explorer.addEventListener('mouseup', function (e) {
        if (Math.abs(e.clientY - pointerStartY) < 30) {
          handleSwipe(pointerStartX, e.clientX);
        }
      });

      window.addEventListener('resize', function () {
        const slideWidth = explorer.getBoundingClientRect().width;
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + current * slideWidth + 'px)';
      }, { passive: true });

      updateUI();
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initHeroSlideshow();
    initNavigation();
    initSliders();
    initSuiteExplorer();
  });

})();
