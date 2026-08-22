import Card from '../Card.jsx';
import { badgeDefs, getBadgeProgress } from '../../data/mockData.js';

export default function BadgesTab({ t }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {badgeDefs.map((b) => {
        const Icon = b.icon;
        const info = t.badges[b.id];
        const progress = getBadgeProgress(b);

        return (
          <Card key={b.id}>
            <div className="flex items-center gap-3">
              <div className="sc-badge w-10 h-10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display text-sm text-white">{info.label}</div>
                  {progress && (
                    <span
                      className="font-display text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 shrink-0"
                      style={{ color: progress.tierColor, border: `1px solid ${progress.tierColor}` }}
                    >
                      {progress.tierName}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-500 font-body">{info.sub}</div>
              </div>
            </div>

            {progress && (
              <div className="mt-2.5">
                <div className="sc-track h-1.5 overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${progress.progressPct}%`, background: progress.tierColor }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-mono text-[10px] text-neutral-500">{progress.value}</span>
                  <span className="font-mono text-[10px] text-neutral-600">
                    {progress.isMaxed ? t.tierMaxed : `${t.tierNext} ${progress.nextThreshold}`}
                  </span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
