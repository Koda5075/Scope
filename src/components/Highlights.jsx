import { Flame, TrendingDown, Map as MapIcon, Swords, Trophy } from 'lucide-react';
import Card from './Card.jsx';
import { badgeDefs, getBadgeProgress, getStreaks, computeAgentStats, computeMapStats, TIER_NAMES } from '../data/mockData.js';

function fmt(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

// Picks up to 4 of the most tell-a-story-quickly facts across streaks, maps, agents and
// badge progress, so the Overview tab has a fast entry point before digging into tabs.
// Streak/map/agent facts are computed from the currently filtered games — this card sits
// right below the global Mode + Period filter, so it must agree with the numbers the
// Agents & Maps tab shows for that same filter instead of quoting an unrelated all-time
// snapshot.
function computeHighlights(t, filteredGames) {
  const items = [];

  const streaks = getStreaks(filteredGames);
  if (streaks.currentCount >= 2) {
    items.push({
      Icon: streaks.currentType === 'win' ? Flame : TrendingDown,
      text: fmt(streaks.currentType === 'win' ? t.highlightStreakWin : t.highlightStreakLoss, { n: streaks.currentCount }),
    });
  }

  const bestMap = computeMapStats(filteredGames).filter((m) => m.wr !== null).sort((a, b) => b.wr - a.wr)[0];
  if (bestMap) items.push({ Icon: MapIcon, text: fmt(t.highlightBestMap, { map: bestMap.name, wr: bestMap.wr }) });

  const bestAgent = computeAgentStats(filteredGames).filter((a) => a.wr !== null).sort((a, b) => b.wr - a.wr)[0];
  if (bestAgent) items.push({ Icon: Swords, text: fmt(t.highlightBestAgent, { agent: bestAgent.name, wr: bestAgent.wr }) });

  const closestBadge = badgeDefs
    .map((b) => ({ b, progress: getBadgeProgress(b) }))
    .filter((x) => x.progress && !x.progress.isMaxed)
    .sort((a, b) => b.progress.progressPct - a.progress.progressPct)[0];
  if (closestBadge) {
    const nextTier = TIER_NAMES[closestBadge.progress.tierIndex + 1];
    items.push({
      Icon: Trophy,
      text: fmt(t.highlightBadgeClose, {
        pct: closestBadge.progress.progressPct,
        tier: nextTier,
        badge: t.badges[closestBadge.b.id].label,
      }),
    });
  }

  return items.slice(0, 4);
}

export default function Highlights({ t, filteredGames }) {
  const items = computeHighlights(t, filteredGames);
  if (items.length === 0) return null;

  return (
    <Card className="mb-4" data-tour="highlights">
      <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.highlightsTitle}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 border border-neutral-800 bg-neutral-950">
            <item.Icon size={14} className="text-accent shrink-0" />
            <span className="text-xs font-body text-neutral-300">{item.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
