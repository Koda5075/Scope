import { useState } from 'react';
import { Info } from 'lucide-react';

// Small hover/focus-triggered tooltip for explaining a stat abbreviation or metric
// (KDA, ACS, Win Rate, ...) inline, right where the number is shown — instead of
// leaving raw numbers/percentages with no context anywhere on the page.
export default function InfoTip({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex normal-case tracking-normal"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={text}
        className="text-neutral-400 hover:text-accent focus:text-accent transition-colors"
      >
        <Info size={13} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] leading-snug text-neutral-300 font-body shadow-lg pointer-events-none"
        >
          {text}
        </span>
      )}
    </span>
  );
}
