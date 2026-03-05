export async function generateShareCard(result) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0F0F0F';
  ctx.fillRect(0, 0, 1080, 1920);

  // Accent gradient at top
  const grad = ctx.createLinearGradient(0, 0, 1080, 400);
  grad.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
  grad.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 500);

  // Title
  ctx.fillStyle = '#8B5CF6';
  ctx.font = '700 48px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FITCHECKAI', 540, 180);

  // Score circle
  const scoreColor = getScoreColor(result.overall_score);
  ctx.beginPath();
  ctx.arc(540, 500, 180, 0, Math.PI * 2);
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 12;
  ctx.stroke();

  // Score number
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 140px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(result.overall_score.toFixed(1), 540, 545);

  // Score label
  ctx.fillStyle = scoreColor;
  ctx.font = '700 56px Inter, system-ui, sans-serif';
  ctx.fillText(result.rating_label.toUpperCase(), 540, 630);

  // Fire emojis based on score
  const fires = result.overall_score >= 9 ? '🔥🔥🔥' :
                result.overall_score >= 7 ? '🔥🔥' :
                result.overall_score >= 5 ? '🔥' : '';
  if (fires) {
    ctx.font = '64px sans-serif';
    ctx.fillText(fires, 540, 730);
  }

  // Style vibe pill
  ctx.fillStyle = '#1A1A1A';
  const vibeText = result.style_vibe;
  ctx.font = '600 36px Inter, system-ui, sans-serif';
  const vibeWidth = ctx.measureText(vibeText).width + 60;
  roundRect(ctx, 540 - vibeWidth / 2, 780, vibeWidth, 60, 30);
  ctx.fill();
  ctx.fillStyle = '#8B5CF6';
  ctx.fillText(vibeText, 540, 822);

  // Breakdown bars
  const categories = [
    ['Color', result.breakdown.color_coordination],
    ['Fit', result.breakdown.fit_proportions],
    ['Style', result.breakdown.style_cohesion],
    ['Accessories', result.breakdown.accessory_game],
    ['Confidence', result.breakdown.confidence_factor],
  ];

  let y = 920;
  for (const [label, score] of categories) {
    // Label
    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 28px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, 140, y);

    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText(`${score}/10`, 940, y);

    // Bar background
    ctx.fillStyle = '#2A2A2A';
    roundRect(ctx, 140, y + 10, 800, 16, 8);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = getScoreColor(score);
    roundRect(ctx, 140, y + 10, (score / 10) * 800, 16, 8);
    ctx.fill();

    y += 70;
  }

  // What's fire
  y += 30;
  ctx.fillStyle = '#22C55E';
  ctx.font = '700 32px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText("What's Fire", 140, y);
  y += 40;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '400 26px Inter, system-ui, sans-serif';
  for (const item of result.whats_fire.slice(0, 2)) {
    const wrapped = wrapText(ctx, `✓ ${item}`, 140, y, 800, 34);
    y = wrapped + 10;
  }

  // Bottom branding
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 28px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rate your fit →  fitcheckai.com', 540, 1840);

  // Border
  ctx.strokeStyle = '#2A2A2A';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 1080, 1920);

  return canvas.toDataURL('image/png');
}

function getScoreColor(score) {
  if (score >= 9) return '#F59E0B';
  if (score >= 7) return '#22C55E';
  if (score >= 4) return '#EAB308';
  return '#EF4444';
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
