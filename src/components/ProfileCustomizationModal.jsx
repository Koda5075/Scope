import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Loader2, AlertTriangle, EyeOff, X, Grid3x3 } from 'lucide-react';
import Avatar from './Avatar.jsx';
import PremiumLock from './PremiumLock.jsx';
import CosmeticLocker from './CosmeticLocker.jsx';
import {
  DEFAULT_TITLE_ID,
  getAllPlayerTitles,
  getPlayerTitleLabel,
  getSprayIcon,
} from '../data/valorantCosmetics.js';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Client-side mirror of the real limit enforced server-side in moderate-avatar (see
// try_record_avatar_upload) — this one is purely cosmetic (anyone could clear
// localStorage), the real enforcement lives in the Edge Function. This just lets the
// demo actually show what a rate-limited player sees, combined across avatar + banner
// uploads since both would hit the same "stop spamming uploads" concern in practice.
const MAX_UPLOADS_PER_DAY = 5;
const UPLOAD_LOG_KEY = 'scope-upload-log';

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function getUploadsToday() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const log = JSON.parse(localStorage.getItem(UPLOAD_LOG_KEY) ?? '{}');
    return log.date === today ? log.count : 0;
  } catch {
    return 0;
  }
}

function recordUpload() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const count = getUploadsToday() + 1;
    localStorage.setItem(UPLOAD_LOG_KEY, JSON.stringify({ date: today, count }));
  } catch {
    /* ignore */
  }
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Mock flow: the real path is upload to Supabase Storage's private `avatars` bucket,
// then the moderate-avatar Edge Function (Claude vision) approves/rejects before
// avatar_url is ever set — see supabase/functions/moderate-avatar. There's no real
// logged-in user yet to attach an upload to, so this simulates the same states
// (uploading → moderating → approved/rejected) client-side. Mostly-approve so the
// rejection path stays demonstrable without special input. The same simulated pipeline
// is reused for banner uploads below — presets skip it entirely since they're
// Scope-provided art, not user content.
function simulateModeration() {
  return new Promise((resolve) => setTimeout(() => resolve(Math.random() >= 0.15), 1300));
}

// Drag the spray freely inside the banner preview. The move/up listeners live on
// `window` for the whole drag (not just the preview box) so the spray keeps following
// the pointer even when it leaves the box, and `preventDefault` on the move + a scroll
// lock on the modal panel stop the page shifting under the finger mid-drag.
function BannerSprayEditor({ bannerUrl, sprayIcon, position, onPositionChange, onDragChange, t }) {
  const boxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const pos = { x: position?.x ?? 0.5, y: position?.y ?? 0.5 };

  function pointToFraction(clientX, clientY) {
    const box = boxRef.current;
    if (!box) return null;
    const r = box.getBoundingClientRect();
    return { x: clamp01((clientX - r.left) / r.width), y: clamp01((clientY - r.top) / r.height) };
  }

  useEffect(() => {
    onDragChange?.(dragging);
    if (!dragging) return undefined;

    const onMove = (e) => {
      e.preventDefault();
      const next = pointToFraction(e.clientX, e.clientY);
      if (next) onPositionChange(next);
    };
    const stop = () => setDragging(false);

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', onMove, { passive: false });
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <div
      ref={boxRef}
      className="relative h-24 overflow-hidden border border-neutral-800 bg-neutral-950 select-none"
    >
      {bannerUrl ? (
        <img src={bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-600 font-body uppercase tracking-widest">
          {t.bannerSectionTitle}
        </div>
      )}
      {sprayIcon && (
        <img
          src={sprayIcon}
          alt=""
          draggable={false}
          onPointerDown={(e) => {
            e.preventDefault();
            const next = pointToFraction(e.clientX, e.clientY);
            if (next) onPositionChange(next);
            setDragging(true);
          }}
          className="absolute w-12 h-12 object-contain -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing drop-shadow-lg"
          style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, touchAction: 'none' }}
        />
      )}
    </div>
  );
}

export default function ProfileCustomizationModal({
  avatarUrl,
  onAvatarChange,
  bannerUrl,
  onBannerChange,
  titleId,
  onTitleChange,
  bannerSpray,
  onBannerSprayChange,
  lang,
  isPremium,
  onSeePlans,
  onClose,
  t,
}) {
  const [avatarStatus, setAvatarStatus] = useState('idle'); // idle | uploading | moderating | rejected | rate_limited
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [bannerStatus, setBannerStatus] = useState('idle');
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = useRef(null);

  const [lockerOpen, setLockerOpen] = useState(false);
  const [lockerCategory, setLockerCategory] = useState('banner');
  const [dragLock, setDragLock] = useState(false);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  const allTitles = getAllPlayerTitles(lang);
  const currentTitleLabel = getPlayerTitleLabel(titleId, lang);
  const spraySelId = bannerSpray?.id ?? null;
  const sprayIcon = spraySelId ? getSprayIcon(spraySelId) : undefined;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (lockerOpen) setLockerOpen(false);
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, lockerOpen]);

  function openLocker(category) {
    if (lockerOpen && lockerCategory === category) {
      setLockerOpen(false);
    } else {
      setLockerCategory(category);
      setLockerOpen(true);
    }
  }

  function handleSprayPick(id) {
    if (!id) return onBannerSprayChange(null);
    onBannerSprayChange({ id, x: bannerSpray?.x ?? 0.5, y: bannerSpray?.y ?? 0.5 });
  }

  async function runUpload(file, setStatus, setPreview, onChange, moderatingStatus) {
    if (getUploadsToday() >= MAX_UPLOADS_PER_DAY) {
      setPreview(null);
      setStatus('rate_limited');
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      setPreview(null);
      setStatus('rejected');
      return;
    }
    const dataUrl = await readAsDataURL(file);
    setPreview(dataUrl);
    setStatus('uploading');
    await new Promise((r) => setTimeout(r, 600));
    setStatus(moderatingStatus);
    recordUpload();
    const approved = await simulateModeration();
    if (approved) {
      onChange(dataUrl);
      setStatus('idle');
      setPreview(null);
    } else {
      setPreview(null);
      setStatus('rejected');
    }
  }

  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await runUpload(file, setAvatarStatus, setAvatarPreview, onAvatarChange, 'moderating');
  }

  async function handleBannerFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await runUpload(file, setBannerStatus, setBannerPreview, onBannerChange, 'moderating');
  }

  const uploadNote = (status, moderatingLabel) => (
    <>
      {(status === 'uploading' || status === 'moderating') && (
        <div className="flex items-center gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
          <Loader2 size={14} className="animate-spin text-accent" />
          {status === 'uploading' ? t.uploadingStatus : moderatingLabel}
        </div>
      )}
      {status === 'rejected' && (
        <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
          <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
          <span>{moderatingLabel === t.bannerModeratingStatus ? t.bannerModerationRejected : t.moderationRejected}</span>
        </div>
      )}
      {status === 'rate_limited' && (
        <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
          <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
          <span>{t.uploadRateLimited}</span>
        </div>
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-stretch gap-3 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Locker — animates its width so [locker + modal] grows/shrinks as one centred block */}
        <div
          className={`shrink-0 self-stretch bg-[#0F0F0F] overflow-hidden transition-[width,opacity] duration-300 ease-out ${
            lockerOpen ? 'w-[300px] sm:w-[340px] opacity-100 border border-neutral-800' : 'w-0 opacity-0'
          }`}
        >
          <div className="h-full w-[300px] sm:w-[340px] p-4 flex flex-col">
            <CosmeticLocker
              category={lockerCategory}
              onCategoryChange={setLockerCategory}
              bannerUrl={bannerUrl}
              onBannerChange={onBannerChange}
              spray={bannerSpray}
              onSprayPick={handleSprayPick}
              isPremium={isPremium}
              lang={lang}
              t={t}
              onClose={() => setLockerOpen(false)}
            />
          </div>
        </div>

        {/* Main customization panel */}
        <div
          ref={panelRef}
          className={`w-[92vw] max-w-lg max-h-[90vh] bg-[#0F0F0F] border border-neutral-800 p-5 relative ${
            dragLock ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-3 right-3 text-neutral-500 hover:text-accent transition-colors"
            aria-label={t.close}
          >
            <X size={18} />
          </button>

          <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-2">{t.profileCustomizationTitle}</div>
          <p className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-body mb-4">
            <EyeOff size={12} className="text-neutral-600 shrink-0" /> {t.profilePrivacyNote}
          </p>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar name="KAITO" photoUrl={avatarPreview || avatarUrl} size={64} />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarStatus === 'uploading' || avatarStatus === 'moderating'}
                className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Upload size={12} /> {t.uploadPhoto}
              </button>
              {avatarUrl && avatarStatus === 'idle' && (
                <button
                  onClick={() => onAvatarChange(null)}
                  className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
                >
                  <Trash2 size={11} /> {t.removePhoto}
                </button>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarFileChange}
              className="hidden"
            />
          </div>
          {uploadNote(avatarStatus, t.moderatingStatus)}
          <p className="text-[11px] text-neutral-600 font-body mt-3 mb-6 leading-relaxed">{t.moderationDisclaimer}</p>

          {/* Player title */}
          <div className="border-t border-neutral-800 pt-5 mb-6">
            <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1">{t.titleSectionTitle}</div>
            <p className="text-[11px] text-neutral-500 font-body mb-3">{t.titleSectionDesc}</p>

            <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="font-display text-base tracking-wide text-white">
                KAITO<span className="text-neutral-600">#EUW1</span>
              </span>
              {currentTitleLabel && (
                <span className="px-2 py-0.5 text-[10px] font-display font-semibold uppercase tracking-[0.12em] text-accent bg-accent/10 border border-accent/40">
                  {currentTitleLabel}
                </span>
              )}
            </div>

            {isPremium ? (
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {[{ id: DEFAULT_TITLE_ID, label: t.titleNoneOption }, ...allTitles].map((tt) => {
                  const selected = (titleId ?? DEFAULT_TITLE_ID) === tt.id;
                  return (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() => onTitleChange(tt.id)}
                      className={`text-left px-3 py-2 text-xs font-body border-2 transition-colors ${
                        selected
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      {tt.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <PremiumLock title={t.unlock} description={t.titleLockDesc} ctaLabel={t.seePlans} onCtaClick={onSeePlans}>
                <div className="grid grid-cols-2 gap-2">
                  {allTitles.slice(0, 4).map((tt) => (
                    <div key={tt.id} className="px-3 py-2 text-xs font-body border-2 border-neutral-800 text-neutral-400">
                      {tt.label}
                    </div>
                  ))}
                </div>
              </PremiumLock>
            )}
          </div>

          {/* Banner */}
          <div className="border-t border-neutral-800 pt-5 mb-6">
            <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3">{t.bannerSectionTitle}</div>

            {(bannerPreview || bannerUrl) && (
              <div className="relative h-16 mb-3 overflow-hidden border border-neutral-800">
                <img src={bannerPreview || bannerUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openLocker('banner')}
                className={`flex items-center gap-1.5 font-display font-bold uppercase text-xs tracking-wide px-3 py-2 border transition-colors ${
                  lockerOpen && lockerCategory === 'banner'
                    ? 'border-accent text-accent'
                    : 'border-neutral-700 text-neutral-300 hover:border-accent hover:text-accent'
                }`}
              >
                <Grid3x3 size={12} /> {t.lockerOpen}
              </button>
              {isPremium && (
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={bannerStatus === 'uploading' || bannerStatus === 'moderating'}
                  className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Upload size={12} /> {t.uploadBanner}
                </button>
              )}
              {bannerUrl && bannerStatus === 'idle' && (
                <button
                  onClick={() => onBannerChange(null)}
                  className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
                >
                  <Trash2 size={11} /> {t.removeBanner}
                </button>
              )}
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleBannerFileChange}
              className="hidden"
            />

            {!isPremium && (
              <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.bannerLockDesc}</p>
            )}
            {isPremium && uploadNote(bannerStatus, t.bannerModeratingStatus)}
            {isPremium && (
              <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.bannerModerationDisclaimer}</p>
            )}
          </div>

          {/* Spray */}
          <div className="border-t border-neutral-800 pt-5">
            <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1">{t.spraySectionTitle}</div>
            <p className="text-[11px] text-neutral-500 font-body mb-3">{t.spraySectionDesc}</p>

            <button
              type="button"
              onClick={() => openLocker('spray')}
              className={`flex items-center gap-1.5 font-display font-bold uppercase text-xs tracking-wide px-3 py-2 border transition-colors mb-3 ${
                lockerOpen && lockerCategory === 'spray'
                  ? 'border-accent text-accent'
                  : 'border-neutral-700 text-neutral-300 hover:border-accent hover:text-accent'
              }`}
            >
              <Grid3x3 size={12} /> {t.lockerOpen}
            </button>

            {sprayIcon ? (
              <BannerSprayEditor
                bannerUrl={bannerPreview || bannerUrl}
                sprayIcon={sprayIcon}
                position={bannerSpray}
                onPositionChange={(p) => onBannerSprayChange({ ...bannerSpray, ...p })}
                onDragChange={setDragLock}
                t={t}
              />
            ) : (
              <p className="text-[11px] text-neutral-600 font-body leading-relaxed">{t.sprayPickHint}</p>
            )}
            {sprayIcon && (
              <button
                onClick={() => onBannerSprayChange({ ...bannerSpray, x: 0.5, y: 0.5 })}
                className="text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mt-2"
              >
                {t.sprayCenterButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
