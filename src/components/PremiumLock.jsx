import { Lock, ChevronRight } from 'lucide-react';

export default function PremiumLock({ title, description, ctaLabel, children }) {
  return (
    <div className="relative">
      <div className="opacity-40 select-none">{children}</div>
      <div className="absolute inset-0 locked-overlay flex flex-col items-center justify-center gap-2">
        <Lock size={18} className="text-accent" />
        <span className="font-display text-xs tracking-wide uppercase text-neutral-100">{title}</span>
        <span className="text-[10px] text-neutral-400 font-body text-center max-w-[220px]">{description}</span>
        <button className="mt-1 flex items-center gap-1 text-[11px] font-body text-accent hover:underline">
          {ctaLabel} <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
