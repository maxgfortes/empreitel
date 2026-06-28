
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const nonHeroReveals = Array.from(revealEls).filter(
    el => !el.closest('.hero')
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  nonHeroReveals.forEach(el => revealObserver.observe(el));

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const statsSection = document.querySelector('.section-resultados');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          statNums.forEach(animateCounter);
        }
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  }

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

})();