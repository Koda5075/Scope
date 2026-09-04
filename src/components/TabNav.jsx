import { Lock } from 'lucide-react';

// Exported so App.jsx's keyboard-shortcut handler (digit keys 1-7) can map to the same
// order without duplicating it.
export const TABS = ['overview', 'agents', 'economy', 'compare', 'leaderboard', 'badges', 'progress', 'premium'];

export default function TabNav({ tab, setTab, t }) {
  return (
    <div className="flex gap-1 mb-6 border-b border-neutral-800 overflow-x-auto" data-tour="tabs">
      {TABS.map((tb) => (
        <button
          key={tb}
          onClick={() => setTab(tb)}
          data-tour={tb === 'premium' ? 'scope-plus-tab' : undefined}
          className={`flex items-center gap-1.5 font-display text-sm tracking-wide px-4 py-2 uppercase whitespace-nowrap transition-colors ${
            tab === tb ? 'text-accent border-b-2 border-accent' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {tb === 'premium' && <Lock size={11} />}
          {t.tabs[tb]}
        </button>
      ))}
    </div>
  );
}
