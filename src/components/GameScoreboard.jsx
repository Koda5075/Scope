export default function GameScoreboard({ match, t }) {
  const modeLabel = { competitive: t.modeCompetitive, unrated: t.modeUnrated, deathmatch: t.modeDeathmatch }[match.mode];

  return (
    <div>
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
              <span className="text-[10px] font-mono text-neutral-600 shrink-0">{p.agent}</span>
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
