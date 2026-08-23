import { Star } from 'lucide-react';
import Card from '../Card.jsx';
import { agentStats, mapStats, weaponStats } from '../../data/mockData.js';
import { getAgentIcon, getMapImage, getWeaponIcon } from '../../data/valorantAssets.js';

export default function AgentsTab({ t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.agentPerf}</span>
        <div className="flex flex-col gap-3">
          {agentStats.map((a) => (
            <div key={a.name} className="flex items-center gap-4">
              <span className="font-display text-sm text-white w-32 shrink-0 flex items-center gap-2">
                {getAgentIcon(a.name) && <img src={getAgentIcon(a.name)} alt="" className="val-icon w-11 h-11 rounded-full object-cover shrink-0" />}
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
        <div className="flex flex-col gap-4">
          {mapStats.map((m) => (
            <div key={m.name} className="flex items-center gap-4">
              {getMapImage(m.name) && (
                <img src={getMapImage(m.name).splash} alt="" className="val-icon w-28 h-16 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm text-white mb-1.5">{m.name}</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${m.wr}%` }} /></div>
                  <span className="font-mono text-xs text-neutral-500 w-20 text-right shrink-0">{m.games} {t.gamesShort}</span>
                  <span className="font-mono text-xs text-accent w-12 text-right shrink-0">{m.wr}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-600 w-7 shrink-0">ATK</span>
                    <div className="flex-1 sc-track h-1 overflow-hidden"><div className="sc-fill-dim h-full" style={{ width: `${m.atkWr}%` }} /></div>
                    <span className="font-mono text-[10px] text-neutral-500 w-8 text-right shrink-0">{m.atkWr}%</span>
                  </span>
                  <span className="flex-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-600 w-7 shrink-0">DEF</span>
                    <div className="flex-1 sc-track h-1 overflow-hidden"><div className="sc-fill-dim h-full" style={{ width: `${m.defWr}%` }} /></div>
                    <span className="font-mono text-[10px] text-neutral-500 w-8 text-right shrink-0">{m.defWr}%</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.weaponPerf}</span>
        <div className="flex flex-col gap-3">
          {weaponStats.map((w) => (
            <div key={w.name} className="flex items-center gap-4">
              <span className="font-display text-sm text-white w-32 flex items-center gap-1.5 shrink-0">
                {getWeaponIcon(w.name) && <img src={getWeaponIcon(w.name)} alt="" className="val-icon w-9 h-9 object-contain shrink-0" />}
                <span className="truncate">{w.name}</span>
                {w.favorite && <Star size={10} className="text-accent shrink-0" fill="currentColor" />}
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
