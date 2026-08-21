import Card from '../Card.jsx';
import { badgeDefs } from '../../data/mockData.js';

export default function BadgesTab({ t }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {badgeDefs.map((b) => {
        const Icon = b.icon;
        const info = t.badges[b.id];
        return (
          <Card key={b.id}>
            <div className="flex items-center gap-3">
              <div className="sc-badge w-10 h-10 flex items-center justify-center shrink-0"><Icon size={18} className="text-accent" /></div>
              <div>
                <div className="font-display text-sm text-white">{info.label}</div>
                <div className="text-[11px] text-neutral-500 font-body">{info.sub}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
