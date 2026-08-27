import { Lock, X } from 'lucide-react';
import {
  getBannerLocker,
  getSprayLocker,
  isCosmeticUnlocked,
  describeCosmeticLock,
} from '../data/cosmeticUnlocks.js';

// Side panel that opens to the left of the profile-customization modal. Browses the
// full banner / spray catalog as a scrollable grid; locked items stay visible (greyed)
// with their unlock requirement shown, matching the Badges tab. Selecting an unlocked
// item hands it back up via onBannerChange / onSprayPick — nothing here is ever
// persisted or shown outside the owner's own profile.
function LockerCell({ unlocked, selected, lockText, onSelect, children }) {
  return (
    <button
      type="button"
      onClick={unlocked ? onSelect : undefined}
      title={unlocked ? undefined : lockText}
      aria-disabled={!unlocked}
      className={`relative block w-full overflow-hidden border-2 transition-colors text-left ${
        selected ? 'border-accent' : 'border-neutral-800'
      } ${unlocked ? 'hover:border-neutral-500 cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <div className={unlocked ? '' : 'opacity-35 grayscale'}>{children}</div>
      {!unlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 px-1.5 text-center">
          <Lock size={12} className="text-neutral-200 shrink-0" />
          <span className="text-[9px] leading-tight font-body text-neutral-100">{lockText}</span>
        </div>
      )}
    </button>
  );
}

export default function CosmeticLocker({
  category,
  onCategoryChange,
  bannerUrl,
  onBannerChange,
  spray,
  onSprayPick,
  isPremium,
  lang,
  t,
  onClose,
}) {
  const banners = getBannerLocker();
  const sprays = getSprayLocker(lang);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-sm uppercase tracking-wide text-neutral-200">{t.lockerTitle}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.lockerClose}
          className="text-neutral-500 hover:text-accent transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        {[
          ['banner', t.lockerBanners],
          ['spray', t.lockerSprays],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onCategoryChange(key)}
            className={`px-3 py-1.5 text-xs font-display uppercase tracking-wide border transition-colors ${
              category === key
                ? 'border-accent text-accent bg-neutral-900'
                : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto pr-1 flex-1 min-h-0">
        {category === 'banner' ? (
          <div className="grid grid-cols-2 gap-2">
            <LockerCell unlocked selected={!bannerUrl} onSelect={() => onBannerChange(null)}>
              <div className="flex h-14 items-center justify-center text-[10px] uppercase tracking-widest text-neutral-500 font-body">
                {t.lockerNone}
              </div>
            </LockerCell>
            {banners.map((b) => {
              const unlocked = isCosmeticUnlocked(b.rule, isPremium);
              return (
                <LockerCell
                  key={b.name}
                  unlocked={unlocked}
                  selected={bannerUrl === b.url}
                  lockText={describeCosmeticLock(b.rule, t)}
                  onSelect={() => onBannerChange(b.url)}
                >
                  <img src={b.url} alt={b.name} loading="lazy" className="w-full h-14 object-cover" />
                </LockerCell>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <LockerCell unlocked selected={!spray} onSelect={() => onSprayPick(null)}>
              <div className="flex h-16 items-center justify-center text-[9px] uppercase tracking-widest text-neutral-500 font-body px-1 text-center">
                {t.lockerNone}
              </div>
            </LockerCell>
            {sprays.map((s) => {
              const unlocked = isCosmeticUnlocked(s.rule, isPremium);
              return (
                <LockerCell
                  key={s.id}
                  unlocked={unlocked}
                  selected={spray?.id === s.id}
                  lockText={describeCosmeticLock(s.rule, t)}
                  onSelect={() => onSprayPick(s.id)}
                >
                  <img src={s.icon} alt={s.label} loading="lazy" title={s.label} className="w-full h-16 object-contain bg-neutral-950 p-1" />
                </LockerCell>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
