import { Star, Swords, Crosshair, Target, Zap } from 'lucide-react';
import StatReadout from './StatReadout.jsx';
import { getRankIcon } from '../data/valorantAssets.js';

export default function PlayerProfileCard({ player, isFavorite, onToggleFavorite, onCompare, t }) {
  const rankIcon = getRankIcon(player.rank);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-display text-lg font-semibold text-white">
            {player.name}
            <span className="text-neutral-600">#{player.tag}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-body mt-1">
            {rankIcon && <img src={rankIcon} alt="" className="val-asset w-4 h-4 object-contain" />}
            {player.rank} · {t.peakRankLabel} {player.peakRank}
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatReadout label={t.statKDA} value={player.kda} Icon={Swords} />
        <StatReadout label={t.statAccuracy} value={player.accuracy} unit="%" Icon={Crosshair} />
        <StatReadout label={t.statHeadshots} value={player.headshots} unit="%" Icon={Target} />
        <StatReadout label={t.statACS} value={player.acs} Icon={Zap} />
      </div>

      <button
        onClick={onCompare}
        className="w-full bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
      >
        {t.compareWithMe}
      </button>
    </div>
  );
}
