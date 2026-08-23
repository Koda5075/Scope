// Draws a shareable session-summary card on an offscreen canvas and returns a PNG blob.
// Hand-rolled with the Canvas API (no html2canvas/similar) to avoid adding a dependency
// for a single mock feature — it mirrors Scope's own visual identity directly.
export async function renderShareCard({ accent, rank, playerName, stats, footerText }) {
  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch { /* ignore */ }
  }

  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(180, 120, 0, 180, 120, 560);
  glow.addColorStop(0, `${accent}30`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = accent;
  ctx.fillRect(24, 24, 5, height - 48);

  ctx.fillStyle = '#ffffff';
  ctx.font = "700 40px 'Rajdhani', sans-serif";
  ctx.fillText('SCOPE', 72, 96);
  ctx.fillStyle = accent;
  ctx.fillRect(72, 110, 58, 4);

  ctx.fillStyle = '#a3a3a3';
  ctx.font = "600 15px 'Inter', sans-serif";
  ctx.fillText(playerName, 72, 160);

  ctx.fillStyle = accent;
  ctx.font = "700 58px 'Rajdhani', sans-serif";
  ctx.fillText(rank, 72, 225);

  const colWidth = (width - 144) / stats.length;
  stats.forEach((s, i) => {
    const x = 72 + i * colWidth;
    ctx.fillStyle = '#737373';
    ctx.font = "600 13px 'Inter', sans-serif";
    ctx.fillText(s.label.toUpperCase(), x, 330);
    ctx.fillStyle = '#ffffff';
    ctx.font = "700 44px 'JetBrains Mono', monospace";
    ctx.fillText(String(s.value), x, 385);
  });

  ctx.fillStyle = '#525252';
  ctx.font = "13px 'Inter', sans-serif";
  ctx.fillText(footerText, 72, height - 60);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyBlobToClipboard(blob) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}
