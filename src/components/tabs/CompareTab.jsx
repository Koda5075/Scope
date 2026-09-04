import { useMemo, useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Copy, Check } from 'lucide-react';
import Card from '../Card.jsx';
import AdSlot from '../AdSlot.jsx';
import {
  comparisons, friends, otherPlayers, myStats,
  computeAverageAcs, computeAggregateKDA, computeAverageAccuracy, computeAverageHeadshots,
} from '../../data/mockData.js';
import { parseRiotId } from '../../lib/riotId.js';

const MEDAL = ['#F2C94C', '#C0C4C9', '#CD7F32'];

// Rounds to a sensible number of decimals for a delta (KDA needs 2, everything else 0).
function fmtDelta(d) {
  const rounded = Math.abs(d) < 10 ? Math.round(d * 100) / 100 : Math.round(d);
  return (d > 0 ? '+' : '') + rounded;
}

// One metric, you vs a single reference value, shown as two competing bars so "ahead /
// behind" is obvious at a glance instead of a bare "1.48 vs 1.32".
function VersusRow({ label, you, them, themLabel, youLabel = 'You', bare = false }) {
  const max = Math.max(you, them, 1);
  const ahead = you >= them;
  const body = (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-neutral-400 font-body">{label}</span>
        <span className={`flex items-center gap-1 text-[11px] font-mono ${ahead ? 'text-accent' : 'text-red-500'}`}>
          {ahead ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {fmtDelta(you - them)}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-body text-neutral-500 w-24 shrink-0 leading-tight">{youLabel}</span>
        <div className="flex-1 sc-track h-2.5 overflow-hidden">
          <div className="sc-fill h-full" style={{ width: `${(you / max) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-white w-12 text-right shrink-0">{you}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-body text-neutral-500 w-24 shrink-0 leading-tight">{themLabel}</span>
        <div className="flex-1 sc-track h-2 overflow-hidden">
          <div className="sc-fill-muted h-full" style={{ width: `${(them / max) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-neutral-400 w-12 text-right shrink-0">{them}</span>
      </div>
    </>
  );
  return bare ? body : <div className="border border-neutral-800 bg-neutral-950 px-3 py-3">{body}</div>;
}

const COMPARE_METRICS = [
  { key: 'kda', labelKey: 'statKDA' },
  { key: 'acs', labelKey: 'statACS' },
  { key: 'accuracy', labelKey: 'statAccuracy' },
  { key: 'headshots', labelKey: 'statHeadshots' },
];

const BOARD_METRICS = [
  { key: 'acs', labelKey: 'statACS', fmt: (v) => v },
  { key: 'kda', labelKey: 'statKDA', fmt: (v) => v.toFixed(2) },
  { key: 'hs', labelKey: 'statHeadshots', fmt: (v) => `${v}%` },
  { key: 'rr', labelKey: null, label: 'RR', fmt: (v) => v },
];

const HISTORY_KEY = 'scope-compare-history';
const HISTORY_MAX = 6;

function loadCompareHistory() {
  try {
    const v = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(v) ? v.slice(0, HISTORY_MAX) : [];
  } catch {
    return [];
  }
}

export default function CompareTab({ t, isPremium, filteredGames }) {
  const [query, setQuery] = useState('');
  const [player, setPlayer] = useState(() => otherPlayers.find((p) => p.puuid === 'p2') ?? null);
  const [error, setError] = useState(null);
  const [boardMetric, setBoardMetric] = useState('acs');
  const [linkCopied, setLinkCopied] = useState(false);
  const [history, setHistory] = useState(loadCompareHistory);

  function pushHistory(riotId) {
    setHistory((prev) => {
      const next = [riotId, ...prev.filter((r) => r.toLowerCase() !== riotId.toLowerCase())].slice(0, HISTORY_MAX);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  }

  function selectFromHistory(riotId) {
    const parsed = parseRiotId(riotId);
    const match = parsed && otherPlayers.find(
      (p) => p.name.toLowerCase() === parsed.name.toLowerCase() && p.tag.toLowerCase() === parsed.tag.toLowerCase()
    );
    if (match) {
      setPlayer(match);
      setError(null);
    }
  }

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  const filteredAcs = useMemo(() => computeAverageAcs(filteredGames), [filteredGames]);
  const filteredKda = useMemo(() => computeAggregateKDA(filteredGames), [filteredGames]);
  const filteredAccuracy = useMemo(() => computeAverageAccuracy(filteredGames), [filteredGames]);
  const filteredHeadshots = useMemo(() => computeAverageHeadshots(filteredGames), [filteredGames]);
  const you = {
    acs: filteredAcs ?? myStats.acs,
    kda: filteredKda ?? myStats.kda,
    accuracy: filteredAccuracy ?? myStats.accuracy,
    headshots: filteredHeadshots ?? myStats.headshots,
  };
  const compared = comparisons.map((c) => {
    if (c.metric === 'ACS') return filteredAcs !== null ? { ...c, you: filteredAcs } : c;
    if (c.metric === 'KDA') return filteredKda !== null ? { ...c, you: filteredKda } : c;
    if (c.metric === 'HS%') return filteredHeadshots !== null ? { ...c, you: filteredHeadshots } : c;
    return c;
  });
  // The "you" row tracks the active filter for the stats that have a filtered
  // equivalent (acs/kda/hs); rr has none, so it stays static.
  const friendsWithYou = friends.map((f) =>
    f.isYou ? { ...f, acs: you.acs, kda: you.kda, hs: you.headshots } : f
  );
  const activeMetric = BOARD_METRICS.find((m) => m.key === boardMetric) ?? BOARD_METRICS[0];
  const friendsRanked = [...friendsWithYou].sort((a, b) => b[boardMetric] - a[boardMetric]);

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
      pushHistory(`${match.name}#${match.tag}`);
    } else if (match && match.connected) {
      setError('private');
    } else {
      setError('not_found');
    }
  }

  return (
    <div className="flex flex-col gap-5">
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

        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.compareHistoryTitle}</span>
            {history.map((r) => (
              <button
                key={r}
                onClick={() => selectFromHistory(r)}
                className="border border-neutral-800 hover:border-accent px-2.5 py-1 text-xs font-body text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {r}
              </button>
            ))}
            <button onClick={clearHistory} className="text-[10px] font-body text-neutral-600 hover:text-accent transition-colors">
              {t.compareHistoryClear}
            </button>
          </div>
        )}

        {error === 'invalid' && <div className="text-xs font-body text-neutral-500 mb-3">{t.searchInvalidFormat}</div>}
        {error === 'private' && <div className="text-xs font-body text-neutral-500 mb-3">{t.searchPrivateDesc}</div>}
        {error === 'not_found' && (
          <div className="mb-3">
            <div className="text-xs font-body text-neutral-500 mb-2">{t.searchNotOnScopeDesc}</div>
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity"
            >
              {linkCopied ? <Check size={12} /> : <Copy size={12} />}
              {linkCopied ? t.linkCopied : t.inviteButton}
            </button>
          </div>
        )}

        {player && (
          <div>
            <div className="text-xs font-display uppercase text-neutral-400 mb-3">
              <span className="text-accent">{t.you}</span> {t.compareVs} {player.name}#{player.tag}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {COMPARE_METRICS.map((m) => (
                <VersusRow
                  key={m.key}
                  label={t[m.labelKey]}
                  you={you[m.key]}
                  them={player[m.key]}
                  youLabel={t.you}
                  themLabel={player.name}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.compareTitle}</span>
          <div className="flex flex-col gap-4">
            {compared.map((c, i) => (
              <div
                key={c.metric}
                className="sc-reveal border border-neutral-800 bg-neutral-950 px-4 py-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-display uppercase tracking-wide text-neutral-400">{c.metric}</span>
                  <span className="font-mono text-2xl font-bold text-white leading-none">{c.you}</span>
                </div>
                <VersusRow bare label={t.rankAvg} you={c.you} them={c.rankAvg} youLabel={t.you} themLabel={t.rankAvg} />
                <div className="h-3" />
                <VersusRow bare label={t.past30} you={c.you} them={c.past} youLabel={t.you} themLabel={t.past30} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.friendsBoard}</span>
            <div className="flex gap-1">
              {BOARD_METRICS.map((m) => {
                const label = m.labelKey ? t[m.labelKey] : m.label;
                return (
                  <button
                    key={m.key}
                    onClick={() => setBoardMetric(m.key)}
                    className={`px-2 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                      boardMetric === m.key
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {friendsRanked.map((f, i) => {
              const top = MEDAL[i];
              const metricLabel = activeMetric.labelKey ? t[activeMetric.labelKey] : activeMetric.label;
              return (
                <div
                  key={f.name}
                  className={`flex items-center justify-between px-3 py-2.5 border ${f.isYou ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-display text-[11px] font-bold w-5 h-5 flex items-center justify-center shrink-0"
                      style={top ? { color: '#0A0A0A', background: top } : { color: '#737373' }}
                    >
                      {i + 1}
                    </span>
                    <span className={`font-body text-sm ${f.isYou ? 'text-accent' : 'text-neutral-300'}`}>{f.name}</span>
                  </div>
                  <span className="font-mono text-sm text-white">
                    {activeMetric.fmt(f[boardMetric])} <span className="text-[9px] text-neutral-600">{metricLabel}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <AdSlot t={t} isPremium={isPremium} variant="banner" />
    </div>
  );
}
