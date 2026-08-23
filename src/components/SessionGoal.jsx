import { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';
import Card from './Card.jsx';

const STORAGE_KEY = 'scope-session-goal';

// Current values the goal types track against — same mock numbers already shown
// elsewhere on Overview (RR progress chart, headshot StatReadout), kept in sync here
// rather than re-derived, since both are hardcoded demo snapshots today.
const CURRENT_VALUES = { rr: 67, headshots: 31 };

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
            <option value="rr">{t.sessionGoalTypeRR}</option>
            <option value="headshots">{t.sessionGoalTypeHeadshots}</option>
          </select>
          <input
            type="number"
            min="1"
            value={draftTarget}
            onChange={(e) => setDraftTarget(e.target.value)}
            placeholder={draftType === 'rr' ? 'RR' : '%'}
            className="w-16 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 px-2 py-1.5 focus:border-accent outline-none"
          />
          <button type="submit" className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-1.5 hover:opacity-90 transition-opacity">
            {t.sessionGoalSet}
          </button>
        </form>
      </Card>
    );
  }

  const current = CURRENT_VALUES[goal.type];
  const pct = Math.min(100, Math.round((current / goal.target) * 100));
  const reached = current >= goal.target;
  const unit = goal.type === 'rr' ? '' : '%';
  const label = goal.type === 'rr' ? t.sessionGoalTypeRR : t.sessionGoalTypeHeadshots;

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
        <span className="text-xs text-neutral-400 font-body">{label}</span>
        <span className="font-mono text-sm text-white">{current}{unit} / {goal.target}{unit}</span>
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
