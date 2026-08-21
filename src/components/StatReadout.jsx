import Card from './Card.jsx';

export default function StatReadout({ label, value, unit, Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{label}</span>
        <Icon size={14} className="text-accent" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        {unit && <span className="font-mono text-xs text-neutral-500">{unit}</span>}
      </div>
    </Card>
  );
}
