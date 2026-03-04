/* Parallax suave: a vila se move levemente com o mouse */
const bg = document.querySelector('.bg-village');

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
const STRENGTH = 12; // px máximo de deslocamento
const EASE = 0.06;

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  targetX = ((e.clientX - cx) / cx) * -STRENGTH;
  targetY = ((e.clientY - cy) / cy) * -STRENGTH;
});

function tick() {
  currentX += (targetX - currentX) * EASE;
  currentY += (targetY - currentY) * EASE;
  bg.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.04)`;
  requestAnimationFrame(tick);
}

tick();
