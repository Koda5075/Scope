import { useState } from 'react';
import { UserPlus, Copy, Check, X } from 'lucide-react';
import Card from './Card.jsx';
import { inviteStats } from '../data/mockData.js';

const STORAGE_KEY = 'scope-invite-card-dismissed';

export default function InviteFriendsCard({ t }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  return (
    <Card className="relative">
      <button onClick={dismiss} aria-label={t.close} className="absolute top-3 right-3 text-neutral-600 hover:text-neutral-300 transition-colors">
        <X size={13} />
      </button>
      <div className="flex items-center gap-2 mb-1.5">
        <UserPlus size={14} className="text-accent" />
        <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.inviteCardTitle}</span>
      </div>
      <p className="text-[11px] text-neutral-500 font-body mb-3 pr-4">{t.inviteCardDesc.replace('{joined}', inviteStats.joined)}</p>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? t.linkCopied : t.inviteButton}
      </button>
    </Card>
  );
}
