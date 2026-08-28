import { useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import Card from '../Card.jsx';
import Modal from '../Modal.jsx';
import PlayerProfileCard from '../PlayerProfileCard.jsx';
import PlayerCompareView from '../PlayerCompareView.jsx';
import { LEADERBOARD_REGIONS, getLeaderboard } from '../../data/leaderboardData.js';
import { otherPlayers } from '../../data/mockData.js';
import { getRankIcon } from '../../data/valorantAssets.js';
import { fetchValLeaderboard } from '../../lib/riotLive.js';

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
export default function LeaderboardTab({ t, favoriteIds, onToggleFavorite, filteredGames, publicOnly = false }) {
  const [region, setRegion] = useState('eu');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('profile');
  const [scopeOnly, setScopeOnly] = useState(false);
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
  // The Scope-only view is a short flat list — no podium, since it can hold 0–2 rows.
  const podium = scopeOnly ? [] : rows.slice(0, 3);
  const rest = scopeOnly ? rows : rows.slice(3);

  function openScopeProfile(matched) {
    setSelected(matched);
    setView('profile');
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
            const rankIcon = getRankIcon(p.competitiveTier);
            const medal = MEDAL[i];
            const Cell = matched ? 'button' : 'div';
            return (
              <Cell
                key={p.puuid}
                {...(matched ? { type: 'button', onClick: () => openScopeProfile(matched) } : {})}
                className={`relative flex flex-col items-center text-center gap-1 px-2 pt-4 pb-3 border w-full transition-colors ${
                  i === 0 ? 'border-accent' : matched ? 'border-accent hover:bg-neutral-800/60' : 'border-neutral-800'
                }`}
                style={{ background: `linear-gradient(180deg, ${medal}1f, transparent 70%)` }}
              >
                <span
                  className="absolute top-1.5 left-1.5 font-display text-[10px] font-bold px-1.5 py-0.5"
                  style={{ color: '#0A0A0A', background: medal }}
                >
                  {p.leaderboardRank}
                </span>
                {rankIcon && <img src={rankIcon} alt="" className="val-icon w-11 h-11 rounded-full object-cover" />}
                <span className={`font-body text-xs truncate w-full ${matched ? 'text-accent' : 'text-neutral-200'}`}>
                  {p.gameName}<span className="text-neutral-600">#{p.tagLine}</span>
                </span>
                <span className="font-mono text-xs text-white">{p.rankedRating} RR</span>
                <span className="text-[9px] font-body text-neutral-500">{p.competitiveTier}</span>
                {matched && (
                  <span className="text-[10px] font-body text-accent">{t.leaderboardViewProfile}</span>
                )}
              </Cell>
            );
          })}
        </div>
        )}

        <div className="flex flex-col gap-1">
          {rest.map((p) => {
            const matched = !publicOnly && isScopePlayer(p);
            const rankIcon = getRankIcon(p.competitiveTier);
            const Row = matched ? 'button' : 'div';
            return (
              <Row
                key={p.puuid}
                {...(matched ? { type: 'button', onClick: () => openScopeProfile(matched) } : {})}
                className={`flex items-center justify-between gap-3 px-3 py-2 border transition-colors w-full text-left ${
                  matched
                    ? 'border-accent bg-neutral-900 hover:bg-neutral-800/70'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-neutral-500 w-6 shrink-0 text-right">{p.leaderboardRank}</span>
                  {rankIcon && <img src={rankIcon} alt="" className="val-icon w-7 h-7 rounded-full object-cover shrink-0" />}
                  <span className={`font-body text-sm truncate ${matched ? 'text-accent' : 'text-neutral-300'}`}>
                    {p.gameName}<span className="text-neutral-600">#{p.tagLine}</span>
                  </span>
                  {matched && (
                    <span className="text-[9px] tracking-wide uppercase text-accent border border-accent px-1.5 py-0.5 shrink-0">{t.leaderboardOnScope}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:block text-[11px] font-body text-neutral-500">{p.competitiveTier}</span>
                  <span className="font-mono text-xs text-white w-12 text-right">{p.rankedRating} RR</span>
                  {matched && (
                    <span className="text-[11px] font-body text-accent whitespace-nowrap">{t.leaderboardViewProfile}</span>
                  )}
                </div>
              </Row>
            );
          })}
        </div>
      </Card>

      {selected && (
        <Modal onClose={() => setSelected(null)} closeLabel={t.close}>
          {view === 'profile' ? (
            <PlayerProfileCard
              player={selected}
              isFavorite={favoriteIds.includes(selected.puuid)}
              onToggleFavorite={onToggleFavorite}
              onCompare={() => setView('compare')}
              t={t}
            />
          ) : (
            <PlayerCompareView player={selected} onBack={() => setView('profile')} t={t} filteredGames={filteredGames} />
          )}
        </Modal>
      )}
    </div>
  );
}
