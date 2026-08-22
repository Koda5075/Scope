import { Star } from 'lucide-react';
import Card from '../Card.jsx';
import { agentStats, mapStats, weaponStats } from '../../data/mockData.js';
import { getAgentIcon, getMapImage } from '../../data/valorantAssets.js';

export default function AgentsTab({ t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.agentPerf}</span>
        <div className="flex flex-col gap-3">
          {agentStats.map((a) => (
            <div key={a.name} className="flex items-center gap-4">
              <span className="font-display text-sm text-white w-24 flex items-center gap-1.5">
                {getAgentIcon(a.name) && <img src={getAgentIcon(a.name)} alt="" className="val-asset w-5 h-5 rounded-full object-cover shrink-0" />}
                {a.name}
              </span>
              <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${a.wr}%` }} /></div>
              <span className="font-mono text-xs text-neutral-500 w-20 text-right">{a.games} {t.gamesShort}</span>
              <span className="font-mono text-xs text-accent w-12 text-right">{a.wr}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.mapPerf}</span>
        <div className="flex flex-col gap-3">
          {mapStats.map((m) => (
            <div key={m.name} className="flex items-center gap-4">
              <span className="font-display text-sm text-white w-24 flex items-center gap-1.5">
                {getMapImage(m.name) && <img src={getMapImage(m.name).icon} alt="" className="val-asset w-5 h-5 rounded-sm object-cover shrink-0" />}
                {m.name}
              </span>
              <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${m.wr}%` }} /></div>
              <span className="font-mono text-xs text-neutral-500 w-20 text-right">{m.games} {t.gamesShort}</span>
              <span className="font-mono text-xs text-accent w-12 text-right">{m.wr}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.weaponPerf}</span>
        <div className="flex flex-col gap-3">
          {weaponStats.map((w) => (
            <div key={w.name} className="flex items-center gap-4">
              <span className="font-display text-sm text-white w-24 flex items-center gap-1.5">
                {w.name}
                {w.favorite && <Star size={10} className="text-accent" fill="currentColor" />}
              </span>
              <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${w.accuracy}%` }} /></div>
              <span className="font-mono text-xs text-neutral-500 w-24 text-right">{w.kills} {t.weaponKills}</span>
              <span className="font-mono text-xs text-accent w-12 text-right">{w.accuracy}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
