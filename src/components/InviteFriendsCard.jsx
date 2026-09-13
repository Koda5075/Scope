import { useState } from 'react';
import { UserPlus, Copy, Check, X, Gift, Pencil } from 'lucide-react';
import Card from './Card.jsx';
import { inviteStats, referralProgram, topReferrers } from '../data/mockData.js';
import { defaultReferralCode } from '../lib/riotId.js';

const STORAGE_KEY = 'scope-invite-card-dismissed';
// Same shape check as Settings > Privacy — 4-12 chars, letters/digits/dashes.
// There's no backend uniqueness check, so this only validates format.
const CODE_RE = /^[A-Za-z0-9-]{4,12}$/;

export default function InviteFriendsCard({ t, customCode, setCustomCode, nickname }) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(null); // 'link' | 'code' | null
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

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
  const suggestedCode = defaultReferralCode(nickname);
  const code = customCode?.trim() || suggestedCode;
  const done = referred >= rewardAt;
  const pct = Math.min(100, Math.round((referred / rewardAt) * 100));
  const rewardLine = done
    ? (t.referralRewardDone ?? '').replace('{reward}', rewardBannerName)
    : (t.referralRewardLine ?? '')
        .replace('{n}', referred)
        .replace('{goal}', rewardAt)
        .replace('{reward}', rewardBannerName);

  const draftValid = CODE_RE.test(draft);
  const canEdit = typeof setCustomCode === 'function';

  function startEdit() {
    setDraft(code);
    setEditing(true);
  }

  function commit() {
    if (!draftValid) return;
    setCustomCode(draft === suggestedCode ? '' : draft);
    setEditing(false);
  }

  function reset() {
    setCustomCode('');
    setEditing(false);
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

      <div className="mb-3">
        <span className="block text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body mb-1">{t.referralCodeLabel}</span>

        {editing ? (
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value.toUpperCase().slice(0, 12))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                  if (e.key === 'Escape') setEditing(false);
                }}
                maxLength={12}
                spellCheck={false}
                aria-label={t.referralCodeEdit}
                className={`w-36 bg-neutral-950 border text-sm font-mono tracking-wider text-neutral-200 px-2.5 py-1.5 outline-none transition-colors ${
                  draftValid ? 'border-neutral-700 focus:border-accent' : 'border-red-600'
                }`}
              />
              <button
                onClick={commit}
                disabled={!draftValid}
                aria-label={t.referralCodeSave}
                className="p-1.5 border border-neutral-700 text-accent hover:border-accent disabled:opacity-30 disabled:hover:border-neutral-700 transition-colors"
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => setEditing(false)}
                aria-label={t.cancel}
                className="p-1.5 border border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 transition-colors"
              >
                <X size={13} />
              </button>
            </div>
            <p className={`text-[11px] font-body mt-1.5 ${draftValid ? 'text-neutral-600' : 'text-red-500'}`}>
              {draftValid ? t.referralCodeHint : t.referralCodeFormatError}
            </p>
            {customCode?.trim() && (
              <button onClick={reset} className="text-[11px] font-body text-neutral-500 hover:text-accent transition-colors mt-1">
                {t.referralCodeReset}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => copy(code, 'code')}
              className="flex items-center gap-2 border border-dashed border-neutral-700 hover:border-accent text-neutral-200 font-mono text-sm px-3 py-1.5 transition-colors"
            >
              <span className="tracking-wider">{code}</span>
              {copied === 'code' ? <Check size={12} className="text-accent" /> : <Copy size={12} className="text-neutral-500" />}
            </button>
            {canEdit && (
              <button
                onClick={startEdit}
                aria-label={t.referralCodeEdit}
                title={t.referralCodeEdit}
                className="p-1.5 text-neutral-600 hover:text-accent transition-colors"
              >
                <Pencil size={13} />
              </button>
            )}
          </div>
        )}
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

      <div className="mb-3">
        <span className="block text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body mb-1.5">{t.topReferrersTitle}</span>
        <div className="flex flex-col gap-1">
          {topReferrers.map((r, i) => (
            <div key={r.name} className="flex items-center justify-between text-[11px] font-body text-neutral-400">
              <span>{i + 1}. {r.name}</span>
              <span className="font-mono text-neutral-300">{r.invited}</span>
            </div>
          ))}
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
