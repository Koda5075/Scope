import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { T } from './i18n/translations.js';
import { THEMES, resolveAccent, deriveDim, isValidHex } from './data/themes.js';
import { peakRank as mockPeakRank, acts, filterGames, recentGames } from './data/mockData.js';
import TopBar from './components/TopBar.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import LandingView from './components/LandingView.jsx';
import PlayerHeader from './components/PlayerHeader.jsx';
import { visibleCosmetics } from './data/cosmeticUnlocks.js';
import PlayerSearchBar from './components/PlayerSearchBar.jsx';
import ProfileCustomizationModal from './components/ProfileCustomizationModal.jsx';
import TabNav from './components/TabNav.jsx';
import FilterBar from './components/FilterBar.jsx';
import PromoBanner from './components/PromoBanner.jsx';
import OnboardingTour from './components/OnboardingTour.jsx';
import ScopePlansModal from './components/ScopePlansModal.jsx';
import Footer from './components/Footer.jsx';
import TabLoading from './components/TabLoading.jsx';
import { getSupabase } from './lib/supabaseClient.js';
import { DEFAULT_TITLE_ID } from './data/valorantCosmetics.js';
import OverviewTab from './components/tabs/OverviewTab.jsx';
import AgentsTab from './components/tabs/AgentsTab.jsx';
import CompareTab from './components/tabs/CompareTab.jsx';
import LeaderboardTab from './components/tabs/LeaderboardTab.jsx';
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
  const [themeMode, setThemeMode] = useState(() => loadStored('scope-theme-mode', 'dark', (v) => (v === 'light' ? 'light' : 'dark')));
  // Scope+ only: a free-choice accent hex that overrides the preset when set. Non-Scope+
  // accounts keep the value stored but it has no effect until they subscribe.
  const [customAccent, setCustomAccent] = useState(() => loadStored('scope-accent-custom', null, (v) => (isValidHex(v) ? v : null)));
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSection, setSettingsSection] = useState('appearance');
  const [favoriteIds, setFavoriteIds] = useState(() => loadStored('scope-favorites', ['p2'], JSON.parse));
  const [publicVisible, setPublicVisible] = useState(() => loadStored('scope-public-visible', true, (v) => v === 'true'));
  const [avatarUrl, setAvatarUrl] = useState(() => loadStored('scope-avatar', null));
  const [bannerUrl, setBannerUrl] = useState(() => loadStored('scope-banner', null));
  // Player title (a val-content id, or DEFAULT_TITLE_ID) and an optional banner spray
  // ({ id, x, y } with x/y as 0..1 fractions of the banner box). Both are strictly
  // private — same rule as avatar/banner/theme: only ever passed to the owner's own
  // PlayerHeader and the customization modal, never to public profile / search / compare.
  const [titleId, setTitleId] = useState(() => loadStored('scope-title', DEFAULT_TITLE_ID));
  const [bannerSpray, setBannerSpray] = useState(() => loadStored('scope-banner-spray', null, JSON.parse));
  // Banner focal point ({ x, y } as 0..1 fractions) fed straight into the header
  // banner's object-position so a wide crop can be nudged onto the interesting part
  // of the art instead of always centre-cropping. Framing metadata only — never gated.
  const [bannerFocus, setBannerFocus] = useState(() => loadStored('scope-banner-focus', { x: 0.5, y: 0.5 }, JSON.parse));
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
  const accent = resolveAccent({ theme, customAccent, isPremium, mode: themeMode });
  const accentDim =
    isPremium && isValidHex(customAccent) ? deriveDim(accent) : THEMES[theme]?.dim ?? THEMES.yellow.dim;
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
        'scope-avatar', 'scope-banner', 'scope-title', 'scope-banner-spray', 'scope-banner-focus',
        'scope-theme-mode', 'scope-accent-custom', 'scope-logged-in', 'scope-premium',
        'scope-invite-card-dismissed', 'scope-onboarding-seen', 'scope-session-goal',
      ].forEach((key) => localStorage.removeItem(key));
      sessionStorage.removeItem('scope-promo-dismissed');
    } catch (e) { /* ignore */ }

    setLoggedIn(false);
    setLang('en');
    setTheme('yellow');
    setThemeMode('dark');
    setCustomAccent(null);
    setFavoriteIds(['p2']);
    setPublicVisible(true);
    setAvatarUrl(null);
    setBannerUrl(null);
    setTitleId(DEFAULT_TITLE_ID);
    setBannerSpray(null);
    setBannerFocus({ x: 0.5, y: 0.5 });
    setIsPremium(false);
    setShowSettings(false);
  }

  // Stripe Checkout (test mode) bounces back here with ?checkout=success&session_id=...
  // once a test payment actually completes — that's the real trigger for isPremium now,
  // not the "Choose Plan" click itself (see ScopePlansModal.jsx). Runs once on mount, and
  // strips the query params either way so a refresh doesn't re-trigger it.
  //
  // The `checkout=success` param alone was never proof of payment — anyone could type it
  // into the URL bar and unlock Scope+ for free. verify-checkout-session re-checks the
  // session id with Stripe directly (server-side, with the secret key) before isPremium
  // is trusted, so only a session Stripe actually marks paid flips it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    const sessionId = params.get('session_id');

    if (checkout) {
      params.delete('checkout');
      params.delete('session_id');
      const qs = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }

    if (checkout !== 'success' || !sessionId) return;

    try {
      getSupabase()
        .functions.invoke('verify-checkout-session', { body: { sessionId } })
        .then(({ data, error }) => {
          if (!error && data?.premium) setIsPremium(true);
        })
        .catch((err) => console.error('checkout session verification failed', err));
    } catch (err) {
      // getSupabase() throws synchronously if VITE_SUPABASE_URL/ANON_KEY are missing —
      // must not crash the whole app over an unverifiable checkout redirect.
      console.error('checkout session verification failed', err);
    }
  }, []);

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
      localStorage.setItem('scope-title', titleId);
      if (bannerSpray) localStorage.setItem('scope-banner-spray', JSON.stringify(bannerSpray));
      else localStorage.removeItem('scope-banner-spray');
      localStorage.setItem('scope-banner-focus', JSON.stringify(bannerFocus));
      localStorage.setItem('scope-theme-mode', themeMode);
      if (customAccent) localStorage.setItem('scope-accent-custom', customAccent);
      else localStorage.removeItem('scope-accent-custom');
      localStorage.setItem('scope-logged-in', String(loggedIn));
      localStorage.setItem('scope-premium', String(isPremium));
    } catch (e) { /* ignore */ }
  }, [lang, theme, themeMode, customAccent, favoriteIds, publicVisible, avatarUrl, bannerUrl, titleId, bannerSpray, bannerFocus, loggedIn, isPremium]);

  // Keep the page (and the area outside the max-w container / behind overscroll) on the
  // active surface colour, not just the app root div.
  useEffect(() => {
    document.documentElement.style.background = themeMode === 'light' ? '#FAF9F7' : '#000000';
  }, [themeMode]);

  return (
    <div
      data-scope-root
      data-theme={themeMode}
      className="min-h-screen w-full font-body"
      style={{ '--accent': accent, '--accent-dim': accentDim, background: 'var(--sc-bg)', color: 'var(--sc-text)' }}
    >
      <style>{`
        /* Fonts are loaded via a <link> in index.html's <head> (not @import here) so the
           browser's HTML parser can start fetching them immediately instead of waiting
           for React to mount and inject this stylesheet. */
        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-accent { color: var(--accent-text); }
        .bg-accent { background: var(--accent); }
        .border-accent { border-color: var(--accent); }

        /* Semantic surface tokens. Dark values match the palette the app was built with
           (so dark mode is byte-for-byte what it was); [data-theme="light"] swaps them
           and adds targeted overrides for the Tailwind neutral utilities used directly
           throughout the components. */
        [data-scope-root] {
          --sc-bg: #000000;
          --sc-surface: #0F0F0F;
          --sc-inset: #0A0A0A;
          --sc-track: #1A1A1A;
          --sc-track-border: #2A2A2A;
          --sc-line: #262626;
          --sc-overlay: rgba(0, 0, 0, 0.65);
          --sc-scroll-track: #171717;
          --accent-text: var(--accent);
        }
        [data-scope-root][data-theme="light"] {
          --sc-bg: #FAF9F7;
          --sc-surface: #FFFFFF;
          --sc-inset: #F4F3F1;
          --sc-track: #E9E7E4;
          --sc-track-border: #D8D5D0;
          --sc-line: #E2DED8;
          --sc-overlay: rgba(255, 255, 255, 0.72);
          --sc-scroll-track: #EAE8E4;
          --accent-text: color-mix(in srgb, var(--accent) 62%, #1C1917);
        }

        .sc-card { background: var(--sc-surface); border: 1px solid var(--sc-line); border-left: 3px solid var(--accent); padding: 16px 18px; }
        .sc-track { background: var(--sc-track); border: 1px solid var(--sc-track-border); }
        .sc-fill { background: var(--accent); box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 45%, transparent); }
        .sc-fill-dim { background: var(--accent-dim); }
        .sc-fill-muted { background: #4D4D4D; }
        .sc-badge { background: var(--sc-surface); border: 1px solid var(--sc-line); border-left: 2px solid var(--accent); }
        .locked-overlay { backdrop-filter: blur(3px); background: var(--sc-overlay); }
        .settings-panel { background: var(--sc-surface); border: 1px solid var(--sc-line); border-top: 3px solid var(--accent); }
        .swatch { width: 22px; height: 22px; border-radius: 999px; display: flex; align-items: center; justify-content: center; border: 2px solid transparent; cursor: pointer; }

        /* Real Valorant art (agents/maps/ranks): full color, framed with a thin accent
           border like sc-card — a filter on already-small icons just blurred the detail
           out instead of integrating them with the theme. */
        /* No fill: many rank/agent/weapon PNGs have transparent or round edges, so a
           surface-coloured box behind them showed as a pale "hole" in light mode. The
           thin accent border stays as the intentional framing. */
        .val-icon { border: 1.5px solid var(--accent); background: transparent; padding: 2px; }

        @keyframes sc-reveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .sc-reveal { animation: sc-reveal 0.45s ease-out both; }

        .tour-highlight { position: relative; z-index: 55; background: var(--sc-surface); outline: 2px solid var(--accent); outline-offset: 4px; box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 22%, transparent); border-radius: 2px; transition: box-shadow 0.3s ease; }
        .tour-dim { position: fixed; inset: 0; z-index: 54; background: rgba(0,0,0,0.75); pointer-events: none; transition: opacity 0.3s ease; }

        /* Themed scrollbars app-wide (modals, panels, horizontal-scroll rows). */
        * { scrollbar-width: thin; scrollbar-color: var(--accent-dim) var(--sc-scroll-track); }
        *::-webkit-scrollbar { width: 9px; height: 9px; }
        *::-webkit-scrollbar-track { background: var(--sc-scroll-track); }
        *::-webkit-scrollbar-thumb { background: var(--accent-dim); border: 2px solid var(--sc-scroll-track); border-radius: 999px; }
        *::-webkit-scrollbar-thumb:hover { background: var(--accent); }

        /* --- Light mode: remap the hardcoded Tailwind darks used across components.
           NOTE: backslashes are doubled because this CSS lives in a JS template literal —
           a single backslash would be swallowed and the selector silently dropped. --- */
        [data-scope-root][data-theme="light"] .bg-black { background-color: var(--sc-bg) !important; }
        [data-scope-root][data-theme="light"] .bg-neutral-950 { background-color: var(--sc-surface) !important; }
        [data-scope-root][data-theme="light"] .bg-neutral-900 { background-color: var(--sc-inset) !important; }
        [data-scope-root][data-theme="light"] .bg-neutral-800 { background-color: var(--sc-track) !important; }
        [data-scope-root][data-theme="light"] .bg-\\[\\#0F0F0F\\] { background-color: var(--sc-surface) !important; }
        [data-scope-root][data-theme="light"] .bg-neutral-950\\/60 { background-color: color-mix(in srgb, var(--sc-surface) 60%, transparent) !important; }
        [data-scope-root][data-theme="light"] .hover\\:bg-neutral-900:hover { background-color: var(--sc-inset) !important; }

        [data-scope-root][data-theme="light"] .border-neutral-800,
        [data-scope-root][data-theme="light"] .border-neutral-700 { border-color: var(--sc-line) !important; }

        [data-scope-root][data-theme="light"] .text-white,
        [data-scope-root][data-theme="light"] .text-neutral-100,
        [data-scope-root][data-theme="light"] .text-neutral-200 { color: #1C1917 !important; }
        [data-scope-root][data-theme="light"] .text-neutral-300 { color: #33302C !important; }
        [data-scope-root][data-theme="light"] .text-neutral-400 { color: #52504B !important; }
        [data-scope-root][data-theme="light"] .text-neutral-500 { color: #6B675F !important; }
        [data-scope-root][data-theme="light"] .text-neutral-600 { color: #8A857C !important; }
        [data-scope-root][data-theme="light"] .text-neutral-700,
        [data-scope-root][data-theme="light"] .text-neutral-800 { color: #A8A29A !important; }

        /* Banner fade in PlayerHeader / GameScoreboard fades to the surface, not to black. */
        [data-scope-root][data-theme="light"] .from-neutral-950 { --tw-gradient-from: var(--sc-bg) !important; }
        [data-scope-root][data-theme="light"] .via-neutral-950\\/85 { --tw-gradient-via: color-mix(in srgb, var(--sc-bg) 85%, transparent) !important; }
        [data-scope-root][data-theme="light"] .to-neutral-950\\/60 { --tw-gradient-to: color-mix(in srgb, var(--sc-bg) 60%, transparent) !important; }
        [data-scope-root][data-theme="light"] .from-\\[\\#0F0F0F\\] { --tw-gradient-from: var(--sc-surface) !important; }
        [data-scope-root][data-theme="light"] .via-\\[\\#0F0F0F\\]\\/40 { --tw-gradient-via: color-mix(in srgb, var(--sc-surface) 40%, transparent) !important; }

        /* The logo art is a flat white monochrome mark — white on the dark theme,
           flipped to black in light mode. */
        [data-scope-root][data-theme="light"] .sc-logo { filter: invert(1); }

        /* The rank banner is a hero strip: its background is dark VALORANT card art
           built for light text, so it stays a dark band in both themes. In light
           mode the token remaps are cancelled inside it — otherwise the scrim faded
           to cream and washed the art out. */
        [data-scope-root][data-theme="light"] .sc-rank-banner {
          background-color: #0A0A0A !important;
          border-color: #262626 !important;
        }
        [data-scope-root][data-theme="light"] .sc-rank-banner .from-neutral-950 { --tw-gradient-from: #0A0A0A !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .via-neutral-950\\/85 { --tw-gradient-via: rgba(10, 10, 10, 0.85) !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .to-neutral-950\\/60 { --tw-gradient-to: rgba(10, 10, 10, 0.6) !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-white,
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-100,
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-200 { color: #FAFAFA !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-300 { color: #D4D4D4 !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-400 { color: #A3A3A3 !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-500 { color: #8A8A8A !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .text-neutral-600 { color: #707070 !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .border-neutral-700,
        [data-scope-root][data-theme="light"] .sc-rank-banner .border-neutral-800 { border-color: #333333 !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .bg-neutral-900 { background-color: #171717 !important; }
        [data-scope-root][data-theme="light"] .sc-rank-banner .sc-track { background: #1A1A1A !important; border-color: #2A2A2A !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 py-8">
        <TopBar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          onOpenSettings={(sectionArg) => {
            setSettingsSection(typeof sectionArg === 'string' ? sectionArg : 'appearance');
            setShowSettings(true);
          }}
          t={t}
        />

        <main>
        {!loggedIn ? (
          <LandingView t={t} setLoggedIn={setLoggedIn} filteredGames={filteredGames} />
        ) : (
          <>
            <PlayerHeader
              t={t}
              lang={lang}
              rrCurrent={rrCurrent}
              rrGoal={rrGoal}
              peakRank={mockPeakRank}
              avatarUrl={avatarUrl}
              {...visibleCosmetics({ titleId, bannerUrl, bannerSpray, isPremium })}
              bannerFocus={bannerFocus}
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
            {tab === 'leaderboard' && (
              <LeaderboardTab t={t} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} filteredGames={filteredGames} />
            )}
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
        </main>

        <Footer t={t} lang={lang} />

        {showProfileModal && (
          <ProfileCustomizationModal
            avatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            bannerUrl={bannerUrl}
            onBannerChange={setBannerUrl}
            titleId={titleId}
            onTitleChange={setTitleId}
            bannerSpray={bannerSpray}
            onBannerSprayChange={setBannerSpray}
            bannerFocus={bannerFocus}
            onBannerFocusChange={setBannerFocus}
            lang={lang}
            isPremium={isPremium}
            onSeePlans={() => {
              setShowProfileModal(false);
              setShowPlansModal(true);
            }}
            onClose={() => setShowProfileModal(false)}
            t={t}
          />
        )}

        {showSettings && (
          <SettingsModal
            t={t}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            customAccent={customAccent}
            setCustomAccent={setCustomAccent}
            publicVisible={publicVisible}
            setPublicVisible={setPublicVisible}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            isPremium={isPremium}
            setIsPremium={setIsPremium}
            onDeleteAccount={handleDeleteAccount}
            onSeePlans={() => {
              setShowSettings(false);
              setShowPlansModal(true);
            }}
            initialSection={settingsSection}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showPlansModal && <ScopePlansModal onClose={() => setShowPlansModal(false)} t={t} />}
      </div>
    </div>
  );
}
