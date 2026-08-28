import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card.jsx';
import InfoTip from './InfoTip.jsx';

// `delta` is recent-vs-earlier change for this stat (higher is better for all of them),
// null when there aren't enough games to split. `deltaTip` explains what it compares.
export default function StatReadout({ label, value, unit, Icon, tip, delta = null, deltaTip }) {
  const showDelta = delta !== null && delta !== undefined && Math.abs(delta) >= 0.01;
  const up = delta > 0;
  return (
    <Card>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-1 min-w-0 text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">
          {label}
          {tip && <InfoTip text={tip} />}
        </span>
        <Icon size={14} className="text-accent shrink-0" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        {unit && <span className="font-mono text-xs text-neutral-500">{unit}</span>}
        {showDelta && (
          <span
            title={deltaTip}
            className={`flex items-center gap-0.5 text-[10px] font-mono ${up ? 'text-accent' : 'text-neutral-500'}`}
          >
            {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {up ? '+' : ''}{delta}
          </span>
        )}
      </div>
    </Card>
  );
}
