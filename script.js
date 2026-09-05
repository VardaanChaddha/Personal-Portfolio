/* =========================================================
   PORTFOLIO SCRIPT
   Handles: mobile nav, scroll-spy, scroll reveals, hero
   typewriter effect, footer date, and the contact form.
   No external libraries — vanilla JS only.
   ========================================================= */

// Opt in to the hero's staggered fade-up as early as possible (before the DOM
// is even fully parsed further down). Real content stays visible by default
// in style.css if this line never runs — this only adds a nicety on top.
document.body.classList.add('anim-ready');

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the menu after tapping a link (mobile)
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Header background on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-spy: highlight the active nav link ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Scroll reveal for section content ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .projects-grid, .contact-grid, .section-head'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Hero typewriter ---------- */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'interfaces that feel fast.',
    'things for the web.',
    'accessible, responsive UIs.',
    'ideas into working code.',
  ];

  if (typewriterEl) {
    if (prefersReducedMotion) {
      typewriterEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 55;
      const DELETE_SPEED = 30;
      const HOLD_TIME = 1400;

      const tick = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
          charIndex++;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typewriterEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      };

      setTimeout(tick, 900); // let the hero fade-in finish first
    }
  }

  /* ---------- Footer date / year (auto-updating "drawing date") ---------- */
  const footerYear = document.getElementById('footerYear');
  const footerDate = document.getElementById('footerDate');
  const now = new Date();
  if (footerYear) footerYear.textContent = now.getFullYear();
  if (footerDate) {
    footerDate.textContent = now.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
    });
  }

  /* ---------- Contact form ----------
     This is a static site with no backend, so the form opens a
     pre-filled email in the visitor's own mail client instead of
     posting anywhere. Swap in a service like Formspree if you'd
     rather receive submissions directly. */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const RECIPIENT_EMAIL = 'Vardaan.26074@stu.upes.ac.in'; // TODO: replace with your email

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !email || !message) {
        if (formNote) formNote.textContent = 'Please fill in every field before sending.';
        return;
      }

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;

      if (formNote) formNote.textContent = 'Opening your email app with this message pre-filled…';
      contactForm.reset();
    });
  }
});
