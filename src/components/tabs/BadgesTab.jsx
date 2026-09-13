import { useState } from 'react';
import { Lock, Share2, Check } from 'lucide-react';
import Card from '../Card.jsx';
import AdSlot from '../AdSlot.jsx';
import { badgeDefs, getBadgeProgress, isBadgeUnlocked } from '../../data/mockData.js';
import { renderShareCard, downloadBlob, copyBlobToClipboard } from '../../lib/shareImage.js';

const FILTERS = ['all', 'unlocked', 'inProgress', 'locked'];
const FILTER_LABEL_KEY = { all: 'All', unlocked: 'Unlocked', inProgress: 'InProgress', locked: 'Locked' };

// A tiered badge that's unlocked but hasn't hit its top tier yet — distinct from
// "unlocked", which also includes single-state badges and already-maxed tiered ones.
function isInProgress(b) {
  const progress = getBadgeProgress(b);
  return !!progress && progress.tierIndex >= 0 && !progress.isMaxed;
}

// `badges` defaults to the owner's own roster; the public player-profile page passes a
// per-player clone (same shape, re-rolled progress). `showAds` lets that page drop the
// ad slot.
// "Unlocked" (for the header count and the filter) means fully achieved: a single-state
// badge with its flag set, or a tiered badge that's already hit its top tier. A tiered
// badge sitting between Bronze and Diamond is still climbing, so it belongs under "In
// Progress" instead — otherwise "Unlocked" and "All minus Locked" are the same list,
// which is what made the header count (and the filter) count in-progress badges as done.
function isFullyUnlocked(b) {
  return isBadgeUnlocked(b) && !isInProgress(b);
}

const SORTS = ['default', 'recent'];

export default function BadgesTab({ t, accent, nickname, isPremium, badges = badgeDefs, showAds = true }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [sharedId, setSharedId] = useState(null);

  async function handleShareBadge(b, info, progress) {
    const blob = await renderShareCard({
      accent,
      rank: info.label,
      playerName: `${nickname?.trim() || 'KAITO'}#EUW1`,
      stats: progress
        ? [{ label: t.tierNext.replace(':', ''), value: `${progress.value}/${progress.nextThreshold ?? progress.value}` }]
        : [{ label: t.badgeUnlockedLabel, value: b.daysAgo === 0 ? t.alertToday : `${b.daysAgo}${t.daysAgoSuffix}` }],
      footerText: info.sub,
    });
    downloadBlob(blob, `scope-badge-${b.id}.png`);
    await copyBlobToClipboard(blob);
    setSharedId(b.id);
    setTimeout(() => setSharedId(null), 1800);
  }
  const unlockedCount = badges.filter(isFullyUnlocked).length;
  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return isFullyUnlocked(b);
    if (filter === 'inProgress') return isInProgress(b);
    if (filter === 'locked') return !isBadgeUnlocked(b);
    return true;
  });
  // "Most recent" only has a real date to sort by for single-state badges (they carry
  // `daysAgo`); tiered badges have no unlock timestamp in the mock dataset, so they sort
  // after every dated badge rather than getting a fabricated date. Locked badges (no
  // date at all, dated or not) sort last. Ties keep the array's original relative order
  // (a plain numeric sort is already stable in every engine this ships to).
  const sortRank = (b) => {
    if (!isBadgeUnlocked(b)) return Infinity;
    return b.daysAgo ?? Number.MAX_SAFE_INTEGER;
  };
  const visibleBadges = sortBy === 'recent' ? [...filteredBadges].sort((a, b) => sortRank(a) - sortRank(b)) : filteredBadges;

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">
            {unlockedCount}/{badges.length} {t.badgesUnlockedLabel}
          </span>
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                  filter === f
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {t[`badgesFilter${FILTER_LABEL_KEY[f]}`]}
              </button>
            ))}
            <span className="w-px bg-neutral-800 mx-1" />
            {SORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2 py-1 text-[10px] font-display uppercase tracking-wide border transition-colors ${
                  sortBy === s
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                }`}
              >
                {t[`badgesSort${s === 'default' ? 'Default' : 'Recent'}`]}
              </button>
            ))}
          </div>
        </div>
        <div className="sc-track h-1.5 overflow-hidden">
          <div className="sc-fill h-full transition-all" style={{ width: `${(unlockedCount / badges.length) * 100}%` }} />
        </div>
      </Card>

      {visibleBadges.length === 0 && (
        <div className="text-xs font-body text-neutral-500 py-2">{t.badgesNoneForFilter}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleBadges.map((b) => {
          const Icon = b.icon;
          const info = t.badges[b.id];
          const progress = getBadgeProgress(b);
          const unlocked = isBadgeUnlocked(b);
          const glowColor = progress ? progress.tierColor : 'var(--accent)';
          // Secret badges keep their name/description hidden until unlocked, for the
          // surprise-reveal effect — everything else about the card (locked styling,
          // lock icon) stays the same as a normal locked badge.
          const isHiddenSecret = b.secret && !unlocked;

          return (
            <Card
              key={b.id}
              className={unlocked ? '' : 'opacity-50'}
              style={
                unlocked
                  ? { borderLeftColor: glowColor, boxShadow: `0 0 20px -6px ${glowColor}`, background: `linear-gradient(135deg, ${glowColor}14, var(--sc-surface) 55%)` }
                  // The accent border means "active/unlocked" everywhere else on the site
                  // (sc-card's default) — a locked badge is the opposite of that, so it
                  // drops the accent left border entirely rather than just fading it via
                  // the opacity-50 on the whole card, which read as an inconsistency.
                  : { borderLeftColor: 'var(--sc-line)' }
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center shrink-0 relative rounded-full"
                  style={{
                    background: unlocked ? `${glowColor}26` : 'var(--sc-surface)',
                    border: `1.5px solid ${unlocked ? glowColor : 'var(--sc-line)'}`,
                    boxShadow: unlocked ? `0 0 10px -2px ${glowColor}` : 'none',
                  }}
                >
                  {isHiddenSecret ? <Lock size={16} className="text-neutral-600" /> : <Icon size={20} style={{ color: unlocked ? glowColor : '#737373' }} />}
                  {!unlocked && !isHiddenSecret && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-900 border border-neutral-700 flex items-center justify-center rounded-full">
                      <Lock size={9} className="text-neutral-400" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`font-display text-sm font-semibold ${unlocked ? 'text-white' : 'text-neutral-400'}`}>
                      {isHiddenSecret ? t.badgeSecretLabel : info.label}
                    </div>
                    {unlocked && progress && (
                      <span
                        className="font-display text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 shrink-0 rounded-sm"
                        style={{ color: '#0A0A0A', background: progress.tierColor }}
                      >
                        {t[progress.tierNameKey]}
                      </span>
                    )}
                    {!unlocked && (
                      <span className="font-display text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 shrink-0 text-neutral-500 border border-neutral-700">
                        {t.badgeLocked}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-body">{isHiddenSecret ? t.badgeSecretSub : info.sub}</div>
                </div>
              </div>

              <div className="mt-2.5 min-h-[26px]">
                {unlocked && progress ? (
                  <>
                    <div className="sc-track h-1.5 overflow-hidden">
                      <div className="h-full transition-all" style={{ width: `${progress.progressPct}%`, background: progress.tierColor }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="font-mono text-[10px] text-neutral-500">{progress.value}</span>
                      <span className="font-mono text-[10px] text-neutral-600">
                        {progress.isMaxed ? t.tierMaxed : `${t.tierNext} ${progress.nextThreshold}`}
                      </span>
                    </div>
                  </>
                ) : unlocked && b.daysAgo !== undefined ? (
                  <span className="font-mono text-[10px] text-neutral-500">
                    {t.badgeUnlockedLabel} · {b.daysAgo === 0 ? t.alertToday : `${b.daysAgo}${t.daysAgoSuffix}`}
                  </span>
                ) : null}
              </div>

              {unlocked && !isHiddenSecret && accent && (
                <button
                  onClick={() => handleShareBadge(b, info, progress)}
                  className="mt-2 flex items-center gap-1 text-[10px] font-body text-neutral-500 hover:text-accent transition-colors"
                >
                  {sharedId === b.id ? <Check size={11} className="text-accent" /> : <Share2 size={11} />}
                  {sharedId === b.id ? t.shareDownloaded : t.share}
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {showAds && <AdSlot t={t} isPremium={isPremium} variant="banner" />}
    </div>
  );
}
