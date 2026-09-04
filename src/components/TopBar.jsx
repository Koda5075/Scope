import { useRef, useState } from 'react';
import { LogIn, Settings } from 'lucide-react';
import NotificationsBell from './NotificationsBell.jsx';

// Discreet easter egg for anyone clicking around the logo — 5 clicks within 2s, no
// state kept anywhere, purely a one-off flourish for people exploring the site.
const EASTER_EGG_CLICKS = 5;
const EASTER_EGG_WINDOW_MS = 2000;

export default function TopBar({ loggedIn, setLoggedIn, onOpenSettings, dndEnabled, t }) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const clickTimes = useRef([]);

  function handleLogoClick() {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((t) => now - t < EASTER_EGG_WINDOW_MS);
    if (clickTimes.current.length >= EASTER_EGG_CLICKS) {
      clickTimes.current = [];
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 2500);
    }
  }

  return (
    <div className="flex items-start justify-between mb-6 relative">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Scope"
          onClick={handleLogoClick}
          className="sc-logo w-10 h-10 object-contain cursor-pointer"
        />
        {showEasterEgg && (
          <span className="absolute top-12 left-0 text-[11px] font-mono text-accent bg-neutral-950 border border-accent px-2.5 py-1 z-50 whitespace-nowrap">
            {t.easterEggMessage}
          </span>
        )}
        <div>
          {/* The dashboard's page <h1>. Rendered as a plain <span> on the logged-out
              landing so LandingView's own <h1> stays the single heading there — the two
              are never mounted without one of these branches applying. The visible text
              is just "SCOPE"; the sr-only span adds the keyword phrase for crawlers and
              screen readers without changing the layout (it's position:absolute). */}
          {loggedIn ? (
            <h1 className="font-display text-3xl font-bold tracking-wide text-white">
              SCOPE<span className="sr-only"> — VALORANT Stats Tracker</span>
            </h1>
          ) : (
            <span className="font-display text-3xl font-bold tracking-wide text-white">SCOPE</span>
          )}
          <div className="h-[2px] w-14 bg-accent mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLoggedIn((s) => !s)}
          className="w-9 h-9 flex items-center justify-center bg-black border border-accent text-accent hover:opacity-80 transition-opacity"
          aria-label={loggedIn ? t.topBarLogoutAria : t.loginBtn}
          title={loggedIn ? t.topBarConnectedTitle.replace('{name}', 'KAITO#EUW1') : t.loginBtn}
        >
          <LogIn size={16} />
        </button>

        {loggedIn && <NotificationsBell t={t} onManage={() => onOpenSettings('notifications')} dndEnabled={dndEnabled} />}

        <button
          onClick={onOpenSettings}
          className="h-9 px-3 flex items-center gap-2 border border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-colors"
          aria-label={t.topBarSettingsAria}
        >
          <Settings size={16} />
          <span className="hidden sm:inline font-display text-xs uppercase tracking-wide">{t.settingsTitle}</span>
        </button>
      </div>
    </div>
  );
}
