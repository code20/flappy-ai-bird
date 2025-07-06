export const BIRD_COLORS = [
  "#FF8C00",
  "#FFD700",
  "#FF6347",
  "#00BFFF",
];
export const DIFFICULTY_SCORE_INTERVAL = 5;
export const JUMP_COOLDOWN = 100;
export const NightViewScore = 20;
export const BuildingSizeIncreaseScore = 10;

export const CLOUDS = [
  { x: 50, y: 60, speed: 0.3, size: 42 },
  { x: 200, y: 100, speed: 0.2, size: 58 },
  { x: 320, y: 40, speed: 0.25, size: 46 },
  { x: 120, y: 150, speed: 0.18, size: 50 },
  { x: 400, y: 80, speed: 0.35, size: 38 },
];

export const PIPE_COLORS = ["green", "blue", "gray", "orange"];

export const PARALLAX_LAYERS = [
  { speed: 0.2, offset: 0, height: 100, color: "#27ae60" },
  { speed: 0.4, offset: 0, height: 80, color: "#2ecc71" },
  { speed: 0.6, offset: 0, height: 60, color: "#1abc9c" },
  { speed: 0.1, offset: 0, height: 40, color: "#34495e" },
];

export const PARALLAX_LAYERS_NIGHT = [
  { speed: 0.2, offset: 0, height: 100, color: "#2c3e50" },
  { speed: 0.4, offset: 0, height: 80, color: "#34495e" },
  { speed: 0.6, offset: 0, height: 60, color: "#2c3e50" },
  { speed: 0.1, offset: 0, height: 150, color: "#34495e" },
];

export const GROUND_OFFSET = 100;

export const FIXED_TIMESTEP = 1000 / 60; // 60 FPS

export const BASE_HEIGHT = 600;
export const BASE_WIDTH = 960;

export const INITIAL_LIVES = 3;

export const BIRD_START_X = 100;

export const PIPE_TOP_MIN = 50;
export const PIPE_TOP_BUFFER = 100;
export const DESIRED_PIPE_PIXEL_GAP = 650; // Desired gap between pipes in pixels

//add three export speeds to in crease difficulty from easy to hard
export const PIPE_SPEED_EASY = 3.5;
export const PIPE_SPEED_MEDIUM = 6;
export const PIPE_SPEED_HARD = 8;
