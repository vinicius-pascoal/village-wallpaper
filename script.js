// ── Partículas de folhas e pó ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Relógio místico ──
const elH = document.getElementById('clock-h');
const elM = document.getElementById('clock-m');
const elS = document.getElementById('clock-s');
const elDate = document.getElementById('clock-date');

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function pad(n) { return String(n).padStart(2, '0'); }

function tickClock() {
  const now = new Date();
  elH.textContent = pad(now.getHours());
  elM.textContent = pad(now.getMinutes());
  elS.textContent = pad(now.getSeconds());
  elDate.textContent = `${DAYS[now.getDay()]}  •  ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

tickClock();
setInterval(tickClock, 1000);

const PARTICLE_COUNT = 45;
const COLORS = [
  'rgba(180, 220, 110, 0.72)',  // folha verde clara
  'rgba(210, 175,  65, 0.62)',  // folha amarela
  'rgba(195, 130,  55, 0.60)',  // folha marrom
  'rgba(235, 225, 195, 0.38)',  // pó claro
  'rgba(160, 200, 130, 0.55)',  // folha verde média
];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -12;
    this.size = 1.5 + Math.random() * 4;
    this.speedY = 0.35 + Math.random() * 0.75;
    this.speedX = (Math.random() - 0.5) * 0.7;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.045;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpd = 0.018 + Math.random() * 0.022;
  }

  update() {
    this.wobble += this.wobbleSpd;
    this.x += this.speedX + Math.sin(this.wobble) * 0.55;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height + 14) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

// ── Vagalumes ──
const FIREFLY_COUNT = 30;
const FIREFLY_PALETTES = [
  [150, 255, 120],  // verde vibrante
  [190, 255, 160],  // verde-amarelo
  [210, 245, 80],  // amarelo
  [170, 210, 255],  // azul místico
  [210, 160, 255],  // lavanda
];

class Firefly {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial
      ? canvas.height * 0.25 + Math.random() * canvas.height * 0.70
      : canvas.height + 10;
    this.radius = 1.0 + Math.random() * 1.8;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.speedY = -(0.15 + Math.random() * 0.45);
    this.phase = Math.random() * Math.PI * 2;
    this.phaseSpd = 0.010 + Math.random() * 0.028;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpd = 0.008 + Math.random() * 0.018;
    this.rgb = FIREFLY_PALETTES[Math.floor(Math.random() * FIREFLY_PALETTES.length)];
  }

  update() {
    this.phase += this.phaseSpd;
    this.wobble += this.wobbleSpd;
    this.x += this.speedX + Math.sin(this.wobble) * 0.5;
    this.y += this.speedY;
    if (this.y < -10) this.reset();
  }

  draw() {
    const alpha = Math.sin(this.phase) * 0.5 + 0.5;
    const [r, g, b] = this.rgb;
    const glowR = this.radius * 7;

    // halo externo
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
    grd.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 0.50).toFixed(2)})`);
    grd.addColorStop(0.4, `rgba(${r},${g},${b},${(alpha * 0.15).toFixed(2)})`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // ponto central brilhante
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(alpha * 1.3, 1).toFixed(2)})`;
    ctx.fill();
  }
}

const fireflies = Array.from({ length: FIREFLY_COUNT }, () => new Firefly());

// ── Faíscas do halo ──
const islandWrapper = document.querySelector('.island-wrapper');

const SPARK_COLORS = [
  [240, 180, 255],  // violeta claro
  [255, 220, 120],  // dourado
  [120, 240, 255],  // ciano
  [200, 140, 255],  // lilás
  [255, 255, 255],  // branco
];

class HaloSpark {
  constructor() { this.reset(); }

  reset() {
    const rect = islandWrapper.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.50;
    const cy = rect.top + rect.height * 0.55;
    // raio base do anel interno (em px, aproximado)
    const rx = rect.width * 0.40;
    const ry = rect.height * 0.13;
    const angle = Math.random() * Math.PI * 2;

    this.x = cx + Math.cos(angle) * rx;
    this.y = cy + Math.sin(angle) * ry;
    // velocidade em direção radial + componente vertical suave
    const speed = 0.5 + Math.random() * 1.4;
    this.vx = Math.cos(angle) * speed * 1.8;
    this.vy = Math.sin(angle) * speed * 0.45 - (0.4 + Math.random() * 0.8);
    this.life = 1.0;
    this.decay = 0.018 + Math.random() * 0.025;
    this.size = 1.2 + Math.random() * 2.2;
    this.rgb = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 0.012;          // leve flutuação para cima
    this.vx *= 0.97;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }

  draw() {
    const [r, g, b] = this.rgb;
    const a = this.life;
    const glowR = this.size * 4;

    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
    grd.addColorStop(0, `rgba(${r},${g},${b},${(a * 0.9).toFixed(2)})`);
    grd.addColorStop(0.5, `rgba(${r},${g},${b},${(a * 0.3).toFixed(2)})`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a * 1.2, 1).toFixed(2)})`;
    ctx.fill();
  }
}

const sparks = Array.from({ length: 22 }, () => new HaloSpark());

// ── Loop de animação ──
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  fireflies.forEach(f => { f.update(); f.draw(); });
  sparks.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(animate);
}

animate();
