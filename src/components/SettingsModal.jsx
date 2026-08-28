import { useState } from 'react';
import { Check, AlertTriangle, Lock, Moon, Sun } from 'lucide-react';
import Modal from './Modal.jsx';
import { THEMES, isValidHex } from '../data/themes.js';
import { inviteStats } from '../data/mockData.js';

const MOCK_PUBLIC_SLUG = 'kaito-euw1';
const LANGS = ['en', 'fr', 'de', 'es', 'it', 'pt'];

const NOTIFY_KEYS = ['rank', 'badges', 'streaks', 'act', 'coaching'];
const NOTIFY_STORAGE = 'scope-notify-prefs';

function loadNotifyPrefs() {
  const defaults = Object.fromEntries(NOTIFY_KEYS.map((k) => [k, true]));
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(NOTIFY_STORAGE) ?? '{}') };
  } catch {
    return defaults;
  }
}

function SectionTitle({ children }) {
  return <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-3">{children}</div>;
}

export default function SettingsModal({
  t,
  lang,
  setLang,
  theme,
  setTheme,
  themeMode,
  setThemeMode,
  customAccent,
  setCustomAccent,
  publicVisible,
  setPublicVisible,
  loggedIn,
  setLoggedIn,
  isPremium,
  setIsPremium,
  onDeleteAccount,
  onSeePlans,
  onClose,
  initialSection = 'appearance',
}) {
  const [section, setSection] = useState(initialSection);
  const [copied, setCopied] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [hexDraft, setHexDraft] = useState(customAccent ?? '');
  const [notifyPrefs, setNotifyPrefs] = useState(loadNotifyPrefs);

  function toggleNotify(key) {
    setNotifyPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(NOTIFY_STORAGE, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const customActive = isPremium && isValidHex(customAccent);
  const pickerValue = isValidHex(hexDraft) ? hexDraft : customAccent ?? THEMES[theme]?.accent ?? '#FFC300';

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${MOCK_PUBLIC_SLUG}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  function applyHex(value) {
    setHexDraft(value);
    if (isValidHex(value)) setCustomAccent(value);
  }

  const NAV = [
    ['appearance', t.appearance],
    ['connection', t.settingsNavConnection],
    ['notifications', t.settingsNavNotifications],
    ['privacy', t.settingsNavPrivacy],
    ['demo', t.demoSection],
    ['danger', t.dangerZoneTitle],
  ];

  const NOTIFY_LABELS = {
    rank: t.notifyRank,
    badges: t.notifyBadges,
    streaks: t.notifyStreaks,
    act: t.notifyAct,
    coaching: t.notifyCoaching,
  };

  return (
    <Modal onClose={onClose} closeLabel={t.close} size="lg">
      <div className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-5">{t.settingsTitle}</div>

      <div className="flex flex-col sm:flex-row gap-5">
        <nav className="flex sm:flex-col gap-1 shrink-0 sm:w-40 overflow-x-auto sm:overflow-visible -mx-1 px-1">
          {NAV.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`text-left px-3 py-2 text-xs font-body whitespace-nowrap border-l-2 transition-colors ${
                section === id
                  ? 'border-accent text-accent bg-accent/5'
                  : `border-transparent hover:text-neutral-200 ${id === 'danger' ? 'text-red-500/80' : 'text-neutral-500'}`
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Fixed min-height so the modal doesn't jump size between the tall Appearance
            pane and the short Demo/Privacy/Danger panes when switching sections. */}
        <div className="flex-1 min-w-0 sm:min-h-[24rem] sm:border-l sm:border-neutral-800 sm:pl-5">
          {section === 'appearance' && (
            <div className="flex flex-col gap-6">
              <div>
                <SectionTitle>{t.themeModeLabel}</SectionTitle>
                <div className="flex gap-2">
                  {[
                    ['dark', t.themeModeDark, Moon],
                    ['light', t.themeModeLight, Sun],
                  ].map(([mode, label, Icon]) => (
                    <button
                      key={mode}
                      onClick={() => setThemeMode(mode)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs font-display uppercase tracking-wide border transition-colors ${
                        themeMode === mode ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>{t.accentLabel}</SectionTitle>
                <div className="flex gap-3">
                  {Object.entries(THEMES).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        setCustomAccent(null);
                        setHexDraft('');
                      }}
                      className="swatch"
                      style={{ background: val.accent, borderColor: !customActive && theme === key ? '#fff' : 'transparent' }}
                      aria-label={val.label}
                      title={val.label}
                    >
                      {!customActive && theme === key && <Check size={12} color="#000" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle>{t.customAccentLabel}</SectionTitle>
                {isPremium ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="color"
                      value={pickerValue}
                      onChange={(e) => applyHex(e.target.value)}
                      aria-label={t.customAccentLabel}
                      className="w-10 h-10 bg-transparent border border-neutral-800 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={hexDraft}
                      onChange={(e) => applyHex(e.target.value.trim())}
                      placeholder="#FFC300"
                      spellCheck={false}
                      className="w-28 bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 px-2 py-2 focus:border-accent outline-none"
                    />
                    {customActive && (
                      <button
                        onClick={() => {
                          setCustomAccent(null);
                          setHexDraft('');
                        }}
                        className="text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
                      >
                        {t.customAccentReset}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 border border-neutral-800 bg-neutral-950 px-3 py-2.5">
                    <Lock size={13} className="text-accent shrink-0" />
                    <span className="text-[11px] font-body text-neutral-400 flex-1">{t.customAccentHint}</span>
                    <button onClick={onSeePlans} className="text-[11px] font-body text-accent hover:underline whitespace-nowrap">
                      {t.seePlans}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <SectionTitle>{t.language}</SectionTitle>
                <div className="grid grid-cols-3 gap-2 max-w-xs">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1.5 text-xs font-display uppercase border transition-colors ${
                        lang === l ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'connection' && (
            <div>
              <SectionTitle>{t.settingsNavConnection}</SectionTitle>
              <p className="text-xs font-body text-neutral-300 mb-4">
                {loggedIn ? t.connectionConnectedAs.replace('{name}', 'KAITO#EUW1') : t.connectionNotConnected}
              </p>
              <button
                onClick={() => setLoggedIn((s) => !s)}
                className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                {loggedIn ? t.connectionSignOut : t.connectionSignIn}
              </button>
            </div>
          )}

          {section === 'notifications' && (
            <div>
              <SectionTitle>{t.notifyPrefsTitle}</SectionTitle>
              <div className="flex flex-col gap-2.5">
                {NOTIFY_KEYS.map((key) => (
                  <label key={key} className="flex items-center gap-2 text-xs font-body text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyPrefs[key]}
                      onChange={() => toggleNotify(key)}
                      className="accent-[var(--accent)]"
                    />
                    {NOTIFY_LABELS[key]}
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-neutral-600 font-body mt-3 leading-relaxed">{t.notifyPrefsHint}</p>
            </div>
          )}

          {section === 'privacy' && (
            <div>
              <SectionTitle>{t.publicProfileSection}</SectionTitle>
              <label className="flex items-center gap-2 text-xs font-body text-neutral-300 cursor-pointer mb-2.5">
                <input
                  type="checkbox"
                  checked={publicVisible}
                  onChange={(e) => setPublicVisible(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {t.publicVisibilityLabel}
              </label>
              <button onClick={handleCopyLink} className="text-[11px] font-body text-accent hover:underline">
                {copied ? t.linkCopied : t.copyLink}
              </button>
              <div className="text-[11px] text-neutral-500 font-body mt-2">
                {t.inviteStatsText.replace('{joined}', inviteStats.joined)}
              </div>
            </div>
          )}

          {section === 'demo' && (
            <div>
              <SectionTitle>{t.demoSection}</SectionTitle>
              <label className="flex items-center gap-2 text-xs font-body text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {t.simulatePremiumLabel}
              </label>
              {/* This toggle only flips local demo state and defaults to OFF. When RSO
                  sign-in and Stripe go live, `isPremium` must be driven by the server's
                  subscription record, not this control — it must never be able to grant
                  Scope+ on a real account. */}
              <p className="flex items-start gap-1.5 text-[11px] text-neutral-600 font-body mt-2 leading-relaxed">
                <AlertTriangle size={12} className="text-neutral-600 shrink-0 mt-0.5" />
                {t.simulatePremiumHint}
              </p>
            </div>
          )}

          {section === 'danger' && (
            <div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-red-500/80 font-body mb-3">{t.dangerZoneTitle}</div>
              {!confirmingDelete ? (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="text-[11px] font-body text-red-500 hover:text-red-400 hover:underline"
                >
                  {t.deleteAccountButton}
                </button>
              ) : (
                <div className="border border-red-900/50 bg-red-950/20 px-3 py-3">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-neutral-300 font-body leading-relaxed">{t.deleteAccountWarning}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onDeleteAccount}
                      className="bg-red-600 text-white font-display font-bold uppercase text-[10px] tracking-wide px-3 py-1.5 hover:bg-red-500 transition-colors"
                    >
                      {t.deleteAccountConfirm}
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(false)}
                      className="text-[11px] font-body text-neutral-400 hover:text-neutral-200"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
