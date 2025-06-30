
export function updateHearts(lives) {
  const heartsContainer = document.getElementById('hearts');
  if (!heartsContainer) return;
  
  heartsContainer.innerHTML = '';
  
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heartsContainer.appendChild(heart);
  }
}

export function updateBestScore(bestScore) {
  const bestScoreDisplay = document.getElementById('bestScoreDisplay');
  if (bestScoreDisplay) {
    bestScoreDisplay.textContent = bestScore;
  }
}

export function updateDifficulty(score, baseSpeed, maxSpeed, baseGap, minGap, interval) {
  const difficultyLevel = Math.floor(score / interval);
  const speedIncrement = (maxSpeed - baseSpeed) * (difficultyLevel * 0.2);
  const gapDecrement = (baseGap - minGap) * (difficultyLevel * 0.15);
  
  return {
    currentPipeSpeed: Math.min(baseSpeed + speedIncrement, maxSpeed),
    currentPipeGap: Math.max(baseGap - gapDecrement, minGap)
  };
}