import { useState } from 'react';
import { Crosshair, Target, Zap, Skull, Flame, Swords, ShieldOff } from 'lucide-react';
import { getAgentIcon, getMapImage, optimizeImg } from '../data/valorantAssets.js';
import { getMatchDiagnosis } from '../lib/matchDiagnosis.js';
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
      {/* Always 3 columns, not 6 at `sm:` -- this grid lives inside a max-w-3xl modal, not
          the full viewport, so the `sm:` breakpoint (viewport-width-based) would switch to
          6 columns long before the modal is actually wide enough, squeezing labels like
          "PREMIÈRES MORTS" + icon + info tip into ~80px and making them overlap. */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatReadout label={t.statACS} value={p.acs} Icon={Zap} tip={t.tipACS} />
        <StatReadout label={t.statHeadshots} value={p.headshotPct} unit="%" Icon={Target} tip={t.tipHeadshots} />
        <StatReadout label={t.statAccuracy} value={p.accuracyPct} unit="%" Icon={Crosshair} tip={t.tipAccuracy} />
        <StatReadout label={t.statFirstBloods} value={p.firstBloods} Icon={Skull} tip={t.tipFirstBloods} />
        <StatReadout label={t.statFirstDeaths} value={p.firstDeaths} Icon={ShieldOff} tip={t.tipFirstDeaths} />
        <StatReadout label={t.statClutches} value={p.clutchesWon} unit={`/${p.clutchesPlayed}`} Icon={Flame} tip={t.tipClutches} />
      </div>

      {p.clutchSituations?.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mr-1">{t.matchClutchRoundsTitle}</span>
          {p.clutchSituations.map((c, ci) => (
            <span
              key={ci}
              className={`font-mono text-[10px] px-1.5 py-0.5 border ${
                c.won ? 'text-accent border-accent' : 'text-neutral-500 border-neutral-700 line-through'
              }`}
            >
              1v{c.v}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sc-card">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{t.matchDamageTitle}</span>
            <span className="font-mono text-lg text-accent leading-none">
              {p.avgDamageRound}
              <span className="text-[9px] text-neutral-500 ml-1">{t.matchDamagePerRound}</span>
            </span>
          </div>
          {[
            [t.matchDamageDealt, p.damageDealt, 'bg-accent'],
            [t.matchDamageReceived, p.damageReceived, 'bg-neutral-600'],
          ].map(([label, value, bar]) => (
            <div key={label} className="mb-1.5 last:mb-0">
              <div className="flex justify-between text-[10px] font-body text-neutral-400 mb-0.5">
                <span>{label}</span>
                <span className="font-mono text-neutral-300">{value}</span>
              </div>
              <div className="sc-track h-1.5 overflow-hidden">
                <div
                  className={`${bar} h-full`}
                  style={{ width: `${Math.round((value / Math.max(p.damageDealt, p.damageReceived, 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
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
          <div className="flex flex-col gap-2">
            {[
              [t.matchRivalNemesis, p.rivals.toughest, ShieldOff],
              [t.matchRivalPrey, p.rivals.favorite, Swords],
            ].map(([label, r, Icon]) => (
              <div key={label} className="flex items-center gap-2">
                {getAgentIcon(r.agent) && (
                  <img src={optimizeImg(getAgentIcon(r.agent), 32)} alt="" loading="lazy" className="val-icon w-7 h-7 rounded-full object-cover shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-neutral-500 font-body">
                    <Icon size={10} className="shrink-0" /> {label}
                  </div>
                  <div className="text-xs font-body text-neutral-300 truncate">{r.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-xs">
                    <span className="text-neutral-400">{r.theyKilledYou}</span>
                    <span className="text-neutral-600"> – </span>
                    <span className="text-accent">{r.youKilledThem}</span>
                  </div>
                  <div className="text-[8px] text-neutral-600 font-body">{t.matchRivalDuelCaption}</div>
                </div>
              </div>
            ))}
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
  const diagnosis = getMatchDiagnosis(match, you);

  return (
    <div>
      {mapImage && (
        <div className="relative -mx-5 -mt-5 mb-4 h-28 overflow-hidden">
          <img src={optimizeImg(mapImage.splash, 768)} alt="" className="w-full h-full object-cover" />
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

      {diagnosis.length > 0 && (
        <div className="sc-card mb-3">
          <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-1.5">{t.matchDiagnosisTitle}</div>
          <ul className="flex flex-col gap-1">
            {diagnosis.map((d) => (
              <li key={d.key} className="text-xs font-body text-neutral-300 leading-relaxed">{fmt(t[d.key], d.params)}</li>
            ))}
          </ul>
        </div>
      )}

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
                    {getAgentIcon(p.agent) && <img src={optimizeImg(getAgentIcon(p.agent), 32)} alt="" loading="lazy" className="val-icon w-8 h-8 rounded-full object-cover" />}
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
