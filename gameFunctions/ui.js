import { BIRD_COLORS } from '../consts.js';

export function showStartScreen() {
  const startScreen = document.getElementById('startScreen');
  if (startScreen) startScreen.style.display = 'flex';
  const ui = document.getElementById('ui');
  if (ui) ui.style.pointerEvents = 'auto';
}

export function hideStartScreen() {
  const startScreen = document.getElementById('startScreen');
  if (startScreen) startScreen.style.display = 'none';
}

export function showGameOver(score, bestScore) {
  const gameOverScreen = document.getElementById('gameOver');
  const finalScore = document.getElementById('finalScore');
  
  if (gameOverScreen && finalScore) {
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = `SCORE: ${score} | BEST: ${bestScore}`;
  }
}

export function hideGameOver() {
  const gameOverScreen = document.getElementById('gameOver');
  if (gameOverScreen) gameOverScreen.style.display = 'none';
}

export function showPauseBtn() {
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  if (pauseBtn) pauseBtn.style.display = 'block';
  if (muteBtn) muteBtn.style.display = 'block';
}

export function showHearts() {
  const hearts = document.getElementById('hearts');
  if (hearts) hearts.style.display = 'flex';
}

export function updateHearts(lives) {
  const hearts = document.getElementById('hearts');
  if (hearts) {
    hearts.innerHTML = '';
    for (let i = 0; i < lives; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.innerHTML = '<i class="fas fa-heart" aria-label="Life"></i>';
      hearts.appendChild(heart);
    }
    hearts.setAttribute('aria-label', `${lives} lives left`);
  }
}

export function updatePauseBtnIcon(paused) {
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.innerHTML = paused
      ? '<i class="fas fa-play"></i>'
      : '<i class="fas fa-pause"></i>';
    pauseBtn.setAttribute('aria-label', paused ? 'Resume Game' : 'Pause Game');
    pauseBtn.setAttribute('aria-pressed', paused.toString());
  }
}

export function updateMuteBtnIcon(muted) {
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.setAttribute('aria-pressed', muted.toString());
    muteBtn.setAttribute('aria-label', muted ? 'Unmute Sound' : 'Mute Sound');
  }
}

export function draw(
  ctx,
  canvas,
  bird,
  pipes,
  particles,
  score,
  paused,
  BIRD_SIZE,
  currentPipeGap,
  PIPE_WIDTH,
  groundY,
  frame,
  BuildingSizeIncreaseScore,
  NightViewScore,
  PARALLAX_LAYERS,
  PARALLAX_LAYERS_NIGHT,
  CLOUDS,
  drawCloud,
  drawPipes,
  drawBird,
  drawParticles,
  drawDarkParallax,
  drawLightParallax
) {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Use PARALLAX_LAYERS or PARALLAX_LAYERS_NIGHT based on score
  const layers = (score >= BuildingSizeIncreaseScore) ? PARALLAX_LAYERS_NIGHT : PARALLAX_LAYERS;
  const drawParallax = score >= NightViewScore ? drawDarkParallax : drawLightParallax;

  drawParallax(ctx, canvas, layers, groundY);

  for (let cloud of CLOUDS) drawCloud(ctx, cloud);

  if (bird) {
    for (let pipe of pipes) drawPipes(ctx, pipe, currentPipeGap, PIPE_WIDTH, canvas);
    drawBird(ctx, bird, frame || 0, BIRD_SIZE);
    drawParticles(ctx, particles);
  } else {
    // Draw preview bird on start screen
    drawBird(ctx, {
      x: 100,
      y: canvas.height / 2,
      w: BIRD_SIZE,
      h: BIRD_SIZE,
      color: BIRD_COLORS[0],
      wingState: 0,
      wingDirection: 1
    }, 0, BIRD_SIZE);
  }
  
  // Draw score
  ctx.fillStyle = '#fff200';
  ctx.font = 'bold 36px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 4;
  ctx.strokeText(score || 0, canvas.width/2, 60);
  ctx.fillText(score || 0, canvas.width/2, 60);
  
  // Draw pause overlay
  if (paused) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillText('Press P to resume', canvas.width/2, canvas.height/2 + 40);
    ctx.restore();
  }
}