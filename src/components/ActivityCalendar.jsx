import { useState } from 'react';
import { activityCalendar, getActivitySummary } from '../data/mockData.js';
import { gamesLabel } from '../i18n/translations.js';

function intensityClass(games) {
  if (games <= 0) return 'bg-neutral-900';
  if (games === 1) return 'sc-fill-muted';
  if (games === 2) return 'sc-fill-dim';
  return 'sc-fill';
}

// `days` defaults to the owner's own 90-day grid; the public player-profile page passes
// a per-player grid of the same `{ date, games }[]` shape.
export default function ActivityCalendar({ t, days = activityCalendar }) {
  const [view, setView] = useState('heatmap'); // 'heatmap' | 'month'
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  const summary = getActivitySummary(days);

  // Calendar-month view: only the entries that actually fall within the current real
  // calendar month, laid out on a proper Mon-Sun grid with leading blanks — a different
  // read on the exact same `days` data, not a second dataset.
  const byDate = new Map(days.map((d) => [d.date, d.games]));
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7; // Monday-first week
  const monthCells = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      const dateStr = d.toISOString().slice(0, 10);
      return { date: dateStr, day: i + 1, games: byDate.get(dateStr) ?? 0 };
    }),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-y-1">
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.activityTitle}</span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {['heatmap', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2 py-0.5 text-[9px] font-display uppercase tracking-wide border transition-colors ${
                  view === v
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {v === 'heatmap' ? t.activityViewHeatmap : t.activityViewMonth}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600">
            <span>{t.activityLess}</span>
            <span className="w-3 h-3 bg-neutral-900" />
            <span className="w-3 h-3 sc-fill-muted" />
            <span className="w-3 h-3 sc-fill-dim" />
            <span className="w-3 h-3 sc-fill" />
            <span>{t.activityMore}</span>
          </div>
        </div>
      </div>

      {view === 'heatmap' ? (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div key={day.date} title={`${day.date} — ${day.games} ${gamesLabel(day.games, t)}`} className={`w-3 h-3 ${intensityClass(day.games)}`} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {monthCells.map((cell, i) =>
            cell ? (
              <div
                key={cell.date}
                title={`${cell.date} — ${cell.games} ${gamesLabel(cell.games, t)}`}
                className={`aspect-square min-w-[24px] flex items-center justify-center text-[9px] font-mono ${intensityClass(cell.games)} ${cell.games > 0 ? 'text-black' : 'text-neutral-600'}`}
              >
                {cell.day}
              </div>
            ) : (
              <div key={`blank-${i}`} />
            )
          )}
        </div>
      )}

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
