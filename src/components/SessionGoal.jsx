import { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';
import Card from './Card.jsx';

const STORAGE_KEY = 'scope-session-goal';

// Current values + units the goal types track against — same mock numbers already
// shown elsewhere on Overview (RR progress chart, StatReadout grid), kept in sync here
// rather than re-derived, since all of these are hardcoded demo snapshots today.
const GOAL_TYPES = [
  { key: 'rr', labelKey: 'sessionGoalTypeRR', current: 67, unit: '', step: 1 },
  { key: 'kda', labelKey: 'statKDA', current: 1.42, unit: '', step: 0.01 },
  { key: 'acs', labelKey: 'statACS', current: 238, unit: '', step: 1 },
  { key: 'accuracy', labelKey: 'statAccuracy', current: 24, unit: '%', step: 1 },
  { key: 'headshots', labelKey: 'statHeadshots', current: 31, unit: '%', step: 1 },
  { key: 'firstBloods', labelKey: 'statFirstBloods', current: 9, unit: '', step: 1 },
];

export default function SessionGoal({ t }) {
  const [goal, setGoal] = useState(null);
  const [draftType, setDraftType] = useState('rr');
  const [draftTarget, setDraftTarget] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setGoal(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

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
        <form onSubmit={handleSet} className="flex items-center gap-2 flex-wrap">
          <select
            value={draftType}
            onChange={(e) => setDraftType(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1.5 focus:border-accent outline-none"
          >
            {GOAL_TYPES.map((g) => (
              <option key={g.key} value={g.key}>{t[g.labelKey]}</option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step={draftConfig.step}
            value={draftTarget}
            onChange={(e) => setDraftTarget(e.target.value)}
            placeholder={draftConfig.unit || t[draftConfig.labelKey]}
            className="w-20 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 px-2 py-1.5 focus:border-accent outline-none"
          />
          <button type="submit" className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-1.5 hover:opacity-90 transition-opacity">
            {t.sessionGoalSet}
          </button>
        </form>
      </Card>
    );
  }

  const config = GOAL_TYPES.find((g) => g.key === goal.type) ?? GOAL_TYPES[0];
  const pct = Math.min(100, Math.round((config.current / goal.target) * 100));
  const reached = config.current >= goal.target;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.sessionGoalTitle}</span>
        </div>
        <button onClick={() => persist(null)} aria-label={t.sessionGoalClear} className="text-neutral-600 hover:text-neutral-300 transition-colors">
          <X size={13} />
        </button>
      </div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-neutral-400 font-body">{t[config.labelKey]}</span>
        <span className="font-mono text-sm text-white">{config.current}{config.unit} / {goal.target}{config.unit}</span>
      </div>
      <div className="sc-track h-2 overflow-hidden">
        <div className="sc-fill h-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-neutral-500 font-body mt-2">
        {reached ? t.sessionGoalReached : t.sessionGoalProgress.replace('{pct}', pct)}
      </p>
    </Card>
  );
}
