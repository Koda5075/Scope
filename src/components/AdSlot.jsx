import { Megaphone } from 'lucide-react';

// Mock ad placement — no real ad network wired in yet, just a clearly-labeled
// placeholder that disappears once `isPremium` is true, same gating pattern as
// PromoBanner (see the comment there — this is the exact case it was preparing for).
export default function AdSlot({ t, isPremium = false, variant = 'banner' }) {
  if (isPremium) return null;

  const isRectangle = variant === 'rectangle';

  return (
    <div
      className={`relative border border-dashed border-neutral-700 bg-neutral-950/60 flex items-center justify-center gap-3 px-4 text-center ${
        isRectangle ? 'h-48 flex-col gap-2' : 'h-16'
      }`}
    >
      <span className="absolute top-2 left-2 text-[9px] font-display font-bold uppercase tracking-wide text-neutral-600 border border-neutral-700 px-1 py-0.5">
        {t.adLabel}
      </span>
      <Megaphone size={isRectangle ? 22 : 16} className="text-neutral-700 shrink-0" />
      <span className="text-xs font-body text-neutral-600">{t.adPlaceholderText}</span>
      <span className={`text-[10px] font-body text-neutral-700 ${isRectangle ? '' : 'hidden sm:inline'}`}>{t.adRemoveHint}</span>
    </div>
  );
}
