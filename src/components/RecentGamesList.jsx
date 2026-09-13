import { useEffect, useState } from 'react';
import KDAStat from './KDAStat.jsx';
import { getAgentIcon, getMapImage, optimizeImg } from '../data/valorantAssets.js';

const MODE_LABEL_KEY = { competitive: 'modeCompetitive', unrated: 'modeUnrated', deathmatch: 'modeDeathmatch' };
const PAGE = 8;

// The recent-games list, shared by the owner's Overview tab and the public profile page
// so the two can't drift. `games` rows follow the recentGames shape (id/kda/map/mode/
// agent/acs/score/result); `onSelectGame(id)` opens the per-match scoreboard when the
// caller wires one.
export default function RecentGamesList({ games, t, onSelectGame }) {
  const [visible, setVisible] = useState(PAGE);
  // Collapse back to the first page whenever the underlying list changes (filter change
  // on the dashboard, different player on a profile).
  useEffect(() => setVisible(PAGE), [games]);

  return (
    <>
      <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recentGamesTitle}</span>
      <div className="flex flex-col gap-1.5">
        {games.length === 0 ? (
          <div className="text-xs font-body text-neutral-500 py-2">{t.noGamesForFilter}</div>
        ) : (
          games.slice(0, visible).map((g) => {
            const [k, d, a] = g.kda.split('/').map(Number);
            const mapImage = getMapImage(g.map);
            return (
              <button
                key={g.id}
                onClick={() => onSelectGame?.(g.id)}
                className="flex items-center justify-between gap-3 px-3 py-2 border border-neutral-800 hover:border-accent bg-neutral-950 transition-colors text-left flex-wrap sm:flex-nowrap"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Fixed win/loss colours rather than bg-accent for the win dot — a
                      status colour needs to stay green/red regardless of which accent
                      theme is active, otherwise a red or pink theme would make the win
                      and loss dots look confusingly similar. */}
                  <span className={`w-2 h-2 shrink-0 rounded-full ${g.result === 'win' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {mapImage && <img src={optimizeImg(mapImage.splash, 48)} alt="" loading="lazy" className="val-icon w-12 h-7 rounded object-cover shrink-0" />}
                  <span className="font-display text-sm font-semibold text-white truncate min-w-[64px]">{g.map}</span>
                  <span
                    className={`font-body text-[10px] uppercase tracking-wide px-1.5 py-0.5 shrink-0 border ${
                      g.mode === 'competitive' ? 'text-accent border-accent' : 'text-neutral-500 border-neutral-700'
                    }`}
                  >
                    {t[MODE_LABEL_KEY[g.mode]] ?? g.mode}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 shrink-0">
                    {getAgentIcon(g.agent) && <img src={optimizeImg(getAgentIcon(g.agent), 32)} alt={g.agent} loading="lazy" className="val-icon w-8 h-8 rounded-full object-cover" />}
                    <span className="hidden sm:inline">{g.agent}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                  <KDAStat kills={k} deaths={d} assists={a} showDiff />
                  <span className="flex flex-col items-end w-11 shrink-0">
                    <span className="font-mono text-xs text-white">{g.acs}</span>
                    <span className="text-[8px] text-neutral-600 uppercase tracking-wide">{t.statACS}</span>
                  </span>
                  <span className="font-mono text-xs text-white">{g.score}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
      {games.length > visible && (
        <button
          type="button"
          onClick={() => setVisible((n) => n + PAGE)}
          className="mt-2.5 w-full py-2 text-[11px] font-display uppercase tracking-wide text-neutral-400 border border-neutral-800 hover:border-accent hover:text-accent transition-colors"
        >
          {t.seeMore} ({games.length - visible})
        </button>
      )}
    </>
  );
}
