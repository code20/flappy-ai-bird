
let controlsInitialized = false;

function handleCanvasClick() {
  console.log("Canvas clicked");
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
    const pauseBtn = document.getElementById('pauseBtn');
    
    console.log("startBtn found:", !!startBtn);
    console.log("restartBtn found:", !!restartBtn);
    
    if (startBtn) startBtn.addEventListener('click', function() {
      console.log("StartBtn click event fired");
      startGame();
    });
    if (restartBtn) restartBtn.addEventListener('click', startGame);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        jump();
      } else if (e.code === 'KeyP') {
        togglePause();
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