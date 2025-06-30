
export function showStartScreen() {
  document.getElementById('startScreen').style.display = 'flex';
  document.getElementById('score').style.display = 'none';
  document.getElementById('hearts').style.display = 'none';
  // Draw background/parallax
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  // You may need to import or access parallaxLayers and groundY here
  drawParallax(ctx, canvas, parallaxLayers, groundY);
  document.getElementById('startBtn').onclick = () => {
    if (typeof window.startGame === 'function') window.startGame();
  };
}

export function hideStartScreen() {
  document.getElementById('startScreen').style.display = 'none';
}

export function showGameOver(score, bestScore) {
  document.getElementById('gameOver').style.display = 'flex';
  document.getElementById('finalScore').textContent = `SCORE: ${score}${score > bestScore ? ' (NEW BEST!)' : ''}`;
}

export function hideGameOver() {
  document.getElementById('gameOver').style.display = 'none';
}

export function showPauseBtn(paused) {
  const btn = document.getElementById('pauseBtn');
  btn.style.display = 'block';
  btn.textContent = paused ? '▶️' : '⏸️';
}

export function hidePauseBtn() {
  document.getElementById('pauseBtn').style.display = 'none';
}

export function showHearts() {
  document.getElementById('hearts').style.display = 'block';
}

export function hideHearts() {
  document.getElementById('hearts').style.display = 'none';
}
