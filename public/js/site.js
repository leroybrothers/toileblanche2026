/**
 * Toile Blanche – Site JavaScript
 * Replaces Webflow's IX2 interactions and slider functionality
 */

(function () {
  'use strict';

  // ─── Page Loader ───────────────────────────────────────────────────────────
  // Mobile: skip loader, reveal hero immediately for better LCP (3G/slow connections).
  // Desktop: brief loader, reveal when LCP image loads or after 100ms.
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    var isMobile = window.innerWidth <= 640;
    if (isMobile) {
      loader.style.display = 'none';
      revealHero(true);
      return;
    }

    var revealed = false;
    function hideLoaderAndReveal() {
      if (revealed) return;
      revealed = true;
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.25s ease';
      setTimeout(function () {
        loader.style.display = 'none';
        revealHero(false);
      }, 280);
    }
    var minReveal = setTimeout(hideLoaderAndReveal, 100);
    requestAnimationFrame(function () {
      var lcpSrc = window.innerWidth >= 1280 ? '/assets/images/slideshow1.avif' : '/assets/images/slideshow1-1200w.avif';
      var lcpImg = new Image();
      lcpImg.onload = lcpImg.onerror = function () {
        clearTimeout(minReveal);
        hideLoaderAndReveal();
      };
      lcpImg.src = lcpSrc;
    });
    window.addEventListener('load', function () {
      clearTimeout(minReveal);
      hideLoaderAndReveal();
    }, { once: true });
  }

  function revealHero(instant) {
    const hero = document.getElementById('hero');
    const heroContent = document.getElementById('hero-content');
    const heroArrow = document.getElementById('hero-arrow');
    var t = instant ? '0.15s' : '0.5s';
    var d = instant ? '0s' : '0.2s';
    if (hero) {
      hero.style.transition = 'opacity ' + t + ' ease';
      hero.style.opacity = '1';
    }
    if (heroContent) {
      heroContent.style.transition = 'opacity ' + t + ' ease ' + d + ', transform ' + t + ' ease ' + d;
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'none';
    }
    if (heroArrow) {
      heroArrow.style.transition = 'transform ' + (instant ? '0.2s' : '0.6s') + ' ease ' + (instant ? '0.05s' : '0.4s');
      heroArrow.style.transform = 'translateY(0)';
    }
  }

  // ─── Hero slideshow ────────────────────────────────────────────────────────
  // 6s per image, 1.5s cross-dissolve (CSS). No dots or arrows — silent cycle.
  // Disabled: single static hero image only.
  function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    if (slides.length <= 1) return;
    let current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
    }, 6000);
  }

  // ─── Nav color toggle (white on hero, black when scrolled) ─────────────────
  function initNavColorToggle() {
    var navDark = document.getElementById('nav-dark');
    var navLight = document.getElementById('nav-light');
    var hero = document.getElementById('hero') || document.querySelector('.art-hero, .exp-hero, .rst-hero, .lgn-hero, .lrs-hero, .prop-hero');
    if (!navDark || !navLight) {
      if (navLight) document.body.classList.add('tb-nav-light');
      return;
    }
    navLight.style.display = 'none';
    document.body.classList.add('tb-nav-dark');
    function showLight() {
      navDark.style.display = 'none';
      navLight.style.display = '';
      document.body.classList.add('tb-nav-light');
      document.body.classList.remove('tb-nav-dark');
    }
    function showDark() {
      navDark.style.display = '';
      navLight.style.display = 'none';
      document.body.classList.add('tb-nav-dark');
      document.body.classList.remove('tb-nav-light');
    }
    function update() {
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (y > 80) showLight(); else showDark();
    }
    if (hero) {
      var observer = new IntersectionObserver(function (entries) {
        var r = entries[0] && entries[0].intersectionRatio;
        if (r !== undefined && r < 0.2) showLight(); else showDark();
      }, { threshold: [0, 0.2, 0.5, 1] });
      observer.observe(hero);
      requestAnimationFrame(update);
    } else {
      window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
      requestAnimationFrame(update);
    }
  }

  // ─── Navigation Menu ───────────────────────────────────────────────────────
  function initNavigation() {
    const toggleBtns = document.querySelectorAll('.js-menu-toggle');
    const navLinks = document.querySelectorAll('.js-nav-links');

    // Move fullpage menus to body so they stack above hero/suites/footer (escape stacking context)
    navLinks.forEach(function (menu) {
      if (menu.classList.contains('tb-fullpage-menu') && menu.parentNode !== document.body) {
        document.body.appendChild(menu);
      }
    });

    function getVisibleMenuTheme() {
      const navDark = document.getElementById('nav-dark');
      const navLight = document.getElementById('nav-light');
      if (!navDark) return 'light';
      if (!navLight) return 'dark';
      return navDark.style.display === 'none' ? 'light' : 'dark';
    }

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
            const theme = getVisibleMenuTheme();
            const isDark = nav.classList.contains('dark');
            const match = (theme === 'dark' && isDark) || (theme === 'light' && !isDark);
            if (match) {
              nav.removeAttribute('hidden');
              nav.style.display = 'grid';
            } else {
              nav.setAttribute('hidden', '');
              nav.style.display = '';
            }
          } else {
            nav.setAttribute('hidden', '');
            nav.style.display = '';
          }
        });

        // Prevent body scroll when menu is open
        document.body.style.overflow = newState ? 'hidden' : '';
        document.body.classList.toggle('tb-menu-open', newState);
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
        document.body.classList.remove('tb-menu-open');
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
        document.body.classList.remove('tb-menu-open');
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

        // Read layout before DOM writes to avoid forced reflow
        const slideWidth = slides[0].getBoundingClientRect().width;

        slides[current].classList.remove('is-active');
        current = index;
        slides[current].classList.add('is-active');

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
        // Read layout before DOM writes to avoid forced reflow
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

      // Defer initial layout read to avoid forced reflow during DOMContentLoaded
      requestAnimationFrame(function () { updateUI(); });
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initNavColorToggle();
    initLoader();
    initHeroSlideshow();
    initNavigation();
    initSliders();
    // Suite Explorer (mobile menu carousel): defer to idle to avoid long main-thread tasks
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initSuiteExplorer, { timeout: 600 });
    } else {
      requestAnimationFrame(initSuiteExplorer);
    }
  });

})();
