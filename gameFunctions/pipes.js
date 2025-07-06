// Handles drawing of pipes

// Pipe color palettes for 3D effect
const PIPE_COLORS = {
  green: {
    main: "#4ec24e",
    shadow: "#267326",
    highlight: "#a8ffb0",
    rim: "#2e8b2e",
    inner: "#145214",
    shadowRGBA: "rgba(46, 139, 46, 0.18)",
  },
  blue: {
    main: "#3a8dde",
    shadow: "#1a3a5c",
    highlight: "#b3e6ff",
    rim: "#235a8c",
    inner: "#15304a",
    shadowRGBA: "rgba(58, 141, 222, 0.18)",
  },
  gray: {
    main: "#6e6e6e",
    shadow: "#232323",
    highlight: "#d6d6d6",
    rim: "#444444",
    inner: "#181818",
    shadowRGBA: "rgba(70, 70, 70, 0.18)",
  },
  orange: {
    main: "#ff9c2a",
    shadow: "#a85a00",
    highlight: "#ffe0b3",
    rim: "#c97a1c",
    inner: "#7a3d00",
    shadowRGBA: "rgba(255, 156, 42, 0.18)",
  },
};

export function drawPipes(
  ctx,
  pipe,
  currentPipeGap,
  PIPE_WIDTH,
  canvas
) {
  // Pick color set (default to green if not set)
  const colorKey = pipe.color || "green";
  const colors = PIPE_COLORS[colorKey] || PIPE_COLORS.green;

  const pipeTopHeight = pipe.top;
  const pipeBottomY = pipe.top + currentPipeGap;
  const pipeEndMargin = -8; // Margin for pipe ends

  // --- Top Pipe ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(pipe.x, 0, PIPE_WIDTH, pipeTopHeight - 18 - pipeEndMargin);
  ctx.clip();
  ctx.shadowColor = colors.shadowRGBA;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  // Draw main body (cylinder)
  let grad = ctx.createLinearGradient(
    pipe.x,
    0,
    pipe.x + PIPE_WIDTH,
    0
  );
  grad.addColorStop(0, colors.highlight);
  grad.addColorStop(0.18, colors.main);
  grad.addColorStop(0.5, colors.shadow);
  grad.addColorStop(0.82, colors.main);
  grad.addColorStop(1, colors.highlight);
  ctx.fillStyle = grad;
  ctx.fillRect(
    pipe.x,
    0,
    PIPE_WIDTH,
    pipeTopHeight - 18 - pipeEndMargin
  );

  // Subtle vertical shine (only in top pipe)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#fff";
  ctx.fillRect(
    pipe.x + PIPE_WIDTH * 0.18,
    0,
    PIPE_WIDTH * 0.13,
    pipeTopHeight - 18 - pipeEndMargin
  );
  ctx.restore();

  ctx.restore(); // End top pipe

  // Draw rim (ellipse for 3D effect) just outside the clipped region
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeTopHeight - 18 - pipeEndMargin,
    PIPE_WIDTH / 2 + 6,
    10,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = colors.rim;
  ctx.shadowColor = colors.shadowRGBA;
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();

  // Draw inner ellipse (darker for depth)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeTopHeight - 18 - pipeEndMargin,
    PIPE_WIDTH / 2 - 6,
    6,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = colors.inner;
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.restore();

  // Top rim highlight
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeTopHeight - 22 - pipeEndMargin,
    PIPE_WIDTH / 2 - 10,
    2,
    0,
    0,
    Math.PI
  );
  ctx.strokeStyle = colors.highlight;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.stroke();
  ctx.restore();

  // --- Bottom Pipe ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    pipe.x,
    pipeBottomY + 18 + pipeEndMargin,
    PIPE_WIDTH,
    canvas.height - pipeBottomY - 18 - pipeEndMargin
  );
  ctx.clip();
  ctx.shadowColor = colors.shadowRGBA;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  grad = ctx.createLinearGradient(
    pipe.x,
    pipeBottomY + 18 + pipeEndMargin,
    pipe.x + PIPE_WIDTH,
    canvas.height
  );
  grad.addColorStop(0, colors.highlight);
  grad.addColorStop(0.18, colors.main);
  grad.addColorStop(0.5, colors.shadow);
  grad.addColorStop(0.82, colors.main);
  grad.addColorStop(1, colors.highlight);
  ctx.fillStyle = grad;
  ctx.fillRect(
    pipe.x,
    pipeBottomY + 18 + pipeEndMargin,
    PIPE_WIDTH,
    canvas.height - pipeBottomY - 18 - pipeEndMargin
  );

  // Subtle vertical shine (only in bottom pipe)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#fff";
  ctx.fillRect(
    pipe.x + PIPE_WIDTH * 0.18,
    pipeBottomY + 18 + pipeEndMargin,
    PIPE_WIDTH * 0.13,
    canvas.height - pipeBottomY - 18 - pipeEndMargin
  );
  ctx.restore();

  ctx.restore(); // End bottom pipe

  // Draw rim (ellipse for 3D effect) just outside the clipped region
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeBottomY + 18 + pipeEndMargin,
    PIPE_WIDTH / 2 + 6,
    10,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = colors.rim;
  ctx.shadowColor = colors.shadowRGBA;
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();

  // Draw inner ellipse (darker for depth)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeBottomY + 18 + pipeEndMargin,
    PIPE_WIDTH / 2 - 6,
    6,
    0,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = colors.inner;
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.restore();

  // Bottom rim highlight
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    pipe.x + PIPE_WIDTH / 2,
    pipeBottomY + 22 + pipeEndMargin,
    PIPE_WIDTH / 2 - 10,
    2,
    0,
    0,
    Math.PI
  );
  ctx.strokeStyle = colors.highlight;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.stroke();
  ctx.restore();
}
