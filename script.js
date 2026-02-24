const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const animateCounter = (el) => {
  const target = Number(el.dataset.target) || 0;
  const duration = 1500;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

document.querySelectorAll('.stat').forEach((el, index) => {
  setTimeout(() => animateCounter(el), index * 140);
});

const bindFilter = (btnSelector, itemSelector, attrName, itemTagAttr) => {
  const buttons = document.querySelectorAll(btnSelector);
  const items = document.querySelectorAll(itemSelector);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset[attrName];
      items.forEach((item, idx) => {
        const tags = item.dataset[itemTagAttr] || '';
        const show = filter === 'all' || tags.includes(filter);

        if (!show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 180);
          return;
        }

        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 60 + idx * 35);
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
    heroCard.style.transform = `perspective(1000px) rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

const subtitle = document.getElementById('typingSubtitle');
if (subtitle) {
  const full = subtitle.textContent.trim();
  subtitle.textContent = '';
  let i = 0;
  const type = () => {
    subtitle.textContent = full.slice(0, i);
    i += 1;
    if (i <= full.length) {
      setTimeout(type, 15);
    }
  };
  type();
}

const progress = document.getElementById('scrollProgress');
const onScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${percent}%`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const canvas = document.getElementById('sparkCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const sparks = [];
  const SPARK_COUNT = 70;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const randomSpark = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.7 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.7 + 0.2,
  });

  const init = () => {
    sparks.length = 0;
    for (let i = 0; i < SPARK_COUNT; i += 1) sparks.push(randomSpark());
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
        Object.assign(s, randomSpark());
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 192, 245, ${s.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  resize();
  init();
  draw();
  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
