
export function drawBird(ctx, bird, frame, BIRD_SIZE) {
  // Calculate rotation based on velocity
  const rotation = Math.max(-Math.PI/4, Math.min(bird.vy * 0.05, Math.PI/4));

  ctx.save();
  ctx.translate(Math.round(bird.x + BIRD_SIZE/2), Math.round(bird.y + BIRD_SIZE/2));
  ctx.rotate(rotation);

  // Body with gradient
  const gradient = ctx.createRadialGradient(
    -5, -5, 1,
    0, 0, BIRD_SIZE/2
  );
  gradient.addColorStop(0, bird.color);
  gradient.addColorStop(1, '#f0f0f0');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE/2, BIRD_SIZE/2 - 4, 0, 0, Math.PI*2);
  ctx.fill();

  const wingStates = [0, 15, 30];
  const wingOffset = wingStates[bird.wingState] || 0;

  // Wing
  ctx.save();
  ctx.rotate(-0.3 + wingOffset * 0.05);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.quadraticCurveTo(-25, -10, -10, -20 - wingOffset);
  ctx.quadraticCurveTo(0, -10, -10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Tail
  ctx.fillStyle = bird.color;
  ctx.beginPath();
  ctx.moveTo(-BIRD_SIZE/2 + 5, 0);
  ctx.lineTo(-BIRD_SIZE/2 - 10, -5);
  ctx.lineTo(-BIRD_SIZE/2 - 5, 5);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(10, -5, 4, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(11, -6, 1.5, 0, Math.PI*2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE/2 - 2, -2);
  ctx.lineTo(BIRD_SIZE/2 + 12, 0);
  ctx.lineTo(BIRD_SIZE/2 - 2, 2);
  ctx.closePath();
  ctx.fill();

  // Beak highlight
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE/2 + 3, -1);
  ctx.lineTo(BIRD_SIZE/2 + 8, 0);
  ctx.lineTo(BIRD_SIZE/2 + 3, 1);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Update wing animation
  if (frame % 5 === 0) {
    bird.wingState += bird.wingDirection;
    if (bird.wingState === 0 || bird.wingState === 2) {
      bird.wingDirection *= -1;
    }
  }
}
