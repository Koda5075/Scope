import { activityCalendar, getActivitySummary } from '../data/mockData.js';
import { gamesLabel } from '../i18n/translations.js';

function intensityClass(games) {
  if (games <= 0) return 'bg-neutral-900';
  if (games === 1) return 'sc-fill-muted';
  if (games === 2) return 'sc-fill-dim';
  return 'sc-fill';
}

export default function ActivityCalendar({ t }) {
  const weeks = [];
  for (let i = 0; i < activityCalendar.length; i += 7) {
    weeks.push(activityCalendar.slice(i, i + 7));
  }
  const summary = getActivitySummary();

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-y-1">
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.activityTitle}</span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
          <span>{t.activityLess}</span>
          <span className="w-2.5 h-2.5 bg-neutral-900" />
          <span className="w-2.5 h-2.5 sc-fill-muted" />
          <span className="w-2.5 h-2.5 sc-fill-dim" />
          <span className="w-2.5 h-2.5 sc-fill" />
          <span>{t.activityMore}</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div key={day.date} title={`${day.date} — ${day.games} ${gamesLabel(day.games, t)}`} className={`w-2.5 h-2.5 ${intensityClass(day.games)}`} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 mt-3 pt-3 border-t border-neutral-900">
        <div>
          <span className="font-mono text-sm text-white">{summary.totalGames}</span>{' '}
          <span className="text-[11px] text-neutral-500 font-body">{t.activityTotalGames}</span>
        </div>
        <div>
          <span className="font-mono text-sm text-accent">{summary.mostActiveGames}</span>{' '}
          <span className="text-[11px] text-neutral-500 font-body">{t.activityBestDay} ({summary.mostActiveDate})</span>
        </div>
        <div>
          <span className="font-mono text-sm text-white">{summary.activeDays}</span>{' '}
          <span className="text-[11px] text-neutral-500 font-body">{t.activityDaysPlayed}</span>
        </div>
      </div>

      <div className="text-[11px] text-neutral-500 font-body mt-2">{t.activitySub}</div>
    </div>
  );
}
