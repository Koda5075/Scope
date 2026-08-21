export default function CompareRow({ label, value, max, tone }) {
  const pct = Math.min(100, (value / max) * 100);
  const barClass = tone === 'you' ? 'sc-fill' : tone === 'past' ? 'sc-fill-dim' : 'sc-fill-muted';
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-body text-neutral-400 w-32 shrink-0">{label}</span>
      <div className="flex-1 sc-track h-2 overflow-hidden">
        <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-neutral-300 w-12 text-right">{value}</span>
    </div>
  );
}
