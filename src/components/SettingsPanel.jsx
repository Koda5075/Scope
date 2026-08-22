import { useState } from 'react';
import { Check } from 'lucide-react';
import { THEMES } from '../data/themes.js';

const MOCK_PUBLIC_SLUG = 'kaito-euw1';

export default function SettingsPanel({ t, lang, setLang, theme, setTheme, publicVisible, setPublicVisible }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${MOCK_PUBLIC_SLUG}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  return (
    <div className="settings-panel absolute right-0 top-11 w-64 p-4 z-10">
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.language}</div>
        <div className="flex flex-wrap gap-2">
          {['en', 'fr', 'de', 'es', 'it', 'pt'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-xs font-display uppercase border transition-colors ${
                lang === l ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.appearance}</div>
        <div className="flex gap-2.5">
          {Object.entries(THEMES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className="swatch"
              style={{ background: val.accent, borderColor: theme === key ? '#fff' : 'transparent' }}
              aria-label={val.label}
              title={val.label}
            >
              {theme === key && <Check size={12} color={key === 'mono' ? '#000' : '#000'} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.publicProfileSection}</div>
        <label className="flex items-center gap-2 text-xs font-body text-neutral-300 cursor-pointer mb-2">
          <input type="checkbox" checked={publicVisible} onChange={(e) => setPublicVisible(e.target.checked)} className="accent-[var(--accent)]" />
          {t.publicVisibilityLabel}
        </label>
        <button onClick={handleCopyLink} className="text-[11px] font-body text-accent hover:underline">
          {copied ? t.linkCopied : t.copyLink}
        </button>
      </div>
    </div>
  );
}
