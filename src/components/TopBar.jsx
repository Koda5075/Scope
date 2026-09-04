import { LogIn, Settings } from 'lucide-react';
import NotificationsBell from './NotificationsBell.jsx';

export default function TopBar({ loggedIn, setLoggedIn, onOpenSettings, dndEnabled, t }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Scope" className="sc-logo w-10 h-10 object-contain" />
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
