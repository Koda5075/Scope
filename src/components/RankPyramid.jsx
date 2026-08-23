import { getRankLadder } from '../data/valorantAssets.js';

// Illustrative player-distribution estimate per rank (not sub-tier) — there's no real
// player-distribution API to pull from, so this is a plausible, roughly pyramid-shaped
// mock spread (heaviest around Gold/Platinum, thinning sharply toward Radiant). Always
// shown next to an explicit "approximate" label so it doesn't read as a real stat.
const DISTRIBUTION_PCT = {
  Iron: 4,
  Bronze: 9,
  Silver: 16,
  Gold: 20,
  Platinum: 18,
  Diamond: 14,
  Ascendant: 10,
  Immortal: 8,
};

const RANK_LADDER = [...getRankLadder()].reverse(); // Radiant first, Iron last — peak at the top.

export default function RankPyramid({ t }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 font-body leading-relaxed mb-2">{t.rankPyramidDesc}</p>
      <p className="text-[11px] text-neutral-600 font-body leading-relaxed mb-5">{t.rankPyramidDistributionNote}</p>

      <div className="flex flex-col gap-2">
        {RANK_LADDER.map((group) => {
          const pct = DISTRIBUTION_PCT[group.name];
          return (
            <div
              key={group.name}
              className="flex items-center gap-3 px-3 py-2.5"
              style={{ background: `${group.color}14`, borderLeft: `3px solid ${group.color}` }}
            >
              <div className="flex items-center gap-2 shrink-0">
                {group.tiers.map((tier) => (
                  <div key={tier.label} className="flex flex-col items-center gap-0.5">
                    <img src={tier.icon} alt={tier.label} className="val-icon w-9 h-9 rounded-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: group.color }}>
                  {group.name}
                </span>
                <span className="font-mono text-xs text-neutral-400 shrink-0">
                  {pct !== undefined ? `~${pct}%` : '<1%'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-neutral-500 font-body leading-relaxed mt-5">{t.rankPyramidRRNote}</p>
    </div>
  );
}
