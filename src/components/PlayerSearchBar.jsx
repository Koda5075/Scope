import { useMemo, useState } from 'react';
import { Search, Star, X, Lock, UserPlus, Clock } from 'lucide-react';
import Modal from './Modal.jsx';
import PlayerProfileCard from './PlayerProfileCard.jsx';
import PlayerCompareView from './PlayerCompareView.jsx';
import { otherPlayers } from '../data/mockData.js';
import { parseRiotId } from '../lib/riotId.js';

const RECENT_KEY = 'scope-recent-searches';
const RECENT_MAX = 6;

function loadRecent() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v.slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

export default function PlayerSearchBar({ t, favoriteIds, onToggleFavorite, filteredGames }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('profile');
  const [inviteCopied, setInviteCopied] = useState(false);
  const [recent, setRecent] = useState(loadRecent);
  const [focused, setFocused] = useState(false);

  const favorites = otherPlayers.filter((p) => favoriteIds.includes(p.puuid));

  // As-you-type matches against the players Scope already knows (connected + public).
  // Not a real directory — that needs the Riot API — but it makes known IDs findable
  // without typing the exact tag. Favorites first, then anyone recently searched, then
  // everyone else — same "people you actually care about" ordering as the favorites/
  // recent-searches rows below the input, just applied to the live suggestion list too.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const recentLower = recent.map((r) => r.toLowerCase());
    const rank = (p) => {
      if (favoriteIds.includes(p.puuid)) return 0;
      if (recentLower.includes(`${p.name}#${p.tag}`.toLowerCase())) return 1;
      return 2;
    };
    return otherPlayers
      .filter((p) => p.connected && p.isPublic && `${p.name}#${p.tag}`.toLowerCase().includes(q))
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, 5);
  }, [query, favoriteIds, recent]);

  function pushRecent(riotId) {
    setRecent((prev) => {
      const next = [riotId, ...prev.filter((r) => r.toLowerCase() !== riotId.toLowerCase())].slice(0, RECENT_MAX);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  }

  function openPlayer(p, initialView = 'profile') {
    setSelected(p);
    setView(initialView);
    setResult(null);
    setQuery('');
    setFocused(false);
    pushRecent(`${p.name}#${p.tag}`);
  }

  function runSearch(raw) {
    const parsed = parseRiotId(raw);
    if (!parsed) {
      setResult({ status: 'invalid' });
      return;
    }
    const match = otherPlayers.find(
      (p) => p.name.toLowerCase() === parsed.name.toLowerCase() && p.tag.toLowerCase() === parsed.tag.toLowerCase()
    );
    if (match && match.connected && match.isPublic) {
      openPlayer(match);
    } else if (match && match.connected && !match.isPublic) {
      setResult({ status: 'private' });
      pushRecent(`${parsed.name}#${parsed.tag}`);
    } else {
      setResult({ status: 'not_found', riotId: `${parsed.name}#${parsed.tag}` });
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    runSearch(query);
  }

  async function handleInvite() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  const showRecentRow = focused && query.trim() === '' && !result && recent.length > 0;

  return (
    <div className="mb-6" data-tour="search">
      <form onSubmit={handleSearch} className="relative">
        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-accent transition-colors" aria-label={t.searchPlaceholder}>
          <Search size={14} />
        </button>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setResult(null); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none pl-9 pr-3 py-2.5 text-sm font-body text-neutral-200 placeholder:text-neutral-600 transition-colors"
        />

        {focused && suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 top-full mt-1 border border-neutral-800 bg-neutral-950 shadow-lg">
            {suggestions.map((p) => (
              <div key={p.puuid} className="group flex items-center justify-between w-full px-3 py-2 hover:bg-neutral-900 transition-colors">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => openPlayer(p)}
                  className="flex-1 min-w-0 flex items-center justify-between gap-2 text-left"
                >
                  <span className="text-xs font-body text-neutral-200 truncate">
                    {p.name}<span className="text-neutral-600">#{p.tag}</span>
                  </span>
                  <span className="text-[10px] font-body text-neutral-600 shrink-0">{p.rank}</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => openPlayer(p, 'compare')}
                  className="shrink-0 ml-2 text-[10px] font-body text-neutral-600 group-hover:text-accent hover:underline transition-colors"
                >
                  {t.searchCompareInline}
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {showRecentRow && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.recentSearchesTitle}</span>
          {recent.map((r) => (
            <button
              key={r}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runSearch(r)}
              className="flex items-center gap-1.5 border border-neutral-800 hover:border-accent px-2.5 py-1 text-xs font-body text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Clock size={10} className="text-neutral-600" />
              {r}
            </button>
          ))}
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearRecent}
            className="text-[10px] font-body text-neutral-600 hover:text-accent transition-colors"
          >
            {t.clearRecentSearches}
          </button>
        </div>
      )}

      {result?.status === 'invalid' && (
        <div className="mt-2 text-xs font-body text-neutral-500">{t.searchInvalidFormat}</div>
      )}

      {result?.status === 'private' && (
        <div className="mt-2 flex items-center gap-3 border border-neutral-800 bg-neutral-950 px-3 py-3">
          <Lock size={16} className="text-neutral-500 shrink-0" />
          <div>
            <div className="text-xs font-body text-neutral-300">{t.searchPrivateTitle}</div>
            <div className="text-[11px] font-body text-neutral-500 mt-0.5">{t.searchPrivateDesc}</div>
          </div>
        </div>
      )}

      {result?.status === 'not_found' && (
        <div className="mt-2 flex items-center gap-3 border border-neutral-800 bg-neutral-950 px-3 py-3">
          <UserPlus size={16} className="text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-body text-neutral-300">{t.searchNotOnScopeTitle}</div>
            <div className="text-[11px] font-body text-neutral-500 mt-0.5">{t.searchNotOnScopeDesc}</div>
          </div>
          <button
            onClick={handleInvite}
            className="shrink-0 text-[11px] font-body text-accent hover:underline whitespace-nowrap"
          >
            {inviteCopied ? t.linkCopied : t.inviteButton}
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.favoritesTitle}</span>
          {favorites.map((p) => (
            <div
              key={p.puuid}
              className="group flex items-center gap-1.5 border border-neutral-800 hover:border-accent pl-2.5 pr-1.5 py-1 text-xs font-body text-neutral-300 transition-colors"
            >
              <button onClick={() => openPlayer(p)} className="flex items-center gap-1.5">
                <Star size={10} className="text-accent" fill="currentColor" />
                {p.name}
              </button>
              <button
                onClick={() => onToggleFavorite(p.puuid)}
                className="text-neutral-700 hover:text-accent transition-colors"
                aria-label={t.removeFavorite}
                title={t.removeFavorite}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)} closeLabel={t.close}>
          {view === 'profile' ? (
            <PlayerProfileCard
              player={selected}
              isFavorite={favoriteIds.includes(selected.puuid)}
              onToggleFavorite={onToggleFavorite}
              onCompare={() => setView('compare')}
              t={t}
            />
          ) : (
            <PlayerCompareView player={selected} onBack={() => setView('profile')} t={t} filteredGames={filteredGames} />
          )}
        </Modal>
      )}
    </div>
  );
}
