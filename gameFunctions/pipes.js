// Pipes module for Flappy Retro
// Handles drawing of pipes and broken statues

export function drawPipe(ctx, pipe, currentPipeGap, PIPE_WIDTH, canvas, groundY) {
  if (pipe.isStatue) {
    drawBrokenStatue(ctx, pipe, currentPipeGap, PIPE_WIDTH, canvas);
    return;
  }

  const pipeTopHeight = pipe.top;
  const pipeBottomY = pipe.top + currentPipeGap;

  // Even creamier pillar colors
  const pillarMain = '#fff7e6'; 
  const pillarShadow = '#f5e6c8'; 
  const pillarHighlight = '#fffbe6'; 
  const pillarCap = '#f9efd2'; 
  const pillarBand = '#e8d7b8'; 

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.13)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Top pillar cap
  ctx.fillStyle = pillarCap;
  ctx.fillRect(pipe.x - 7, pipeTopHeight - 18, PIPE_WIDTH + 14, 18);
  ctx.strokeStyle = pillarBand;
  ctx.lineWidth = 2;
  ctx.strokeRect(pipe.x - 7, pipeTopHeight - 18, PIPE_WIDTH + 14, 18);

  // Top pillar body (vertical gradient)
  let grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
  grad.addColorStop(0, pillarHighlight);
  grad.addColorStop(0.5, pillarMain);
  grad.addColorStop(1, pillarShadow);
  ctx.fillStyle = grad;
  ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipeTopHeight - 18);

  // Top pillar bands
  for (let i = 1; i < 4; i++) {
    const y = pipeTopHeight - 18 - i * 22;
    if (y > 10) {
      ctx.strokeStyle = pillarBand;
      ctx.beginPath();
      ctx.moveTo(pipe.x, y);
      ctx.lineTo(pipe.x + PIPE_WIDTH, y);
      ctx.stroke();
    }
  }

  // Fluting (vertical lines)
  ctx.strokeStyle = pillarBand;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(pipe.x + (PIPE_WIDTH/5)*i, 0);
    ctx.lineTo(pipe.x + (PIPE_WIDTH/5)*i, pipeTopHeight - 18);
    ctx.stroke();
  }

  // Bottom pillar cap
  ctx.fillStyle = pillarCap;
  ctx.fillRect(pipe.x - 7, pipeBottomY, PIPE_WIDTH + 14, 18);
  ctx.strokeStyle = pillarBand;
  ctx.strokeRect(pipe.x - 7, pipeBottomY, PIPE_WIDTH + 14, 18);

  // Bottom pillar body
  grad = ctx.createLinearGradient(pipe.x, pipeBottomY + 18, pipe.x + PIPE_WIDTH, canvas.height);
  grad.addColorStop(0, pillarHighlight);
  grad.addColorStop(0.5, pillarMain);
  grad.addColorStop(1, pillarShadow);
  ctx.fillStyle = grad;
  ctx.fillRect(pipe.x, pipeBottomY + 18, PIPE_WIDTH, canvas.height - pipeBottomY - 18);

  // Bottom pillar bands
  for (let i = 1; i < 4; i++) {
    const y = pipeBottomY + 18 + i * 22;
    if (y < canvas.height - 20) {
      ctx.strokeStyle = pillarBand;
      ctx.beginPath();
      ctx.moveTo(pipe.x, y);
      ctx.lineTo(pipe.x + PIPE_WIDTH, y);
      ctx.stroke();
    }
  }

  // Fluting (vertical lines)
  ctx.strokeStyle = pillarBand;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(pipe.x + (PIPE_WIDTH/5)*i, pipeBottomY + 18);
    ctx.lineTo(pipe.x + (PIPE_WIDTH/5)*i, canvas.height);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawBrokenStatue(ctx, pipe, currentPipeGap, PIPE_WIDTH, canvas) {
  const statueHeight = 120;
  const baseY = pipe.top + currentPipeGap;

  ctx.save();

  // Draw base
  ctx.fillStyle = '#d7ccc8';
  ctx.fillRect(pipe.x, baseY, PIPE_WIDTH, canvas.height - baseY);

  // Draw broken statue pieces
  ctx.fillStyle = '#bcaaa4';

  // Base platform
  ctx.fillRect(pipe.x - 10, baseY - 10, PIPE_WIDTH + 20, 10);

  // Broken pillar base
  ctx.fillRect(pipe.x + 20, baseY - 60, 40, 50);

  // Fallen pillar top
  ctx.save();
  ctx.translate(pipe.x + 40, baseY - 30);
  ctx.rotate(-0.3);
  ctx.fillRect(0, 0, 60, 20);
  ctx.restore();

  // Statue fragments
  ctx.fillStyle = '#8d6e63';

  // Head
  ctx.beginPath();
  ctx.arc(pipe.x + 40, baseY - 100, 15, 0, Math.PI * 2);
  ctx.fill();

  // Arm
  ctx.fillRect(pipe.x + 10, baseY - 85, 30, 10);

  // Torso
  ctx.fillRect(pipe.x + 25, baseY - 70, 30, 40);

  ctx.restore();
}
