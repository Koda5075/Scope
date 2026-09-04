import { useState, useEffect } from 'react';
import { Target, X, TrendingUp, Swords, Zap, Crosshair, Skull } from 'lucide-react';
import Card from './Card.jsx';
import { rrHistory } from '../data/mockData.js';

const STORAGE_KEY = 'scope-session-goal';

// Recent-sessions average, the same "your own trend, not a guess" reasoning as the
// stat-delta arrows elsewhere on Overview — +10 above it is a stretch goal, not just
// matching what already happened.
const RECENT_RR_AVG = Math.round(rrHistory.slice(-3).reduce((sum, r) => sum + r.rr, 0) / 3);

// Current values + units the goal types track against — same mock numbers already
// shown elsewhere on Overview (RR progress chart, StatReadout grid), kept in sync here
// rather than re-derived, since all of these are hardcoded demo snapshots today.
// `suggested` seeds the draft target so setting a goal is a one-click accept-or-tweak
// instead of a blank field — rr's is grounded in real recent-session history (the only
// type with a per-session array to average); the rest use a flat "a bit more than now"
// bump since there's no equivalent history for them yet.
const GOAL_TYPES = [
  { key: 'rr', labelKey: 'sessionGoalTypeRR', current: 67, unit: '', step: 1, Icon: TrendingUp, suggested: RECENT_RR_AVG + 10 },
  { key: 'kda', labelKey: 'statKDA', current: 1.42, unit: '', step: 0.01, Icon: Swords, suggested: 1.56 },
  { key: 'acs', labelKey: 'statACS', current: 238, unit: '', step: 1, Icon: Zap, suggested: 257 },
  { key: 'accuracy', labelKey: 'statAccuracy', current: 24, unit: '%', step: 1, Icon: Crosshair, suggested: 27 },
  { key: 'headshots', labelKey: 'statHeadshots', current: 31, unit: '%', step: 1, Icon: Target, suggested: 34 },
  { key: 'firstBloods', labelKey: 'statFirstBloods', current: 9, unit: '', step: 1, Icon: Skull, suggested: 11 },
];

export default function SessionGoal({ t }) {
  const [goal, setGoal] = useState(null);
  const [draftType, setDraftType] = useState('rr');
  const [draftTarget, setDraftTarget] = useState(String(GOAL_TYPES[0].suggested));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setGoal(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Reseeds the draft with that type's own suggestion on every switch — so "pick a
  // different metric" still lands on a one-click-ready number instead of an empty field.
  useEffect(() => {
    const config = GOAL_TYPES.find((g) => g.key === draftType);
    setDraftTarget(String(config?.suggested ?? ''));
  }, [draftType]);

  function persist(next) {
    setGoal(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }

  function handleSet(e) {
    e.preventDefault();
    const target = Number(draftTarget);
    if (!target || target <= 0) return;
    persist({ type: draftType, target });
    setDraftTarget('');
  }

  const draftConfig = GOAL_TYPES.find((g) => g.key === draftType);

  if (!goal) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-1.5">
          <Target size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.sessionGoalTitle}</span>
        </div>
        <p className="text-[11px] text-neutral-500 font-body mb-3">{t.sessionGoalDesc}</p>
        <form onSubmit={handleSet} className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-1.5">
            {GOAL_TYPES.map((g) => {
              const active = draftType === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setDraftType(g.key)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-body border transition-colors ${
                    active
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  <g.Icon size={12} className="shrink-0" />
                  <span className="truncate">{t[g.labelKey]}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-neutral-600 font-body -mt-1">{t.sessionGoalSuggestedHint}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-body text-neutral-600">
              {t.sessionGoalCurrent}: <span className="font-mono text-neutral-400">{draftConfig.current}{draftConfig.unit}</span>
            </span>
            <input
              type="number"
              min="0"
              step={draftConfig.step}
              value={draftTarget}
              onChange={(e) => setDraftTarget(e.target.value)}
              placeholder={t.sessionGoalTargetPlaceholder}
              aria-label={t.sessionGoalTargetPlaceholder}
              className="w-24 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 px-2 py-1.5 focus:border-accent outline-none"
            />
            <button type="submit" className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-1.5 hover:opacity-90 transition-opacity">
              {t.sessionGoalSet}
            </button>
          </div>
        </form>
      </Card>
    );
  }

  const config = GOAL_TYPES.find((g) => g.key === goal.type) ?? GOAL_TYPES[0];
  const pct = Math.min(100, Math.round((config.current / goal.target) * 100));
  const reached = config.current >= goal.target;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.sessionGoalTitle}</span>
        </div>
        <button onClick={() => persist(null)} aria-label={t.sessionGoalClear} className="text-neutral-600 hover:text-neutral-300 transition-colors">
          <X size={13} />
        </button>
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs text-neutral-400 font-body">{t[config.labelKey]}</span>
        <span className="font-mono text-sm text-white">{config.current}{config.unit} / {goal.target}{config.unit}</span>
      </div>

      {/* The gauge itself: bigger and more prominent than a generic thin progress bar,
          with 25/50/75 tick marks so "how far along" reads at a glance, and the percent
          moved inline as the headline number rather than buried in the caption below. */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="font-display text-3xl font-bold text-accent leading-none">{pct}%</span>
        {reached && <span className="font-display text-[10px] font-bold uppercase tracking-wide text-accent">{t.sessionGoalReached}</span>}
      </div>
      <div className="relative sc-track h-4 overflow-hidden">
        <div className="sc-fill h-full transition-all" style={{ width: `${pct}%` }} />
        {[25, 50, 75].map((tick) => (
          <span key={tick} className="absolute top-0 bottom-0 w-px bg-black/40" style={{ left: `${tick}%` }} />
        ))}
      </div>
      {!reached && (
        <p className="text-[11px] text-neutral-500 font-body mt-2">{t.sessionGoalProgress.replace('{pct}', pct)}</p>
      )}
    </Card>
  );
}
