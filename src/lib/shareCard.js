export async function generateShareCard(result, goal) {
  // Wait for fonts to load
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  const score = result.overall_score;
  const isFireScore = score >= 9;
  const scoreColor = getScoreColor(score);

  // Background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 1080, 1920);

  // Noise grain overlay (procedural)
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = 200;
  noiseCanvas.height = 200;
  const nctx = noiseCanvas.getContext('2d');
  const noiseData = nctx.createImageData(200, 200);
  for (let i = 0; i < noiseData.data.length; i += 4) {
    const v = Math.random() * 255;
    noiseData.data[i] = v;
    noiseData.data[i + 1] = v;
    noiseData.data[i + 2] = v;
    noiseData.data[i + 3] = 10; // very subtle
  }
  nctx.putImageData(noiseData, 0, 0);
  const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');
  ctx.fillStyle = noisePattern;
  ctx.fillRect(0, 0, 1080, 1920);

  // Subtle lime gradient at bottom-right
  const limeGrad = ctx.createRadialGradient(900, 1600, 0, 900, 1600, 600);
  limeGrad.addColorStop(0, 'rgba(191, 255, 0, 0.06)');
  limeGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = limeGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Brand name
  ctx.fillStyle = '#F5F5F5';
  ctx.font = '700 44px "Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FITCHECK', 490, 150);
  // "AI" in lime
  const fitW = ctx.measureText('FITCHECK').width;
  ctx.fillStyle = '#BFFF00';
  ctx.fillText('AI', 490 + fitW / 2 + 24, 150);

  // Goal text (between brand and score ring)
  let goalOffset = 0;
  if (goal) {
    goalOffset = 50;
    ctx.fillStyle = '#737373';
    ctx.font = '500 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    const goalText = `Going for: "${goal.length > 50 ? goal.slice(0, 47) + '...' : goal}"`;
    ctx.fillText(goalText, 540, 210);
  }

  // Score ring
  const cx = 540, cy = 460 + goalOffset, r = 170;
  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#1F1F1F';
  ctx.lineWidth = 10;
  ctx.stroke();
  // Progress arc
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (score / 10) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Glow for high scores
  if (isFireScore) {
    ctx.shadowColor = scoreColor;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = scoreColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.shadowBlur = 0;
  }

  // Score number
  ctx.fillStyle = '#F5F5F5';
  ctx.font = '800 130px "Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score.toFixed(1), cx, cy - 10);
  ctx.textBaseline = 'alphabetic';

  // Rating label
  ctx.fillStyle = scoreColor;
  ctx.font = '700 48px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(result.rating_label, cx, cy + r + 80);

  // Style vibe pill
  const vibeText = result.style_vibe;
  ctx.font = '600 32px "Plus Jakarta Sans", system-ui, sans-serif';
  const vibeWidth = ctx.measureText(vibeText).width + 56;
  const vibeX = cx - vibeWidth / 2;
  const vibeY = cy + r + 115;
  ctx.fillStyle = 'rgba(191, 255, 0, 0.12)';
  roundRect(ctx, vibeX, vibeY, vibeWidth, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#BFFF00';
  ctx.textBaseline = 'middle';
  ctx.fillText(vibeText, cx, vibeY + 26);
  ctx.textBaseline = 'alphabetic';

  // Divider
  const divY = vibeY + 90;
  ctx.fillStyle = '#1F1F1F';
  ctx.fillRect(140, divY, 800, 1);

  // Breakdown bars
  const categories = [
    ['Color', result.breakdown.color_coordination],
    ['Fit', result.breakdown.fit_proportions],
    ['Style', result.breakdown.style_cohesion],
    ['Accessories', result.breakdown.accessory_game],
    ['Confidence', result.breakdown.confidence_factor],
  ];

  let y = divY + 50;
  ctx.textAlign = 'left';
  for (const [label, s] of categories) {
    ctx.fillStyle = '#737373';
    ctx.font = '500 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(label, 140, y);

    ctx.fillStyle = '#F5F5F5';
    ctx.textAlign = 'right';
    ctx.fillText(`${s}/10`, 940, y);
    ctx.textAlign = 'left';

    // Bar bg
    ctx.fillStyle = '#1F1F1F';
    roundRect(ctx, 140, y + 12, 800, 14, 7);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = getScoreColor(s);
    const barW = Math.max(14, (s / 10) * 800);
    roundRect(ctx, 140, y + 12, barW, 14, 7);
    ctx.fill();

    y += 64;
  }

  // Divider
  y += 10;
  ctx.fillStyle = '#1F1F1F';
  ctx.fillRect(140, y, 800, 1);
  y += 40;

  // What's Fire
  ctx.fillStyle = '#BFFF00';
  ctx.font = '700 28px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("What's Fire", 140, y);
  y += 38;
  ctx.fillStyle = '#F5F5F5';
  ctx.font = '400 24px "Plus Jakarta Sans", system-ui, sans-serif';
  for (const item of result.whats_fire.slice(0, 2)) {
    const wrapped = wrapText(ctx, `\u2713  ${item}`, 140, y, 800, 32);
    y = wrapped + 8;
  }

  // Bottom branding
  ctx.fillStyle = '#737373';
  ctx.font = '500 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rate your fit  \u2192  fitcheckai.com', 540, 1845);

  // Thin border
  ctx.strokeStyle = '#1F1F1F';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 1080, 1920);

  return canvas.toDataURL('image/png');
}

function getScoreColor(score) {
  if (score >= 9) return '#FF6B2B';
  if (score >= 7) return '#BFFF00';
  if (score >= 4) return '#FFD60A';
  return '#FF3B3B';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight;
}
