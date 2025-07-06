export function createParticle(x, y, color) {
  return {
    x: x,
    y: y,
    size: Math.random() * 5 + 2,
    speedX: Math.random() * 4 - 2,
    speedY: Math.random() * 2 - 4,
    color: color,
    life: 20,
  };
}

export function updateParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / 20;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
