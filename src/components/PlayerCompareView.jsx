import { ArrowLeft } from 'lucide-react';
import CompareRow from './CompareRow.jsx';
import {
  myStats, computeAverageAcs, computeAggregateKDA, computeAverageAccuracy, computeAverageHeadshots,
} from '../data/mockData.js';

const METRICS = [
  { key: 'kda', labelKey: 'statKDA', max: 2 },
  { key: 'acs', labelKey: 'statACS', max: 300 },
  { key: 'accuracy', labelKey: 'statAccuracy', max: 40 },
  { key: 'headshots', labelKey: 'statHeadshots', max: 45 },
];

export default function PlayerCompareView({ player, onBack, t, filteredGames }) {
  // Same "you" comparison as the Compare tab's own search — every metric follows the
  // global filter there, so it must here too, or this reachable-from-the-search-bar view
  // would quote different "you" numbers than the Compare tab for the same filter.
  const you = {
    acs: computeAverageAcs(filteredGames) ?? myStats.acs,
    kda: computeAggregateKDA(filteredGames) ?? myStats.kda,
    accuracy: computeAverageAccuracy(filteredGames) ?? myStats.accuracy,
    headshots: computeAverageHeadshots(filteredGames) ?? myStats.headshots,
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mb-4"
      >
        <ArrowLeft size={12} /> {t.backToProfile}
      </button>

      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4">
        {t.you} vs {player.name}#{player.tag}
      </div>

      <div className="flex flex-col gap-4">
        {METRICS.map((m) => (
          <div key={m.key}>
            <div className="text-xs font-display uppercase text-neutral-300 mb-2">{t[m.labelKey]}</div>
            <div className="flex flex-col gap-1.5">
              <CompareRow label={t.you} value={you[m.key]} max={m.max} tone="you" />
              <CompareRow label={player.name} value={player[m.key]} max={m.max} tone="avg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
