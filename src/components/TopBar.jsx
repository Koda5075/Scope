import { LogIn, Settings } from 'lucide-react';
import SettingsPanel from './SettingsPanel.jsx';
import NotificationsBell from './NotificationsBell.jsx';

export default function TopBar({ loggedIn, setLoggedIn, showSettings, setShowSettings, t, lang, setLang, theme, setTheme, publicVisible, setPublicVisible, isPremium, setIsPremium }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Scope" className="w-10 h-10 object-contain" />
        <div>
          <span className="font-display text-3xl font-bold tracking-wide text-white">SCOPE</span>
          <div className="h-[2px] w-14 bg-accent mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLoggedIn((s) => !s)}
          className="w-9 h-9 flex items-center justify-center bg-black border border-accent text-accent hover:opacity-80 transition-opacity"
          aria-label={loggedIn ? 'Se déconnecter' : 'Se connecter avec Riot'}
          title={loggedIn ? 'KAITO#EUW1 — connecté' : t.loginBtn}
        >
          <LogIn size={16} />
        </button>

        {loggedIn && <NotificationsBell t={t} />}

        <div className="relative">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="w-9 h-9 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-colors"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>

          {showSettings && (
            <SettingsPanel
              t={t}
              lang={lang}
              setLang={setLang}
              theme={theme}
              setTheme={setTheme}
              publicVisible={publicVisible}
              setPublicVisible={setPublicVisible}
              isPremium={isPremium}
              setIsPremium={setIsPremium}
            />
          )}
        </div>
      </div>
    </div>
  );
}
