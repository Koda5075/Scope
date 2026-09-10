import { ArrowLeft, Star, Swords, Crosshair, Target, Zap } from 'lucide-react';
import StatReadout from './StatReadout.jsx';
import Avatar from './Avatar.jsx';
import { getRankIcon, optimizeImg } from '../data/valorantAssets.js';
import { getPlayerProfile } from '../data/mockData.js';
import { gamesLabel } from '../i18n/translations.js';

function SectionLabel({ children }) {
  return <div className="font-display text-xs tracking-wide uppercase text-neutral-400 mb-2">{children}</div>;
}

function BreakdownRow({ name, games, wr, t }) {
  return (
    <div className="flex items-center justify-between border border-neutral-800 px-3 py-2 text-xs font-body">
      <span className="text-neutral-200">{name}</span>
      <span className="flex items-center gap-3 shrink-0">
        <span className="text-neutral-600">{games} {gamesLabel(games, t)}</span>
        <span className="font-mono text-neutral-400">{wr}% {t.wrShort}</span>
      </span>
    </div>
  );
}

export default function PlayerFullProfile({ player, isFavorite, onToggleFavorite, onBack, onCompare, t }) {
  const rankIcon = getRankIcon(player.rank);
  const profile = getPlayerProfile(player);

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mb-4"
      >
        <ArrowLeft size={12} /> {t.backToProfile}
      </button>

      {/* pr-8 keeps the favorite button clear of the modal's absolute close (X) button */}
      <div className="flex items-start justify-between gap-3 mb-5 pr-8">
        <div className="flex items-center gap-3">
          <Avatar name={player.name} size={52} />
          <div>
            <div className="font-display text-lg font-semibold text-white">
              {player.name}
              <span className="text-neutral-600">#{player.tag}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-body mt-1.5">
              {rankIcon && <img src={optimizeImg(rankIcon, 24)} alt="" className="val-icon w-6 h-6" />}
              {player.rank} · {t.peakRankLabel} {player.peakRank}
            </div>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(player.puuid)}
          className={`w-8 h-8 flex items-center justify-center border shrink-0 transition-colors ${
            isFavorite ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-accent'
          }`}
          aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
          title={isFavorite ? t.removeFavorite : t.addFavorite}
        >
          <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatReadout label={t.statKDA} value={player.kda} Icon={Swords} tip={t.tipKDA} />
        <StatReadout label={t.statAccuracy} value={player.accuracy} unit="%" Icon={Crosshair} tip={t.tipAccuracy} />
        <StatReadout label={t.statHeadshots} value={player.headshots} unit="%" Icon={Target} tip={t.tipHeadshots} />
        <StatReadout label={t.statACS} value={player.acs} Icon={Zap} tip={t.tipACS} />
      </div>

      {profile && (
        <>
          <div className="mb-6">
            <SectionLabel>{t.profileRecentForm}</SectionLabel>
            <div className="flex flex-wrap items-center gap-1 mb-2">
              {profile.recentForm.map((m, i) => (
                <span
                  key={i}
                  title={`${m.agent} · ${m.map} · ${m.k}/${m.d}/${m.a}`}
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-display font-bold ${
                    m.win ? 'bg-accent/15 text-accent' : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {m.win ? t.winShort : t.lossShort}
                </span>
              ))}
            </div>
            <div className="text-[11px] font-body text-neutral-500">
              {t.profileFormSummary
                .replace('{wins}', profile.wins)
                .replace('{total}', profile.matchesTracked)
                .replace('{wr}', profile.winrate)}
            </div>
          </div>

          <div className="border border-neutral-800 divide-y divide-neutral-900 mb-6">
            {profile.recentForm.slice(0, 8).map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs font-body">
                <span className={`w-1 h-8 shrink-0 ${m.win ? 'bg-accent' : 'bg-red-500'}`} />
                <span className="w-16 shrink-0 text-neutral-200 truncate">{m.agent}</span>
                <span className="w-16 shrink-0 text-neutral-500 truncate">{m.map}</span>
                <span className="text-neutral-400 font-mono">{m.k}/{m.d}/{m.a}</span>
                <span className="ml-auto text-neutral-500 font-mono">{m.acs} {t.statACS}</span>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <SectionLabel>{t.profileTopAgents}</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {profile.topAgents.map((a) => (
                  <BreakdownRow key={a.name} name={a.name} games={a.games} wr={a.wr} t={t} />
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>{t.profileTopMaps}</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {profile.topMaps.map((mp) => (
                  <BreakdownRow key={mp.name} name={mp.name} games={mp.games} wr={mp.wr} t={t} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <button
        onClick={onCompare}
        className="w-full bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
      >
        {t.compareWithMe}
      </button>

      {profile && <p className="text-[11px] text-neutral-600 font-body mt-3">{t.profileSnapshotNote}</p>}
    </div>
  );
}
