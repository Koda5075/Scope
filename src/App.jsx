import { useState, useEffect } from 'react';
import { T } from './i18n/translations.js';
import { THEMES } from './data/themes.js';
import TopBar from './components/TopBar.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import PlayerHeader from './components/PlayerHeader.jsx';
import TabNav from './components/TabNav.jsx';
import Footer from './components/Footer.jsx';
import OverviewTab from './components/tabs/OverviewTab.jsx';
import AgentsTab from './components/tabs/AgentsTab.jsx';
import CompareTab from './components/tabs/CompareTab.jsx';
import BadgesTab from './components/tabs/BadgesTab.jsx';

export default function ScopeDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('overview');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('yellow');
  const [showSettings, setShowSettings] = useState(false);
  const rrCurrent = 67;
  const rrGoal = 100;
  const t = T[lang];
  const accent = THEMES[theme].accent;

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('scope-lang');
      const savedTheme = localStorage.getItem('scope-theme');
      if (savedLang && T[savedLang]) setLang(savedLang);
      if (savedTheme && THEMES[savedTheme]) setTheme(savedTheme);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scope-lang', lang);
      localStorage.setItem('scope-theme', theme);
    } catch (e) { /* ignore */ }
  }, [lang, theme]);

  return (
    <div
      className="min-h-screen w-full bg-black text-neutral-100 font-body"
      style={{ '--accent': THEMES[theme].accent, '--accent-dim': THEMES[theme].dim }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-accent { color: var(--accent); }
        .bg-accent { background: var(--accent); }
        .border-accent { border-color: var(--accent); }

        .sc-card { background: #0F0F0F; border: 1px solid #262626; border-left: 3px solid var(--accent); padding: 16px 18px; }
        .sc-track { background: #1A1A1A; border: 1px solid #2A2A2A; }
        .sc-fill { background: var(--accent); box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 45%, transparent); }
        .sc-fill-dim { background: var(--accent-dim); }
        .sc-fill-muted { background: #4D4D4D; }
        .sc-badge { background: #0F0F0F; border: 1px solid #262626; border-left: 2px solid var(--accent); }
        .locked-overlay { backdrop-filter: blur(3px); background: rgba(0,0,0,0.65); }
        .settings-panel { background: #0F0F0F; border: 1px solid #262626; }
        .swatch { width: 22px; height: 22px; border-radius: 999px; display: flex; align-items: center; justify-content: center; border: 2px solid transparent; cursor: pointer; }
      `}</style>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <TopBar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
        />

        {!loggedIn ? (
          <LoginScreen t={t} setLoggedIn={setLoggedIn} />
        ) : (
          <>
            <PlayerHeader t={t} rrCurrent={rrCurrent} rrGoal={rrGoal} />
            <TabNav tab={tab} setTab={setTab} t={t} />

            {tab === 'overview' && <OverviewTab t={t} accent={accent} />}
            {tab === 'agents' && <AgentsTab t={t} />}
            {tab === 'compare' && <CompareTab t={t} theme={theme} />}
            {tab === 'badges' && <BadgesTab t={t} />}
          </>
        )}

        <Footer t={t} lang={lang} />
      </div>
    </div>
  );
}
