/* ============================================
   AMERICAN GLOBAL SECURITY - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Sticky Header Shadow ----------
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---------- Mobile Menu Toggle ----------
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Floating CTA Visibility ----------
  const floatingCta = document.getElementById('floatingCta');
  if (floatingCta) {
    const toggleFloatingCta = () => {
      if (window.scrollY > 600) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', toggleFloatingCta, { passive: true });
  }

  // ---------- Scroll Animations (Intersection Observer) ----------
  const animateElements = document.querySelectorAll(
    '.service-card, .industry-card, .testimonial-card, .feature, .stats__item, .coverage__region'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger the animation
            setTimeout(() => {
              entry.target.classList.add('animate-in', 'visible');
            }, index * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animateElements.forEach(el => {
      el.classList.add('animate-in');
      observer.observe(el);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Form Submission Handler ----------
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(quoteForm);
      const data = Object.fromEntries(formData.entries());

      // Basic validation
      const required = ['firstName', 'lastName', 'email', 'phone', 'service'];
      const missing = required.filter(field => !data[field] || !data[field].trim());

      if (missing.length > 0) {
        return;
      }

      // Show success state
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Quote Request Sent!
      `;
      submitBtn.disabled = true;
      submitBtn.style.background = '#38a169';
      submitBtn.style.borderColor = '#38a169';
      submitBtn.style.boxShadow = '0 4px 14px rgba(56, 161, 105, 0.35)';

      // Reset after 4 seconds
      setTimeout(() => {
        quoteForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.boxShadow = '';
      }, 4000);
    });
  }

  // ---------- Phone Number Auto-Format ----------
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);

      if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }

      e.target.value = value;
    });
  }

});
