import { getAgentIcon, getMapImage } from '../data/valorantAssets.js';

export default function GameScoreboard({ match, t }) {
  const modeLabel = { competitive: t.modeCompetitive, unrated: t.modeUnrated, deathmatch: t.modeDeathmatch }[match.mode];
  const mapImage = getMapImage(match.map);

  return (
    <div>
      {mapImage && (
        <div className="relative -mx-5 -mt-5 mb-4 h-24 overflow-hidden">
          <img src={mapImage.splash} alt="" className="val-asset w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
        </div>
      )}
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1">
        {match.map} · {modeLabel}
      </div>
      <div className={`text-xs font-mono mb-4 ${match.result === 'win' ? 'text-accent' : 'text-neutral-500'}`}>{match.score}</div>

      <div className="flex flex-col gap-1.5">
        {match.players.map((p, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-2 border ${p.isYou ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-[10px] text-neutral-600 w-4 shrink-0">{p.team}</span>
              <span className={`font-body text-xs truncate ${p.isYou ? 'text-accent' : 'text-neutral-300'}`}>{p.name}</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-600 shrink-0">
                {getAgentIcon(p.agent) && <img src={getAgentIcon(p.agent)} alt="" className="val-asset w-4 h-4 rounded-full object-cover" />}
                {p.agent}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs text-neutral-400">
                {p.kills}/{p.deaths}/{p.assists}
              </span>
              <span className="font-mono text-xs text-white w-10 text-right">{p.acs}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
