export function drawParallax(ctx, canvas, parallaxLayers, groundY) {
  // Draw sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#4fd1ff'); 
  skyGradient.addColorStop(1, '#a8ffea');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw distant city layer (layer 3)
  const cityLayer = parallaxLayers[3];
  ctx.fillStyle = cityLayer.color;
  for (let i = -1; i < 2; i++) {
    const x = cityLayer.offset + i * canvas.width;
    drawCitySilhouette(ctx, x, groundY - cityLayer.height * 2, cityLayer.height * 2); // 30% smaller than 2.8x
  }

  // Draw ground layers
  for (let i = 0; i < 3; i++) {
    const layer = parallaxLayers[i];
    ctx.fillStyle = layer.color;
    ctx.fillRect(0, groundY, canvas.width, layer.height);
    ctx.fillStyle = i === 0 ? '#16a085' : '#1a936f';
    for (let j = 0; j < 50; j++) {
      const x = (j * 40 + layer.offset) % (canvas.width + 40) - 20;
      const height = (layer.hedgeHeights && layer.hedgeHeights[j]) ? layer.hedgeHeights[j] : 15;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.quadraticCurveTo(x + 10, groundY - height, x + 20, groundY);
      ctx.fill();
    }
  }
}

export function drawCitySilhouette(ctx, x, y, height) {
  ctx.save();
  ctx.fillStyle = '#34495e';
  const scale = 2; // 30% smaller than 2.8x
  const buildings = [
    { x: 0, width: 30 * scale, height: height * 0.8 },
    { x: 40 * scale, width: 25 * scale, height: height * 0.6 },
    { x: 75 * scale, width: 40 * scale, height: height * 0.9 },
    { x: 125 * scale, width: 35 * scale, height: height * 0.7 },
    { x: 170 * scale, width: 30 * scale, height: height * 0.5 },
    { x: 210 * scale, width: 45 * scale, height: height }
  ];
  for (const building of buildings) {
    ctx.fillRect(x + building.x, y + (height - building.height), building.width, building.height);
    ctx.fillStyle = '#f1c40f';
    const windowWidth = 5 * scale;
    const windowHeight = 8 * scale;
    const spacing = 8 * scale;
    for (let wy = y + height - building.height + 10 * scale; wy < y + height - 5 * scale; wy += windowHeight + 5 * scale) {
      for (let wx = x + building.x + 5 * scale; wx < x + building.x + building.width - windowWidth; wx += windowWidth + spacing) {
        ctx.fillRect(wx, wy, windowWidth, windowHeight);
      }
    }
    ctx.fillStyle = '#34495e';
  }
  ctx.restore();
}

export function updateParallax(parallaxLayers, canvas) {
  for (let i = 0; i < parallaxLayers.length; i++) {
    // Make city layer (index 3) move faster
    if (i === 3) {
      parallaxLayers[i].offset = (parallaxLayers[i].offset - parallaxLayers[i].speed * 3.0) % canvas.width; // 20% faster than 2.5
    } else {
      parallaxLayers[i].offset = (parallaxLayers[i].offset - parallaxLayers[i].speed * 1.8) % canvas.width; // 20% faster than 1.5
    }
  }
}

export function drawCloud(ctx, cloud) {
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.1, cloud.size * 0.7, cloud.size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cloud.x - cloud.size * 0.5, cloud.y + cloud.size * 0.1, cloud.size * 0.6, cloud.size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function updateClouds(CLOUDS, canvas) {
  for (let cloud of CLOUDS) {
    cloud.x -= cloud.speed;
    if (cloud.x < -cloud.size * 2) {
      cloud.x = canvas.width + cloud.size;
      cloud.y = 30 + Math.random() * 150;
    }
  }
}
