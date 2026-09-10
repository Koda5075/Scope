import { useEffect, useState } from 'react';

// Minimal client-side router. The app is otherwise a single view gated on `loggedIn`,
// so this only needs to tell "the dashboard" apart from "a player profile page" and
// keep a real, shareable URL in the address bar. No dependency — same hand-rolled style
// as the existing `?mode=&period=` query-param round-trip in App.jsx.
//
// vercel.json already rewrites every path to /index.html, so /player/<slug> survives a
// hard refresh and direct links; the Vite dev server does the same for unknown paths.

const NAV_EVENT = 'scope:navigate';
const PLAYER_RE = /^\/player\/(.+)$/;

// Riot IDs are Name#Tag; names allow letters, digits and spaces but not '-', and tags
// are short alphanumerics — so a single '-' cleanly joins the two halves in the slug,
// and splitting on the LAST '-' is unambiguous. Each half is percent-encoded so spaces
// and any stray punctuation survive the round-trip.
export function playerPath(riotId) {
  if (!riotId?.name || !riotId?.tag) return '/';
  return `/player/${encodeURIComponent(riotId.name)}-${encodeURIComponent(riotId.tag)}`;
}

function slugToRiotId(slug) {
  const raw = decodeURIComponent(slug).trim();
  const dash = raw.lastIndexOf('-');
  if (dash <= 0 || dash === raw.length - 1) return null;
  try {
    return {
      name: decodeURIComponent(raw.slice(0, dash)),
      tag: decodeURIComponent(raw.slice(dash + 1)),
    };
  } catch {
    // Malformed percent-encoding — fall back to the raw split rather than throwing.
    return { name: raw.slice(0, dash), tag: raw.slice(dash + 1) };
  }
}

export function parseRoute(pathname = window.location.pathname) {
  const m = pathname.match(PLAYER_RE);
  if (m) {
    const riotId = slugToRiotId(m[1]);
    if (riotId) return { name: 'player', riotId, slug: m[1] };
  }
  return { name: 'dashboard' };
}

export function navigate(path) {
  if (path === window.location.pathname + window.location.search) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new CustomEvent(NAV_EVENT));
}

// Re-renders the subscriber on browser back/forward (popstate) and on our own
// navigate() calls (the custom event — pushState alone fires nothing).
export function useRoute() {
  const [route, setRoute] = useState(() => parseRoute());
  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);
  return route;
}
