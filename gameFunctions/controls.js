
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
    
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    // Only attach to start and restart buttons here
    // Pause and mute buttons are handled in game.js
    if (startBtn) startBtn.addEventListener('click', function() {
      startGame();
    });
    if (restartBtn) restartBtn.addEventListener('click', startGame);
    
    // Only listen for Space key here
    // P and M keys are handled in game.js
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        jump();
      }
    });
  }

  if (canvas) {
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.removeEventListener('touchstart', handleCanvasTouch);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', handleCanvasTouch);
  }
}