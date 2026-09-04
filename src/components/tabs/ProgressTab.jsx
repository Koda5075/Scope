import { useState } from 'react';
import { Plus, X, TrendingUp, Zap, Flame, Trophy } from 'lucide-react';
import Card from '../Card.jsx';
import AdSlot from '../AdSlot.jsx';
import { progressionTimeline, badgeDefs, getBadgeProgress, TIER_NAMES } from '../../data/mockData.js';
import { getRankIcon, getMapImage, optimizeImg } from '../../data/valorantAssets.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

const FILTERS = ['all', 'rank', 'record', 'streak'];
const TYPE_ICON = { rank: TrendingUp, record: Zap, streak: Flame };
const CUSTOM_KEY = 'scope-custom-milestones';

function loadCustomMilestones() {
  try {
    const v = JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default function ProgressTab({ t, isPremium }) {
  const [filter, setFilter] = useState('all');
  const [customMilestones, setCustomMilestones] = useState(loadCustomMilestones);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [draftType, setDraftType] = useState('record');

  function persistCustom(next) {
    setCustomMilestones(next);
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function handleAddMilestone(e) {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    const entry = { id: `custom-${Date.now()}`, title: draftTitle.trim(), note: draftNote.trim(), type: draftType, createdAt: Date.now(), custom: true };
    persistCustom([entry, ...customMilestones]);
    setDraftTitle('');
    setDraftNote('');
    setShowAddForm(false);
  }

  function removeCustomMilestone(id) {
    persistCustom(customMilestones.filter((m) => m.id !== id));
  }

  // Custom entries carry a real creation timestamp (so "days ago" stays correct as time
  // passes) rather than a static daysAgo like the mock ones — resolved to the same shape
  // right before merging so the rest of the render logic below can't tell them apart.
  const resolvedCustom = customMilestones.map((m) => ({
    ...m,
    icon: TYPE_ICON[m.type] ?? Zap,
    daysAgo: Math.floor((Date.now() - m.createdAt) / 86400000),
  }));

  // Oldest first so the timeline reads top-to-bottom as a story ending at "today".
  const timeline = [...progressionTimeline, ...resolvedCustom]
    .sort((a, b) => b.daysAgo - a.daysAgo)
    .filter((m) => filter === 'all' || m.type === filter);

  // Same "closest to its next tier" pick Highlights already surfaces on Overview —
  // ties Progress to the badge system Koda asked for instead of it staying a purely
  // passive history, without inventing a second progress mechanic to maintain.
  const closestBadge = badgeDefs
    .filter((b) => !b.secret)
    .map((b) => ({ b, progress: getBadgeProgress(b) }))
    .filter((x) => x.progress && !x.progress.isMaxed)
    .sort((a, b) => b.progress.progressPct - a.progress.progressPct)[0];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.tabs.progress}</span>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setShowAddForm((s) => !s)}
              aria-label={t.timelineAddCustom}
              title={t.timelineAddCustom}
              className="w-6 h-6 flex items-center justify-center border border-neutral-800 text-neutral-500 hover:text-accent hover:border-accent transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-neutral-500 font-body mb-5">{t.progressSub}</p>

        {closestBadge && (
          <div className="flex items-center gap-2.5 mb-5 px-3 py-2.5 border border-accent bg-accent/5">
            <Trophy size={14} className="text-accent shrink-0" />
            <span className="text-xs font-body text-neutral-200">
              {fmt(t.highlightBadgeClose, {
                pct: closestBadge.progress.progressPct,
                tier: TIER_NAMES[closestBadge.progress.tierIndex + 1],
                badge: t.badges[closestBadge.b.id].label,
              })}
            </span>
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddMilestone} className="flex flex-col gap-2 mb-5 p-3 border border-neutral-800 bg-neutral-950">
            <div className="flex gap-2">
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder={t.timelineCustomTitlePlaceholder}
                aria-label={t.timelineCustomTitlePlaceholder}
                className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-accent outline-none px-2.5 py-1.5 text-xs font-body text-neutral-200 placeholder:text-neutral-600"
              />
              <select
                value={draftType}
                onChange={(e) => setDraftType(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 focus:border-accent outline-none px-2 py-1.5 text-xs font-body text-neutral-200"
              >
                {FILTERS.filter((f) => f !== 'all').map((f) => (
                  <option key={f} value={f}>{t[`timelineFilter${f.charAt(0).toUpperCase()}${f.slice(1)}`]}</option>
                ))}
              </select>
            </div>
            <input
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder={t.timelineCustomNotePlaceholder}
              aria-label={t.timelineCustomNotePlaceholder}
              className="bg-neutral-900 border border-neutral-800 focus:border-accent outline-none px-2.5 py-1.5 text-xs font-body text-neutral-200 placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="self-end bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-1.5 hover:opacity-90 transition-opacity"
            >
              {t.timelineCustomSave}
            </button>
          </form>
        )}

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
                      <span className="font-display text-sm text-white truncate">{m.custom ? m.title : t[m.titleKey]}</span>
                      <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                        {m.daysAgo === 0 ? t.alertToday : `${m.daysAgo}${t.daysAgoSuffix}`}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-body">{m.custom ? m.note : fmt(t[m.descKey], m.descParams)}</p>
                  </div>
                  {rankIcon && <img src={optimizeImg(rankIcon, 44)} alt="" loading="lazy" className="val-icon w-9 h-9 shrink-0" />}
                  {!rankIcon && mapImg && (
                    <img src={optimizeImg(mapImg.splash, 64)} alt="" loading="lazy" className="val-icon w-16 h-9 rounded object-cover shrink-0" />
                  )}
                  {m.custom && (
                    <button
                      onClick={() => removeCustomMilestone(m.id)}
                      aria-label={t.timelineCustomDeleteAria}
                      title={t.timelineCustomDeleteAria}
                      className="shrink-0 text-neutral-700 hover:text-accent transition-colors"
                    >
                      <X size={13} />
                    </button>
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
