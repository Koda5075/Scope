export default function CompareRow({ label, value, max, tone }) {
  const pct = Math.min(100, (value / max) * 100);
  const isYou = tone === 'you';
  const barClass = isYou ? 'sc-fill' : tone === 'past' ? 'sc-fill-dim' : 'sc-fill-muted';
  const barHeight = isYou ? 'h-2.5' : 'h-1.5';
  return (
    <div className="flex items-center gap-3">
      <span className={`text-[11px] font-body w-32 shrink-0 ${isYou ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}`}>{label}</span>
      <div className={`flex-1 sc-track ${barHeight} overflow-hidden`}>
        <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-mono text-xs w-12 text-right ${isYou ? 'text-white font-semibold' : 'text-neutral-400'}`}>{value}</span>
    </div>
  );
}
