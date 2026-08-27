import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

// A single "house promo" slot for the free tier. Later, a real third-party ad slot can
// live behind the same `isPremium` gate — e.g. render <AdSlot /> instead of
// <PromoBanner /> when !isPremium, and render neither when isPremium — without touching
// this component. Keeping the gate as a prop (rather than hardcoding "always show")
// is what makes that swap trivial once real subscription state exists.
export default function PromoBanner({ t, onSeePlans, isPremium = false }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('scope-promo-dismissed') === 'true';
    } catch {
      return false;
    }
  });

  if (isPremium || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem('scope-promo-dismissed', 'true');
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="sc-card flex items-center justify-between gap-3 mb-4"
      style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent), var(--sc-surface) 70%)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Sparkles size={15} className="text-accent shrink-0" />
        <span className="text-xs font-body text-neutral-200 truncate">{t.promoBannerText}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button onClick={onSeePlans} className="text-[11px] font-display font-bold uppercase tracking-wide text-accent hover:underline">
          {t.seePlans}
        </button>
        <button onClick={dismiss} aria-label={t.close} className="text-neutral-600 hover:text-neutral-300 transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
