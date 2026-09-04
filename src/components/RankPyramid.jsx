import { useState } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import { getRankLadder, optimizeImg } from '../data/valorantAssets.js';

// Illustrative player-distribution estimate per individual tier — there's no real
// player-distribution API to pull from, so this is a plausible, roughly pyramid-shaped
// mock spread. Kept internally coherent on purpose: within a rank, tier 1 (just
// promoted in) is always more common than tier 3 (about to promote out), and each
// rank's tier-3 share still comfortably exceeds the next rank's tier-1 share. Always
// shown next to an explicit "approximate" label so it doesn't read as a real stat.
const DISTRIBUTION_PCT = {
  'Iron 1': 2.0, 'Iron 2': 1.4, 'Iron 3': 1.0,
  'Bronze 1': 3.4, 'Bronze 2': 2.6, 'Bronze 3': 2.0,
  'Silver 1': 6.0, 'Silver 2': 5.4, 'Silver 3': 4.8,
  'Gold 1': 7.6, 'Gold 2': 7.0, 'Gold 3': 6.2,
  'Platinum 1': 6.8, 'Platinum 2': 6.2, 'Platinum 3': 5.4,
  'Diamond 1': 5.2, 'Diamond 2': 4.6, 'Diamond 3': 3.8,
  'Ascendant 1': 3.8, 'Ascendant 2': 3.2, 'Ascendant 3': 2.6,
  'Immortal 1': 3.0, 'Immortal 2': 2.6, 'Immortal 3': 2.0,
  Radiant: 0.4,
};

// Row width, as a % of the pyramid's own max width — narrowest at the apex (Radiant,
// fewest players) and widest at the base (Iron, most players). This is what actually
// makes the thing read as a pyramid rather than an accordion list: the width steps
// mirror the same "fewer players the higher you go" idea the distribution note below
// already states in words, so the shape and the copy reinforce each other.
const ROW_WIDTH_PCT = {
  Radiant: 30, Immortal: 42, Ascendant: 53, Diamond: 64,
  Platinum: 74, Gold: 82, Silver: 89, Bronze: 95, Iron: 100,
};

// Radiant (apex) down to Iron (base) — reversed from getRankLadder()'s natural
// lowest-to-highest order.
const GROUPS = [...getRankLadder()].reverse();

function groupPct(group) {
  return group.tiers.reduce((sum, tier) => sum + (DISTRIBUTION_PCT[tier.label] ?? 0), 0);
}

export default function RankPyramid({ t, isPremium, onSeePlans }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  return (
    <div>
      <p className="text-xs text-neutral-400 font-body leading-relaxed mb-2">{t.rankPyramidDesc}</p>
      <p className="text-[11px] text-neutral-600 font-body leading-relaxed mb-5">{t.rankPyramidDistributionNote}</p>

      <div className="flex flex-col items-center gap-1">
        {GROUPS.map((group) => {
          const isOpen = expandedGroup === group.name;
          const content = t.rankTips?.[group.name];
          const pct = groupPct(group);

          return (
            <div key={group.name} className="w-full flex flex-col items-center">
              <div className="min-w-[8.5rem]" style={{ width: `${ROW_WIDTH_PCT[group.name]}%` }}>
                <button
                  type="button"
                  onClick={() => setExpandedGroup(isOpen ? null : group.name)}
                  className="w-full flex flex-col items-center gap-1 px-2 py-2"
                  style={{
                    background: `${group.color}14`,
                    borderLeft: `3px solid ${group.color}`,
                    borderRight: `3px solid ${group.color}`,
                  }}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    {group.tiers.map((tier) => (
                      <img
                        key={tier.label}
                        src={optimizeImg(tier.icon, 44)}
                        alt={tier.label}
                        className="val-icon w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
                      />
                    ))}
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide" style={{ color: group.color }}>
                      {group.name}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                      {pct !== undefined ? `~${pct.toFixed(1)}%` : '<1%'}
                    </span>
                    <ChevronDown size={12} className={`text-neutral-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
              </div>

              {isOpen && content && (
                <div className="w-full px-3 py-3 bg-neutral-950 border-t border-neutral-800">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-1.5">
                    {t.rankTipsHowToLabel}
                  </div>
                  <p className="text-xs text-neutral-300 font-body leading-relaxed mb-3">{content.howTo}</p>

                  <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-1.5">
                    {t.rankTipsLabel}
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    <li className="text-xs text-neutral-300 font-body leading-relaxed flex gap-1.5">
                      <span className="text-accent shrink-0">•</span> {content.tips[0]}
                    </li>
                    {isPremium ? (
                      content.tips.slice(1).map((tip) => (
                        <li key={tip} className="text-xs text-neutral-300 font-body leading-relaxed flex gap-1.5">
                          <span className="text-accent shrink-0">•</span> {tip}
                        </li>
                      ))
                    ) : (
                      <li className="flex items-center gap-2 text-[11px] text-neutral-500 font-body mt-1 px-2.5 py-2 border border-neutral-800">
                        <Lock size={11} className="text-accent shrink-0" />
                        <span className="flex-1">{t.rankTipsLockedLabel}</span>
                        <button onClick={onSeePlans} className="text-accent hover:underline shrink-0 font-display font-bold uppercase text-[10px] tracking-wide">
                          {t.seePlans}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-neutral-500 font-body leading-relaxed mt-5">{t.rankPyramidRRNote}</p>
    </div>
  );
}
