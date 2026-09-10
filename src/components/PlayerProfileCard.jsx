import { Star, Swords, Crosshair, Target, Zap } from 'lucide-react';
import StatReadout from './StatReadout.jsx';
import Avatar from './Avatar.jsx';
import { getRankIcon, optimizeImg } from '../data/valorantAssets.js';

export default function PlayerProfileCard({ player, isFavorite, onToggleFavorite, onCompare, onViewFull, t }) {
  const rankIcon = getRankIcon(player.rank);

  return (
    <div>
      {/* pr-8 keeps the favorite button clear of the modal's absolute close (X) button */}
      <div className="flex items-start justify-between gap-3 mb-4 pr-8">
        <div className="flex items-center gap-3">
          <Avatar name={player.name} size={48} />
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatReadout label={t.statKDA} value={player.kda} Icon={Swords} tip={t.tipKDA} />
        <StatReadout label={t.statAccuracy} value={player.accuracy} unit="%" Icon={Crosshair} tip={t.tipAccuracy} />
        <StatReadout label={t.statHeadshots} value={player.headshots} unit="%" Icon={Target} tip={t.tipHeadshots} />
        <StatReadout label={t.statACS} value={player.acs} Icon={Zap} tip={t.tipACS} />
      </div>

      <div className="flex flex-col gap-2">
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="w-full border border-neutral-700 text-neutral-200 font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:border-accent hover:text-accent transition-colors"
          >
            {t.viewFullProfile}
          </button>
        )}
        <button
          onClick={onCompare}
          className="w-full bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
        >
          {t.compareWithMe}
        </button>
      </div>
    </div>
  );
}
