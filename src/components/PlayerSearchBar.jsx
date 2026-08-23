import { useState } from 'react';
import { Search, Star, X, Lock, UserPlus } from 'lucide-react';
import Modal from './Modal.jsx';
import PlayerProfileCard from './PlayerProfileCard.jsx';
import PlayerCompareView from './PlayerCompareView.jsx';
import { otherPlayers } from '../data/mockData.js';
import { parseRiotId } from '../lib/riotId.js';

export default function PlayerSearchBar({ t, favoriteIds, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('profile');
  const [inviteCopied, setInviteCopied] = useState(false);

  const favorites = otherPlayers.filter((p) => favoriteIds.includes(p.puuid));

  function openPlayer(p) {
    setSelected(p);
    setView('profile');
    setResult(null);
    setQuery('');
  }

  function handleSearch(e) {
    e.preventDefault();
    const parsed = parseRiotId(query);
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
    } else {
      setResult({ status: 'not_found', riotId: `${parsed.name}#${parsed.tag}` });
    }
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

  return (
    <div className="mb-6" data-tour="search">
      <form onSubmit={handleSearch} className="relative">
        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-accent transition-colors" aria-label={t.searchPlaceholder}>
          <Search size={14} />
        </button>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setResult(null); }}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none pl-9 pr-3 py-2.5 text-sm font-body text-neutral-200 placeholder:text-neutral-600 transition-colors"
        />
      </form>

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
            <PlayerCompareView player={selected} onBack={() => setView('profile')} t={t} />
          )}
        </Modal>
      )}
    </div>
  );
}
