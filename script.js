// ===== Анимированный фон: падающие багеты, ноты и спирали =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
const symbols = ['🥖', '♪', '♫', '❤', 'テ', 'ト'];
let W, H, particles = [];

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

function makeParticle(y) {
  return {
    x: Math.random() * W,
    y: y ?? Math.random() * H,
    size: 14 + Math.random() * 26,
    speed: 0.3 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.6,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.03,
    alpha: 0.15 + Math.random() * 0.45,
    s: symbols[Math.floor(Math.random() * symbols.length)]
  };
}
const COUNT = innerWidth < 760 ? 30 : 60;
for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

function draw() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    p.y += p.speed;
    p.x += p.drift + Math.sin(p.y / 60) * 0.3;
    p.rot += p.vr;
    if (p.y > H + 40) Object.assign(p, makeParticle(-40));
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillStyle = '#e8364f';
    ctx.textAlign = 'center';
    ctx.fillText(p.s, 0, 0);
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
draw();

// ===== Печатающийся текст =====
const phrases = [
  'певица-химера 🌀',
  'первоапрельская шутка, ставшая легендой',
  'королева UTAU',
  'любительница багетов 🥖',
  'обладательница самых мощных буров',
  'голос Synthesizer V'
];
const typed = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;
function type() {
  const word = phrases[pi];
  typed.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) ci++;
  else if (deleting && ci > 0) ci--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1600); }
  else { deleting = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, deleting ? 35 : 70);
}
type();

// ===== Появление блоков при прокрутке + счётчики =====
function animateNumber(el) {
  const target = parseFloat(el.dataset.target);
  const dec = parseInt(el.dataset.decimals || 0);
  const pad = parseInt(el.dataset.pad || 0);
  const start = performance.now(), dur = 1600;
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    let v = (target * eased).toFixed(dec);
    if (pad) v = String(Math.round(v)).padStart(pad, '0');
    el.textContent = v;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('.num').forEach(animateNumber);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
  io.observe(el);
});

// ===== Взрыв из эмодзи =====
function burst(x, y, emoji = '🥖', n = 10) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'flying';
    s.textContent = Array.isArray(emoji) ? emoji[i % emoji.length] : emoji;
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 160;
    s.style.setProperty('--dx', Math.cos(a) * d + 'px');
    s.style.setProperty('--dy', Math.sin(a) * d + 'px');
    s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
}

// ===== Кнопка с багетом =====
let bags = parseInt(localStorage.getItem('tetoBaguettes') || '0');
const bagCount = document.getElementById('bagCount');
bagCount.textContent = bags;
document.getElementById('baguetteBtn').addEventListener('click', e => {
  bags++;
  localStorage.setItem('tetoBaguettes', bags);
  bagCount.textContent = bags;
  burst(e.clientX, e.clientY, '🥖', 14);
  if (bags % 10 === 0) alert(`Ты собрал ${bags} багетов! Тето гордится тобой 🌀`);
});

// ===== Клик по фону =====
document.addEventListener('click', e => {
  if (e.target.closest('button, a')) return;
  burst(e.clientX, e.clientY, ['🌀', '♪', '🥖', '❤'], 8);
});

// ===== Случайные факты =====
const facts = [
  'Тето официально 31 год — хотя выглядит она как подросток.',
  'В профиле её пол указан как «химера». Это часть изначальной шутки.',
  'День рождения Тето — 1 апреля, потому что она родилась как первоапрельский розыгрыш.',
  'Её номер 0401 — это тоже дата: 04.01, то есть 1 апреля.',
  'Багет — её фирменный предмет. Как лук-порей у Мику.',
  'Её волосы-«буры» (twin drills) стали узнаваемым символом во всём мире.',
  'Голос Тето принадлежит Оямано Маё (小山乃舞世).',
  'Первый голосовой банк Тето для UTAU был бесплатным.',
  'В 2023 году Тето получила ИИ-голос в Synthesizer V.',
  'Тето не Vocaloid, а UTAU / Synthesizer V — но фанаты всё равно часто зовут её вокалоидом.',
  'Песня «Fukkireta» с Тето и багетом стала одним из самых известных мемов.',
  'Её фраза из профиля: «Кими ва дзицу ни бака да на» — «Ты и правда дурак».'
];
let lastFact = -1;
const factText = document.getElementById('factText');
document.getElementById('factBtn').addEventListener('click', e => {
  let i;
  do { i = Math.floor(Math.random() * facts.length); } while (i === lastFact);
  lastFact = i;
  factText.classList.add('hide');
  setTimeout(() => { factText.textContent = facts[i]; factText.classList.remove('hide'); }, 300);
  burst(e.clientX, e.clientY, '🌀', 6);
});
