import { getRankIcon } from '../data/valorantAssets.js';

const CURRENT_RANK = 'DIAMOND 2';

export default function PlayerHeader({ t, rrCurrent, rrGoal, peakRank, avatarUrl, onAvatarClick }) {
  const rankIcon = getRankIcon(CURRENT_RANK);
  const peakRankIcon = getRankIcon(peakRank);

  return (
    <div className="mb-7">
      <div className="border border-neutral-800 bg-neutral-950 px-6 py-5 mb-4">
        <div className="flex items-center gap-5">
          {rankIcon && <img src={rankIcon} alt="" className="val-icon w-24 h-24 shrink-0" />}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-body mb-1">{t.rank}</div>
            <div className="font-display text-4xl sm:text-5xl font-bold text-accent leading-none">{CURRENT_RANK}</div>
            <div className="sc-track h-2.5 w-full max-w-sm overflow-hidden mt-3">
              <div className="sc-fill h-full" style={{ width: `${rrCurrent}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="font-mono text-xs text-neutral-300">
                {rrCurrent} RR <span className="text-neutral-600">/ {rrGoal}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-600">
                {t.peakRankLabel}
                {peakRankIcon && <img src={peakRankIcon} alt="" className="val-icon w-5 h-5" />}
                <span className="text-neutral-400">{peakRank}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onAvatarClick}
          className="w-10 h-10 shrink-0 bg-neutral-900 border border-neutral-700 hover:border-accent flex items-center justify-center font-display font-bold text-base text-accent overflow-hidden transition-colors"
          aria-label={t.editProfile}
          title={t.editProfile}
        >
          {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : 'K'}
        </button>
        <div>
          <div className="font-display text-base font-semibold tracking-wide text-white">
            KAITO<span className="text-neutral-600">#EUW1</span>
          </div>
          <div className="text-xs text-neutral-500 font-body">{t.lastSession}</div>
        </div>
      </div>
    </div>
  );
}
