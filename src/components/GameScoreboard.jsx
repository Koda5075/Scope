import { useState } from 'react';
import { Crosshair, Target, Zap, Skull, Flame, Sword, ShieldOff } from 'lucide-react';
import { getAgentIcon, getMapImage } from '../data/valorantAssets.js';
import KDAStat from './KDAStat.jsx';
import StatReadout from './StatReadout.jsx';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function PlayerDetail({ p, t }) {
  return (
    <div className="px-1 pt-3 pb-1">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
        <StatReadout label={t.statACS} value={p.acs} Icon={Zap} />
        <StatReadout label={t.statHeadshots} value={p.headshotPct} unit="%" Icon={Target} />
        <StatReadout label={t.statAccuracy} value={p.accuracyPct} unit="%" Icon={Crosshair} />
        <StatReadout label={t.statFirstBloods} value={p.firstBloods} Icon={Skull} />
        <StatReadout label={t.statFirstDeaths} value={p.firstDeaths} Icon={ShieldOff} />
        <StatReadout label={t.statClutches} value={p.clutchesWon} unit={`/${p.clutchesPlayed}`} Icon={Flame} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sc-card">
          <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.matchDamageTitle}</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="font-mono text-lg text-white">{p.damageDealt}</div>
              <div className="text-[10px] text-neutral-500 font-body">{t.matchDamageDealt}</div>
            </div>
            <div>
              <div className="font-mono text-lg text-neutral-400">{p.damageReceived}</div>
              <div className="text-[10px] text-neutral-500 font-body">{t.matchDamageReceived}</div>
            </div>
            <div>
              <div className="font-mono text-lg text-accent">{p.avgDamageRound}</div>
              <div className="text-[10px] text-neutral-500 font-body">{t.matchDamagePerRound}</div>
            </div>
          </div>
        </div>

        <div className="sc-card">
          <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.matchEconomyTitle}</div>
          <p className="text-xs font-body text-neutral-300">
            {fmt(t.matchEconomyEcoRounds, { won: p.economy.ecoRoundsWon, played: p.economy.ecoRoundsPlayed })}
            {' · '}
            {fmt(t.matchEconomyAvgSpend, { credits: p.economy.avgSpend })}
          </p>
        </div>

        <div className="sc-card">
          <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.matchRivalsTitle}</div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-body text-neutral-300">
              <ShieldOff size={12} className="text-neutral-500 shrink-0" />
              {fmt(t.matchRivalToughest, { name: p.rivals.toughest.name, count: p.rivals.toughest.count })}
            </div>
            <div className="flex items-center gap-2 text-xs font-body text-neutral-300">
              <Sword size={12} className="text-accent shrink-0" />
              {fmt(t.matchRivalFavorite, { name: p.rivals.favorite.name, count: p.rivals.favorite.count })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameScoreboard({ match, t }) {
  const modeLabel = { competitive: t.modeCompetitive, unrated: t.modeUnrated, deathmatch: t.modeDeathmatch }[match.mode];
  const mapImage = getMapImage(match.map);
  const you = match.you;
  const dt = match.dateTime;
  const dateTimeLabel = dt
    ? `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())} · ${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`
    : null;

  const [expandedName, setExpandedName] = useState(you?.name ?? null);

  return (
    <div>
      {mapImage && (
        <div className="relative -mx-5 -mt-5 mb-4 h-28 overflow-hidden">
          <img src={mapImage.splash} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
        </div>
      )}
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1">
        {match.map} · {modeLabel}
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-mono ${match.result === 'win' ? 'text-accent' : 'text-neutral-500'}`}>{match.score}</span>
        {dateTimeLabel && <span className="text-[11px] font-mono text-neutral-600">{dateTimeLabel}</span>}
      </div>

      <div className="flex items-center gap-4 mb-2 text-[10px] font-body text-neutral-500">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> {t.yourTeamLabel}</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> {t.enemyTeamLabel}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {match.players.map((p, i) => {
          const isExpanded = expandedName === p.name;
          return (
            <div
              key={i}
              className={`border ${p.isYou ? 'border-accent bg-neutral-900' : isExpanded ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}
            >
              <button
                type="button"
                onClick={() => setExpandedName(isExpanded ? null : p.name)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.team === you?.team ? 'bg-accent' : 'bg-neutral-600'}`} />
                  <span className={`font-body text-xs truncate ${p.isYou ? 'text-accent' : 'text-neutral-300'}`}>{p.name}</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-600 shrink-0">
                    {getAgentIcon(p.agent) && <img src={getAgentIcon(p.agent)} alt="" className="val-icon w-8 h-8 rounded-full object-cover" />}
                    {p.agent}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <KDAStat kills={p.kills} deaths={p.deaths} assists={p.assists} tone={p.isYou ? 'you' : 'default'} showDiff />
                  <span className="flex flex-col items-end w-11 shrink-0">
                    <span className="font-mono text-xs text-white">{p.acs}</span>
                    <span className="text-[8px] text-neutral-600 uppercase tracking-wide">{t.statACS}</span>
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div className="border-t border-neutral-800 px-3">
                  <PlayerDetail p={p} t={t} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
