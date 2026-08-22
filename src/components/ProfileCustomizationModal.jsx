import { useRef, useState } from 'react';
import { Upload, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import Avatar from './Avatar.jsx';

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
// rejection path stays demonstrable without special input.
function simulateModeration() {
  return new Promise((resolve) => setTimeout(() => resolve(Math.random() >= 0.15), 1300));
}

export default function ProfileCustomizationModal({ avatarUrl, onAvatarChange, t }) {
  const [status, setStatus] = useState('idle'); // idle | uploading | moderating | rejected
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES) {
      setPreview(null);
      setStatus('rejected');
      return;
    }

    const dataUrl = await readAsDataURL(file);
    setPreview(dataUrl);
    setStatus('uploading');
    await new Promise((r) => setTimeout(r, 600));
    setStatus('moderating');
    const approved = await simulateModeration();

    if (approved) {
      onAvatarChange(dataUrl);
      setStatus('idle');
      setPreview(null);
    } else {
      setPreview(null);
      setStatus('rejected');
    }
  }

  return (
    <div>
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4">{t.profileCustomizationTitle}</div>

      <div className="flex items-center gap-4 mb-4">
        <Avatar name="KAITO" photoUrl={preview || avatarUrl} size={64} />
        <div className="flex flex-col gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={status === 'uploading' || status === 'moderating'}
            className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Upload size={12} /> {t.uploadPhoto}
          </button>
          {avatarUrl && status === 'idle' && (
            <button
              onClick={() => onAvatarChange(null)}
              className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
            >
              <Trash2 size={11} /> {t.removePhoto}
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {(status === 'uploading' || status === 'moderating') && (
        <div className="flex items-center gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          <Loader2 size={14} className="animate-spin text-accent" />
          {status === 'uploading' ? t.uploadingStatus : t.moderatingStatus}
        </div>
      )}

      {status === 'rejected' && (
        <div className="flex items-start gap-2 text-xs font-body text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
          <AlertTriangle size={14} className="text-accent shrink-0 mt-0.5" />
          <span>{t.moderationRejected}</span>
        </div>
      )}

      <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.moderationDisclaimer}</p>
    </div>
  );
}
