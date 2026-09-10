import { TrendingUp, Zap, Swords, Flame, Trophy } from 'lucide-react';
import { hashString, otherPlayers, badgeDefs, weaponStats } from './mockData.js';

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic per-player dataset for the public profile PAGE (/player/<slug>).
//
// Scope has no Riot match-history API yet, so a searched player's match-level data
// can't be real. Everything here is generated deterministically from a hash of the
// Riot ID string — the same player always renders the same profile — and anchored to
// whatever summary numbers we do have: if the Riot ID matches a known `otherPlayers`
// entry we use its real rank / KDA / ACS / accuracy / headshots as the anchor, else a
// plausible rank is synthesised. Every structure below mirrors the shape of its
// real-dashboard counterpart in mockData.js so the existing compute*() helpers and tab
// components work on it unchanged. The page shows a standing "indicative snapshot"
// disclaimer — see PlayerProfilePage.jsx.
//
// Draws come from a seeded mulberry32 stream (proper decorrelated PRNG) rather than the
// sin-based seededValue used elsewhere — sequential sin samples alias badly and were
// producing runs like a 16-game win streak.
// ─────────────────────────────────────────────────────────────────────────────

function mulberry32(a) {
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AGENT_POOL = ['Jett', 'Reyna', 'Raze', 'Omen', 'Sova', 'Killjoy', 'Cypher', 'Fade', 'Chamber', 'Neon', 'Sage', 'Breach'];
const MAP_POOL = ['Ascent', 'Bind', 'Haven', 'Split', 'Lotus', 'Sunset', 'Icebox', 'Pearl', 'Breeze', 'Abyss', 'Fracture'];
const MODE_POOL = ['competitive', 'competitive', 'competitive', 'competitive', 'unrated', 'unrated', 'swiftplay'];

const RANK_LADDER = [
  'Iron 2', 'Bronze 1', 'Bronze 3', 'Silver 2', 'Gold 1', 'Gold 3',
  'Platinum 2', 'Diamond 1', 'Diamond 3', 'Ascendant 2', 'Immortal 1', 'Immortal 3',
];

function riotIdKey(riotId) {
  return `${(riotId?.name ?? '').toLowerCase()}#${(riotId?.tag ?? '').toLowerCase()}`;
}

const pick = (arr, r) => arr[Math.floor(r * arr.length)];

// Anchor stats: real ones when the Riot ID is a known public Scope player, otherwise a
// stable synthetic profile derived from the ID hash.
function resolveAnchor(riotId, rnd) {
  const key = riotIdKey(riotId);
  const known = otherPlayers.find(
    (p) => `${p.name.toLowerCase()}#${p.tag.toLowerCase()}` === key && p.connected && p.isPublic && p.kda != null,
  );
  if (known) {
    return {
      name: known.name, tag: known.tag,
      rank: known.rank, peakRank: known.peakRank,
      kda: known.kda, acs: known.acs, accuracy: known.accuracy, headshots: known.headshots,
      known: true,
    };
  }
  const tierIdx = Math.floor(rnd() * RANK_LADDER.length);
  const rank = RANK_LADDER[tierIdx];
  const peakRank = RANK_LADDER[Math.min(RANK_LADDER.length - 1, tierIdx + (rnd() < 0.6 ? 1 : 0))];
  const skill = tierIdx / (RANK_LADDER.length - 1); // 0..1
  return {
    name: riotId.name, tag: riotId.tag,
    rank, peakRank,
    kda: Math.round((0.85 + skill * 0.85 + rnd() * 0.25) * 100) / 100,
    acs: Math.round(165 + skill * 110 + rnd() * 30),
    accuracy: Math.round(16 + skill * 12 + rnd() * 6),
    headshots: Math.round(18 + skill * 18 + rnd() * 8),
    known: false,
  };
}

function buildGames(rnd, anchor) {
  const winP = Math.max(0.34, Math.min(0.66, 0.3 + anchor.kda * 0.2));
  const COUNT = 30;
  let dayCursor = 0;
  return Array.from({ length: COUNT }, (_, i) => {
    dayCursor += 1 + Math.floor(rnd() * 4); // 1..4 days between games, oldest last
    const result = rnd() < winP ? 'win' : 'loss';
    const agent = pick(AGENT_POOL, rnd());
    const map = pick(MAP_POOL, rnd());
    const mode = pick(MODE_POOL, rnd());
    const d = Math.round(12 + rnd() * 7);
    const a = Math.round(3 + rnd() * 6);
    const k = Math.max(6, Math.round(anchor.kda * d - a + (rnd() * 8 - 4)));
    const acs = Math.round(anchor.acs * (0.8 + rnd() * 0.4));
    const loseScore = 3 + Math.floor(rnd() * 9); // 3..11
    const score = result === 'win' ? `13-${loseScore}` : `${loseScore}-13`;
    const clutchPlayed = rnd() < 0.5 ? (rnd() < 0.6 ? 1 : 2) : 0;
    const clutchWon = clutchPlayed ? Math.round(rnd() * clutchPlayed) : 0;
    return {
      id: `pp${i + 1}`,
      mode,
      map,
      result,
      score,
      agent,
      kda: `${k}/${d}/${a}`,
      acs,
      daysAgo: Math.min(88, dayCursor),
      accuracy: Math.max(8, Math.round(anchor.accuracy * (0.75 + rnd() * 0.5))),
      hs: Math.max(10, Math.round(anchor.headshots * (0.7 + rnd() * 0.6))),
      firstBloods: Math.floor(rnd() * 3),
      clutchWon,
      clutchPlayed,
    };
  });
}

function buildRrHistory(rnd) {
  let rr = 25 + Math.round(rnd() * 45);
  return Array.from({ length: 7 }, (_, i) => {
    rr = Math.max(6, Math.min(96, rr + Math.round((rnd() - 0.45) * 40)));
    return { s: i + 1, rr };
  });
}

// Clone the real badge roster, re-rolling the per-player progress so a stranger's board
// isn't identical to the owner's. Tiered badges get a fresh `value`; single-state ones
// get their `unlocked` flag re-rolled (weighted so most stay locked).
function buildBadges(rnd) {
  return badgeDefs.map((b) => {
    if (b.tiers && b.value !== undefined) {
      const ceiling = b.tiers[b.tiers.length - 1];
      return { ...b, value: Math.round(rnd() ** 1.7 * ceiling) };
    }
    // "First steps" is auto-granted to any account that exists — keep it unlocked for
    // every profile rather than re-rolling it.
    if (b.id === 'firstSteps') return { ...b };
    return { ...b, unlocked: rnd() < 0.4 };
  });
}

const PROGRESSION_TEMPLATES = [
  { icon: TrendingUp, titleKey: 'timelineFirstDiamondTitle', descKey: 'timelineFirstDiamondDesc', type: 'rank', param: (a) => ({ rank: a.rank.toUpperCase() }) },
  { icon: Zap, titleKey: 'timelineBestClimbTitle', descKey: 'timelineBestClimbDesc', type: 'record', param: () => ({ rr: 15, map: 'Sunset' }) },
  { icon: Swords, titleKey: 'timelineFirstAceTitle', descKey: 'timelineFirstAceDesc', type: 'record', param: () => ({ map: 'Bind' }) },
  { icon: Flame, titleKey: 'timelineStreakTitle', descKey: 'timelineStreakDesc', type: 'streak', param: () => ({ n: 5, map: 'Ascent' }) },
  { icon: Trophy, titleKey: 'timelineTodayTitle', descKey: 'timelineTodayDesc', type: 'rank', param: (a) => ({ rank: a.rank }) },
];

function buildProgression(rnd, anchor) {
  const spans = [82, 58, 34, 12, 0];
  return PROGRESSION_TEMPLATES
    .map((tpl, i) => ({
      id: `ppm${i + 1}`,
      daysAgo: Math.max(0, spans[i] + Math.round((rnd() - 0.5) * 10)),
      icon: tpl.icon,
      titleKey: tpl.titleKey,
      descKey: tpl.descKey,
      descParams: tpl.param(anchor),
      type: tpl.type,
    }))
    .sort((a, b) => b.daysAgo - a.daysAgo);
}

function buildEconomy(rnd, games) {
  const clutch = games.reduce(
    (acc, g) => ({ won: acc.won + g.clutchWon, played: acc.played + g.clutchPlayed }),
    { won: 0, played: 0 },
  );
  return {
    syncRate: 58 + Math.round(rnd() * 32),
    outOfSyncBuys: 2 + Math.round(rnd() * 7),
    outOfSyncSaves: 1 + Math.round(rnd() * 5),
    pistolWr: 40 + Math.round(rnd() * 35),
    ecoForceWr: 22 + Math.round(rnd() * 30),
    clutches: [
      { situation: '1v1', attempts: Math.max(clutch.played, 10), won: Math.round((clutch.played ? clutch.won / clutch.played : 0.45) * Math.max(clutch.played, 10)) },
      { situation: '1v2', attempts: 6 + Math.round(rnd() * 5), won: 2 + Math.round(rnd() * 3) },
      { situation: '1v3', attempts: 3 + Math.round(rnd() * 3), won: Math.round(rnd() * 2) },
      { situation: '1v4', attempts: 1 + Math.round(rnd() * 2), won: rnd() < 0.2 ? 1 : 0 },
      { situation: '1v5', attempts: rnd() < 0.5 ? 1 : 0, won: 0 },
    ],
  };
}

function buildWeapons(rnd) {
  const rolled = weaponStats.map((w) => ({
    name: w.name,
    category: w.category,
    accuracy: Math.max(0, Math.round(w.accuracy * (0.7 + rnd() * 0.6))),
    kills: Math.round(w.kills * (0.4 + rnd() * 1.3)),
    favorite: false,
  }));
  const top = rolled.reduce((best, w) => (w.kills > best.kills ? w : best), rolled[0]);
  if (top) top.favorite = true;
  return rolled;
}

function buildActivity(rnd) {
  return Array.from({ length: 90 }, (_, i) => {
    const daysAgo = 89 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const roll = rnd();
    return { date: date.toISOString().slice(0, 10), games: roll < 0.42 ? 0 : Math.ceil(roll * 4) };
  });
}

// Public rank-tier averages the profile's Comparisons tab measures a player against when
// the viewer isn't logged in (or picks "vs rank average"). Broad, illustrative bands.
export function rankAverageStats(rank = '') {
  const r = rank.toLowerCase();
  if (/(immortal|radiant|ascendant)/.test(r)) return { kda: 1.35, acs: 245, accuracy: 24, headshots: 32 };
  if (/(diamond|platinum)/.test(r)) return { kda: 1.15, acs: 215, accuracy: 21, headshots: 27 };
  if (/(gold|silver)/.test(r)) return { kda: 1.0, acs: 190, accuracy: 19, headshots: 23 };
  return { kda: 0.9, acs: 170, accuracy: 17, headshots: 20 };
}

const cache = new Map();

export function getPlayerDataset(riotId) {
  if (!riotId?.name || !riotId?.tag) return null;
  const key = riotIdKey(riotId);
  if (cache.has(key)) return cache.get(key);

  // One shared stream: each build* consumes the next N draws in a fixed order, so the
  // whole dataset is reproducible for a given Riot ID.
  const rnd = mulberry32(hashString(key || 'unknown'));
  const anchor = resolveAnchor(riotId, rnd);
  const games = buildGames(rnd, anchor);

  const dataset = {
    identity: {
      name: anchor.name,
      tag: anchor.tag,
      rank: anchor.rank,
      peakRank: anchor.peakRank,
      rr: 8 + Math.round(rnd() * 88),
      rrGoal: 100,
      known: anchor.known,
    },
    summary: { kda: anchor.kda, acs: anchor.acs, accuracy: anchor.accuracy, headshots: anchor.headshots },
    games,
    rrHistory: buildRrHistory(rnd),
    badges: buildBadges(rnd),
    progression: buildProgression(rnd, anchor),
    economy: buildEconomy(rnd, games),
    weapons: buildWeapons(rnd),
    activity: buildActivity(rnd),
    rankAverage: rankAverageStats(anchor.rank),
  };
  cache.set(key, dataset);
  return dataset;
}
