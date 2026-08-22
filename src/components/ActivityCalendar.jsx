import { activityCalendar } from '../data/mockData.js';

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

  return (
    <div>
      <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.activityTitle}</span>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div key={day.date} title={`${day.date} — ${day.games} ${t.gamesShort}`} className={`w-2.5 h-2.5 ${intensityClass(day.games)}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="text-[11px] text-neutral-500 font-body mt-2">{t.activitySub}</div>
    </div>
  );
}
