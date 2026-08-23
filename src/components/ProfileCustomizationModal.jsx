import { useRef, useState } from 'react';
import { Upload, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { getAllMapImages } from '../data/valorantAssets.js';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

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

export default function ProfileCustomizationModal({ avatarUrl, onAvatarChange, bannerUrl, onBannerChange, t }) {
  const [avatarStatus, setAvatarStatus] = useState('idle'); // idle | uploading | moderating | rejected
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [bannerStatus, setBannerStatus] = useState('idle');
  const [bannerPreview, setBannerPreview] = useState(null);
  const bannerInputRef = useRef(null);

  const presetBanners = getAllMapImages();

  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

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
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4">{t.profileCustomizationTitle}</div>

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

      <p className="text-[11px] text-neutral-600 font-body mt-3 mb-6 leading-relaxed">{t.moderationDisclaimer}</p>

      <div className="border-t border-neutral-800 pt-5">
        <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3">{t.bannerSectionTitle}</div>

        {bannerUrl && (
          <div className="relative h-16 mb-3 overflow-hidden border border-neutral-800">
            <img src={bannerPreview || bannerUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.bannerGalleryLabel}</div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {presetBanners.map((banner) => (
            <button
              key={banner.name}
              onClick={() => onBannerChange(banner.splash)}
              className={`shrink-0 w-20 h-11 overflow-hidden border-2 transition-colors ${
                bannerUrl === banner.splash ? 'border-accent' : 'border-transparent hover:border-neutral-600'
              }`}
              title={banner.name}
            >
              <img src={banner.splash} alt={banner.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

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

        <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.bannerModerationDisclaimer}</p>
      </div>
    </div>
  );
}
