export const THEMES = {
  yellow: { accent: '#FFC300', dim: '#7A6100', label: 'Jaune' },
  cyan: { accent: '#35D0F0', dim: '#155A66', label: 'Cyan' },
  coral: { accent: '#FF5C72', dim: '#7A2C36', label: 'Corail' },
  mono: { accent: '#E5E5E5', dim: '#525252', label: 'Mono' },
};

export const THEME_MODES = ['dark', 'light'];

export function isValidHex(hex) {
  return typeof hex === 'string' && /^#[0-9a-fA-F]{6}$/.test(hex.trim());
}

// Companion "dim" colour for a given accent — used by progress-bar fills, scrollbars,
// etc. Each channel scaled toward black; hue preserved. Mirrors the hand-picked `dim`
// values on the presets above for an arbitrary Scope+ custom colour.
export function deriveDim(hex) {
  if (!isValidHex(hex)) return '#525252';
  const n = parseInt(hex.trim().slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * 0.42));
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// The accent actually applied. The true brand colour is used as-is (buttons keep their
// bright fill with black text on top); `.text-accent` gets a separately darkened
// `--accent-text` in light mode via CSS color-mix, so accent-coloured *text* stays
// readable on a light surface without dulling the fills. The one exception is the near
// -white `mono` preset, which would be an invisible fill on a light page — nudged to a
// mid grey there.
export function resolveAccent({ theme, customAccent, isPremium, mode }) {
  if (isPremium && isValidHex(customAccent)) return customAccent;
  if (mode === 'light' && theme === 'mono') return '#6B6B6B';
  return THEMES[theme]?.accent ?? THEMES.yellow.accent;
}
