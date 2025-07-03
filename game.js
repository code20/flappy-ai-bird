// Import modules
import { setupControls } from './gameFunctions/controls.js';
import { drawBird } from './gameFunctions/bird.js';
import { drawPipes } from './gameFunctions/pipes.js';
import { drawParallax, updateParallax, drawCloud, updateClouds } from './gameFunctions/parallax.js';
import { sounds, unlockAudio } from './gameFunctions/sound.js';
import { updateBestScore, updateDifficulty } from './gameFunctions/state.js';
import { createParticle, updateParticles, drawParticles } from './gameFunctions/particles.js';

let canvas, ctx;

// Game constants (will be set dynamically)
let GRAVITY, JUMP, PIPE_WIDTH, BASE_PIPE_GAP, MIN_PIPE_GAP, BASE_PIPE_SPEED, MAX_PIPE_SPEED, BIRD_SIZE, PIPE_INTERVAL;
const BIRD_COLORS = ['#FF8C00', '#FFD700', '#FF6347', '#00BFFF'];
const DIFFICULTY_SCORE_INTERVAL = 5;
const STATUE_CHANCE = 0.2;
const JUMP_COOLDOWN = 100;

// Cloud settings
const CLOUDS = [
  { x: 50, y: 60, speed: 0.3, size: 42 },
  { x: 200, y: 100, speed: 0.2, size: 58 },
  { x: 320, y: 40, speed: 0.25, size: 46 },
  { x: 120, y: 150, speed: 0.18, size: 50 },
  { x: 400, y: 80, speed: 0.35, size: 38 }
];

// Game state
let bird, pipes, score, gameOver, frame, started, birdFrame, bestScore = 0;
let particles = [];
let parallaxLayers = [
  { speed: 0.2, offset: 0, height: 100, color: '#27ae60' },
  { speed: 0.4, offset: 0, height: 80, color: '#2ecc71' },
  { speed: 0.6, offset: 0, height: 60, color: '#1abc9c' },
  { speed: 0.1, offset: 0, height: 40, color: '#34495e' } 
];
let groundY = 500;
let lives = 3;
let paused = false;
let currentPipeGap = BASE_PIPE_GAP;
let currentPipeSpeed = BASE_PIPE_SPEED;
let lastJumpTime = 0;
let muted = false;

// UI Functions Implementation
function showStartScreen() {
  const startScreen = document.getElementById('startScreen');
  if (startScreen) startScreen.style.display = 'flex';
  const ui = document.getElementById('ui');
  if (ui) ui.style.pointerEvents = 'auto';
}

function hideStartScreen() {
  const startScreen = document.getElementById('startScreen');
  if (startScreen) startScreen.style.display = 'none';
}

function showGameOver() {
  const gameOverScreen = document.getElementById('gameOver');
  const finalScore = document.getElementById('finalScore');
  
  if (gameOverScreen && finalScore) {
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = `SCORE: ${score} | BEST: ${bestScore}`;
  }
}

function hideGameOver() {
  const gameOverScreen = document.getElementById('gameOver');
  if (gameOverScreen) gameOverScreen.style.display = 'none';
}

function showPauseBtn() {
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  if (pauseBtn) pauseBtn.style.display = 'block';
  if (muteBtn) muteBtn.style.display = 'block';
}

function hidePauseBtn() {
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  if (pauseBtn) pauseBtn.style.display = 'none';
  if (muteBtn) muteBtn.style.display = 'none';
}

function showHearts() {
  const hearts = document.getElementById('hearts');
  if (hearts) hearts.style.display = 'flex';
}

function hideHearts() {
  const hearts = document.getElementById('hearts');
  if (hearts) hearts.style.display = 'none';
}

// Update the hearts display to use Font Awesome icons
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

// Responsive canvas setup
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  groundY = canvas.height - 100;

  // Reference design size
  const BASE_HEIGHT = 600;
  const BASE_WIDTH = 960;
  const heightScale = canvas.height / BASE_HEIGHT;
  const widthScale = canvas.width / BASE_WIDTH;

  // Only scale visual elements
  BIRD_SIZE = Math.max(24, Math.round(34 * heightScale));
  PIPE_WIDTH = Math.max(60, Math.round(80 * widthScale));
  BASE_PIPE_GAP = Math.round(160 * heightScale);
  MIN_PIPE_GAP = Math.round(120 * heightScale);
  PIPE_INTERVAL = Math.round(100 * widthScale);

  // Physics constants: keep original values
  GRAVITY = 0.4;
  JUMP = -7.5;
  BASE_PIPE_SPEED = 3.5;
  MAX_PIPE_SPEED = 6.5;

  if (bird) {
    bird.w = BIRD_SIZE;
    bird.h = BIRD_SIZE;
    draw();
  }
}

// Update canvas size
window.addEventListener('resize', resizeCanvas);

function resetGame() {
  bird = {
    x: 100,
    y: canvas.height / 2,
    vy: 0,
    w: BIRD_SIZE,
    h: BIRD_SIZE,
    color: BIRD_COLORS[Math.floor(Math.random()*BIRD_COLORS.length)],
    wingState: 0,
    wingDirection: 1
  };
  pipes = [];
  // Add a pipe immediately at game start
  const top = Math.floor(Math.random() * (groundY - BASE_PIPE_GAP - 100)) + 50;
  pipes.push({
    x: canvas.width,
    top,
    passed: false,
    isStatue: false
  });
  score = 0;
  gameOver = false;
  frame = 1; // Prevent immediate duplicate pipe
  birdFrame = 0;
  particles = [];
  lives = 3;
  paused = false;
  currentPipeGap = BASE_PIPE_GAP;
  currentPipeSpeed = BASE_PIPE_SPEED;
  lastJumpTime = 0;
  hideGameOver();
  updateHearts(lives);
  updateBestScore(bestScore);
  // Reset parallax layer offsets
  for (let i = 0; i < 3; i++) {
    const layer = parallaxLayers[i];
    layer.offset = 0;
    layer.hedgeHeights = [];
    for (let j = 0; j < 50; j++) {
      layer.hedgeHeights[j] = 10 + Math.random() * 15;
    }
  }
}

// Helper: Reset all game state variables to safe defaults
function resetGameStateVars() {
  started = false;
  bird = undefined;
  pipes = [];
  score = undefined;
  gameOver = false;
  frame = 0;
  birdFrame = 0;
  particles = [];
  lives = 3;
  paused = false;
  currentPipeGap = BASE_PIPE_GAP;
  currentPipeSpeed = BASE_PIPE_SPEED;
  lastJumpTime = 0;
  
  for (let i = 0; i < 3; i++) {
    const layer = parallaxLayers[i];
    layer.offset = 0;
    layer.hedgeHeights = [];
    
    for (let j = 0; j < 50; j++) {
      layer.hedgeHeights[j] = 10 + Math.random() * 15;
    }
  }
  
  updateHearts(lives);
}

function draw() {
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawParallax(ctx, canvas, parallaxLayers, groundY);
  
  for (let cloud of CLOUDS) drawCloud(ctx, cloud);
  
  if (bird) {
    for (let pipe of pipes) drawPipes(ctx, pipe, currentPipeGap, PIPE_WIDTH, canvas, groundY);
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

function update() {
  if (!started || gameOver || paused || !bird) return;
  
  // Progressive pipe gap reduction for difficulty
  // Every DIFFICULTY_SCORE_INTERVAL points, reduce gap by 10px, but never below MIN_PIPE_GAP
  currentPipeGap = Math.max(
    MIN_PIPE_GAP,
    BASE_PIPE_GAP - Math.floor(score / DIFFICULTY_SCORE_INTERVAL) * 10
  );

  // Optionally, you can also increase pipe speed here for more challenge:
  // currentPipeSpeed = Math.min(
  //   MAX_PIPE_SPEED,
  //   BASE_PIPE_SPEED + Math.floor(score / DIFFICULTY_SCORE_INTERVAL) * 0.2
  // );

  // Apply physics
  bird.vy += GRAVITY;
  bird.y += bird.vy;
  birdFrame++;
  
  // Update environment
  updateClouds(CLOUDS, canvas);
  updateParallax(parallaxLayers, canvas);
  updateParticles(particles);

  // Ground collision
  if (bird.y + bird.h > groundY) {
    bird.y = groundY - bird.h;
    loseLife();
    
    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(
        bird.x + bird.w/2, 
        bird.y + bird.h, 
        bird.color
      ));
    }
    return;
  }
  
  // Ceiling collision
  if (bird.y < 0) {
    bird.y = 0;
    bird.vy = 0;
  }

  // Pipe generation
  if (frame % PIPE_INTERVAL === 0) {
    const top = Math.floor(Math.random() * (groundY - currentPipeGap - 100)) + 50;
    const isStatue = Math.random() < STATUE_CHANCE;
    // Randomly pick a color for the pipe (green, blue, gray, orange)
    const pipeColors = ['green', 'blue', 'gray', 'orange'];
    const color = pipeColors[Math.floor(Math.random() * pipeColors.length)];
    pipes.push({ 
      x: canvas.width, 
      top, 
      passed: false,
      isStatue,
      color: isStatue ? undefined : color // statues remain default
    });
  }
  
  // Move pipes
  for (let pipe of pipes) {
    pipe.x -= currentPipeSpeed;
  }
  
  // Cleanup pipes
  pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

  // Collision detection
  for (let pipe of pipes) {
    const pipeRight = pipe.x + PIPE_WIDTH;
    const birdRight = bird.x + bird.w;
    const birdBottom = bird.y + bird.h;
    
    // Collision with statue
    if (pipe.isStatue) {
      if (birdRight - 10 > pipe.x && 
          bird.x + 10 < pipeRight &&
          birdBottom - 5 > pipe.top + currentPipeGap) {
        loseLife();
        return;
      }
    } 
    // Collision with normal pipe
    else {
      if (birdRight - 10 > pipe.x && 
          bird.x + 10 < pipeRight &&
          (bird.y + 5 < pipe.top || birdBottom - 5 > pipe.top + currentPipeGap)) {
        loseLife();
        return;
      }
    }
    
    // Scoring
    if (!pipe.passed && pipeRight < bird.x) {
      score++;
      pipe.passed = true;
      try {
        if (sounds.score && !muted) {
          sounds.score.currentTime = 0;
          sounds.score.play();
        }
      } catch (e) {
        console.log("Score sound error:", e);
      }
    }
  }
  
  frame++;
}

function jump() {
  if (!started || gameOver || paused) return;
  const now = Date.now();
  if (now - lastJumpTime < JUMP_COOLDOWN) return;
  lastJumpTime = now;
  bird.vy = JUMP;
  try {
    if (sounds.jump && !muted) {
      sounds.jump.currentTime = 0;
      sounds.jump.play();
    }
  } catch (e) {
    console.log("Jump sound error:", e);
  }
  // Jump particles
  for (let i = 0; i < 5; i++) {
    particles.push(createParticle(
      bird.x + bird.w/2, 
      bird.y + bird.h, 
      '#FFD700'
    ));
  }
}

function loseLife() {
  lives--;
  
  try {
    if (sounds.hit && !muted) {
      sounds.hit.currentTime = 0;
      sounds.hit.play();
    }
  } catch (e) {
    console.log("Hit sound error:", e);
  }
  
  updateHearts(lives);
  
  if (lives <= 0) {
    gameOver = true;
  } else {
    // Reset position
    bird.y = canvas.height / 2;
    bird.vy = 0;
    
    // Remove overlapping pipes
    pipes = pipes.filter(pipe => {
      const pipeRight = pipe.x + PIPE_WIDTH;
      return !(bird.x + bird.w - 10 > pipe.x && bird.x + 10 < pipeRight);
    });
    
    showHearts();
    updateHearts(lives);
  }
}

function togglePause() {
  paused = !paused;
  updatePauseBtnIcon();
  if (!paused && !gameOver) {
    lastFrameTime = performance.now();
    accumulator = 0;
    requestAnimationFrame(loop);
  }
}

function updatePauseBtnIcon() {
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.innerHTML = paused
      ? '<i class="fas fa-play"></i>'
      : '<i class="fas fa-pause"></i>';
    pauseBtn.setAttribute('aria-label', paused ? 'Resume Game' : 'Pause Game');
    pauseBtn.setAttribute('aria-pressed', paused.toString());
  }
}

function toggleMute() {
  muted = !muted;
  updateMuteBtnIcon();
  // Mute/unmute all sounds
  if (typeof sounds === 'object') {
    Object.values(sounds).forEach(snd => {
      if (snd && typeof snd.muted !== 'undefined') {
        snd.muted = muted;
      }
    });
  }
  localStorage.setItem('flappyMuted', muted);
}

function updateMuteBtnIcon() {
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.setAttribute('aria-pressed', muted.toString());
    muteBtn.setAttribute('aria-label', muted ? 'Unmute Sound' : 'Mute Sound');
  }
}

// Fixed timestep game loop
let lastFrameTime = 0;
let accumulator = 0;
const FIXED_TIMESTEP = 1000 / 60; // 60 FPS

function loop(now) {
  if (!now) now = performance.now();
  accumulator += now - lastFrameTime;
  lastFrameTime = now;

  while (accumulator >= FIXED_TIMESTEP) {
    update();
    accumulator -= FIXED_TIMESTEP;
  }
  draw();

  if (!gameOver && !paused) {
    requestAnimationFrame(loop);
  } else if (gameOver) {
    showGameOver();
    if (score > bestScore) {
      bestScore = score;
    }
  }
}

function startGame() {
  console.log("Start button pressed");
  unlockAudio();
  started = true;
  resetGame();
  hideStartScreen();
  showHearts();
  showPauseBtn();

  // Start game loop
  lastFrameTime = performance.now();
  accumulator = 0;
  requestAnimationFrame(loop);

  // Focus canvas for keyboard controls
  if (canvas) canvas.focus();
}

// Entry point
window.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  // Set initial canvas size and game constants FIRST
  resizeCanvas();

  // Initialize game state
  resetGameStateVars();

  // Load best score
  const savedScore = localStorage.getItem('flappyBestScore');
  bestScore = savedScore ? parseInt(savedScore) : 0;
  updateBestScore(bestScore);
  
  // Load mute preference
  const savedMute = localStorage.getItem('flappyMuted');
  muted = savedMute === 'true';
  
  // Apply mute settings to sound objects
  if (muted && typeof sounds === 'object') {
    Object.values(sounds).forEach(snd => {
      if (snd && typeof snd.muted !== 'undefined') {
        snd.muted = muted;
      }
    });
  }

  // Setup controls (only once)
  console.log('Calling setupControls', { startGame, jump, togglePause, canvas });
  setupControls(startGame, jump, togglePause, canvas);

  // Add mouse, touch, pointer, and click support for jump
  canvas.addEventListener('mousedown', jump);
  canvas.addEventListener('touchstart', function(e) { 
    e.preventDefault(); jump(); 
  }, { passive: false });
  canvas.addEventListener('pointerdown', function(e) { 
    e.preventDefault(); 
    jump(); 
  }, { passive: false });
  canvas.addEventListener('click', function(e) {
    jump();
  });
  document.addEventListener('touchstart', function(e) {
    if (e.target === canvas) { e.preventDefault(); jump(); }
  }, { passive: false });
  document.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    jump();
  }, { passive: false });
  document.addEventListener('click', function(e) {
    if (e.target === canvas) jump();
  });

  // Attach Start button click event
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.onclick = startGame;
  }

  // Add direct event listeners to pause and mute buttons to ensure they work
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');

  if (pauseBtn) {
    const newPauseBtn = pauseBtn.cloneNode(false); // clone without children
    newPauseBtn.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    newPauseBtn.addEventListener('click', togglePause);
    newPauseBtn.setAttribute('tabindex', '0');
    newPauseBtn.setAttribute('aria-pressed', paused.toString());
    newPauseBtn.setAttribute('aria-label', paused ? 'Resume Game' : 'Pause Game');
    pauseBtn.parentNode.replaceChild(newPauseBtn, pauseBtn);
  }

  if (muteBtn) {
    const newMuteBtn = muteBtn.cloneNode(false); // clone without children
    newMuteBtn.innerHTML = muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    newMuteBtn.addEventListener('click', toggleMute);
    newMuteBtn.setAttribute('tabindex', '0');
    newMuteBtn.setAttribute('aria-pressed', muted.toString());
    newMuteBtn.setAttribute('aria-label', muted ? 'Unmute Sound' : 'Mute Sound');
    muteBtn.parentNode.replaceChild(newMuteBtn, muteBtn);
    newMuteBtn.style.display = 'none'; // keep as before
  }
  
  // Keyboard controls - completely separate from button controls
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.code === 'Space' || e.key === ' ') {
      if (!started) startGame();
      if (!paused && !gameOver) jump();
    }
    // Use e.code for reliability, but also check for active form elements
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.code === 'KeyP' && !['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      e.preventDefault();
      togglePause();
    }
    if (e.code === 'KeyM' && !['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      e.preventDefault();
      toggleMute();
    }
  });

  // Show start screen
  showStartScreen();

  // Draw initial frame
  draw();
});