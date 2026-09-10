import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { otherPlayers } from '../../data/mockData.js';
import { getPlayerDataset } from '../../data/playerProfileData.js';
import AgentsTab from '../tabs/AgentsTab.jsx';
import EconomyTab from '../tabs/EconomyTab.jsx';
import BadgesTab from '../tabs/BadgesTab.jsx';
import ProgressTab from '../tabs/ProgressTab.jsx';
import LeaderboardTab from '../tabs/LeaderboardTab.jsx';
import ProfilePlayerHeader from './ProfilePlayerHeader.jsx';
import ProfileOverview from './ProfileOverview.jsx';
import ProfileCompare from './ProfileCompare.jsx';

const PROFILE_TABS = ['overview', 'agents', 'economy', 'compare', 'leaderboard', 'badges', 'progress'];
const DEFAULT_TITLE = 'Scope — VALORANT Stats Tracker';

function initialTab() {
  try {
    const q = new URLSearchParams(window.location.search).get('tab');
    return PROFILE_TABS.includes(q) ? q : 'overview';
  } catch {
    return 'overview';
  }
}

export default function PlayerProfilePage({ riotId, t, lang, loggedIn, isPremium, accent, favoriteIds, onToggleFavorite }) {
  const [tab, setTabState] = useState(initialTab);
  const dataset = getPlayerDataset(riotId);

  // A known public Scope profile can be favourited (favourites are keyed by puuid);
  // an arbitrary searched Riot ID that isn't on Scope can't.
  const known = otherPlayers.find(
    (p) => p.name.toLowerCase() === riotId.name.toLowerCase()
      && p.tag.toLowerCase() === riotId.tag.toLowerCase()
      && p.connected && p.isPublic,
  );

  useEffect(() => {
    if (!dataset) return;
    document.title = `${dataset.identity.name}#${dataset.identity.tag} — Scope`;
    return () => { document.title = DEFAULT_TITLE; };
  }, [dataset]);

  // Reset to Overview whenever the route points at a different player.
  useEffect(() => {
    setTabState(initialTab());
  }, [riotId.name, riotId.tag]);

  function setTab(next) {
    setTabState(next);
    try {
      const url = new URL(window.location.href);
      if (next === 'overview') url.searchParams.delete('tab');
      else url.searchParams.set('tab', next);
      window.history.replaceState({}, '', url);
    } catch { /* ignore */ }
  }

  if (!dataset) {
    return (
      <div className="py-16 text-center text-sm font-body text-neutral-500">{t.searchInvalidFormat}</div>
    );
  }

  const { identity } = dataset;

  return (
    <div>
      <ProfilePlayerHeader
        identity={identity}
        t={t}
        canFavorite={!!known}
        isFavorite={!!known && favoriteIds.includes(known.puuid)}
        onToggleFavorite={() => known && onToggleFavorite(known.puuid)}
      />

      <div className="flex items-start gap-2.5 mb-5 px-3 py-2.5 border border-neutral-800 bg-neutral-950">
        <Info size={14} className="text-neutral-500 shrink-0 mt-0.5" />
        <span className="text-[11px] font-body text-neutral-400 leading-relaxed">{t.profileDisclaimerBanner}</span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-neutral-800 overflow-x-auto">
        {PROFILE_TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`font-display text-sm tracking-wide px-4 py-2 uppercase whitespace-nowrap transition-colors ${
              tab === tb ? 'text-accent border-b-2 border-accent' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {t.tabs[tb]}
          </button>
        ))}
      </div>

      {tab === 'overview' && <ProfileOverview dataset={dataset} t={t} accent={accent} />}
      {tab === 'agents' && (
        <AgentsTab
          t={t}
          isPremium={isPremium}
          filteredGames={dataset.games}
          weapons={dataset.weapons}
          ecoForceWr={dataset.economy.ecoForceWr}
          showAds={false}
          showSuggestions={false}
        />
      )}
      {tab === 'economy' && (
        <EconomyTab t={t} isPremium={isPremium} stats={dataset.economy} rounds={dataset.economy} showAds={false} />
      )}
      {tab === 'compare' && <ProfileCompare dataset={dataset} t={t} loggedIn={loggedIn} />}
      {tab === 'leaderboard' && (
        <LeaderboardTab t={t} highlightRiotId={{ name: identity.name, tag: identity.tag }} />
      )}
      {tab === 'badges' && (
        <BadgesTab t={t} isPremium={isPremium} badges={dataset.badges} showAds={false} />
      )}
      {tab === 'progress' && (
        <ProgressTab
          t={t}
          isPremium={isPremium}
          timelineData={dataset.progression}
          badges={dataset.badges}
          readOnly
          showAds={false}
        />
      )}
    </div>
  );
}
