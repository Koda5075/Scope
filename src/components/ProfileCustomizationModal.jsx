import { useRef, useState } from 'react';
import { Upload, Trash2, Loader2, AlertTriangle, EyeOff } from 'lucide-react';
import Avatar from './Avatar.jsx';
import PremiumLock from './PremiumLock.jsx';
import { getAllPlayerCards } from '../data/valorantAssets.js';
import {
  DEFAULT_TITLE_ID,
  getAllPlayerTitles,
  getPlayerTitleLabel,
  getAllSprays,
} from '../data/valorantCosmetics.js';

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

// Free drag of the spray inside the banner preview: x/y are stored as 0..1 fractions of
// the box so they survive the preview and the real header being different sizes. Pointer
// capture keeps the drag alive if the cursor briefly leaves the image.
function BannerSprayEditor({ bannerUrl, sprays, spray, onSprayChange, t }) {
  const boxRef = useRef(null);
  const draggingRef = useRef(false);
  const pos = { x: spray?.x ?? 0.5, y: spray?.y ?? 0.5 };

  function moveTo(clientX, clientY) {
    const box = boxRef.current;
    if (!box || !spray) return;
    const r = box.getBoundingClientRect();
    onSprayChange({ ...spray, x: clamp01((clientX - r.left) / r.width), y: clamp01((clientY - r.top) / r.height) });
  }

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        <button
          onClick={() => onSprayChange(null)}
          className={`shrink-0 h-14 px-3 text-[11px] font-body border-2 transition-colors ${
            !spray ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
          }`}
        >
          {t.sprayNoneOption}
        </button>
        {sprays.map((sp) => (
          <button
            key={sp.id}
            onClick={() => onSprayChange({ id: sp.id, x: spray?.x ?? 0.5, y: spray?.y ?? 0.5 })}
            title={sp.label}
            className={`shrink-0 w-14 h-14 p-1 bg-neutral-950 border-2 transition-colors ${
              spray?.id === sp.id ? 'border-accent' : 'border-neutral-800 hover:border-neutral-600'
            }`}
          >
            <img src={sp.icon} alt={sp.label} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>

      <div
        ref={boxRef}
        className="relative h-24 mb-2 overflow-hidden border border-neutral-800 bg-neutral-950 select-none"
        onPointerMove={(e) => draggingRef.current && moveTo(e.clientX, e.clientY)}
        onPointerUp={() => (draggingRef.current = false)}
        onPointerLeave={() => (draggingRef.current = false)}
      >
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-600 font-body uppercase tracking-widest">
            {t.bannerSectionTitle}
          </div>
        )}
        {spray && (
          <img
            src={sprays.find((s) => s.id === spray.id)?.icon}
            alt=""
            draggable={false}
            onPointerDown={(e) => {
              draggingRef.current = true;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              moveTo(e.clientX, e.clientY);
            }}
            className="absolute w-12 h-12 object-contain -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing drop-shadow-lg"
            style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, touchAction: 'none' }}
          />
        )}
      </div>
      {spray && (
        <button
          onClick={() => onSprayChange({ ...spray, x: 0.5, y: 0.5 })}
          className="text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mb-1"
        >
          {t.sprayCenterButton}
        </button>
      )}
    </>
  );
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Client-side mirror of the real limit enforced server-side in moderate-avatar (see
// try_record_avatar_upload) — this one is purely cosmetic (anyone could clear
// localStorage), the real enforcement lives in the Edge Function. This just lets the
// demo actually show what a rate-limited player sees, combined across avatar + banner
// uploads since both would hit the same "stop spamming uploads" concern in practice.
const MAX_UPLOADS_PER_DAY = 5;
const UPLOAD_LOG_KEY = 'scope-upload-log';

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
// Scope-provided art, not user content. Moderation stays on regardless of who can see
// the result (minimal safety net against illegal content), even though only the
// uploader themself will ever see it.
function simulateModeration() {
  return new Promise((resolve) => setTimeout(() => resolve(Math.random() >= 0.15), 1300));
}

function BannerGallery({ presetBanners, bannerUrl, onBannerChange, t }) {
  return (
    <>
      <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.bannerGalleryLabel}</div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {presetBanners.map((banner) => (
          <button
            key={banner.name}
            onClick={() => onBannerChange(banner.url)}
            className={`shrink-0 w-20 h-11 overflow-hidden border-2 transition-colors ${
              bannerUrl === banner.url ? 'border-accent' : 'border-transparent hover:border-neutral-600'
            }`}
            title={banner.name}
          >
            <img src={banner.url} alt={banner.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </>
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
  t,
}) {
  const [avatarStatus, setAvatarStatus] = useState('idle'); // idle | uploading | moderating | rejected
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [bannerStatus, setBannerStatus] = useState('idle');
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = useRef(null);

  const presetBanners = getAllPlayerCards();
  const allTitles = getAllPlayerTitles(lang);
  const allSprays = getAllSprays(lang);
  const currentTitleLabel = getPlayerTitleLabel(titleId, lang);

  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (getUploadsToday() >= MAX_UPLOADS_PER_DAY) {
      setAvatarPreview(null);
      setAvatarStatus('rate_limited');
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      setAvatarPreview(null);
      setAvatarStatus('rejected');
      return;
    }

    const dataUrl = await readAsDataURL(file);
    setAvatarPreview(dataUrl);
    setAvatarStatus('uploading');
    await new Promise((r) => setTimeout(r, 600));
    setAvatarStatus('moderating');
    recordUpload();
    const approved = await simulateModeration();

    if (approved) {
      onAvatarChange(dataUrl);
      setAvatarStatus('idle');
      setAvatarPreview(null);
    } else {
      setAvatarPreview(null);
      setAvatarStatus('rejected');
    }
  }

  async function handleBannerFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (getUploadsToday() >= MAX_UPLOADS_PER_DAY) {
      setBannerPreview(null);
      setBannerStatus('rate_limited');
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      setBannerPreview(null);
      setBannerStatus('rejected');
      return;
    }

    const dataUrl = await readAsDataURL(file);
    setBannerPreview(dataUrl);
    setBannerStatus('uploading');
    await new Promise((r) => setTimeout(r, 600));
    setBannerStatus('moderating');
    recordUpload();
    const approved = await simulateModeration();

    if (approved) {
      onBannerChange(dataUrl);
      setBannerStatus('idle');
      setBannerPreview(null);
    } else {
      setBannerPreview(null);
      setBannerStatus('rejected');
    }
  }

  return (
    <div>
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-2">{t.profileCustomizationTitle}</div>
      <p className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-body mb-4">
        <EyeOff size={12} className="text-neutral-600 shrink-0" /> {t.profilePrivacyNote}
      </p>

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

      {(avatarStatus === 'uploading' || avatarStatus === 'moderating') && (
        <div className="flex items-center gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          <Loader2 size={14} className="animate-spin text-accent" />
          {avatarStatus === 'uploading' ? t.uploadingStatus : t.moderatingStatus}
        </div>
      )}

      {avatarStatus === 'rejected' && (
        <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
          <span>{t.moderationRejected}</span>
        </div>
      )}

      {avatarStatus === 'rate_limited' && (
        <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
          <span>{t.uploadRateLimited}</span>
        </div>
      )}

      <p className="text-[11px] text-neutral-600 font-body mt-3 mb-6 leading-relaxed">{t.moderationDisclaimer}</p>

      <div className="border-t border-neutral-800 pt-5 mb-6">
        <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1">{t.titleSectionTitle}</div>
        <p className="text-[11px] text-neutral-500 font-body mb-3">{t.titleSectionDesc}</p>

        <div className="mb-2 font-display text-sm tracking-wide text-white">
          KAITO<span className="text-neutral-600">#EUW1</span>
          {currentTitleLabel && <span className="block text-[11px] text-accent/90 font-body leading-tight">{currentTitleLabel}</span>}
        </div>

        {isPremium ? (
          <select
            value={titleId ?? DEFAULT_TITLE_ID}
            onChange={(e) => onTitleChange(e.target.value)}
            aria-label={t.titleSectionTitle}
            className="w-full bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-2 focus:border-accent outline-none"
          >
            <option value={DEFAULT_TITLE_ID}>{t.titleNoneOption}</option>
            {allTitles.map((tt) => (
              <option key={tt.id} value={tt.id}>{tt.label}</option>
            ))}
          </select>
        ) : (
          <PremiumLock title={t.unlock} description={t.titleLockDesc} ctaLabel={t.seePlans} onCtaClick={onSeePlans}>
            <div className="h-9 w-full bg-neutral-900 border border-neutral-800" />
          </PremiumLock>
        )}
      </div>

      <div className="border-t border-neutral-800 pt-5">
        <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3">{t.bannerSectionTitle}</div>

        {isPremium ? (
          <>
            {bannerUrl && (
              <div className="relative h-16 mb-3 overflow-hidden border border-neutral-800">
                <img src={bannerPreview || bannerUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <BannerGallery presetBanners={presetBanners} bannerUrl={bannerUrl} onBannerChange={onBannerChange} t={t} />

            <div className="flex items-center gap-3">
              <button
                onClick={() => bannerInputRef.current?.click()}
                disabled={bannerStatus === 'uploading' || bannerStatus === 'moderating'}
                className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Upload size={12} /> {t.uploadBanner}
              </button>
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

            {(bannerStatus === 'uploading' || bannerStatus === 'moderating') && (
              <div className="flex items-center gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
                <Loader2 size={14} className="animate-spin text-accent" />
                {bannerStatus === 'uploading' ? t.uploadingStatus : t.bannerModeratingStatus}
              </div>
            )}

            {bannerStatus === 'rejected' && (
              <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
                <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
                <span>{t.bannerModerationRejected}</span>
              </div>
            )}

            {bannerStatus === 'rate_limited' && (
              <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5 mt-3">
                <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
                <span>{t.uploadRateLimited}</span>
              </div>
            )}

            <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.bannerModerationDisclaimer}</p>

            <div className="mt-5">
              <div className="font-display text-xs tracking-wide uppercase text-neutral-400 mb-1">{t.spraySectionTitle}</div>
              <p className="text-[11px] text-neutral-500 font-body mb-3">{t.spraySectionDesc}</p>
              <BannerSprayEditor
                bannerUrl={bannerPreview || bannerUrl}
                sprays={allSprays}
                spray={bannerSpray}
                onSprayChange={onBannerSprayChange}
                t={t}
              />
            </div>
          </>
        ) : (
          <PremiumLock title={t.unlock} description={t.bannerLockDesc} ctaLabel={t.seePlans} onCtaClick={onSeePlans}>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {presetBanners.slice(0, 4).map((banner) => (
                <div key={banner.name} className="shrink-0 w-20 h-11 overflow-hidden border-2 border-transparent">
                  <img src={banner.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="h-9 w-32 bg-accent" />
          </PremiumLock>
        )}
      </div>
    </div>
  );
}
