import { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { otherPlayers, acts, filterGames } from '../../data/mockData.js';
import { getPlayerDataset } from '../../data/playerProfileData.js';
import FilterBar from '../FilterBar.jsx';
import AgentsTab from '../tabs/AgentsTab.jsx';
import EconomyTab from '../tabs/EconomyTab.jsx';
import BadgesTab from '../tabs/BadgesTab.jsx';
import ProgressTab from '../tabs/ProgressTab.jsx';
import LeaderboardTab from '../tabs/LeaderboardTab.jsx';
import ProfilePlayerHeader from './ProfilePlayerHeader.jsx';
import ProfileOverview from './ProfileOverview.jsx';
import ProfileCompare from './ProfileCompare.jsx';

const PROFILE_TABS = ['overview', 'agents', 'economy', 'compare', 'leaderboard', 'badges', 'progress'];
const MODES = ['all', 'competitive', 'unrated', 'deathmatch', 'spikerush', 'escalation', 'teamdeathmatch', 'swiftplay'];
const PERIODS = ['7d', '30d', 'act', 'all'];
const DEFAULT_TITLE = 'Scope — VALORANT Stats Tracker';
const DEFAULT_ACT = () => acts.find((a) => a.current)?.id ?? acts[0].id;

// Tab + Mode/Period filters are read from the query string on load (so a copied
// "filtered link" opens into the same view) and default otherwise. They are LOCAL page
// state — never persisted, never shared — so navigating to another player, whose URL
// carries no params, resets everything (see the riotId effect below).
function initialTab() {
  try {
    const q = new URLSearchParams(window.location.search).get('tab');
    return PROFILE_TABS.includes(q) ? q : 'overview';
  } catch {
    return 'overview';
  }
}

function initialFilters() {
  try {
    const q = new URLSearchParams(window.location.search);
    const m = q.get('mode');
    const p = q.get('period');
    const a = q.get('act');
    return {
      mode: MODES.includes(m) ? m : 'all',
      // Defaults to "all history" on a profile (not "7d" like the owner dashboard) — a
      // stranger's last 7 days is often only a couple of games and reads as an empty page.
      period: PERIODS.includes(p) ? p : 'all',
      actId: a && acts.some((x) => x.id === a) ? a : DEFAULT_ACT(),
    };
  } catch {
    return { mode: 'all', period: 'all', actId: DEFAULT_ACT() };
  }
}

export default function PlayerProfilePage({ riotId, t, lang, loggedIn, isPremium, accent, favoriteIds, onToggleFavorite }) {
  const [tab, setTab] = useState(initialTab);
  const [filters, setFilters] = useState(initialFilters);
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

  // App.jsx keys this component on the Riot ID, so a different player remounts it fresh —
  // tab, filters and any open match modal all reset to defaults (initial*() re-run
  // against the new, param-free URL). No manual per-player reset needed here.

  // Mirror tab + filters into the query string (replaceState, so no extra history
  // entries — browser Back still goes straight to the dashboard). Only non-default
  // values are written, keeping a pristine profile URL clean.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const sp = url.searchParams;
      tab !== 'overview' ? sp.set('tab', tab) : sp.delete('tab');
      filters.mode !== 'all' ? sp.set('mode', filters.mode) : sp.delete('mode');
      filters.period !== 'all' ? sp.set('period', filters.period) : sp.delete('period');
      filters.period === 'act' ? sp.set('act', filters.actId) : sp.delete('act');
      window.history.replaceState({}, '', url);
    } catch { /* ignore */ }
  }, [tab, filters]);

  const selectedAct = acts.find((a) => a.id === filters.actId) ?? acts[0];
  const filteredGames = useMemo(
    () => (dataset ? filterGames(dataset.games, { mode: filters.mode, period: filters.period, act: selectedAct }) : []),
    [dataset, filters.mode, filters.period, selectedAct],
  );

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

      <FilterBar
        t={t}
        mode={filters.mode}
        setMode={(m) => setFilters((f) => ({ ...f, mode: m }))}
        period={filters.period}
        setPeriod={(p) => setFilters((f) => ({ ...f, period: p }))}
        acts={acts}
        actId={filters.actId}
        setActId={(a) => setFilters((f) => ({ ...f, actId: a }))}
      />

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

      {tab === 'overview' && <ProfileOverview dataset={dataset} games={filteredGames} t={t} accent={accent} />}
      {tab === 'agents' && (
        <AgentsTab
          t={t}
          isPremium={isPremium}
          filteredGames={filteredGames}
          weapons={dataset.weapons}
          ecoForceWr={dataset.economy.ecoForceWr}
          showAds={false}
          showSuggestions={false}
        />
      )}
      {tab === 'economy' && (
        <EconomyTab t={t} isPremium={isPremium} stats={dataset.economy} rounds={dataset.economy} showAds={false} />
      )}
      {tab === 'compare' && <ProfileCompare dataset={dataset} games={filteredGames} t={t} loggedIn={loggedIn} />}
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
