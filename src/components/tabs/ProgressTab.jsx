import Card from '../Card.jsx';
import { progressionTimeline } from '../../data/mockData.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

export default function ProgressTab({ t }) {
  // Oldest first so the timeline reads top-to-bottom as a story ending at "today".
  const timeline = [...progressionTimeline].sort((a, b) => b.daysAgo - a.daysAgo);

  return (
    <Card>
      <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1 block">{t.tabs.progress}</span>
      <p className="text-[11px] text-neutral-500 font-body mb-5">{t.progressSub}</p>

      <div className="relative pl-7">
        <div className="absolute left-[8px] top-1 bottom-1 w-px bg-neutral-800" />
        {timeline.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="relative pb-7 last:pb-0">
              <span className="absolute -left-7 top-0.5 w-4 h-4 rounded-full bg-accent border-2 border-black flex items-center justify-center">
                <Icon size={9} className="text-black" />
              </span>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display text-sm text-white">{t[m.titleKey]}</span>
                <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                  {m.daysAgo === 0 ? t.alertToday : `${m.daysAgo}${t.daysAgoSuffix}`}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-body">{fmt(t[m.descKey], m.descParams)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
