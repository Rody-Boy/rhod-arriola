const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const animateCounter = (el) => {
  const target = Number(el.dataset.target) || 0;
  const duration = 1450;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

document.querySelectorAll('.stat').forEach((el, index) => {
  setTimeout(() => animateCounter(el), index * 120);
});

const bindFilter = (btnSelector, itemSelector, attrName, itemTagAttr) => {
  const buttons = document.querySelectorAll(btnSelector);
  const items = document.querySelectorAll(itemSelector);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset[attrName];
      items.forEach((item) => {
        const tags = item.dataset[itemTagAttr] || '';
        const show = filter === 'all' || tags.includes(filter);
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
};

bindFilter('.chip', '.timeline-item', 'filter', 'tags');
bindFilter('.project-chip', '.project-card', 'projectFilter', 'projectTags');

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  heroCard.addEventListener('mousemove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
