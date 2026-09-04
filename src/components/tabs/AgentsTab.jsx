import { useMemo, useState } from 'react';
import { Star, Maximize2 } from 'lucide-react';
import Card from '../Card.jsx';
import Modal from '../Modal.jsx';
import AdSlot from '../AdSlot.jsx';
import { weaponStats, computeAgentStats, computeMapStats, WEAPON_CATEGORIES, roundBreakdown } from '../../data/mockData.js';
import { getAgentIcon, getMapImage, getWeaponIcon, getAllAgentNames, optimizeImg } from '../../data/valorantAssets.js';
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

function AgentRow({ a, t, isLastPlayed }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <span className="font-display text-sm text-white flex items-center gap-2 sm:w-32 sm:shrink-0 min-w-0">
        {getAgentIcon(a.name) && <img src={optimizeImg(getAgentIcon(a.name), 44)} alt="" loading="lazy" className="val-icon w-11 h-11 rounded-full object-cover shrink-0" />}
        <span className="truncate">{a.name}</span>
      </span>
      <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${a.wr ?? 0}%` }} /></div>
      <div className="flex items-center gap-3 shrink-0">
        {isLastPlayed && (
          <span className="text-[8px] font-display uppercase tracking-wide px-1 py-0.5 border border-accent text-accent whitespace-nowrap">
            {t.agentLastPlayedBadge}
          </span>
        )}
        <span className="font-mono text-xs text-neutral-500">{a.games} {gamesLabel(a.games, t)}</span>
        <span className="flex items-center gap-1">
          <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.wrShort}</span>
          <span className="font-mono text-xs text-accent w-10 text-right">{a.wr !== null ? `${a.wr}%` : '—'}</span>
          <InfoTip text={a.games > 0 && a.games < 5 ? t.lowSampleTooltip : t.tipAgentMapWinRate} />
        </span>
      </div>
    </div>
  );
}

function MapRow({ m, t }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {getMapImage(m.name) && (
        <img src={optimizeImg(getMapImage(m.name).splash, 512)} alt="" loading="lazy" className="val-icon w-full h-24 sm:w-28 sm:h-16 rounded object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <div className="font-display text-sm text-white">{m.name}</div>
          {m.bestAgent && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-neutral-600 font-body">{t.bestOnMap}</span>
              {getAgentIcon(m.bestAgent) && (
                <img src={optimizeImg(getAgentIcon(m.bestAgent), 24)} alt="" loading="lazy" className="val-icon w-5 h-5 rounded-full object-cover" />
              )}
              <span className="text-[10px] font-display text-neutral-300">{m.bestAgent}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${m.wr ?? 0}%` }} /></div>
          <span className="font-mono text-xs text-neutral-500 w-16 text-right shrink-0">{m.games} {gamesLabel(m.games, t)}</span>
          <span className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] text-neutral-600 uppercase tracking-wide">{t.wrShort}</span>
            <span className="font-mono text-xs text-accent w-10 text-right">{m.wr !== null ? `${m.wr}%` : '—'}</span>
            <InfoTip text={m.games > 0 && m.games < 5 ? t.lowSampleTooltip : t.tipAgentMapWinRate} />
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
        {getWeaponIcon(w.name) && <img src={optimizeImg(getWeaponIcon(w.name), 44)} alt="" loading="lazy" className="val-icon w-9 h-9 object-contain shrink-0" />}
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
  const [weaponCategory, setWeaponCategory] = useState('all');

  // Agent/map performance is recomputed from whatever the global Mode + Period filter
  // currently selects; weaponStats has no per-match weapon breakdown in the mock
  // dataset, so it stays an all-time snapshot.
  const agentStats = useMemo(() => computeAgentStats(filteredGames), [filteredGames]);
  const mapStats = useMemo(() => computeMapStats(filteredGames), [filteredGames]);
  // filteredGames is most-recent-first (same convention Overview relies on), so its
  // first entry's agent is simply the last one actually played under the current filter.
  const lastPlayedAgent = filteredGames[0]?.agent;
  // One agent from the full roster the player hasn't played at all yet, if any —
  // a nudge to try something new rather than a stat, so a stable pick (first
  // alphabetically past the ones already played) beats re-rolling on every render.
  const untriedAgent = useMemo(() => {
    // computeAgentStats seeds its map from every agent in the game (so the "See all"
    // modal has a full roster to show, zeroed out), not just ones actually played — a
    // plain name lookup would always find every name "already played". Games > 0 is
    // the real signal for "tried this one".
    const played = new Set(agentStats.filter((a) => a.games > 0).map((a) => a.name));
    return getAllAgentNames().find((name) => !played.has(name)) ?? null;
  }, [agentStats]);
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
          {agentStats.slice(0, AGENT_PREVIEW_COUNT).map((a) => (
            <AgentRow key={a.name} a={a} t={t} isLastPlayed={a.name === lastPlayedAgent} />
          ))}
        </div>
        {untriedAgent && (
          <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-neutral-800">
            {getAgentIcon(untriedAgent) && (
              <img src={optimizeImg(getAgentIcon(untriedAgent), 44)} alt="" loading="lazy" className="val-icon w-8 h-8 rounded-full object-cover shrink-0" />
            )}
            <p className="text-xs font-body text-neutral-400 leading-relaxed">
              {t.agentSuggestionText.replace('{agent}', untriedAgent)}
            </p>
          </div>
        )}
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
          <p className="text-[11px] text-neutral-500 font-body mb-1.5">
            {fmt(t.weaponKillShareExplain, { pct: topWeaponShare, weapon: topWeapon.name })}
          </p>
        )}
        <p className="text-[11px] text-neutral-500 font-body mb-3">
          {fmt(t.ecoForceSuggestion, { pct: roundBreakdown.ecoForceWr })}
        </p>
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
        <Modal onClose={() => { setOpenModal(null); setWeaponCategory('all'); }} closeLabel={t.close}>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.weaponPerf}</span>
          <div className="flex flex-wrap gap-1 mb-4">
            {['all', ...WEAPON_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setWeaponCategory(cat)}
                className={`px-2 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                  weaponCategory === cat
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {t[`weaponCategory${cat.charAt(0).toUpperCase()}${cat.slice(1)}`]}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {sortedWeapons.filter((w) => weaponCategory === 'all' || w.category === weaponCategory).map((w) => (
              <WeaponRow key={w.name} w={w} killShare={totalKills ? Math.round((w.kills / totalKills) * 100) : 0} t={t} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
