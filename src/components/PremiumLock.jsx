import { Lock, ChevronRight, Sparkles } from 'lucide-react';

// The blurred content and the lock overlay are stacked via CSS grid (both placed in
// the same 1/1 cell) rather than absolute positioning, so the container's height grows
// to fit whichever layer is taller. With `absolute inset-0`, the overlay's height never
// influenced the container — a longer translation (French, German...) could overflow
// past the blurred content's height and spill into the card below it.
//
// `h-full` here (and on the blurred layer) makes the lock fill its grid cell so the
// wrapped Card stretches to the row height set by its taller row-mate in the Scope+
// two-column grid — otherwise a short card leaves dead space below it in the row.
export default function PremiumLock({ title, description, ctaLabel, preview, className = '', onCtaClick, isPremium = false, children }) {
  if (isPremium) return <div className={`h-full ${className}`}>{children}</div>;

  return (
    <div className={`grid h-full ${className}`}>
      <div className="col-start-1 row-start-1 h-full opacity-30 select-none blur-[1.5px]">{children}</div>
      <div className="col-start-1 row-start-1 locked-overlay flex flex-col items-center justify-center gap-2 px-4 py-3">
        <Lock size={18} className="text-accent" />
        <span className="font-display text-xs tracking-wide uppercase text-neutral-100">{title}</span>
        <span className="text-[10px] text-neutral-400 font-body text-center max-w-[240px]">{description}</span>
        {preview && (
          <div className="mt-1 max-w-[260px] w-full px-3 py-2 border border-accent bg-black/70 flex items-start gap-2">
            <Sparkles size={12} className="text-accent shrink-0 mt-0.5" />
            <span className="text-[11px] text-neutral-100 font-body italic leading-relaxed">{preview}</span>
          </div>
        )}
        <button onClick={onCtaClick} className="mt-1 flex items-center gap-1 text-[11px] font-body text-accent hover:underline">
          {ctaLabel} <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
