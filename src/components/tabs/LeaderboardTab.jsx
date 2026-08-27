import { useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import Card from '../Card.jsx';
import Modal from '../Modal.jsx';
import PlayerProfileCard from '../PlayerProfileCard.jsx';
import PlayerCompareView from '../PlayerCompareView.jsx';
import { LEADERBOARD_REGIONS, getLeaderboard } from '../../data/leaderboardData.js';
import { otherPlayers } from '../../data/mockData.js';
import { getRankIcon } from '../../data/valorantAssets.js';

// Regional leaderboard — public data by nature (Riot's own leaderboard is unauthenticated
// and shows real Riot IDs), so this stays free rather than behind Scope+, unlike the
// personalized coaching features. Rows that match a connected+public Scope profile
// (otherPlayers) get a "compare with me" entry point, reusing the exact same
// profile/compare flow as the search bar's "compare with anyone" — non-Scope players
// just display, no comparison forced.
export default function LeaderboardTab({ t, favoriteIds, onToggleFavorite, filteredGames }) {
  const [region, setRegion] = useState('eu');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('profile');

  const rows = useMemo(() => getLeaderboard(region), [region]);

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
        </div>
        <p className="text-xs font-body text-neutral-500 mb-4">{t.leaderboardSubtitle}</p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
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

        <div className="flex flex-col gap-1">
          {rows.map((p) => {
            const matched = otherPlayers.find(
              (o) => o.connected && o.isPublic && o.name.toLowerCase() === p.gameName.toLowerCase() && o.tag.toLowerCase() === p.tagLine.toLowerCase()
            );
            const rankIcon = getRankIcon(p.competitiveTier);
            return (
              <div
                key={p.puuid}
                className={`flex items-center justify-between gap-3 px-3 py-2 border ${
                  matched ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-neutral-500 w-6 shrink-0">{p.leaderboardRank}</span>
                  <span className={`font-body text-sm truncate ${matched ? 'text-accent' : 'text-neutral-300'}`}>
                    {p.gameName}<span className="text-neutral-600">#{p.tagLine}</span>
                  </span>
                  {matched && (
                    <span className="text-[9px] tracking-wide uppercase text-accent border border-accent px-1.5 py-0.5 shrink-0">{t.leaderboardOnScope}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500">
                    {rankIcon && <img src={rankIcon} alt="" className="val-icon w-5 h-5 rounded-full object-cover" />}
                    {p.competitiveTier}
                  </span>
                  <span className="font-mono text-xs text-white w-12 text-right">{p.rankedRating} RR</span>
                  {matched && (
                    <button
                      onClick={() => openScopeProfile(matched)}
                      className="text-[11px] font-body text-accent hover:underline whitespace-nowrap"
                    >
                      {t.compareWithMe}
                    </button>
                  )}
                </div>
              </div>
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
