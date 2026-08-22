import { useMemo, useState } from 'react';
import { Search, Star, X } from 'lucide-react';
import Modal from './Modal.jsx';
import PlayerProfileCard from './PlayerProfileCard.jsx';
import PlayerCompareView from './PlayerCompareView.jsx';
import { otherPlayers } from '../data/mockData.js';

export default function PlayerSearchBar({ t, favoriteIds, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('profile');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return otherPlayers.filter((p) => p.connected && p.isPublic && `${p.name}#${p.tag}`.toLowerCase().includes(q));
  }, [query]);

  const favorites = otherPlayers.filter((p) => favoriteIds.includes(p.puuid));

  function openPlayer(p) {
    setSelected(p);
    setView('profile');
    setQuery('');
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none pl-9 pr-3 py-2.5 text-sm font-body text-neutral-200 placeholder:text-neutral-600 transition-colors"
        />
        {query.trim() && (
          <div className="absolute z-20 mt-1 w-full bg-[#0F0F0F] border border-neutral-800 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-3 py-3 text-xs font-body text-neutral-500">{t.searchNoResults}</div>
            ) : (
              results.map((p) => (
                <button
                  key={p.puuid}
                  onClick={() => openPlayer(p)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-900 transition-colors"
                >
                  <span className="text-sm font-body text-neutral-200">
                    {p.name}
                    <span className="text-neutral-600">#{p.tag}</span>
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">{p.rank}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

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
