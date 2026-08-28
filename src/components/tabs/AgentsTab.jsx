import { useMemo, useState } from 'react';
import { Star, Maximize2 } from 'lucide-react';
import Card from '../Card.jsx';
import Modal from '../Modal.jsx';
import AdSlot from '../AdSlot.jsx';
import { weaponStats, computeAgentStats, computeMapStats } from '../../data/mockData.js';
import { getAgentIcon, getMapImage, getWeaponIcon } from '../../data/valorantAssets.js';
import { gamesLabel } from '../../i18n/translations.js';
import InfoTip from '../InfoTip.jsx';

const PREVIEW_COUNT = 3;
// One more row than maps/weapons: an AgentRow is much shorter than a MapRow, so four
// of them leaves the "Agent performance" card level with "Map performance" beside it.
const AGENT_PREVIEW_COUNT = 4;

function SeeAllButton({ onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors shrink-0"
    >
      {t.seeAll}
      <Maximize2 size={11} />
    </button>
  );
}

function AgentRow({ a, t }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="font-display text-sm text-white flex items-center gap-2 sm:w-32 sm:shrink-0">
        {getAgentIcon(a.name) && <img src={getAgentIcon(a.name)} alt="" className="val-icon w-11 h-11 rounded-full object-cover shrink-0" />}
        {a.name}
      </span>
      <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${a.wr ?? 0}%` }} /></div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-xs text-neutral-500">{a.games} {gamesLabel(a.games, t)}</span>
        <span className="flex items-center gap-1">
          <span className="font-mono text-xs text-accent w-10 text-right">{a.wr !== null ? `${a.wr}%` : '—'}</span>
          <InfoTip text={t.tipAgentMapWinRate} />
        </span>
      </div>
    </div>
  );
}

function MapRow({ m, t }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {getMapImage(m.name) && (
        <img src={getMapImage(m.name).splash} alt="" className="val-icon w-full h-24 sm:w-28 sm:h-16 rounded object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
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
          <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${m.wr ?? 0}%` }} /></div>
          <span className="font-mono text-xs text-neutral-500 w-16 text-right shrink-0">{m.games} {gamesLabel(m.games, t)}</span>
          <span className="flex items-center gap-1 shrink-0">
            <span className="font-mono text-xs text-accent w-10 text-right">{m.wr !== null ? `${m.wr}%` : '—'}</span>
            <InfoTip text={t.tipAgentMapWinRate} />
          </span>
        </div>
        {m.atkWr !== undefined && m.defWr !== undefined && (
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 mt-1.5">
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
        )}
      </div>
    </div>
  );
}

function fmt(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function WeaponRow({ w, killShare, t }) {
  const killShareHint = fmt(t.weaponKillShareExplain, { pct: killShare, weapon: w.name });
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="font-display text-sm text-white flex items-center gap-1.5 sm:w-32 sm:shrink-0">
        {getWeaponIcon(w.name) && <img src={getWeaponIcon(w.name)} alt="" className="val-icon w-9 h-9 object-contain shrink-0" />}
        <span className="truncate">{w.name}</span>
        {w.favorite && <Star size={10} className="text-accent shrink-0" fill="currentColor" />}
      </span>
      <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${killShare}%` }} /></div>
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <span className="flex flex-col items-start sm:items-end sm:w-14 shrink-0">
          <span className="font-mono text-xs text-neutral-300">{w.kills}</span>
          <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.weaponKills}</span>
        </span>
        <span className="flex flex-col items-start sm:items-end sm:w-14 shrink-0">
          <span className="font-mono text-xs text-accent">{killShare}%</span>
          <span className="flex items-center gap-1 text-[9px] text-neutral-600 uppercase tracking-wide">
            {t.weaponKillShare}
            <InfoTip text={killShareHint} />
          </span>
        </span>
        <span className="flex flex-col items-start sm:items-end sm:w-14 shrink-0">
          <span className="font-mono text-xs text-white">{w.accuracy}%</span>
          <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.statAccuracy}</span>
        </span>
      </div>
    </div>
  );
}

export default function AgentsTab({ t, isPremium, filteredGames }) {
  const [openModal, setOpenModal] = useState(null); // 'agents' | 'maps' | 'weapons' | null

  // Agent/map performance is recomputed from whatever the global Mode + Period filter
  // currently selects; weaponStats has no per-match weapon breakdown in the mock
  // dataset, so it stays an all-time snapshot.
  const agentStats = useMemo(() => computeAgentStats(filteredGames), [filteredGames]);
  const mapStats = useMemo(() => computeMapStats(filteredGames), [filteredGames]);
  // Sorted by kills, same "most relevant first" convention as agentStats/mapStats above
  // — the full weapon roster is grouped by category in mockData.js for readability, so
  // array order alone would otherwise put a rarely-used Shorty ahead of the Vandal in
  // the 3-item preview.
  const sortedWeapons = useMemo(() => [...weaponStats].sort((a, b) => b.kills - a.kills), []);
  const totalKills = weaponStats.reduce((sum, w) => sum + w.kills, 0);
  const topWeapon = sortedWeapons[0] ?? null;
  const topWeaponShare = topWeapon && totalKills ? Math.round((topWeapon.kills / totalKills) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.agentPerf}</span>
          {agentStats.length > AGENT_PREVIEW_COUNT && <SeeAllButton onClick={() => setOpenModal('agents')} t={t} />}
        </div>
        <div className="flex flex-col gap-3">
          {agentStats.slice(0, AGENT_PREVIEW_COUNT).map((a) => <AgentRow key={a.name} a={a} t={t} />)}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.mapPerf}</span>
          {mapStats.length > PREVIEW_COUNT && <SeeAllButton onClick={() => setOpenModal('maps')} t={t} />}
        </div>
        <div className="flex flex-col gap-4">
          {mapStats.slice(0, PREVIEW_COUNT).map((m) => <MapRow key={m.name} m={m} t={t} />)}
        </div>
      </Card>

      <Card className="md:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.weaponPerf}</span>
          {weaponStats.length > PREVIEW_COUNT && <SeeAllButton onClick={() => setOpenModal('weapons')} t={t} />}
        </div>
        {topWeapon && (
          <p className="text-[11px] text-neutral-500 font-body mb-3">
            {fmt(t.weaponKillShareExplain, { pct: topWeaponShare, weapon: topWeapon.name })}
          </p>
        )}
        <div className="flex flex-col gap-3">
          {sortedWeapons.slice(0, PREVIEW_COUNT).map((w) => (
            <WeaponRow key={w.name} w={w} killShare={totalKills ? Math.round((w.kills / totalKills) * 100) : 0} t={t} />
          ))}
        </div>
      </Card>

      <div className="md:col-span-2">
        <AdSlot t={t} isPremium={isPremium} variant="banner" />
      </div>

      {openModal === 'agents' && (
        <Modal onClose={() => setOpenModal(null)} closeLabel={t.close}>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.agentPerf}</span>
          <div className="flex flex-col gap-4">
            {agentStats.map((a) => <AgentRow key={a.name} a={a} t={t} />)}
          </div>
        </Modal>
      )}

      {openModal === 'maps' && (
        <Modal onClose={() => setOpenModal(null)} closeLabel={t.close}>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.mapPerf}</span>
          <div className="flex flex-col gap-5">
            {mapStats.map((m) => <MapRow key={m.name} m={m} t={t} />)}
          </div>
        </Modal>
      )}

      {openModal === 'weapons' && (
        <Modal onClose={() => setOpenModal(null)} closeLabel={t.close}>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.weaponPerf}</span>
          <div className="flex flex-col gap-4">
            {sortedWeapons.map((w) => (
              <WeaponRow key={w.name} w={w} killShare={totalKills ? Math.round((w.kills / totalKills) * 100) : 0} t={t} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
