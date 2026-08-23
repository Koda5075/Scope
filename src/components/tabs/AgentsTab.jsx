import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../Card.jsx';
import { agentStats, mapStats, weaponStats } from '../../data/mockData.js';
import { getAgentIcon, getMapImage, getWeaponIcon } from '../../data/valorantAssets.js';

const DEFAULT_COUNT = 3;

function SeeMoreButton({ expanded, onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors shrink-0"
    >
      {expanded ? t.seeLess : t.seeMore}
      {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </button>
  );
}

export default function AgentsTab({ t }) {
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [showAllMaps, setShowAllMaps] = useState(false);
  const [showAllWeapons, setShowAllWeapons] = useState(false);

  const visibleAgents = showAllAgents ? agentStats : agentStats.slice(0, DEFAULT_COUNT);
  const visibleMaps = showAllMaps ? mapStats : mapStats.slice(0, DEFAULT_COUNT);
  const visibleWeapons = showAllWeapons ? weaponStats : weaponStats.slice(0, DEFAULT_COUNT);
  const totalKills = weaponStats.reduce((sum, w) => sum + w.kills, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.agentPerf}</span>
          {agentStats.length > DEFAULT_COUNT && (
            <SeeMoreButton expanded={showAllAgents} onClick={() => setShowAllAgents((s) => !s)} t={t} />
          )}
        </div>
        <div className="flex flex-col gap-3">
          {visibleAgents.map((a) => (
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
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.mapPerf}</span>
          {mapStats.length > DEFAULT_COUNT && (
            <SeeMoreButton expanded={showAllMaps} onClick={() => setShowAllMaps((s) => !s)} t={t} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {visibleMaps.map((m) => (
            <div key={m.name} className="flex items-center gap-4">
              {getMapImage(m.name) && (
                <img src={getMapImage(m.name).splash} alt="" className="val-icon w-28 h-16 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-display text-sm text-white">{m.name}</div>
                  {m.bestAgent && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-neutral-600 font-body">{t.bestOnMap}</span>
                      {getAgentIcon(m.bestAgent) && (
                        <img src={getAgentIcon(m.bestAgent)} alt="" className="val-icon w-5 h-5 rounded-full object-cover" />
                      )}
                      <span className="text-[10px] font-display text-neutral-300">{m.bestAgent}</span>
                    </div>
                  )}
                </div>
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
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.weaponPerf}</span>
          {weaponStats.length > DEFAULT_COUNT && (
            <SeeMoreButton expanded={showAllWeapons} onClick={() => setShowAllWeapons((s) => !s)} t={t} />
          )}
        </div>
        <div className="flex flex-col gap-3">
          {visibleWeapons.map((w) => {
            const killShare = totalKills ? Math.round((w.kills / totalKills) * 100) : 0;
            return (
              <div key={w.name} className="flex items-center gap-4">
                <span className="font-display text-sm text-white w-32 flex items-center gap-1.5 shrink-0">
                  {getWeaponIcon(w.name) && <img src={getWeaponIcon(w.name)} alt="" className="val-icon w-9 h-9 object-contain shrink-0" />}
                  <span className="truncate">{w.name}</span>
                  {w.favorite && <Star size={10} className="text-accent shrink-0" fill="currentColor" />}
                </span>
                <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${killShare}%` }} /></div>
                <span className="flex flex-col items-end w-16 shrink-0">
                  <span className="font-mono text-xs text-neutral-300">{w.kills}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.weaponKills}</span>
                </span>
                <span className="flex flex-col items-end w-14 shrink-0">
                  <span className="font-mono text-xs text-accent">{killShare}%</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.weaponKillShare}</span>
                </span>
                <span className="flex flex-col items-end w-14 shrink-0">
                  <span className="font-mono text-xs text-white">{w.accuracy}%</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.statAccuracy}</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
