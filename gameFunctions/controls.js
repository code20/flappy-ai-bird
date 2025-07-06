import {
  PIPE_SPEED_EASY,
  PIPE_SPEED_MEDIUM,
  PIPE_SPEED_HARD,
} from "../consts.js";

let controlsInitialized = false;

function handleCanvasClick() {
  window._flappyJump && window._flappyJump();
}
function handleCanvasTouch(e) {
  e.preventDefault();
  window._flappyJump && window._flappyJump();
}

export function setupControls(startGame, jump, togglePause, canvas) {
  window._flappyJump = jump;

  if (!controlsInitialized) {
    controlsInitialized = true;

    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");

    // Only attach to start and restart buttons here
    // Pause and mute buttons are handled in game.js
    if (startBtn)
      startBtn.addEventListener("click", function () {
        startGame();
      });
    if (restartBtn) restartBtn.addEventListener("click", startGame);

    // Only listen for Space key here
    // P and M keys are handled in game.js
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        jump();
      }
    });
  }

  if (canvas) {
    canvas.removeEventListener("click", handleCanvasClick);
    canvas.removeEventListener("touchstart", handleCanvasTouch);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchstart", handleCanvasTouch);
  }
}

// Function to get selected difficulty and set pipe speed
export function getDifficultySettings() {
  const difficultySelect = document.getElementById("difficulty");
  const selectedDifficulty = difficultySelect
    ? difficultySelect.getAttribute("data-value") || "easy"
    : "easy";

  console.log("Selected difficulty:", selectedDifficulty); // Debug log

  switch (selectedDifficulty) {
    case "medium":
      return PIPE_SPEED_MEDIUM;
    case "hard":
      return PIPE_SPEED_HARD;
    case "easy":
    default:
      return PIPE_SPEED_EASY;
  }
}
