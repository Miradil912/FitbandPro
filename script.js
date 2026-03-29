/**
 * FitLife Pro — script.js
 * Features: sticky navbar · mobile toggle · smooth scroll ·
 *           testimonials slider · form validation · footer year
 */

/* ================================================================
   DOM READY — Initialise everything once DOM is parsed
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initTestimonialsSlider();
  initContactForm();
  initFooterYear();

});

/* ================================================================
   1. STICKY NAVBAR — add 'scrolled' class after 60px scroll
================================================================ */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    highlightNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* Active nav link highlighter */
function highlightNavLink() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks  = document.querySelectorAll('.nav-link');
  var scrollPos = window.scrollY + 100;

  sections.forEach(function (section) {
    if (!section.id) return;
    var top    = section.offsetTop;
    var bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ================================================================
   2. MOBILE MENU TOGGLE
================================================================ */
function initMobileMenu() {
  var toggle  = document.getElementById('navToggle');
  var menu    = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  // Open / close on button click
  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ================================================================
   3. SMOOTH SCROLLING — for all anchor links with '#'
================================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      var navH   = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h')) || 72;
      var top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* ================================================================
   4. TESTIMONIALS SLIDER (vanilla JS, no libraries)
================================================================ */
function initTestimonialsSlider() {
  var slider     = document.getElementById('testimonialSlider');
  var prevBtn    = document.getElementById('sliderPrev');
  var nextBtn    = document.getElementById('sliderNext');
  var dotsWrap   = document.getElementById('sliderDots');

  if (!slider || !prevBtn || !nextBtn || !dotsWrap) return;

  var slides     = slider.querySelectorAll('.slide');
  var total      = slides.length;
  var current    = 0;
  var autoTimer  = null;
  var AUTO_DELAY = 5000; // ms between auto-advances

  // Build dot buttons
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className   = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', function () {
      goTo(i);
      resetAuto();
    });
    dotsWrap.appendChild(dot);
  });

  var dots = dotsWrap.querySelectorAll('.dot');

  // Show a specific slide
  function goTo(index) {
    // Hide current
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    // Calculate next index (wrap around)
    current = (index + total) % total;

    // Show new
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  // Show first slide immediately
  goTo(0);

  // Arrow buttons
  prevBtn.addEventListener('click', function () {
    goTo(current - 1);
    resetAuto();
  });
  nextBtn.addEventListener('click', function () {
    goTo(current + 1);
    resetAuto();
  });

  // Keyboard navigation
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  // Touch/swipe support
  var touchStartX = 0;
  slider.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  slider.addEventListener('touchend', function (e) {
    var delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goTo(current + 1);
      else            goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, AUTO_DELAY);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Pause on hover / focus
  var wrap = document.querySelector('.slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    wrap.addEventListener('mouseleave', startAuto);
    wrap.addEventListener('focusin',    function () { clearInterval(autoTimer); });
    wrap.addEventListener('focusout',   startAuto);
  }
}

/* ================================================================
   5. CONTACT FORM VALIDATION
================================================================ */
function initContactForm() {
  var form        = document.getElementById('contactForm');
  if (!form) return;

  var nameInput   = document.getElementById('name');
  var emailInput  = document.getElementById('email');
  var msgInput    = document.getElementById('message');
  var nameErr     = document.getElementById('nameError');
  var emailErr    = document.getElementById('emailError');
  var msgErr      = document.getElementById('messageError');
  var successMsg  = document.getElementById('formSuccess');

  // Helper: show / clear error
  function setError(input, errorEl, msg) {
    errorEl.textContent = msg;
    if (msg) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
    }
  }

  // Validate single field
  function validateName() {
    var val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, nameErr, 'Please enter your full name.');
      return false;
    }
    if (val.length < 2) {
      setError(nameInput, nameErr, 'Name must be at least 2 characters.');
      return false;
    }
    setError(nameInput, nameErr, '');
    return true;
  }

  function validateEmail() {
    var val  = emailInput.value.trim();
    var re   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setError(emailInput, emailErr, 'Please enter your email address.');
      return false;
    }
    if (!re.test(val)) {
      setError(emailInput, emailErr, 'Please enter a valid email address.');
      return false;
    }
    setError(emailInput, emailErr, '');
    return true;
  }

  function validateMessage() {
    var val = msgInput.value.trim();
    if (!val) {
      setError(msgInput, msgErr, 'Please write a message.');
      return false;
    }
    if (val.length < 10) {
      setError(msgInput, msgErr, 'Message must be at least 10 characters.');
      return false;
    }
    setError(msgInput, msgErr, '');
    return true;
  }

  // Live validation on blur
  nameInput.addEventListener('blur',  validateName);
  emailInput.addEventListener('blur', validateEmail);
  msgInput.addEventListener('blur',   validateMessage);

  // Clear error on input
  nameInput.addEventListener('input',  function () { if (nameInput.classList.contains('error'))  validateName(); });
  emailInput.addEventListener('input', function () { if (emailInput.classList.contains('error')) validateEmail(); });
  msgInput.addEventListener('input',   function () { if (msgInput.classList.contains('error'))   validateMessage(); });

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.textContent = '';

    var valid = validateName() & validateEmail() & validateMessage();
    // Note: single & (not &&) to run ALL validations even if one fails

    if (!valid) return;

    // ── Success state ──
    // Replace this block with your actual form-submission logic
    // (e.g. fetch to your API, EmailJS, Formspree, etc.)
    var submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent  = 'Sending…';
    submitBtn.disabled     = true;

    setTimeout(function () {
      // Simulate async send
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;
      successMsg.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';

      // Clear success message after 6 seconds
      setTimeout(function () { successMsg.textContent = ''; }, 6000);
    }, 1200);
  });
}

/* ================================================================
   6. FOOTER YEAR — auto-updates copyright year
================================================================ */
function initFooterYear() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
