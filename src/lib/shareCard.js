export async function generateShareCard(result) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  const score = result.overall_score;
  const isGold = score >= 9;
  const scoreColor = getScoreColor(score);

  // Background
  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, 1080, 1920);

  // Subtle purple gradient at top
  const topGrad = ctx.createLinearGradient(0, 0, 1080, 600);
  topGrad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
  topGrad.addColorStop(1, 'rgba(139, 92, 246, 0.02)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1080, 600);

  // Brand name
  ctx.fillStyle = '#8B5CF6';
  ctx.font = '700 44px "Space Grotesk", "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FITCHECK AI', 540, 170);

  // Score ring
  const cx = 540, cy = 500, r = 170;
  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#27272A';
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

  // Gold glow for 9+
  if (isGold) {
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
  ctx.fillStyle = '#FAFAFA';
  ctx.font = '800 130px "Space Grotesk", "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score.toFixed(1), cx, cy - 10);
  ctx.textBaseline = 'alphabetic';

  // Fire emojis + rating label
  const fires = score >= 9 ? '🔥🔥🔥' :
                score >= 7 ? '🔥🔥' :
                score >= 5 ? '🔥' : '';
  if (fires) {
    ctx.font = '56px sans-serif';
    ctx.fillText(fires, cx, cy + r + 70);
  }

  ctx.fillStyle = scoreColor;
  ctx.font = '700 48px "Inter", system-ui, sans-serif';
  ctx.fillText(result.rating_label, cx, cy + r + 130);

  // Style vibe pill
  const vibeText = result.style_vibe;
  ctx.font = '600 32px "Inter", system-ui, sans-serif';
  const vibeWidth = ctx.measureText(vibeText).width + 56;
  const vibeX = cx - vibeWidth / 2;
  const vibeY = cy + r + 165;
  ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
  roundRect(ctx, vibeX, vibeY, vibeWidth, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#8B5CF6';
  ctx.textBaseline = 'middle';
  ctx.fillText(vibeText, cx, vibeY + 26);
  ctx.textBaseline = 'alphabetic';

  // Divider
  const divY = vibeY + 90;
  ctx.fillStyle = '#27272A';
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
    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 26px "Inter", system-ui, sans-serif';
    ctx.fillText(label, 140, y);

    ctx.fillStyle = '#FAFAFA';
    ctx.textAlign = 'right';
    ctx.fillText(`${s}/10`, 940, y);
    ctx.textAlign = 'left';

    // Bar bg
    ctx.fillStyle = '#27272A';
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
  ctx.fillStyle = '#27272A';
  ctx.fillRect(140, y, 800, 1);
  y += 40;

  // What's Fire (top 2)
  ctx.fillStyle = '#22C55E';
  ctx.font = '700 28px "Inter", system-ui, sans-serif';
  ctx.fillText("What's Fire", 140, y);
  y += 38;
  ctx.fillStyle = '#FAFAFA';
  ctx.font = '400 24px "Inter", system-ui, sans-serif';
  for (const item of result.whats_fire.slice(0, 2)) {
    const wrapped = wrapText(ctx, `✓  ${item}`, 140, y, 800, 32);
    y = wrapped + 8;
  }

  // Bottom branding
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 26px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Rate your fit  →  fitcheckai.com', 540, 1845);

  // Thin border
  ctx.strokeStyle = '#27272A';
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
