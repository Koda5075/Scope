import { useState } from 'react';
import Card from '../Card.jsx';
import CompareRow from '../CompareRow.jsx';
import {
  recentGames, myStats,
  computeAverageAcs, computeAggregateKDA, computeAverageAccuracy, computeAverageHeadshots,
} from '../../data/mockData.js';

const METRICS = [
  { key: 'kda', labelKey: 'statKDA', max: 2 },
  { key: 'acs', labelKey: 'statACS', max: 300 },
  { key: 'accuracy', labelKey: 'statAccuracy', max: 40 },
  { key: 'headshots', labelKey: 'statHeadshots', max: 45 },
];

// Comparisons on someone else's profile: the player against their rank's average by
// default, and against the signed-in viewer ("vs me") when there's one — the owner's
// numbers are the same aggregate the Compare tab uses.
export default function ProfileCompare({ dataset, t, loggedIn }) {
  const [mode, setMode] = useState('rank'); // 'rank' | 'me'

  const player = {
    kda: dataset.summary.kda,
    acs: dataset.summary.acs,
    accuracy: dataset.summary.accuracy,
    headshots: dataset.summary.headshots,
  };

  const me = {
    acs: computeAverageAcs(recentGames) ?? myStats.acs,
    kda: computeAggregateKDA(recentGames) ?? myStats.kda,
    accuracy: computeAverageAccuracy(recentGames) ?? myStats.accuracy,
    headshots: computeAverageHeadshots(recentGames) ?? myStats.headshots,
  };

  const baseline = mode === 'me' && loggedIn ? me : dataset.rankAverage;
  const baselineLabel = mode === 'me' && loggedIn ? t.you : t.rankAvg;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300">
          {dataset.identity.name} vs {baselineLabel}
        </span>
        {loggedIn && (
          <div className="flex gap-1">
            {[
              ['rank', t.rankAvg],
              ['me', t.you],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setMode(val)}
                className={`px-2.5 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                  mode === val
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {METRICS.map((m) => (
          <div key={m.key}>
            <div className="text-xs font-display uppercase text-neutral-300 mb-2">{t[m.labelKey]}</div>
            <div className="flex flex-col gap-1.5">
              <CompareRow label={dataset.identity.name} value={player[m.key]} max={m.max} tone="you" />
              <CompareRow label={baselineLabel} value={Math.round(baseline[m.key] * 100) / 100} max={m.max} tone="avg" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-neutral-600 font-body mt-4">{t.profileDisclaimerBanner}</p>
    </Card>
  );
}
