import Card from '../Card.jsx';
import CompareRow from '../CompareRow.jsx';
import { THEMES } from '../../data/themes.js';
import { comparisons, friends } from '../../data/mockData.js';

export default function CompareTab({ t, theme }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1 block">{t.compareTitle}</span>
        <div className="flex gap-3 mb-4 text-[10px] font-body text-neutral-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent inline-block" /> {t.you}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-neutral-500 inline-block" /> {t.rankAvg}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block" style={{ background: THEMES[theme].dim }} /> {t.past30}</span>
        </div>
        <div className="flex flex-col gap-6">
          {comparisons.map((c, i) => (
            <div
              key={c.metric}
              className={`sc-reveal ${i > 0 ? 'pt-6 border-t border-neutral-900' : ''}`}
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <div className="text-xs font-display uppercase tracking-wide text-neutral-300 mb-3">{c.metric}</div>
              <div className="flex flex-col gap-2.5">
                <CompareRow label={t.you} value={c.you} max={c.max} tone="you" />
                <CompareRow label={t.rankAvg} value={c.rankAvg} max={c.max} tone="avg" />
                <CompareRow label={t.past30} value={c.past} max={c.max} tone="past" />
              </div>
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
