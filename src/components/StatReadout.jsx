import Card from './Card.jsx';
import InfoTip from './InfoTip.jsx';

export default function StatReadout({ label, value, unit, Icon, tip }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-1 min-w-0 text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">
          {label}
          {tip && <InfoTip text={tip} />}
        </span>
        <Icon size={14} className="text-accent shrink-0" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        {unit && <span className="font-mono text-xs text-neutral-500">{unit}</span>}
      </div>
    </Card>
  );
}
