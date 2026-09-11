import { ArrowLeft, Star } from 'lucide-react';
import { getRankIcon, optimizeImg } from '../../data/valorantAssets.js';
import { navigate } from '../../lib/route.js';
import { rankRrDisplay } from '../../lib/rank.js';

// Read-only counterpart of the owner's PlayerHeader: identity + rank + RR + peak, and
// nothing editable (no avatar upload, no title cosmetic, no "last session" — those are
// account-private). Favourite ★ only shows when the player is a known public Scope
// profile (favourites are keyed by puuid).
export default function ProfilePlayerHeader({ identity, t, isFavorite, onToggleFavorite, canFavorite }) {
  const rankIcon = getRankIcon(identity.rank);
  const peakIcon = getRankIcon(identity.peakRank);
  const initial = (identity.name?.[0] ?? '?').toUpperCase();
  const rrView = rankRrDisplay(identity.rank, identity.rr);

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mb-3"
      >
        <ArrowLeft size={12} /> {t.profilePageBack}
      </button>

      <div className="relative border border-neutral-800 bg-neutral-950 px-6 py-5 overflow-hidden">
        <div className="relative flex items-center gap-5 flex-wrap sm:flex-nowrap">
          {rankIcon && <img src={optimizeImg(rankIcon, 96)} alt="" className="w-20 h-20 shrink-0 self-center" />}

          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-10 h-10 shrink-0 bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-bold text-lg text-accent">
                {initial}
              </span>
              <span className="font-display text-2xl sm:text-3xl font-bold text-white leading-none">
                {identity.name}<span className="text-neutral-600">#{identity.tag}</span>
              </span>
              {canFavorite && (
                <button
                  onClick={onToggleFavorite}
                  className={`w-8 h-8 flex items-center justify-center border shrink-0 transition-colors ${
                    isFavorite ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-accent'
                  }`}
                  aria-label={isFavorite ? t.removeFavorite : t.addFavorite}
                  title={isFavorite ? t.removeFavorite : t.addFavorite}
                >
                  <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            <div className="font-display text-xl font-bold text-accent leading-none mt-2">{identity.rank}</div>
            {rrView.barPct != null && (
              <div className="sc-track h-2 w-full max-w-sm overflow-hidden mt-2.5">
                <div className="sc-fill h-full" style={{ width: `${rrView.barPct}%` }} />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              {rrView.rr != null && (
                <span className="font-mono text-xs text-neutral-300">
                  {rrView.rr} RR
                  {rrView.goal != null && <span className="text-neutral-600"> / {rrView.goal}</span>}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-600">
                {t.peakRankLabel}
                {peakIcon && <img src={optimizeImg(peakIcon, 24)} alt="" className="val-icon w-5 h-5" />}
                <span className="text-neutral-400">
                  {identity.peakRank}
                  {identity.peakRr != null && <span className="text-neutral-600"> — {identity.peakRr} RR</span>}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
