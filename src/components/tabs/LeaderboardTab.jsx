import { useEffect, useMemo, useState } from 'react';
import { Trophy, Search } from 'lucide-react';
import Card from '../Card.jsx';
import { LEADERBOARD_REGIONS, getLeaderboard } from '../../data/leaderboardData.js';
import { otherPlayers } from '../../data/mockData.js';
import { getRankIcon, optimizeImg } from '../../data/valorantAssets.js';
import { fetchValLeaderboard } from '../../lib/riotLive.js';
import { navigate, playerPath } from '../../lib/route.js';

const MEDAL = ['#F2C94C', '#C0C4C9', '#CD7F32']; // gold / silver / bronze for ranks 1-3

function isScopePlayer(p) {
  return otherPlayers.find(
    (o) =>
      o.connected &&
      o.isPublic &&
      o.name.toLowerCase() === p.gameName.toLowerCase() &&
      o.tag.toLowerCase() === p.tagLine.toLowerCase()
  );
}

// Regional leaderboard — public data by nature (Riot's own leaderboard is unauthenticated
// and shows real Riot IDs), so this stays free rather than behind Scope+, unlike the
// personalized coaching features. Rows that match a connected+public Scope profile
// (otherPlayers) get a "compare with me" entry point, reusing the exact same
// profile/compare flow as the search bar's "compare with anyone" — non-Scope players
// just display, no comparison forced.
// `highlightRiotId` ({ name, tag }) is set when this tab is embedded in a player's own
// profile page — the matching row (if any) is ringed so "where does this player stand"
// is visible at a glance.
export default function LeaderboardTab({ t, highlightRiotId = null, publicOnly = false }) {
  const [region, setRegion] = useState('eu');
  const [scopeOnly, setScopeOnly] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  // Mock rows render instantly; the val-leaderboard proxy swaps in real rows if a Riot
  // key is configured server-side, otherwise the mock stays. `live` tracks which is shown.
  const [allRows, setAllRows] = useState(() => getLeaderboard(region));
  const [live, setLive] = useState(false);

  useEffect(() => {
    setAllRows(getLeaderboard(region));
    setLive(false);
    let alive = true;
    fetchValLeaderboard(region).then((data) => {
      if (alive && Array.isArray(data?.players) && data.players.length) {
        setAllRows(data.players);
        setLive(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [region]);

  const scopeRows = useMemo(() => allRows.filter((p) => isScopePlayer(p)), [allRows]);
  const rows = scopeOnly ? scopeRows : allRows;
  const query = nameFilter.trim().toLowerCase();
  const matchesQuery = (p) => !query || `${p.gameName}#${p.tagLine}`.toLowerCase().includes(query);
  // A name search flattens the podium into the regular list — searching for a specific
  // player shouldn't depend on whether they happen to be in the top 3 or not.
  const podium = scopeOnly || query ? [] : rows.slice(0, 3);
  const rest = (scopeOnly || query ? rows : rows.slice(3)).filter(matchesQuery);

  // Every leaderboard row links to that player's profile page — the page synthesises a
  // dataset for any Riot ID, so this isn't limited to known Scope members any more
  // (the `matched` flag below now only drives the "ON SCOPE" styling, not clickability).
  function goToProfile(p) {
    navigate(playerPath({ name: p.gameName, tag: p.tagLine }));
  }

  const hl = highlightRiotId
    ? `${highlightRiotId.name.toLowerCase()}#${highlightRiotId.tag.toLowerCase()}`
    : null;
  const isHighlighted = (p) => hl && `${p.gameName.toLowerCase()}#${p.tagLine.toLowerCase()}` === hl;

  // The leaderboard and the profile page each generate their own independent rank/RR for
  // a given Riot ID (see leaderboardData.js), so a player embedding this tab on their own
  // profile can otherwise see two contradictory numbers on the same page. When we know the
  // real rank/RR for the highlighted row (passed down from the profile), show that instead
  // of the leaderboard's own generated value for that one row.
  function displayStats(p) {
    if (isHighlighted(p) && highlightRiotId?.rank != null) {
      return { rankedRating: highlightRiotId.rr, competitiveTier: highlightRiotId.rank };
    }
    return { rankedRating: p.rankedRating, competitiveTier: p.competitiveTier };
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.leaderboardTitle}</span>
          {live && (
            <span className="flex items-center gap-1 text-[9px] font-display uppercase tracking-wide text-accent border border-accent px-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t.leaderboardLive}
            </span>
          )}
        </div>
        <p className="text-xs font-body text-neutral-500 mb-4">{t.leaderboardSubtitle}</p>

        {/* "Where do I stand" is the viewer's own standing — only meaningful on the
            owner's dashboard, not when this tab is embedded in someone else's profile
            page. Diamond doesn't place on a real regional top-30 (Immortal/Radiant-only
            at that scale, see TIER_BANDS in leaderboardData.js), so it can't highlight an
            actual row without faking one; it reuses the exact 15% the "Top 15%" badge
            already tracks so the two can't drift apart. */}
        {!highlightRiotId && !publicOnly && (
          <div className="flex items-center gap-2.5 mb-4 px-3 py-2.5 border border-accent bg-accent/5">
            <Trophy size={14} className="text-accent shrink-0" />
            <span className="text-xs font-body text-neutral-200">{t.leaderboardYourStanding.replace('{pct}', 15)}</span>
          </div>
        )}

        <div className="relative mb-3 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder={t.leaderboardSearchPlaceholder}
            aria-label={t.leaderboardSearchPlaceholder}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none pl-8 pr-3 py-1.5 text-xs font-body text-neutral-200 placeholder:text-neutral-600 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body mr-1">{t.leaderboardRegionLabel}</span>
          {LEADERBOARD_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 text-xs font-body border transition-colors ${
                region === r ? 'border-accent text-accent bg-neutral-900' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.leaderboardRegions[r]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[
            [false, t.leaderboardShowAll],
            [true, t.leaderboardShowScope],
          ].map(([val, label]) => (
            <button
              key={String(val)}
              onClick={() => setScopeOnly(val)}
              className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                scopeOnly === val
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {scopeOnly && rows.length === 0 && (
          <div className="text-xs font-body text-neutral-500 py-2">{t.leaderboardNoScopeUsers}</div>
        )}

        {/* Top 3 podium — bigger rank art, medal-tinted position badge, #1 highlighted */}
        {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {podium.map((p, i) => {
            const matched = !publicOnly && isScopePlayer(p);
            const { rankedRating, competitiveTier } = displayStats(p);
            const rankIcon = getRankIcon(competitiveTier);
            const medal = MEDAL[i];
            return (
              <button
                key={p.puuid}
                type="button"
                onClick={() => goToProfile(p)}
                className={`relative flex flex-col items-center text-center gap-1 px-2 pt-4 pb-3 border w-full transition-colors hover:bg-neutral-800/60 ${
                  i === 0 ? 'border-accent' : ''
                }`}
                style={{
                  borderColor: i === 0 ? undefined : medal,
                  background: `linear-gradient(180deg, ${medal}${i === 0 ? '26' : '38'}, transparent 70%)`,
                }}
              >
                <span
                  className="absolute top-1.5 left-1.5 font-display text-[10px] font-bold px-1.5 py-0.5"
                  style={{ color: '#0A0A0A', background: medal }}
                >
                  {p.leaderboardRank}
                </span>
                {rankIcon && <img src={optimizeImg(rankIcon, 44)} alt="" loading="lazy" className="val-icon w-11 h-11 rounded-full object-cover" />}
                <span className={`font-body text-xs truncate w-full ${matched ? 'text-accent' : 'text-neutral-200'}`}>
                  {p.gameName}<span className="text-neutral-600">#{p.tagLine}</span>
                </span>
                <span className="font-mono text-xs text-white">{rankedRating} RR</span>
                <span className="text-[9px] font-body text-neutral-500">{competitiveTier}</span>
                <span className={`text-[10px] font-body ${matched ? 'text-accent' : 'text-neutral-600'}`}>{t.leaderboardViewProfile}</span>
              </button>
            );
          })}
        </div>
        )}

        <div className="flex flex-col gap-1">
          {rest.map((p) => {
            const matched = !publicOnly && isScopePlayer(p);
            const { rankedRating, competitiveTier } = displayStats(p);
            const rankIcon = getRankIcon(competitiveTier);
            return (
              <button
                key={p.puuid}
                type="button"
                onClick={() => goToProfile(p)}
                className={`group flex items-center justify-between gap-3 px-3 py-2 border transition-colors w-full text-left ${
                  isHighlighted(p)
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : matched
                    ? 'border-accent bg-neutral-900 hover:bg-neutral-800/70'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-neutral-500 w-6 shrink-0 text-right">{p.leaderboardRank}</span>
                  {rankIcon && <img src={optimizeImg(rankIcon, 32)} alt="" loading="lazy" className="val-icon w-7 h-7 rounded-full object-cover shrink-0" />}
                  <span className={`font-body text-sm truncate ${matched ? 'text-accent' : 'text-neutral-300'}`}>
                    {p.gameName}<span className="text-neutral-600">#{p.tagLine}</span>
                  </span>
                  {matched && (
                    <span className="text-[9px] tracking-wide uppercase text-accent border border-accent px-1.5 py-0.5 shrink-0">{t.leaderboardOnScope}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:block text-[11px] font-body text-neutral-500">{competitiveTier}</span>
                  <span className="font-mono text-xs text-white w-12 text-right">{rankedRating} RR</span>
                  <span className={`text-[11px] font-body whitespace-nowrap transition-colors ${
                    matched ? 'text-accent' : 'text-neutral-600 group-hover:text-accent'
                  }`}>{t.leaderboardViewProfile}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
