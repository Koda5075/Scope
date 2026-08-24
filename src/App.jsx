import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { T } from './i18n/translations.js';
import { THEMES } from './data/themes.js';
import { peakRank as mockPeakRank, acts, filterGames, recentGames } from './data/mockData.js';
import TopBar from './components/TopBar.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import PlayerHeader from './components/PlayerHeader.jsx';
import PlayerSearchBar from './components/PlayerSearchBar.jsx';
import Modal from './components/Modal.jsx';
import ProfileCustomizationModal from './components/ProfileCustomizationModal.jsx';
import TabNav from './components/TabNav.jsx';
import FilterBar from './components/FilterBar.jsx';
import PromoBanner from './components/PromoBanner.jsx';
import OnboardingTour from './components/OnboardingTour.jsx';
import ScopePlansModal from './components/ScopePlansModal.jsx';
import Footer from './components/Footer.jsx';
import TabLoading from './components/TabLoading.jsx';
import OverviewTab from './components/tabs/OverviewTab.jsx';
import AgentsTab from './components/tabs/AgentsTab.jsx';
import CompareTab from './components/tabs/CompareTab.jsx';
import BadgesTab from './components/tabs/BadgesTab.jsx';
import ProgressTab from './components/tabs/ProgressTab.jsx';

// Scope+ pulls in its own chart/lock UI that only ever renders once a paying-curious
// user opens the tab — splitting it out of the main bundle keeps the initial load lean
// for the free dashboard most sessions never leave.
const PremiumTab = lazy(() => import('./components/tabs/PremiumTab.jsx'));

// Reads a saved value at state-creation time (lazy useState initializer) rather than
// via a mount-only useEffect — the effect approach renders once with the hardcoded
// default first, and a broader persist-effect firing on that same initial commit was
// writing that stale default back over the just-loaded value before the load's setState
// had actually taken effect, silently losing the saved setting on every fresh load.
function loadStored(key, fallback, parse = (v) => v) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function ScopeDashboard() {
  const [loggedIn, setLoggedIn] = useState(() => loadStored('scope-logged-in', false, (v) => v === 'true'));
  const [tab, setTab] = useState('overview');
  const [lang, setLang] = useState(() => loadStored('scope-lang', 'en', (v) => (T[v] ? v : 'en')));
  const [theme, setTheme] = useState(() => loadStored('scope-theme', 'yellow', (v) => (THEMES[v] ? v : 'yellow')));
  const [showSettings, setShowSettings] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => loadStored('scope-favorites', ['p2'], JSON.parse));
  const [publicVisible, setPublicVisible] = useState(() => loadStored('scope-public-visible', true, (v) => v === 'true'));
  const [avatarUrl, setAvatarUrl] = useState(() => loadStored('scope-avatar', null));
  const [bannerUrl, setBannerUrl] = useState(() => loadStored('scope-banner', null));
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [isPremium, setIsPremium] = useState(() => loadStored('scope-premium', false, (v) => v === 'true'));
  // Mode + Period (and, when period is 'act', the Act/Episode) — one shared filter
  // state for the whole dashboard, rendered once above the tabs, instead of a copy
  // local to whichever tab happened to need it first.
  const [filterMode, setFilterMode] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [actId, setActId] = useState(() => acts.find((a) => a.current)?.id ?? acts[0].id);
  const rrCurrent = 67;
  const rrGoal = 100;
  const t = T[lang];
  const accent = THEMES[theme].accent;
  const selectedAct = acts.find((a) => a.id === actId) ?? acts[0];
  const filteredGames = useMemo(
    () => filterGames(recentGames, { mode: filterMode, period: filterPeriod, act: selectedAct }),
    [filterMode, filterPeriod, selectedAct]
  );

  function toggleFavorite(puuid) {
    setFavoriteIds((ids) => (ids.includes(puuid) ? ids.filter((id) => id !== puuid) : [...ids, puuid]));
  }

  // Mock deletion — no real backend/account exists yet, so this just wipes every
  // scope-* key this app has ever written (listed explicitly rather than
  // localStorage.clear(), which would also nuke anything unrelated sharing the origin)
  // and resets in-memory state to first-run defaults. Matches the deletion right
  // already promised in the privacy policy.
  function handleDeleteAccount() {
    try {
      [
        'scope-lang', 'scope-theme', 'scope-favorites', 'scope-public-visible',
        'scope-avatar', 'scope-banner', 'scope-logged-in', 'scope-premium',
        'scope-invite-card-dismissed', 'scope-onboarding-seen', 'scope-session-goal',
      ].forEach((key) => localStorage.removeItem(key));
      sessionStorage.removeItem('scope-promo-dismissed');
    } catch (e) { /* ignore */ }

    setLoggedIn(false);
    setLang('en');
    setTheme('yellow');
    setFavoriteIds(['p2']);
    setPublicVisible(true);
    setAvatarUrl(null);
    setBannerUrl(null);
    setIsPremium(false);
    setShowSettings(false);
  }

  useEffect(() => {
    try {
      localStorage.setItem('scope-lang', lang);
      localStorage.setItem('scope-theme', theme);
      localStorage.setItem('scope-favorites', JSON.stringify(favoriteIds));
      localStorage.setItem('scope-public-visible', String(publicVisible));
      if (avatarUrl) localStorage.setItem('scope-avatar', avatarUrl);
      else localStorage.removeItem('scope-avatar');
      if (bannerUrl) localStorage.setItem('scope-banner', bannerUrl);
      else localStorage.removeItem('scope-banner');
      localStorage.setItem('scope-logged-in', String(loggedIn));
      localStorage.setItem('scope-premium', String(isPremium));
    } catch (e) { /* ignore */ }
  }, [lang, theme, favoriteIds, publicVisible, avatarUrl, bannerUrl, loggedIn, isPremium]);

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

        /* Real Valorant art (agents/maps/ranks): full color, framed with a thin accent
           border like sc-card — a filter on already-small icons just blurred the detail
           out instead of integrating them with the theme. */
        .val-icon { border: 1.5px solid var(--accent); background: #0F0F0F; padding: 2px; }

        @keyframes sc-reveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .sc-reveal { animation: sc-reveal 0.45s ease-out both; }

        .tour-highlight { position: relative; z-index: 55; background: #0F0F0F; outline: 2px solid var(--accent); outline-offset: 4px; box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 22%, transparent); border-radius: 2px; transition: box-shadow 0.3s ease; }
        .tour-dim { position: fixed; inset: 0; z-index: 54; background: rgba(0,0,0,0.75); pointer-events: none; transition: opacity 0.3s ease; }

        /* Themed scrollbars app-wide (modals, panels, horizontal-scroll rows) instead of
           the browser-default light/thin bar, which clashed with the dark theme. */
        * { scrollbar-width: thin; scrollbar-color: var(--accent-dim) #171717; }
        *::-webkit-scrollbar { width: 9px; height: 9px; }
        *::-webkit-scrollbar-track { background: #171717; }
        *::-webkit-scrollbar-thumb { background: var(--accent-dim); border: 2px solid #171717; border-radius: 999px; }
        *::-webkit-scrollbar-thumb:hover { background: var(--accent); }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 py-8">
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
          publicVisible={publicVisible}
          setPublicVisible={setPublicVisible}
          isPremium={isPremium}
          setIsPremium={setIsPremium}
          onDeleteAccount={handleDeleteAccount}
        />

        {!loggedIn ? (
          <LoginScreen t={t} setLoggedIn={setLoggedIn} />
        ) : (
          <>
            <PlayerHeader
              t={t}
              rrCurrent={rrCurrent}
              rrGoal={rrGoal}
              peakRank={mockPeakRank}
              avatarUrl={avatarUrl}
              bannerUrl={bannerUrl}
              onAvatarClick={() => setShowProfileModal(true)}
              isPremium={isPremium}
              onSeePlans={() => setShowPlansModal(true)}
            />
            <PlayerSearchBar t={t} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} filteredGames={filteredGames} />

            <FilterBar
              t={t}
              mode={filterMode}
              setMode={setFilterMode}
              period={filterPeriod}
              setPeriod={setFilterPeriod}
              acts={acts}
              actId={actId}
              setActId={setActId}
            />

            <TabNav tab={tab} setTab={setTab} t={t} />

            {tab !== 'premium' && <PromoBanner t={t} onSeePlans={() => setShowPlansModal(true)} isPremium={isPremium} />}

            {tab === 'overview' && <OverviewTab t={t} accent={accent} isPremium={isPremium} filteredGames={filteredGames} />}
            {tab === 'agents' && <AgentsTab t={t} isPremium={isPremium} filteredGames={filteredGames} />}
            {tab === 'compare' && <CompareTab t={t} isPremium={isPremium} filteredGames={filteredGames} />}
            {tab === 'badges' && <BadgesTab t={t} isPremium={isPremium} />}
            {tab === 'progress' && <ProgressTab t={t} isPremium={isPremium} />}
            {tab === 'premium' && (
              <Suspense fallback={<TabLoading />}>
                <PremiumTab t={t} accent={accent} onSeePlans={() => setShowPlansModal(true)} isPremium={isPremium} />
              </Suspense>
            )}

            <OnboardingTour t={t} />
          </>
        )}

        <Footer t={t} lang={lang} />

        {showProfileModal && (
          <Modal onClose={() => setShowProfileModal(false)} closeLabel={t.close}>
            <ProfileCustomizationModal
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              bannerUrl={bannerUrl}
              onBannerChange={setBannerUrl}
              isPremium={isPremium}
              onSeePlans={() => {
                setShowProfileModal(false);
                setShowPlansModal(true);
              }}
              t={t}
            />
          </Modal>
        )}

        {showPlansModal && (
          <ScopePlansModal
            onClose={() => setShowPlansModal(false)}
            onChoose={() => {
              setIsPremium(true);
              setShowPlansModal(false);
            }}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
