import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import Card from '../Card.jsx';
import AdSlot from '../AdSlot.jsx';
import { comparisons, friends, otherPlayers, myStats } from '../../data/mockData.js';
import { parseRiotId } from '../../lib/riotId.js';

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

const COMPARE_METRICS = [
  { key: 'kda', labelKey: 'statKDA' },
  { key: 'acs', labelKey: 'statACS' },
  { key: 'accuracy', labelKey: 'statAccuracy' },
  { key: 'headshots', labelKey: 'statHeadshots' },
];

export default function CompareTab({ t, isPremium }) {
  const [query, setQuery] = useState('');
  const [player, setPlayer] = useState(() => otherPlayers.find((p) => p.puuid === 'p2') ?? null);
  const [error, setError] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    const parsed = parseRiotId(query);
    if (!parsed) {
      setError('invalid');
      return;
    }
    const match = otherPlayers.find(
      (p) => p.name.toLowerCase() === parsed.name.toLowerCase() && p.tag.toLowerCase() === parsed.tag.toLowerCase()
    );
    if (match && match.connected && match.isPublic) {
      setPlayer(match);
      setError(null);
      setQuery('');
    } else if (match && match.connected) {
      setError('private');
    } else {
      setError('not_found');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1 block">{t.compareAnyoneTitle}</span>
        <p className="text-[11px] text-neutral-500 font-body mb-3">{t.compareAnyoneDesc}</p>
        <form onSubmit={handleSearch} className="relative mb-3">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-accent transition-colors" aria-label={t.searchPlaceholder}>
            <Search size={14} />
          </button>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(null); }}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none pl-9 pr-3 py-2.5 text-sm font-body text-neutral-200 placeholder:text-neutral-600 transition-colors"
          />
        </form>

        {error === 'invalid' && <div className="text-xs font-body text-neutral-500 mb-3">{t.searchInvalidFormat}</div>}
        {error === 'private' && <div className="text-xs font-body text-neutral-500 mb-3">{t.searchPrivateDesc}</div>}
        {error === 'not_found' && <div className="text-xs font-body text-neutral-500 mb-3">{t.searchNotOnScopeDesc}</div>}

        {player && (
          <div>
            <div className="text-xs font-display uppercase text-neutral-400 mb-3">{t.you} vs {player.name}#{player.tag}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMPARE_METRICS.map((m) => (
                <div key={m.key} className="border border-neutral-800 bg-neutral-950 px-3 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-body">{t[m.labelKey]}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm text-accent">{myStats[m.key]}</span>
                    <span className="text-neutral-700 text-[10px] font-body">{t.compareVs}</span>
                    <span className="font-mono text-sm text-neutral-400">{player[m.key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

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

      <AdSlot t={t} isPremium={isPremium} variant="banner" />
    </div>
  );
}
