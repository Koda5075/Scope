import { LogIn } from 'lucide-react';
import LeaderboardTab from './tabs/LeaderboardTab.jsx';

// Logged-out landing. Crawlers and first-time visitors hit this instead of the full
// dashboard, so it carries the page <h1> and shows something real — the public
// regional leaderboard — above a sign-in call to action. No router: App just renders
// this branch while `loggedIn` is false. The leaderboard is public data by nature
// (see LeaderboardTab), so nothing here is gated.
export default function LandingView({ t, setLoggedIn, filteredGames }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center pt-8 pb-2 px-4">
        {/* The one page <h1> in the logged-out state. sr-only span keeps the
            name + keywords for search/screen readers without changing the
            visible tagline. English like index.html's title/meta. */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white max-w-md mx-auto mb-3">
          <span className="sr-only">Scope — VALORANT Stats Tracker. </span>
          {t.loginTitle}
        </h1>
        <p className="text-sm text-neutral-400 font-body max-w-sm mx-auto">{t.loginSub}</p>
      </div>

      <div className="border border-neutral-800 bg-neutral-950 px-5 py-5 flex flex-col items-center text-center gap-3">
        <p className="text-xs font-body text-neutral-400 max-w-sm">{t.landingCtaLine}</p>
        <button
          onClick={() => setLoggedIn(true)}
          className="flex items-center gap-2 bg-accent text-black font-display font-bold uppercase text-sm tracking-wide px-6 py-3 hover:opacity-90 transition-opacity"
        >
          <LogIn size={16} /> {t.loginBtn}
        </button>
        <p className="text-[11px] text-neutral-600 font-body max-w-xs leading-relaxed">{t.loginConsent}</p>
        <p className="text-[10px] text-neutral-700 font-body italic">{t.loginDemo}</p>
      </div>

      <div>
        <div className="font-display text-xs tracking-[0.2em] uppercase text-neutral-600 mb-3 px-1">
          {t.landingPublicBoard}
        </div>
        <LeaderboardTab
          t={t}
          favoriteIds={[]}
          onToggleFavorite={() => {}}
          filteredGames={filteredGames}
          publicOnly
        />
      </div>
    </div>
  );
}
