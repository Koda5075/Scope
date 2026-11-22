import { useLayoutEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

// Small hover/focus-triggered tooltip for explaining a stat abbreviation or metric
// (KDA, ACS, Win Rate, ...) inline, right where the number is shown — instead of
// leaving raw numbers/percentages with no context anywhere on the page.
const EDGE = 8; // min gap (px) between the bubble and the screen edge

export default function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, below: false });
  const tipRef = useRef(null);

  // A 192px bubble centred on the icon sticks out of a phone screen when the icon is
  // near an edge (half the text cut off). Once it is shown, nudge it back inside the
  // viewport horizontally, and flip it under the icon when there is no room above.
  useLayoutEffect(() => {
    if (!open) {
      setPos((p) => (p.x === 0 && !p.below ? p : { x: 0, below: false }));
      return;
    }
    const el = tipRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let x = 0;
    if (r.left < EDGE) x = EDGE - r.left;
    else if (r.right > window.innerWidth - EDGE) x = window.innerWidth - EDGE - r.right;
    setPos({ x, below: r.top < EDGE });
  }, [open]);

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
          ref={tipRef}
          role="tooltip"
          style={{ transform: `translateX(calc(-50% + ${pos.x}px))` }}
          className={`absolute z-50 left-1/2 ${pos.below ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} w-48 max-w-[calc(100vw_-_16px)] px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 text-[10px] leading-snug text-neutral-300 font-body shadow-lg pointer-events-none`}
        >
          {text}
        </span>
      )}
    </span>
  );
}
