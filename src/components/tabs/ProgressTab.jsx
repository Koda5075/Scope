import { useState } from 'react';
import Card from '../Card.jsx';
import AdSlot from '../AdSlot.jsx';
import { progressionTimeline } from '../../data/mockData.js';
import { getRankIcon, getMapImage, optimizeImg } from '../../data/valorantAssets.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

const FILTERS = ['all', 'rank', 'record', 'streak'];

export default function ProgressTab({ t, isPremium }) {
  const [filter, setFilter] = useState('all');
  // Oldest first so the timeline reads top-to-bottom as a story ending at "today".
  const timeline = [...progressionTimeline]
    .sort((a, b) => b.daysAgo - a.daysAgo)
    .filter((m) => filter === 'all' || m.type === filter);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.tabs.progress}</span>
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                  filter === f
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {t[`timelineFilter${f.charAt(0).toUpperCase()}${f.slice(1)}`]}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-neutral-500 font-body mb-5">{t.progressSub}</p>

        {timeline.length === 0 ? (
          <div className="text-xs font-body text-neutral-500 py-2">{t.timelineNoneForFilter}</div>
        ) : (
        <div className="relative pl-9">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-neutral-800" />
          {timeline.map((m, i) => {
            const Icon = m.icon;
            const rankIcon = m.descParams?.rank ? getRankIcon(m.descParams.rank) : null;
            const mapImg = m.descParams?.map ? getMapImage(m.descParams.map) : null;
            const isLast = i === timeline.length - 1;
            return (
              <div key={m.id} className="relative pb-4 last:pb-0">
                <span
                  className={`absolute -left-9 top-1 w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] ${
                    isLast ? 'border-accent bg-accent/15' : 'border-neutral-700 bg-neutral-950'
                  }`}
                >
                  <Icon size={14} className={isLast ? 'text-accent' : 'text-neutral-400'} />
                </span>

                <div className="sc-badge px-3 py-2.5 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-display text-sm text-white truncate">{t[m.titleKey]}</span>
                      <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                        {m.daysAgo === 0 ? t.alertToday : `${m.daysAgo}${t.daysAgoSuffix}`}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-body">{fmt(t[m.descKey], m.descParams)}</p>
                  </div>
                  {rankIcon && <img src={optimizeImg(rankIcon, 44)} alt="" loading="lazy" className="val-icon w-9 h-9 shrink-0" />}
                  {!rankIcon && mapImg && (
                    <img src={optimizeImg(mapImg.splash, 64)} alt="" loading="lazy" className="val-icon w-16 h-9 rounded object-cover shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </Card>

      <AdSlot t={t} isPremium={isPremium} variant="banner" />
    </div>
  );
}
