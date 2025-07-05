export function drawDarkParallax(ctx, canvas, parallaxLayers, groundY) {
  // Draw sky gradient - more modern color scheme
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#1a2a6c'); // Deep blue
  skyGradient.addColorStop(0.5, '#2c3e50'); // Dark blue-gray
  skyGradient.addColorStop(1, '#4a235a'); // Deep purple
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.4;
    const size = Math.random() * 1.5;
    ctx.fillRect(x, y, size, size);
  }

  // Draw modern city layer with glass buildings
  const cityLayer = parallaxLayers[3];
  ctx.fillStyle = cityLayer.color;
  for (let i = -1; i < 2; i++) {
    const x = cityLayer.offset + i * canvas.width;
    drawModernCity(ctx, x, groundY - cityLayer.height * 2, cityLayer.height * 2);
  }

  // Draw ground layers - more modern look
  for (let i = 0; i < 3; i++) {
    const layer = parallaxLayers[i];
    ctx.fillStyle = layer.color;
    ctx.fillRect(0, groundY, canvas.width, layer.height);
    
    // Draw modern street elements instead of hedges
    ctx.fillStyle = '#2c3e50';
    for (let j = 0; j < 20; j++) {
      const x = (j * 80 + layer.offset) % (canvas.width + 80) - 40;
      ctx.fillRect(x, groundY, 2, -10); // Street lights
      ctx.beginPath();
      ctx.arc(x + 1, groundY - 15, 5, 0, Math.PI * 2); // Light bulbs
      ctx.fillStyle = '#f1c40f';
      ctx.fill();
      ctx.fillStyle = '#2c3e50';
    }
  }
}

export function drawModernCity(ctx, x, y, height) {
  ctx.save();
  const scale = 2;
  
  // Draw building silhouettes
  const buildings = [
    { x: 0, width: 40 * scale, height: height * 0.9 },
    { x: 50 * scale, width: 30 * scale, height: height * 0.7 },
    { x: 90 * scale, width: 50 * scale, height: height * 0.95 },
    { x: 150 * scale, width: 35 * scale, height: height * 0.8 },
    { x: 195 * scale, width: 60 * scale, height: height * 0.85 },
    { x: 265 * scale, width: 25 * scale, height: height * 0.65 },
    { x: 300 * scale, width: 45 * scale, height: height }
  ];
  
  // Draw building bodies with glass effect
  for (const building of buildings) {
    const buildingX = x + building.x;
    const buildingY = y + (height - building.height);
    
    // Building base
    const gradient = ctx.createLinearGradient(
      buildingX, buildingY, 
      buildingX, buildingY + building.height
    );
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#34495e');
    ctx.fillStyle = gradient;
    ctx.fillRect(buildingX, buildingY, building.width, building.height);
    
    // Glass windows with modern pattern
    ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
    const windowWidth = 8 * scale;
    const windowHeight = 15 * scale;
    const horizontalSpacing = 10 * scale;
    const verticalSpacing = 12 * scale;
    
    for (let wy = buildingY + 10 * scale; wy < buildingY + building.height - 5 * scale; wy += windowHeight + verticalSpacing) {
      // Alternating window patterns for modern look
      const offset = (wy / (windowHeight + verticalSpacing)) % 2 === 0 ? 0 : horizontalSpacing / 2;
      
      for (let wx = buildingX + 5 * scale + offset; wx < buildingX + building.width - windowWidth; wx += windowWidth + horizontalSpacing) {
        // Add some variation
        if (Math.random() > 0.2) {
          ctx.fillRect(wx, wy, windowWidth, windowHeight);
          
          // Add reflection highlights
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(wx + 1, wy + 1, windowWidth / 2, windowHeight / 3);
          ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
        }
      }
    }
    
    // Rooftop details
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(buildingX, buildingY, building.width, 5 * scale);
    
    // Antenna
    if (building.width > 30 * scale) {
      ctx.beginPath();
      ctx.moveTo(buildingX + building.width/2, buildingY);
      ctx.lineTo(buildingX + building.width/2, buildingY - 20 * scale);
      ctx.strokeStyle = '#bdc3c7';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  // Draw floating holograms
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#9b59b6';
  ctx.beginPath();
  ctx.arc(x + 100 * scale, y + height * 0.3, 25 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(x + 100 * scale, y + height * 0.3, 35 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  
  ctx.restore();
}

export function drawLightParallax(ctx, canvas, parallaxLayers, groundY) {
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
