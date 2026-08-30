import { Flame, Snowflake } from 'lucide-react';
import InfoTip from './InfoTip.jsx';
import { getActivityStreak, STREAK_FREEZES_MAX, STREAK_MILESTONES } from '../data/mockData.js';

function fmt(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

// The flame stays plain most days on purpose — it only picks up the gold glow once the
// streak has actually crossed one of the "important" milestones (7/14/30/100/365 days).
// If it glowed every day it would stop registering as a signal; keeping it rare is what
// makes it worth noticing when it does light up.
export default function StreakFlame({ t }) {
  const { streak, freezesRemaining } = getActivityStreak();
  const milestoneReached = [...STREAK_MILESTONES].reverse().find((m) => streak >= m);

  return (
    <div className="mb-4 flex items-center gap-4 border border-neutral-800 bg-neutral-950 px-4 py-3">
      <span
        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full"
        style={
          milestoneReached
            ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', boxShadow: '0 0 12px -2px var(--accent)' }
            : { background: 'var(--sc-inset)' }
        }
      >
        <Flame size={18} className={milestoneReached ? 'text-accent' : 'text-neutral-400'} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-display text-base font-semibold text-white leading-none">
          {fmt(t.activityStreakDays, { n: streak })}
        </div>
      </div>
      <span className="flex items-center gap-1.5 shrink-0 text-neutral-500">
        <Snowflake size={13} />
        <span className="font-mono text-xs">{freezesRemaining}/{STREAK_FREEZES_MAX}</span>
        <InfoTip text={fmt(t.activityStreakFreezeTooltip, { remaining: freezesRemaining, max: STREAK_FREEZES_MAX })} />
      </span>
    </div>
  );
}
