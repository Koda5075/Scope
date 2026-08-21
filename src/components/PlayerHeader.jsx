export default function PlayerHeader({ t, rrCurrent, rrGoal }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-7">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-bold text-lg text-accent">
          K
        </div>
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-white">KAITO<span className="text-neutral-600">#EUW1</span></div>
          <div className="text-xs text-neutral-500 font-body">{t.lastSession}</div>
        </div>
      </div>

      <div className="border border-neutral-800 bg-neutral-950 px-5 py-3 min-w-[220px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-body">{t.rank}</span>
          <span className="font-display text-xs font-bold text-accent">DIAMOND 2</span>
        </div>
        <div className="sc-track h-2 w-full overflow-hidden">
          <div className="sc-fill h-full" style={{ width: `${rrCurrent}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[11px] text-neutral-300">{rrCurrent} RR</span>
          <span className="font-mono text-[11px] text-neutral-600">/ {rrGoal}</span>
        </div>
      </div>
    </div>
  );
}
