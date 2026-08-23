import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../Card.jsx';
import { comparisons, friends } from '../../data/mockData.js';

function DeltaRow({ value, baseline, label }) {
  const diff = value - baseline;
  const pct = baseline ? Math.round((diff / baseline) * 100) : 0;
  const flat = diff === 0;
  const positive = diff > 0;
  const Icon = flat ? Minus : positive ? TrendingUp : TrendingDown;
  const toneClass = positive ? 'border-accent text-accent' : 'border-neutral-700 text-neutral-400';

  return (
    <div className="flex items-center gap-2.5">
      <span className={`flex items-center gap-1 px-2 py-0.5 border text-[11px] font-mono shrink-0 ${toneClass}`}>
        <Icon size={11} />
        {positive && !flat ? '+' : ''}{pct}%
      </span>
      <span className="text-[11px] text-neutral-500 font-body truncate">{label} ({baseline})</span>
    </div>
  );
}

export default function CompareTab({ t }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.compareTitle}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {comparisons.map((c, i) => (
            <div
              key={c.metric}
              className="sc-reveal border border-neutral-800 bg-neutral-950 px-4 py-3.5 flex flex-col gap-2.5"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-display uppercase tracking-wide text-neutral-400">{c.metric}</span>
                <span className="font-mono text-3xl font-bold text-white leading-none">{c.you}</span>
              </div>
              <DeltaRow value={c.you} baseline={c.rankAvg} label={t.rankAvg} />
              <DeltaRow value={c.you} baseline={c.past} label={t.past30} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.friendsBoard}</span>
        <div className="flex flex-col gap-2">
          {[...friends].sort((a, b) => b.acs - a.acs).map((f, i) => (
            <div key={f.name} className={`flex items-center justify-between px-3 py-2 border ${f.isYou ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-500 w-4">{i + 1}</span>
                <span className={`font-body text-sm ${f.isYou ? 'text-accent' : 'text-neutral-300'}`}>{f.name}</span>
              </div>
              <span className="font-mono text-sm text-white">{f.acs}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
