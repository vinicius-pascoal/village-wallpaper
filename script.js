// ── Partículas de folhas e pó ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}

animate();
