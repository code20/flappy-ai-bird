import { setupControls } from "./gameFunctions/controls.js";
import { drawBird } from "./gameFunctions/bird.js";
import { drawPipes } from "./gameFunctions/pipes.js";
import {
  drawDarkParallax,
  drawLightParallax,
  updateParallax,
  drawCloud,
  updateClouds,
} from "./gameFunctions/parallax.js";
import { sounds, unlockAudio } from "./gameFunctions/sound.js";
import { updateBestScore } from "./gameFunctions/state.js";
import { createParticle, updateParticles, drawParticles } from "./gameFunctions/particles.js";
import {
  BIRD_COLORS,
  DIFFICULTY_SCORE_INTERVAL,
  JUMP_COOLDOWN,
  NightViewScore,
  BuildingSizeIncreaseScore,
  CLOUDS,
  PIPE_COLORS,
  PARALLAX_LAYERS,
  PARALLAX_LAYERS_NIGHT,
  GROUND_OFFSET,
  BASE_HEIGHT,
  BASE_WIDTH,
  FIXED_TIMESTEP,
  INITIAL_LIVES,
  BIRD_START_X,
  PIPE_TOP_MIN,
  PIPE_TOP_BUFFER,
} from "./consts.js";
import {
  draw,
  showStartScreen,
  hideStartScreen,
  showGameOver,
  hideGameOver,
  showPauseBtn,
  showHearts,
  updateHearts,
  updatePauseBtnIcon,
  updateMuteBtnIcon,
} from "./gameFunctions/ui.js";

let canvas, ctx;

// Game constants (will be set dynamically)
let GRAVITY,
  JUMP,
  PIPE_WIDTH,
  BASE_PIPE_GAP,
  MIN_PIPE_GAP,
  BASE_PIPE_SPEED,
  BIRD_SIZE,
  PIPE_INTERVAL;

// Game state
let bird,
  pipes,
  score,
  gameOver,
  frame,
  started,
  bestScore = 0;
let particles = [];

let groundY = 500;
let lives = INITIAL_LIVES;
let paused = false;
let currentPipeGap = BASE_PIPE_GAP;
let currentPipeSpeed = BASE_PIPE_SPEED;
let lastJumpTime = 0;
let muted = false;

// Responsive canvas setup
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  groundY = canvas.height - GROUND_OFFSET;

  // Reference design size
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

  if (bird) {
    bird.w = BIRD_SIZE;
    bird.h = BIRD_SIZE;
    draw(
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
    );
  }
}

// Update canvas size
window.addEventListener("resize", resizeCanvas);

function resetGame() {
  bird = {
    x: BIRD_START_X,
    y: canvas.height / 2,
    vy: 0,
    w: BIRD_SIZE,
    h: BIRD_SIZE,
    color: BIRD_COLORS[Math.floor(Math.random() * BIRD_COLORS.length)],
    wingState: 0,
    wingDirection: 1,
  };
  pipes = [];
  // Add a pipe immediately at game start
  const top =
    Math.floor(Math.random() * (groundY - currentPipeGap - PIPE_TOP_BUFFER)) + PIPE_TOP_MIN;
  pipes.push({
    x: canvas.width,
    top,
    passed: false,
  });
  score = 0;
  gameOver = false;
  frame = 1; // Prevent immediate duplicate pipe
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
    const layer = PARALLAX_LAYERS[i];
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
  particles = [];
  lives = 3;
  paused = false;
  currentPipeGap = BASE_PIPE_GAP;
  currentPipeSpeed = BASE_PIPE_SPEED;
  lastJumpTime = 0;

  for (let i = 0; i < 3; i++) {
    const layer = PARALLAX_LAYERS[i];
    layer.offset = 0;
    layer.hedgeHeights = [];

    for (let j = 0; j < 50; j++) {
      layer.hedgeHeights[j] = 10 + Math.random() * 15;
    }
  }

  updateHearts(lives);
}

function update() {
  if (!started || gameOver || paused || !bird) return;

  // Progressive pipe gap reduction for difficulty
  // Every DIFFICULTY_SCORE_INTERVAL points, reduce gap by 10px, but never below MIN_PIPE_GAP
  currentPipeGap = Math.max(
    MIN_PIPE_GAP,
    BASE_PIPE_GAP - Math.floor(score / DIFFICULTY_SCORE_INTERVAL) * 10
  );

  // Apply physics
  bird.vy += GRAVITY;
  bird.y += bird.vy;

  // Update environment
  updateClouds(CLOUDS, canvas);

  // Use PARALLAX_LAYERS or PARALLAX_LAYERS_NIGHT based on score
  const layers = score >= BuildingSizeIncreaseScore ? PARALLAX_LAYERS_NIGHT : PARALLAX_LAYERS;
  updateParallax(layers, canvas);
  updateParticles(particles);

  // Ground collision
  if (bird.y + bird.h > groundY) {
    bird.y = groundY - bird.h;
    loseLife();

    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(bird.x + bird.w / 2, bird.y + bird.h, bird.color));
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
    // Randomly pick a color for the pipe (green, blue, gray, orange)
    const color = PIPE_COLORS[Math.floor(Math.random() * PIPE_COLORS.length)];
    pipes.push({
      x: canvas.width,
      top,
      passed: false,
      color: color,
    });
  }

  // Move pipes
  for (let pipe of pipes) {
    pipe.x -= currentPipeSpeed;
  }

  // Cleanup pipes
  pipes = pipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0);

  // Collision detection
  for (let pipe of pipes) {
    const pipeEndMargin = -8; // Match the drawing code

    // Top pipe rectangle (matches drawing)
    const topPipeRect = {
      x: pipe.x,
      y: 0,
      w: PIPE_WIDTH,
      h: pipe.top - 18 - pipeEndMargin,
    };

    // Bottom pipe rectangle (matches drawing)
    const bottomPipeRect = {
      x: pipe.x,
      y: pipe.top + currentPipeGap + 18 + pipeEndMargin,
      w: PIPE_WIDTH,
      h: groundY - (pipe.top + currentPipeGap + 18 + pipeEndMargin),
    };

    // Bird rectangle (shrink by 4px on all sides for a more forgiving collision)
    const birdRect = {
      x: bird.x + 2,
      y: bird.y + 2,
      w: bird.w - 4,
      h: bird.h - 4,
    };

    function rectsOverlap(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    if (rectsOverlap(birdRect, topPipeRect) || rectsOverlap(birdRect, bottomPipeRect)) {
      loseLife();
      return;
    }

    // Scoring
    const pipeRight = pipe.x + PIPE_WIDTH;
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
    particles.push(createParticle(bird.x + bird.w / 2, bird.y + bird.h, "#FFD700"));
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
    pipes = pipes.filter((pipe) => {
      const pipeRight = pipe.x + PIPE_WIDTH;
      return !(bird.x + bird.w - 10 > pipe.x && bird.x + 10 < pipeRight);
    });

    showHearts();
    updateHearts(lives);
  }
}

function togglePause() {
  paused = !paused;
  updatePauseBtnIcon(paused);
  if (!paused && !gameOver) {
    lastFrameTime = performance.now();
    accumulator = 0;
    requestAnimationFrame(loop);
  }
}

function toggleMute() {
  muted = !muted;
  updateMuteBtnIcon(muted);
  // Mute/unmute all sounds
  if (typeof sounds === "object") {
    Object.values(sounds).forEach((snd) => {
      if (snd && typeof snd.muted !== "undefined") {
        snd.muted = muted;
      }
    });
  }
  localStorage.setItem("flappyMuted", muted);
}

// Fixed timestep game loop
let lastFrameTime = 0;
let accumulator = 0;

function loop(now) {
  if (!now) now = performance.now();
  accumulator += now - lastFrameTime;
  lastFrameTime = now;

  while (accumulator >= FIXED_TIMESTEP) {
    update();
    accumulator -= FIXED_TIMESTEP;
  }
  draw(
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
  );

  if (!gameOver && !paused) {
    requestAnimationFrame(loop);
  } else if (gameOver) {
    showGameOver(score, bestScore);
    if (score > bestScore) {
      bestScore = score;
    }
  }
}

function startGame() {
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
window.addEventListener("DOMContentLoaded", () => {
  // Initialize canvas
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Set initial canvas size and game constants FIRST
  resizeCanvas();

  // Initialize game state
  resetGameStateVars();

  // Load best score
  const savedScore = localStorage.getItem("flappyBestScore");
  bestScore = savedScore ? parseInt(savedScore) : 0;
  updateBestScore(bestScore);

  // Load mute preference
  const savedMute = localStorage.getItem("flappyMuted");
  muted = savedMute === "true";

  // Apply mute settings to sound objects
  if (muted && typeof sounds === "object") {
    Object.values(sounds).forEach((snd) => {
      if (snd && typeof snd.muted !== "undefined") {
        snd.muted = muted;
      }
    });
  }

  // Setup controls (only once)
  setupControls(startGame, jump, togglePause, canvas);

  // Add mouse, touch, pointer, and click support for jump
  canvas.addEventListener("mousedown", jump);
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      jump();
    },
    { passive: false }
  );
  canvas.addEventListener(
    "pointerdown",
    function (e) {
      e.preventDefault();
      jump();
    },
    { passive: false }
  );
  canvas.addEventListener("click", function () {
    jump();
  });
  document.addEventListener(
    "touchstart",
    function (e) {
      if (e.target === canvas) {
        e.preventDefault();
        jump();
      }
    },
    { passive: false }
  );
  document.addEventListener(
    "pointerdown",
    function (e) {
      e.preventDefault();
      jump();
    },
    { passive: false }
  );
  document.addEventListener("click", function (e) {
    if (e.target === canvas) jump();
  });

  // Attach Start button click event
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.onclick = startGame;
  }

  // Add direct event listeners to pause and mute buttons to ensure they work
  const pauseBtn = document.getElementById("pauseBtn");
  const muteBtn = document.getElementById("muteBtn");

  if (pauseBtn) {
    const newPauseBtn = pauseBtn.cloneNode(false); // clone without children
    newPauseBtn.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    newPauseBtn.addEventListener("click", togglePause);
    newPauseBtn.setAttribute("tabindex", "0");
    newPauseBtn.setAttribute("aria-pressed", paused.toString());
    newPauseBtn.setAttribute("aria-label", paused ? "Resume Game" : "Pause Game");
    pauseBtn.parentNode.replaceChild(newPauseBtn, pauseBtn);
  }

  if (muteBtn) {
    const newMuteBtn = muteBtn.cloneNode(false); // clone without children
    newMuteBtn.innerHTML = muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    newMuteBtn.addEventListener("click", toggleMute);
    newMuteBtn.setAttribute("tabindex", "0");
    newMuteBtn.setAttribute("aria-pressed", muted.toString());
    newMuteBtn.setAttribute("aria-label", muted ? "Unmute Sound" : "Mute Sound");
    muteBtn.parentNode.replaceChild(newMuteBtn, muteBtn);
    newMuteBtn.style.display = "none"; // keep as before
  }

  // Keyboard controls - completely separate from button controls
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (e.code === "Space" || e.key === " ") {
      if (!started) startGame();
      if (!paused && !gameOver) jump();
    }
    // Use e.code for reliability, but also check for active form elements
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.code === "KeyP" && !["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      e.preventDefault();
      togglePause();
    }
    if (e.code === "KeyM" && !["BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      e.preventDefault();
      toggleMute();
    }
  });

  // Show start screen
  showStartScreen();

  // Draw initial frame
  draw(
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
  );
});
