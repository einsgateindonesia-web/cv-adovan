/* ============ LOADER ============ */
(function() {
  const loader = document.getElementById('loader');
  const loaderNum = document.getElementById('loaderNum');
  const loaderBar = document.getElementById('loaderBar');
  let progress = 0;
  let loaded = false;

  window.addEventListener('load', () => { loaded = true; });

  const interval = setInterval(() => {
    if (loaded && progress >= 100) {
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 300);
      return;
    }
    progress += Math.random() * 8;
    if (progress > 100) progress = 100;
    loaderNum.textContent = Math.round(progress);
    loaderBar.style.width = progress + '%';
  }, 60);

  // Failsafe: hide after 4s
  setTimeout(() => {
    clearInterval(interval);
    loader.classList.add('hidden');
  }, 4000);
})();

/* ============ THEME ============ */
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    if (next === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', next);
  });
})();

/* ============ CUSTOM CURSOR ============ */
(function() {
  const dot = document.querySelector('.cursor-dot');
  const circle = document.querySelector('.cursor-circle');
  if (!dot || !circle) return;

  let mouseX = 0, mouseY = 0, circleX = 0, circleY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function animateCursor() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .skill-card, .achievement-card, .contact-card, .tag, .marquee-item, .hero-photo-frame, .timeline-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => circle.classList.add('hover'));
    el.addEventListener('mouseleave', () => circle.classList.remove('hover'));
  });
})();

/* ============ PROGRESS BAR ============ */
(function() {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressText.textContent = String(Math.round(progress)).padStart(2, '0') + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();
})();

/* ============ SCROLL REVEAL ============ */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============ SKILL BARS ============ */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.setProperty('--fill', el.dataset.fill);
        el.classList.add('active');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar-item').forEach(el => observer.observe(el));
})();

/* ============ PARALLAX HERO ============ */
(function() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroTitle.style.transform = `translateY(${y * 0.25}px)`;
      heroTitle.style.opacity = 1 - (y / window.innerHeight) * 0.8;
    }
  });
})();

/* ============ 3D TILT PHOTO ============ */
(function() {
  const frame = document.getElementById('tiltFrame');
  if (!frame) return;
  if (window.matchMedia('(hover:none)').matches) return;

  frame.addEventListener('mousemove', e => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 8;
    const rotX = -((y - cy) / cy) * 8;
    frame.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
  });

  frame.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
})();

/* ============ TESTIMONIAL SLIDER ============ */
(function() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.getElementById('sliderDots');
  if (!dotsContainer || testimonials.length === 0) return;

  let currentSlide = 0;
  let sliderInterval;

  testimonials.forEach((_, i) => {
    const btn = document.createElement('button');
    if (i === 0) btn.classList.add('active');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(btn);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goToSlide(index) {
    testimonials[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    testimonials[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetInterval();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % testimonials.length);
  }

  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, 5000);
  }
  resetInterval();
})();