import { useState } from 'react';
import { UserPlus, Copy, Check, X, Gift } from 'lucide-react';
import Card from './Card.jsx';
import { inviteStats, referralProgram } from '../data/mockData.js';

const STORAGE_KEY = 'scope-invite-card-dismissed';

export default function InviteFriendsCard({ t, customCode }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(null); // 'link' | 'code' | null

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
  }

  async function copy(text, which) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  const { referred, rewardAt, rewardBannerName } = referralProgram;
  const code = customCode?.trim() || referralProgram.code;
  const done = referred >= rewardAt;
  const pct = Math.min(100, Math.round((referred / rewardAt) * 100));
  const rewardLine = done
    ? (t.referralRewardDone ?? '').replace('{reward}', rewardBannerName)
    : (t.referralRewardLine ?? '')
        .replace('{n}', referred)
        .replace('{goal}', rewardAt)
        .replace('{reward}', rewardBannerName);

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

      <div className="mb-3">
        <span className="block text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body mb-1">{t.referralCodeLabel}</span>
        <button
          onClick={() => copy(code, 'code')}
          className="flex items-center gap-2 border border-dashed border-neutral-700 hover:border-accent text-neutral-200 font-mono text-sm px-3 py-1.5 transition-colors"
        >
          <span className="tracking-wider">{code}</span>
          {copied === 'code' ? <Check size={12} className="text-accent" /> : <Copy size={12} className="text-neutral-500" />}
        </button>
      </div>

      <div className="mb-3 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Gift size={12} className={done ? 'text-accent' : 'text-neutral-500'} />
          <span className={`text-[11px] font-body ${done ? 'text-accent' : 'text-neutral-400'}`}>{rewardLine}</span>
        </div>
        <div className="sc-track h-1.5 overflow-hidden">
          <div className="sc-fill h-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <button
        onClick={() => copy(`${window.location.origin}/?ref=${code}`, 'link')}
        className="flex items-center gap-1.5 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity"
      >
        {copied === 'link' ? <Check size={12} /> : <Copy size={12} />}
        {copied === 'link' ? t.linkCopied : t.inviteButton}
      </button>
    </Card>
  );
}
