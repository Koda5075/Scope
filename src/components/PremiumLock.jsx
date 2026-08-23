import { Lock, ChevronRight, Sparkles } from 'lucide-react';

export default function PremiumLock({ title, description, ctaLabel, preview, className = '', children }) {
  return (
    <div className={`relative ${className}`}>
      <div className="opacity-30 select-none blur-[1.5px]">{children}</div>
      <div className="absolute inset-0 locked-overlay flex flex-col items-center justify-center gap-2 px-4 py-3">
        <Lock size={18} className="text-accent" />
        <span className="font-display text-xs tracking-wide uppercase text-neutral-100">{title}</span>
        <span className="text-[10px] text-neutral-400 font-body text-center max-w-[240px]">{description}</span>
        {preview && (
          <div className="mt-1 max-w-[260px] w-full px-3 py-2 border border-accent bg-black/70 flex items-start gap-2">
            <Sparkles size={12} className="text-accent shrink-0 mt-0.5" />
            <span className="text-[11px] text-neutral-100 font-body italic leading-relaxed">{preview}</span>
          </div>
        )}
        <button className="mt-1 flex items-center gap-1 text-[11px] font-body text-accent hover:underline">
          {ctaLabel} <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
