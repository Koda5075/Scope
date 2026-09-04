import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getRankIcon, optimizeImg } from '../data/valorantAssets.js';
import { getPlayerTitleLabel, getSprayIcon } from '../data/valorantCosmetics.js';
import Modal from './Modal.jsx';
import RankPyramid from './RankPyramid.jsx';

const CURRENT_RANK = 'DIAMOND 2';

export default function PlayerHeader({ t, lang, rrCurrent, rrGoal, peakRank, avatarUrl, nickname, bannerUrl, titleId, bannerSpray, bannerFocus, onAvatarClick, isPremium, onSeePlans }) {
  const rankIcon = getRankIcon(CURRENT_RANK);
  const peakRankIcon = getRankIcon(peakRank);
  const [showRankInfo, setShowRankInfo] = useState(false);
  // Relative phrasing ("N min ago") rather than a baked-in clock time — always true
  // regardless of when the demo is actually viewed, unlike a hardcoded "9:04 PM" that
  // could read as a future time. Picked once per mount, not on every render.
  const [minutesAgo] = useState(() => 5 + Math.floor(Math.random() * 55));

  const titleLabel = getPlayerTitleLabel(titleId, lang);
  const sprayIcon = bannerSpray ? getSprayIcon(bannerSpray.id) : undefined;

  return (
    <div
      className={`mb-7 relative border border-neutral-800 bg-neutral-950 px-6 py-5 overflow-hidden ${
        bannerUrl ? 'sc-rank-banner' : ''
      }`}
    >
      {bannerUrl && (
        <>
          <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: `${(bannerFocus?.x ?? 0.5) * 100}% ${(bannerFocus?.y ?? 0.5) * 100}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/60" />
        </>
      )}
      {sprayIcon && (
        <img
          src={sprayIcon}
          alt=""
          className="absolute w-16 h-16 object-contain pointer-events-none select-none -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
          style={{ left: `${(bannerSpray.x ?? 0.5) * 100}%`, top: `${(bannerSpray.y ?? 0.5) * 100}%` }}
        />
      )}
      {/* items-center: the avatar/title/last-session block is shorter than the rank
          block (label + huge rank + RR bar + peak line), so it's centred against the
          row's full height rather than pinned to the top with dead space below. The
          rank icon likewise sits centred against its own text column. */}
      <div className="relative flex items-center gap-5 flex-wrap sm:flex-nowrap">
        {rankIcon && <img src={optimizeImg(rankIcon, 96)} alt="" className="w-24 h-24 shrink-0 self-center" />}
        <div className="flex-1 min-w-[220px]">
          <span className="block text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-body mb-1">{t.rank}</span>
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
              {peakRankIcon && <img src={optimizeImg(peakRankIcon, 24)} alt="" className="val-icon w-5 h-5" />}
              <span className="text-neutral-400">{peakRank}</span>
            </span>
          </div>
          <button
            onClick={() => setShowRankInfo(true)}
            className="flex items-center gap-1 mt-2 text-[11px] font-display font-bold uppercase tracking-wide text-accent hover:underline"
          >
            {t.rankPyramidCta}
            <ChevronRight size={12} />
          </button>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-neutral-800 shrink-0" />

        <button
          onClick={onAvatarClick}
          className="flex items-center gap-3 shrink-0 text-left group self-center"
          aria-label={t.editProfile}
          title={t.editProfile}
        >
          <span className="w-16 h-16 shrink-0 bg-neutral-900 border border-neutral-700 group-hover:border-accent flex items-center justify-center font-display font-bold text-2xl text-accent overflow-hidden transition-colors">
            {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : 'K'}
          </span>
          <span className="flex flex-col items-start gap-1">
            <span className="font-display text-lg font-semibold tracking-wide text-white leading-tight">
              {nickname?.trim() || 'KAITO'}<span className="text-neutral-600">#EUW1</span>
            </span>
            {titleLabel && (
              <span className="px-2 py-0.5 text-[10px] font-display font-semibold uppercase tracking-[0.14em] text-accent bg-accent/10 border border-accent/40">
                {titleLabel}
              </span>
            )}
            <span className="text-xs text-neutral-500 font-body">{t.lastSession.replace('{n}', minutesAgo)}</span>
          </span>
        </button>
      </div>

      {showRankInfo && (
        <Modal onClose={() => setShowRankInfo(false)} closeLabel={t.close} size="lg">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.rankPyramidTitle}</span>
          <RankPyramid t={t} isPremium={isPremium} onSeePlans={onSeePlans} />
        </Modal>
      )}
    </div>
  );
}
