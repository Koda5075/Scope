import { Users, Flame, TrendingUp, Swords, Target, Trophy, RotateCcw, Moon, Sunrise, Hourglass, HeartHandshake, Crosshair, Compass, Shuffle, Zap, ShieldAlert, Award, CalendarClock, Footprints, Star } from 'lucide-react';
import { getAllAgentNames } from './valorantAssets.js';

// `s` is a plain session index (1-based) rather than a pre-formatted "S1" string, so the
// chart's tick/tooltip formatters can render it as a full "Session 1" label per locale
// instead of a cryptic abbreviation.
export const rrHistory = [
  { s: 1, rr: 38 }, { s: 2, rr: 52 }, { s: 3, rr: 45 }, { s: 4, rr: 61 },
  { s: 5, rr: 57 }, { s: 6, rr: 74 }, { s: 7, rr: 67 },
];

// Tier ladder shared by every progressive badge. TIER_NAMES stays English (internal
// key/log use); TIER_NAME_KEYS gives the matching translations.js key for display.
export const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Diamond'];
export const TIER_NAME_KEYS = ['tierBronze', 'tierSilver', 'tierGold', 'tierDiamond'];
export const TIER_COLORS = ['#CD7F32', '#C0C4C9', '#F2C94C', '#7DD3E8'];

// Badges with a natural cumulative counter get a 4-tier progression (tiers = thresholds,
// value = current count). One-off or snapshot-style achievements (Comeback, Marathon,
// Explorer, time-of-day patterns, current percentile/rank-tier reached) keep the simple
// single-state display — forcing 4 levels on those wouldn't mean anything.
// Single-state badges (no tiers/value) carry their own `unlocked` flag since there's no
// numeric threshold to derive it from — a mix of true/false so the Badges tab has real
// locked entries to show, not just achievements.
export const badgeDefs = [
  // Auto-unlocked the moment an account exists, so the Badges tab already has one
  // unlocked entry on day one instead of a wall of locked cards.
  { id: 'firstSteps', icon: Footprints, unlocked: true, daysAgo: 94 },
  // Matches Jett's games count in `agentStats` below — the agent actually played the
  // most, same "kept in sync with the real numbers" rule every other badge value follows.
  { id: 'specialist', icon: Star, tiers: [10, 25, 50, 100], value: 14 },
  { id: 'teamPlayer', icon: Users, tiers: [10, 25, 50, 100], value: 38 },
  { id: 'aceX3', icon: Swords, tiers: [1, 3, 10, 25], value: 7 },
  { id: 'headshots200', icon: Target, tiers: [100, 500, 1000, 2500], value: 640 },
  { id: 'streak5', icon: Flame, tiers: [3, 5, 10, 30], value: 8 },
  { id: 'newTier', icon: TrendingUp, unlocked: true, daysAgo: 82 },
  { id: 'top15', icon: Trophy, unlocked: true, daysAgo: 45 },
  // Converted from one-off boolean achievements to tiered counters — same "extend the
  // existing tier system to more badges" direction as `specialist`/`teamPlayer`/etc.,
  // rather than a second, parallel badge mechanic.
  { id: 'comeback', icon: RotateCcw, tiers: [1, 3, 5, 10], value: 2 },
  { id: 'nightOwl', icon: Moon, tiers: [3, 10, 25, 50], value: 0, secret: true },
  { id: 'earlyBird', icon: Sunrise, tiers: [3, 10, 25, 50], value: 14 },
  { id: 'marathon', icon: Hourglass, unlocked: false },
  { id: 'supportStar', icon: HeartHandshake, tiers: [200, 500, 1000, 2000], value: 740 },
  { id: 'rivalSlayer', icon: Crosshair, tiers: [1, 5, 15, 30], value: 4 },
  // value = distinct maps with games > 0 in `mapStats` below (8 of 13) — real, not
  // invented, so this one's already past its first tier rather than starting at 0.
  { id: 'explorer', icon: Compass, tiers: [4, 7, 10, 13], value: 8, secret: true },
  { id: 'versatile', icon: Shuffle, tiers: [3, 6, 10, 15], value: 7 },
];

// Returns null for single-state badges (no `tiers`/`value`). Otherwise the current tier
// reached and progress toward the next one (100% + isMaxed once Diamond is reached).
export function getBadgeProgress(badge) {
  if (!badge.tiers || badge.value === undefined) return null;

  const { tiers, value } = badge;
  let tierIndex = -1;
  for (let i = 0; i < tiers.length; i++) {
    if (value >= tiers[i]) tierIndex = i;
  }

  const isMaxed = tierIndex === tiers.length - 1;
  const floor = tierIndex >= 0 ? tiers[tierIndex] : 0;
  const nextThreshold = isMaxed ? null : tiers[tierIndex + 1];
  const progressPct = isMaxed ? 100 : Math.min(100, Math.round(((value - floor) / (nextThreshold - floor)) * 100));

  return {
    tierIndex,
    tierName: tierIndex >= 0 ? TIER_NAMES[tierIndex] : null,
    tierNameKey: tierIndex >= 0 ? TIER_NAME_KEYS[tierIndex] : null,
    tierColor: tierIndex >= 0 ? TIER_COLORS[tierIndex] : '#525252',
    value,
    nextThreshold,
    progressPct,
    isMaxed,
  };
}

// A tiered badge is unlocked once it has reached its first tier; a single-state badge
// carries its own `unlocked` flag (set on the badge def above).
export function isBadgeUnlocked(badge) {
  if (badge.tiers) {
    const progress = getBadgeProgress(badge);
    return !!progress && progress.tierIndex >= 0;
  }
  return !!badge.unlocked;
}

// Full 29-agent roster (verified against the live agent list, 2026-08-24) so the
// "Voir tout" popup on Agents & Maps can seed every agent that exists, not just the
// handful that happen to appear in recentGames — computeAgentStats (below) uses this
// array's `name` field to build that seed and then overwrites games/wr with real
// numbers derived from the filtered games, so the games/wr values here are never
// rendered directly; kept only so every entry has the same shape.
export const agentStats = [
  // Duelists
  { name: 'Phoenix', games: 0, wr: 0 },
  { name: 'Jett', games: 14, wr: 64 },
  { name: 'Reyna', games: 9, wr: 56 },
  { name: 'Raze', games: 0, wr: 0 },
  { name: 'Yoru', games: 0, wr: 0 },
  { name: 'Neon', games: 0, wr: 0 },
  { name: 'Iso', games: 0, wr: 0 },
  { name: 'Waylay', games: 0, wr: 0 },
  // Controllers
  { name: 'Brimstone', games: 0, wr: 0 },
  { name: 'Omen', games: 5, wr: 40 },
  { name: 'Viper', games: 0, wr: 0 },
  { name: 'Astra', games: 0, wr: 0 },
  { name: 'Harbor', games: 0, wr: 0 },
  { name: 'Clove', games: 0, wr: 0 },
  { name: 'Miks', games: 0, wr: 0 },
  // Initiators
  { name: 'Sova', games: 6, wr: 50 },
  { name: 'Breach', games: 0, wr: 0 },
  { name: 'Skye', games: 0, wr: 0 },
  { name: 'KAY/O', games: 0, wr: 0 },
  { name: 'Fade', games: 0, wr: 0 },
  { name: 'Gekko', games: 0, wr: 0 },
  { name: 'Tejo', games: 0, wr: 0 },
  // Sentinels
  { name: 'Sage', games: 0, wr: 0 },
  { name: 'Cypher', games: 3, wr: 33 },
  { name: 'Killjoy', games: 4, wr: 75 },
  { name: 'Chamber', games: 0, wr: 0 },
  { name: 'Deadlock', games: 0, wr: 0 },
  { name: 'Vyse', games: 0, wr: 0 },
  { name: 'Veto', games: 0, wr: 0 },
];

// atkWr/defWr are separate win rates for rounds started on attack vs. defense on that
// map — a real tactical signal (e.g. a map you're strong on overall but weak on one
// side) that the combined `wr` alone hides. bestAgent is the agent with the best
// winrate specifically on that map (agent x map cross-reference).
//
// Full 13-map roster (verified against the live map list, 2026-08-24), same reasoning
// as agentStats above: computeMapStats seeds every map from this array's `name`, then
// overwrites games/wr with real numbers from the filtered games — atkWr/defWr/bestAgent
// stay as this static, illustrative snapshot since recentGames has no per-side data.
export const mapStats = [
  { name: 'Bind', games: 8, wr: 62, atkWr: 58, defWr: 67, bestAgent: 'Jett' },
  { name: 'Haven', games: 5, wr: 40, atkWr: 33, defWr: 47, bestAgent: 'Sova' },
  { name: 'Split', games: 4, wr: 55, atkWr: 50, defWr: 60, bestAgent: 'Jett' },
  { name: 'Ascent', games: 6, wr: 50, atkWr: 61, defWr: 39, bestAgent: 'Reyna' },
  { name: 'Icebox', games: 3, wr: 67, atkWr: 71, defWr: 63, bestAgent: 'Sova' },
  { name: 'Breeze', games: 0, wr: 0, atkWr: 55, defWr: 60, bestAgent: 'Sova' },
  { name: 'Fracture', games: 3, wr: 45, atkWr: 40, defWr: 50, bestAgent: 'Killjoy' },
  { name: 'Pearl', games: 2, wr: 70, atkWr: 65, defWr: 75, bestAgent: 'Jett' },
  { name: 'Lotus', games: 0, wr: 0, atkWr: 40, defWr: 55, bestAgent: 'Reyna' },
  { name: 'Sunset', games: 2, wr: 55, atkWr: 60, defWr: 50, bestAgent: 'Sova' },
  { name: 'Abyss', games: 0, wr: 0, atkWr: 48, defWr: 52, bestAgent: 'Neon' },
  { name: 'Corrode', games: 0, wr: 0, atkWr: 50, defWr: 58, bestAgent: 'Viper' },
  { name: 'Summit', games: 0, wr: 0, atkWr: 53, defWr: 47, bestAgent: 'Fade' },
];

// ⚠️ Illustrative snapshot only, not a live value — captured for this mockup at the end
// of August 2026. Riot rotates the competitive map pool roughly every two months, so
// this exact 7-map list will likely already be out of date by the time this code is
// read; don't treat it as a permanent truth. Not wired into any filter yet — once the
// production Riot API is connected, the Act/Episode filter (`acts` below) should pull
// the real, live rotation instead of this constant.
export const CURRENT_COMPETITIVE_MAP_POOL = ['Ascent', 'Haven', 'Split', 'Sunset', 'Abyss', 'Lotus', 'Summit'];

// Round-type and clutch breakdown — Scope+. Pistol/eco-force winrates and clutch
// success rate by man-disadvantage situation, instead of just the flat clutch count
// already shown for free on the Overview tab.
// How often the player's own buy (full buy / eco / force / save) matched what most of
// the team did that round, vs bought or saved alone while teammates went the other way
// — illustrative, same "no real per-round economy API" caveat as the rest of this file.
export const economyStats = {
  syncRate: 74,
  outOfSyncBuys: 6,
  outOfSyncSaves: 3,
};

export const roundBreakdown = {
  pistolWr: 58,
  ecoForceWr: 36,
  clutches: [
    { situation: '1v1', attempts: 18, won: 11 },
    { situation: '1v2', attempts: 9, won: 4 },
    { situation: '1v3', attempts: 4, won: 1 },
    { situation: '1v4', attempts: 2, won: 0 },
    { situation: '1v5', attempts: 1, won: 0 },
  ],
};

// Win rate by day/time-of-day slot — Scope+. Mock data engineered so evening/weekend
// play is clearly the strongest slot, giving the "you perform best on weekend evenings"
// coaching-style callout something concrete to point at.
export const timePatterns = [
  { id: 'weekdayMorning', games: 6, wr: 33 },
  { id: 'weekdayEvening', games: 14, wr: 54 },
  { id: 'weekendAfternoon', games: 9, wr: 61 },
  { id: 'weekendEvening', games: 11, wr: 73 },
  { id: 'lateNight', games: 7, wr: 29 },
];

export const performanceScore = [
  { label: 'Aim', value: 82 },
  { label: 'Consistency', value: 74 },
  { label: 'Impact', value: 86 },
  { label: 'Clutch', value: 61 },
];

export const comparisons = [
  { metric: 'ACS', you: 238, rankAvg: 210, past: 195, max: 300 },
  { metric: 'KDA', you: 1.42, rankAvg: 1.25, past: 1.10, max: 2 },
  { metric: 'HS%', you: 31, rankAvg: 24, past: 27, max: 50 },
  { metric: 'DMG/Round', you: 145, rankAvg: 130, past: 125, max: 200 },
];

// hs is headshot %, rr is current ranked rating within the tier. Values line up with
// the same players in otherPlayers / myStats so the friends board and the head-to-head
// comparison above it never disagree.
export const friends = [
  { name: 'Nova#EUW1', acs: 261, kda: 1.61, hs: 34, rr: 178 },
  { name: 'KAITO#EUW1', acs: 238, kda: 1.42, hs: 31, rr: 67, isYou: true },
  { name: 'Miro#EUW1', acs: 204, kda: 1.18, hs: 26, rr: 121 },
];

export const myStats = { kda: 1.42, accuracy: 24, headshots: 31, acs: 238 };

export const peakRank = 'DIAMOND 3';

// Players findable via search/favorites/compare. Only entries with connected:true and
// isPublic:true should ever surface in search results — mirrors the real RSO opt-in
// policy (never-connected and opted-out players must be indistinguishable to searchers).
export const otherPlayers = [
  { puuid: 'p2', name: 'Nova', tag: 'EUW1', connected: true, isPublic: true, rank: 'Immortal 1', peakRank: 'Immortal 2', kda: 1.61, acs: 261, accuracy: 27, headshots: 34 },
  { puuid: 'p3', name: 'Miro', tag: 'EUW1', connected: true, isPublic: true, rank: 'Diamond 3', peakRank: 'Diamond 3', kda: 1.18, acs: 204, accuracy: 21, headshots: 26 },
  { puuid: 'p4', name: 'Shade', tag: 'EUW1', connected: true, isPublic: false, rank: 'Platinum 2', peakRank: 'Diamond 1', kda: 1.05, acs: 190, accuracy: 19, headshots: 22 },
  { puuid: 'p5', name: 'Volt', tag: 'NA1', connected: false, isPublic: false, rank: null, peakRank: null, kda: null, acs: null, accuracy: null, headshots: null },
];

// Full 19-weapon roster (verified against the live weapon list, 2026-08-24). Unlike
// agentStats/mapStats this one isn't filter-derived — recentGames has no per-match
// weapon field — so it's rendered directly, all-time. Weapons you'd realistically never
// buy (heavy machine guns, back-up pistols) are left at low/zero kills rather than
// dropped, so the "Voir tout" popup still lists the entire roster.
// "Melee" is the game's own official name for the knife (the brief's "Couteau" is just
// its French gloss) — kept in English like every other weapon/agent/map name here.
// `category` mirrors the grouping comments below (already the game's own weapon-shop
// categories) so the Weapons filter buttons don't need a second, separately-maintained
// mapping.
export const WEAPON_CATEGORIES = ['sidearm', 'smg', 'shotgun', 'rifle', 'sniper', 'heavy', 'melee'];

export const weaponStats = [
  // Sidearms
  { name: 'Classic', accuracy: 18, kills: 29, category: 'sidearm' },
  { name: 'Shorty', accuracy: 25, kills: 3, category: 'sidearm' },
  { name: 'Frenzy', accuracy: 22, kills: 2, category: 'sidearm' },
  { name: 'Ghost', accuracy: 22, kills: 18, category: 'sidearm' },
  { name: 'Sheriff', accuracy: 28, kills: 33, category: 'sidearm' },
  // SMGs
  { name: 'Stinger', accuracy: 20, kills: 7, category: 'smg' },
  { name: 'Spectre', accuracy: 19, kills: 41, category: 'smg' },
  // Shotguns
  { name: 'Bucky', accuracy: 27, kills: 6, category: 'shotgun' },
  { name: 'Judge', accuracy: 30, kills: 9, category: 'shotgun' },
  // Rifles
  { name: 'Bulldog', accuracy: 26, kills: 15, category: 'rifle' },
  { name: 'Guardian', accuracy: 33, kills: 22, category: 'rifle' },
  { name: 'Phantom', accuracy: 21, kills: 88, category: 'rifle' },
  { name: 'Vandal', accuracy: 24, kills: 142, favorite: true, category: 'rifle' },
  // Sniper rifles
  { name: 'Marshal', accuracy: 45, kills: 12, category: 'sniper' },
  { name: 'Outlaw', accuracy: 44, kills: 5, category: 'sniper' },
  { name: 'Operator', accuracy: 41, kills: 37, category: 'sniper' },
  // Heavy weapons
  { name: 'Ares', accuracy: 15, kills: 1, category: 'heavy' },
  { name: 'Odin', accuracy: 0, kills: 0, category: 'heavy' },
  // Melee
  { name: 'Melee', accuracy: 100, kills: 4, category: 'melee' },
];

// Deterministic pseudo-random in [0, 1) — keeps mock data reproducible across renders/builds.
function seededValue(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const activityCalendar = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const roll = seededValue(i);
  const games = roll < 0.3 ? 0 : Math.ceil(roll * 4);
  return { date: date.toISOString().slice(0, 10), games };
});

// Summary numbers for the activity calendar (total games, most active single day, days
// played) — gives the calendar block something concrete to say instead of just a grid
// of mostly-faint squares.
export function getActivitySummary(days = activityCalendar) {
  const totalGames = days.reduce((sum, d) => sum + d.games, 0);
  const mostActive = days.reduce((best, d) => (d.games > best.games ? d : best), days[0]);
  const activeDays = days.filter((d) => d.games > 0).length;
  return { totalGames, mostActiveDate: mostActive.date, mostActiveGames: mostActive.games, activeDays };
}

// Streak freezes are earned at streak milestones rather than sold, so the retention
// system stays free/non-pay-to-win (Scope+ sells coaching, not "lives"). Held count is
// capped at 3 — generous enough to forgive a real day off, not so generous the streak
// stops meaning anything. Flat mock constant for now (no live day-by-day backend yet to
// persist how many have actually been spent), same treatment as CURRENT_RANK/peakRank
// elsewhere in the mock dataset.
export const STREAK_FREEZES_AVAILABLE = 2;
export const STREAK_FREEZES_MAX = 3;
export const STREAK_MILESTONES = [3, 7, 14, 30, 100, 365];

// Daily activity streak (distinct from getStreaks' win/loss run) — consecutive calendar
// days with at least one game, walked back from today. A held freeze silently bridges a
// single missed day (mirrors Duolingo's "streak freeze": the gap doesn't break the
// count) but two misses in a row exceed what one freeze covers, so the streak still
// ends there — freezes forgive a real accident, not a multi-day break.
export function getActivityStreak(days = activityCalendar, freezesAvailable = STREAK_FREEZES_AVAILABLE) {
  let streak = 0;
  let freezesUsed = 0;
  let budget = freezesAvailable;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].games > 0) {
      streak++;
      continue;
    }
    const priorActive = i > 0 && days[i - 1].games > 0;
    if (budget > 0 && priorActive) {
      budget--;
      freezesUsed++;
      streak++;
      continue;
    }
    break;
  }
  return { streak, freezesUsed, freezesRemaining: freezesAvailable - freezesUsed };
}

// First 7 entries (daysAgo 0-6) intentionally reproduce the numbers that used to be
// hardcoded in OverviewTab's session summary (7 games, 5W-2L, best 24/9, worst 8/17),
// so the default filter (all modes, last 7 days) renders identically to before. The
// rest only surface once a wider period filter is selected.
// accuracy/hs are per-match percentages, firstBloods a per-match count, and
// clutchWon/clutchPlayed a per-match clutch-round record — added so the Overview
// StatReadout grid (KDA/Accuracy/Headshots/ACS/First Bloods/Clutches) can be genuinely
// derived from the filtered games, the same way the rest of Overview already is,
// instead of staying hardcoded regardless of the global filter.
export const recentGames = [
  { id: 'g1', mode: 'competitive', map: 'Bind', result: 'win', score: '13-9', agent: 'Jett', kda: '21/11/6', acs: 278, daysAgo: 0, accuracy: 28, hs: 36, firstBloods: 3, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g15', mode: 'competitive', map: 'Lotus', result: 'loss', score: '7-13', agent: 'Sova', kda: '15/16/8', acs: 229, daysAgo: 0, accuracy: 18, hs: 24, firstBloods: 1, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g16', mode: 'competitive', map: 'Ascent', result: 'win', score: '13-6', agent: 'Reyna', kda: '19/10/3', acs: 271, daysAgo: 0, accuracy: 26, hs: 33, firstBloods: 2, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g2', mode: 'competitive', map: 'Ascent', result: 'win', score: '13-11', agent: 'Reyna', kda: '18/12/4', acs: 245, daysAgo: 1, accuracy: 24, hs: 32, firstBloods: 2, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g3', mode: 'competitive', map: 'Haven', result: 'loss', score: '9-13', agent: 'Sova', kda: '12/15/5', acs: 198, daysAgo: 1, accuracy: 19, hs: 25, firstBloods: 1, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g4', mode: 'unrated', map: 'Split', result: 'win', score: '13-8', agent: 'Jett', kda: '15/11/7', acs: 210, daysAgo: 2, accuracy: 21, hs: 27, firstBloods: 1, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g17', mode: 'competitive', map: 'Breeze', result: 'loss', score: '9-13', agent: 'Reyna', kda: '16/17/6', acs: 238, daysAgo: 2, accuracy: 24, hs: 31, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g18', mode: 'unrated', map: 'Pearl', result: 'win', score: '13-5', agent: 'Reyna', kda: '12/10/4', acs: 223, daysAgo: 2, accuracy: 23, hs: 30, firstBloods: 1, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g5', mode: 'competitive', map: 'Bind', result: 'win', score: '13-10', agent: 'Reyna', kda: '16/13/3', acs: 225, daysAgo: 3, accuracy: 23, hs: 29, firstBloods: 2, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g19', mode: 'unrated', map: 'Sunset', result: 'loss', score: '8-13', agent: 'Cypher', kda: '13/15/7', acs: 196, daysAgo: 3, accuracy: 20, hs: 28, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g6', mode: 'unrated', map: 'Icebox', result: 'win', score: '13-7', agent: 'Cypher', kda: '14/12/5', acs: 201, daysAgo: 4, accuracy: 20, hs: 26, firstBloods: 1, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g20', mode: 'competitive', map: 'Pearl', result: 'win', score: '13-9', agent: 'Jett', kda: '18/14/5', acs: 247, daysAgo: 5, accuracy: 23, hs: 29, firstBloods: 1, clutchWon: 0, clutchPlayed: 2 },
  { id: 'g21', mode: 'competitive', map: 'Split', result: 'win', score: '13-11', agent: 'Jett', kda: '17/14/4', acs: 224, daysAgo: 5, accuracy: 22, hs: 27, firstBloods: 1, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g7', mode: 'competitive', map: 'Haven', result: 'loss', score: '7-13', agent: 'Jett', kda: '8/17/2', acs: 139, daysAgo: 6, accuracy: 14, hs: 19, firstBloods: 0, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g22', mode: 'competitive', map: 'Split', result: 'loss', score: '11-13', agent: 'Reyna', kda: '14/17/4', acs: 205, daysAgo: 6, accuracy: 24, hs: 33, firstBloods: 2, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g23', mode: 'competitive', map: 'Breeze', result: 'loss', score: '5-13', agent: 'Sova', kda: '10/15/6', acs: 184, daysAgo: 7, accuracy: 19, hs: 25, firstBloods: 0, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g24', mode: 'unrated', map: 'Pearl', result: 'win', score: '13-10', agent: 'Reyna', kda: '15/16/3', acs: 214, daysAgo: 8, accuracy: 21, hs: 28, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g8', mode: 'competitive', map: 'Bind', result: 'loss', score: '10-13', agent: 'Reyna', kda: '10/16/4', acs: 175, daysAgo: 10, accuracy: 17, hs: 23, firstBloods: 0, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g25', mode: 'competitive', map: 'Abyss', result: 'win', score: '13-9', agent: 'Jett', kda: '16/13/6', acs: 236, daysAgo: 11, accuracy: 22, hs: 30, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g26', mode: 'competitive', map: 'Lotus', result: 'loss', score: '8-13', agent: 'Reyna', kda: '15/17/5', acs: 222, daysAgo: 13, accuracy: 25, hs: 32, firstBloods: 2, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g27', mode: 'competitive', map: 'Icebox', result: 'loss', score: '7-13', agent: 'Cypher', kda: '11/16/6', acs: 195, daysAgo: 15, accuracy: 17, hs: 23, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g9', mode: 'unrated', map: 'Fracture', result: 'win', score: '13-9', agent: 'Sova', kda: '13/12/8', acs: 198, daysAgo: 18, accuracy: 21, hs: 27, firstBloods: 1, clutchWon: 1, clutchPlayed: 2 },
  { id: 'g28', mode: 'unrated', map: 'Abyss', result: 'win', score: '13-9', agent: 'Jett', kda: '16/15/6', acs: 229, daysAgo: 20, accuracy: 19, hs: 26, firstBloods: 0, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g29', mode: 'unrated', map: 'Sunset', result: 'win', score: '13-12', agent: 'Sova', kda: '18/17/9', acs: 231, daysAgo: 22, accuracy: 19, hs: 24, firstBloods: 1, clutchWon: 1, clutchPlayed: 2 },
  { id: 'g10', mode: 'competitive', map: 'Pearl', result: 'win', score: '13-6', agent: 'Jett', kda: '18/12/5', acs: 233, daysAgo: 25, accuracy: 25, hs: 33, firstBloods: 2, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g30', mode: 'competitive', map: 'Lotus', result: 'win', score: '13-9', agent: 'Reyna', kda: '17/14/7', acs: 251, daysAgo: 28, accuracy: 25, hs: 34, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g31', mode: 'competitive', map: 'Split', result: 'win', score: '13-10', agent: 'Reyna', kda: '15/14/3', acs: 221, daysAgo: 33, accuracy: 16, hs: 21, firstBloods: 0, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g11', mode: 'deathmatch', map: 'Lotus', result: 'loss', score: '9-13', agent: 'Reyna', kda: '11/14/0', acs: 150, daysAgo: 40, accuracy: 16, hs: 21, firstBloods: 0, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g32', mode: 'competitive', map: 'Haven', result: 'win', score: '13-8', agent: 'Jett', kda: '16/13/6', acs: 239, daysAgo: 44, accuracy: 21, hs: 29, firstBloods: 0, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g33', mode: 'competitive', map: 'Haven', result: 'loss', score: '6-13', agent: 'Reyna', kda: '12/16/6', acs: 207, daysAgo: 52, accuracy: 23, hs: 32, firstBloods: 1, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g12', mode: 'competitive', map: 'Sunset', result: 'win', score: '13-11', agent: 'Cypher', kda: '17/13/6', acs: 219, daysAgo: 58, accuracy: 22, hs: 28, firstBloods: 2, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g34', mode: 'competitive', map: 'Breeze', result: 'win', score: '13-11', agent: 'Jett', kda: '17/16/8', acs: 244, daysAgo: 66, accuracy: 15, hs: 22, firstBloods: 1, clutchWon: 0, clutchPlayed: 0 },
  { id: 'g13', mode: 'competitive', map: 'Ascent', result: 'win', score: '13-7', agent: 'Jett', kda: '18/11/5', acs: 227, daysAgo: 70, accuracy: 24, hs: 31, firstBloods: 2, clutchWon: 1, clutchPlayed: 1 },
  { id: 'g14', mode: 'unrated', map: 'Bind', result: 'loss', score: '8-13', agent: 'Sova', kda: '9/13/6', acs: 168, daysAgo: 82, accuracy: 18, hs: 24, firstBloods: 0, clutchWon: 0, clutchPlayed: 1 },
  { id: 'g35', mode: 'competitive', map: 'Sunset', result: 'loss', score: '9-13', agent: 'Jett', kda: '14/16/5', acs: 213, daysAgo: 88, accuracy: 19, hs: 23, firstBloods: 2, clutchWon: 1, clutchPlayed: 2 },
];

// Mock "Acts" — VALORANT's multi-month competitive periods (rank resets between them).
// Ranges are expressed on the same daysAgo axis as recentGames/activityCalendar, most
// recent first. Fictional names since this is mock data (episode/act numbers here don't
// track the real game's current season).
// Current streak + all-time best win/loss streak, derived from recentGames (already
// ordered most-recent-first, so run lengths can be read directly off the array).
export function getStreaks(games = recentGames) {
  const currentType = games[0]?.result ?? null;
  let currentCount = 0;
  for (const g of games) {
    if (g.result !== currentType) break;
    currentCount++;
  }

  let bestWinStreak = 0;
  let bestLossStreak = 0;
  let runType = null;
  let runCount = 0;
  for (const g of games) {
    runCount = g.result === runType ? runCount + 1 : 1;
    runType = g.result;
    if (runType === 'win') bestWinStreak = Math.max(bestWinStreak, runCount);
    else bestLossStreak = Math.max(bestLossStreak, runCount);
  }

  return { currentType, currentCount, bestWinStreak, bestLossStreak };
}

// Shared by the act-ending alert and the always-visible Overview countdown widget so
// the two can't drift apart into quoting different numbers for the same thing.
export const ACT_DAYS_REMAINING = 6;

export const acts = [
  { id: 'e9a3', label: 'Episode 9 — Act III', minDaysAgo: 0, maxDaysAgo: 29, current: true },
  { id: 'e9a2', label: 'Episode 9 — Act II', minDaysAgo: 30, maxDaysAgo: 59 },
  { id: 'e9a1', label: 'Episode 9 — Act I', minDaysAgo: 60, maxDaysAgo: 89 },
];

// Shared by the global Mode + Period filter (App.jsx) so every tab that filters
// recentGames applies the exact same window definition.
export const PERIOD_MAX_DAYS = { '7d': 6, '30d': 29, all: Infinity };

export function filterGames(games, { mode, period, act }) {
  return games.filter((g) => {
    if (mode !== 'all' && g.mode !== mode) return false;
    if (period === 'act') return act ? g.daysAgo >= act.minDaysAgo && g.daysAgo <= act.maxDaysAgo : true;
    return g.daysAgo <= PERIOD_MAX_DAYS[period];
  });
}

// Recomputes per-agent games/win-rate from whatever slice of recentGames the global
// filter currently selects, so Agents & Maps reacts to the Mode + Period filter like
// the rest of the app. Seeded with every agent from the all-time agentStats roster
// (0 games/null wr by default) rather than built only from the filtered games — an
// agent with zero matches in the current window still shows up instead of vanishing
// from the "complete" list, which is exactly the popup-completeness bug the global
// filter work must not reintroduce.
export function computeAgentStats(games) {
  const byAgent = new Map();
  for (const a of agentStats) byAgent.set(a.name, { name: a.name, games: 0, wins: 0 });
  for (const g of games) {
    const entry = byAgent.get(g.agent) ?? { name: g.agent, games: 0, wins: 0 };
    entry.games++;
    if (g.result === 'win') entry.wins++;
    byAgent.set(g.agent, entry);
  }
  return Array.from(byAgent.values())
    .map((a) => ({ name: a.name, games: a.games, wr: a.games ? Math.round((a.wins / a.games) * 100) : null }))
    .sort((a, b) => b.games - a.games);
}

// Same idea for per-map stats, seeded from the all-time mapStats roster for the same
// reason. atkWr/defWr/bestAgent have no side-by-side data in recentGames (only a single
// win/loss per match), so those cosmetic sub-fields are carried over from the all-time
// snapshot and only shown once a map actually has games in the current filter.
export function computeMapStats(games) {
  const byMap = new Map();
  for (const m of mapStats) byMap.set(m.name, { name: m.name, games: 0, wins: 0 });
  for (const g of games) {
    const entry = byMap.get(g.map) ?? { name: g.map, games: 0, wins: 0 };
    entry.games++;
    if (g.result === 'win') entry.wins++;
    byMap.set(g.map, entry);
  }
  return Array.from(byMap.values())
    .map((m) => {
      const wr = m.games ? Math.round((m.wins / m.games) * 100) : null;
      const staticDef = mapStats.find((s) => s.name === m.name);
      return {
        name: m.name,
        games: m.games,
        wr,
        atkWr: m.games ? staticDef?.atkWr ?? wr : undefined,
        defWr: m.games ? staticDef?.defWr ?? wr : undefined,
        bestAgent: m.games ? staticDef?.bestAgent : undefined,
      };
    })
    .sort((a, b) => b.games - a.games);
}

// Aggregates the per-map atk/def winrates from computeMapStats into one global
// attack-vs-defense split, weighted by each map's game count — a map with 1 game
// shouldn't move the number as much as one with 10. Returns null once there's nothing
// to weight (no games at all in the current filter).
export function computeSideWinrates(games) {
  const perMap = computeMapStats(games).filter((m) => m.games && m.atkWr !== undefined);
  const totalGames = perMap.reduce((sum, m) => sum + m.games, 0);
  if (!totalGames) return null;
  const atk = Math.round(perMap.reduce((sum, m) => sum + m.atkWr * m.games, 0) / totalGames);
  const def = Math.round(perMap.reduce((sum, m) => sum + m.defWr * m.games, 0) / totalGames);
  return { atk, def };
}

// Per-match aggregates used to make the Overview stat grid and Compare tab react to the
// global filter — each recentGames row carries acs/kda/accuracy/hs/firstBloods/clutch
// fields, so these are genuine derivations, not invented numbers.
export function computeAverageAcs(games) {
  if (!games.length) return null;
  return Math.round(games.reduce((sum, g) => sum + g.acs, 0) / games.length);
}

export function computeAggregateKDA(games) {
  if (!games.length) return null;
  let kills = 0, deaths = 0, assists = 0;
  for (const g of games) {
    const [k, d, a] = g.kda.split('/').map(Number);
    kills += k; deaths += d; assists += a;
  }
  return Math.round((deaths > 0 ? (kills + assists) / deaths : kills + assists) * 100) / 100;
}

export function computeAverageAccuracy(games) {
  if (!games.length) return null;
  return Math.round(games.reduce((sum, g) => sum + g.accuracy, 0) / games.length);
}

export function computeAverageHeadshots(games) {
  if (!games.length) return null;
  return Math.round(games.reduce((sum, g) => sum + g.hs, 0) / games.length);
}

export function computeFirstBloods(games) {
  return games.reduce((sum, g) => sum + g.firstBloods, 0);
}

export function computeClutchRecord(games) {
  return games.reduce(
    (acc, g) => ({ won: acc.won + g.clutchWon, played: acc.played + g.clutchPlayed }),
    { won: 0, played: 0 }
  );
}

const FILLER_NAMES = [
  'Nova', 'Miro', 'Shade', 'Kestrel', 'Ondine', 'Rasp', 'Tally', 'Brix', 'Wisp',
  'Ferro', 'Halcyon', 'Juno', 'Lynx', 'Marrow', 'Nyx', 'Orin', 'Pyre', 'Quill',
  'Rift', 'Suto', 'Talon', 'Umbra', 'Vex', 'Wraith', 'Zephyra',
];
const FILLER_TAGS = ['EUW1', 'NA1', 'EU', 'KR', 'BR1', 'AP', 'LATAM'];
const FILLER_AGENTS = getAllAgentNames();

// Deterministic string hash (djb2-style) — used instead of a single trailing char so
// every gameId spreads to a distinct seed (the old `charCodeAt(len-1) + length` hash
// collided across ids like g1/g10 and g2/g11, which is why the same handful of filler
// names kept resurfacing match after match).
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h;
}

// Deterministic Fisher-Yates shuffle, seeded — gives each match its own distinct draw
// order from the shared name/agent pools instead of everyone reusing the same ~9 slots.
function seededShuffle(arr, seed) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededValue(seed + i * 13.37) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds a deterministic 10-player scoreboard (you + 9 filler players) around a game's
// known kda/acs, instead of hand-writing ten rows per match.
export function getMatchScoreboard(gameId) {
  const game = recentGames.find((g) => g.id === gameId);
  if (!game) return null;

  const [yourKills, yourDeaths, yourAssists] = game.kda.split('/').map(Number);
  const seed = hashString(gameId);

  const shuffledNames = seededShuffle(FILLER_NAMES, seed);
  const shuffledAgents = seededShuffle(FILLER_AGENTS, seed + 1000);

  const [teamScore, enemyScore] = game.score.split('-').map(Number);
  const totalRounds = teamScore + enemyScore;
  const youWon = game.result === 'win';

  const fillers = Array.from({ length: 9 }, (_, i) => {
    const team = i < 4 ? 'A' : 'B';
    // Team A is your team; a filler "won" if their team matches your result.
    const teamWon = (team === 'A') === youWon;
    // Kills and deaths roll on independent seeds so nobody gets handed a high-kill AND
    // low-death line at once (the old shared `n` did exactly that). Both are a fraction
    // of the round count, which keeps K/D in a believable band whatever the match length.
    const kRoll = seededValue(seed + i * 7 + 11);
    const dRoll = seededValue(seed + i * 7 + 29);
    const killsPerRound = 0.38 + kRoll * 0.55 + (teamWon ? 0.1 : 0);
    const deathsPerRound = 0.92 - dRoll * 0.34 - (teamWon ? 0.08 : -0.02);
    return {
      name: `${shuffledNames[i % shuffledNames.length]}#${FILLER_TAGS[(seed + i) % FILLER_TAGS.length]}`,
      team,
      agent: shuffledAgents[i % shuffledAgents.length],
      kills: Math.max(4, Math.round(totalRounds * killsPerRound)),
      deaths: Math.max(6, Math.round(totalRounds * Math.max(0.42, deathsPerRound))),
      assists: Math.max(1, Math.round(totalRounds * (0.14 + seededValue(seed + i * 7 + 43) * 0.32))),
      acs: Math.max(90, Math.round(70 + killsPerRound * 210 + seededValue(seed + i * 7 + 57) * 45)),
    };
  });

  const you = {
    name: 'KAITO#EUW1',
    team: 'A',
    isYou: true,
    agent: game.agent,
    kills: yourKills,
    deaths: yourDeaths,
    assists: yourAssists,
    acs: game.acs,
  };

  const allPlayers = [you, ...fillers];

  // Extended per-player stats (headshots, accuracy, first bloods/deaths, clutches,
  // damage, economy, rivals) computed for every player via a per-player-seeded pass,
  // instead of a one-off block for `you` alone — this way any participant can be
  // expanded to the same depth of detail, not just the viewing player.
  allPlayers.forEach((p, idx) => {
    const pSeed = seed + idx * 97;
    const n1 = seededValue(pSeed + 501);
    const n2 = seededValue(pSeed + 502);
    const n3 = seededValue(pSeed + 503);
    const n4 = seededValue(pSeed + 504);
    const n5 = seededValue(pSeed + 505);

    const headshotPct = Math.round(20 + n1 * 25);
    const accuracyPct = Math.round(15 + n2 * 20);
    const firstBloods = Math.max(0, Math.round(n3 * 5));
    const firstDeaths = Math.max(0, Math.round((1 - n3) * 4));
    const clutchesWon = n4 > 0.6 ? 1 : 0;
    const clutchesPlayed = Math.max(clutchesWon, n4 > 0.3 ? 1 : 0);
    // Each attempted clutch gets a concrete 1vX (X in 2..5, weighted toward the easier
    // 1v2 / 1v3), and the won ones are the first `clutchesWon`.
    const clutchSituations = Array.from({ length: clutchesPlayed }, (_, ci) => {
      const r = seededValue(pSeed + 610 + ci * 11);
      return { v: 2 + Math.floor(r * r * 4), won: ci < clutchesWon };
    });
    const damageDealt = Math.round(p.kills * (120 + n5 * 40) + p.assists * 25);
    const damageReceived = Math.round(p.deaths * (110 + (1 - n5) * 40) + 200);
    const avgDamageRound = totalRounds ? Math.round(damageDealt / totalRounds) : 0;

    const ecoRoundsWon = Math.max(0, Math.round(n1 * 3));
    const ecoRoundsPlayed = ecoRoundsWon + Math.round(n2 * 2) + 1;
    const avgSpend = Math.round(2400 + n3 * 1400);

    // Rivals only make sense against the enemy team — picking from the full roster
    // could otherwise land on a teammate, who you never actually fight in competitive
    // modes. Generalized from a hardcoded team-A check so it holds for any player.
    const enemyPool = allPlayers.filter((o) => o.team !== p.team);
    const rivalIdx = Math.floor(n4 * enemyPool.length);
    const targetIdx = Math.floor(n5 * enemyPool.length);

    p.headshotPct = headshotPct;
    p.accuracyPct = accuracyPct;
    p.firstBloods = firstBloods;
    p.firstDeaths = firstDeaths;
    p.clutchesWon = clutchesWon;
    p.clutchesPlayed = clutchesPlayed;
    p.clutchSituations = clutchSituations;
    p.damageDealt = damageDealt;
    p.damageReceived = damageReceived;
    p.avgDamageRound = avgDamageRound;
    p.economy = { ecoRoundsWon, ecoRoundsPlayed, avgSpend };

    const nemesis = enemyPool[rivalIdx];
    const prey = enemyPool[targetIdx];
    const hi = (r) => Math.max(2, Math.round(2 + r * 3)); // 2..5 — the dominant direction
    const lo = (r) => Math.max(0, Math.round(r * 2)); // 0..2 — the other direction
    // `count` stays the headline number each rival is known for (kept so
    // getMatchDiagnosis keeps reading it), plus both directions for the duel display.
    p.rivals = {
      toughest: { name: nemesis?.name, agent: nemesis?.agent, theyKilledYou: hi(n1), youKilledThem: lo(n2), count: hi(n1) },
      favorite: { name: prey?.name, agent: prey?.agent, theyKilledYou: lo(n1), youKilledThem: hi(n2), count: hi(n2) },
    };
  });

  const players = [...allPlayers].sort((a, b) => b.acs - a.acs);

  const dateTime = new Date();
  dateTime.setDate(dateTime.getDate() - game.daysAgo);
  dateTime.setHours(17 + Math.floor(seededValue(seed + 900) * 6), Math.floor(seededValue(seed + 901) * 60), 0, 0);

  return { ...game, players, you, totalRounds, dateTime };
}

// Last entry matches performanceScore exactly, so the "current" snapshot is the latest
// point of the history line rather than a disconnected number.
export const performanceHistory = [
  { s: 'S1', aim: 68, consistency: 60, impact: 71, clutch: 40 },
  { s: 'S2', aim: 72, consistency: 65, impact: 75, clutch: 48 },
  { s: 'S3', aim: 70, consistency: 68, impact: 78, clutch: 52 },
  { s: 'S4', aim: 76, consistency: 70, impact: 80, clutch: 55 },
  { s: 'S5', aim: 79, consistency: 72, impact: 82, clutch: 58 },
  { s: 'S6', aim: 84, consistency: 76, impact: 85, clutch: 63 },
  { s: 'S7', aim: 82, consistency: 74, impact: 86, clutch: 61 },
];

export const teammates = [
  { name: 'Nova#EUW1', gamesTogether: 14, winRate: 71 },
  { name: 'Miro#EUW1', gamesTogether: 9, winRate: 44 },
  { name: 'Shade#EUW1', gamesTogether: 6, winRate: 33 },
];

export function buildGamesCSV() {
  const header = ['date', 'mode', 'map', 'result', 'score', 'agent', 'kda', 'acs'];
  const rows = recentGames.map((g) => {
    const date = new Date();
    date.setDate(date.getDate() - g.daysAgo);
    return [date.toISOString().slice(0, 10), g.mode, g.map, g.result, g.score, g.agent, g.kda, g.acs];
  });
  return [header, ...rows].map((row) => row.join(',')).join('\n');
}

// Triggered-alerts feed backing the header bell — shaped like a generic notification
// feed (id, icon, message template + params, daysAgo, read) so swapping this mock array
// for a real backend feed later is a data-source change, not a UI rewrite.
// `tone` colours the icon chip so the feed reads as distinct categories at a glance
// (goal / risk / streak / unlock / season) rather than a wall of same-coloured rows.
export const alertsFeed = [
  { id: 'a1', icon: Trophy, tone: 'success', messageKey: 'alertMsgGoalReached', params: { rank: 'Diamond 2' }, daysAgo: 0, read: false },
  { id: 'a2', icon: ShieldAlert, tone: 'warn', messageKey: 'alertMsgDerankRisk', params: { rr: 8 }, daysAgo: 2, read: false },
  { id: 'a3', icon: Award, tone: 'success', messageKey: 'alertMsgNewBadge', params: { badge: 'Ace Hunter' }, daysAgo: 3, read: false },
  { id: 'a4', icon: Flame, tone: 'hot', messageKey: 'alertMsgStreak', params: { n: 3 }, daysAgo: 5, read: true },
  { id: 'a5', icon: CalendarClock, tone: 'info', messageKey: 'alertMsgActEnding', params: { days: ACT_DAYS_REMAINING }, daysAgo: 6, read: true },
];

export function getUnreadAlertsCount(alerts = alertsFeed) {
  return alerts.filter((a) => !a.read).length;
}

// "My Progress" timeline — narrative milestones, distinct from the Badges grid. Sourced
// from the same underlying data where possible (bestWinStreak from getStreaks) so it
// stays consistent with the rest of the mock dataset rather than being invented in
// isolation.
// `type` groups milestones for the Progress tab's timeline filter — 'rank' for
// tier/rank changes, 'record' for one-off personal bests, 'streak' for win/day streaks.
export const progressionTimeline = [
  { id: 'm1', daysAgo: 82, icon: TrendingUp, titleKey: 'timelineFirstDiamondTitle', descKey: 'timelineFirstDiamondDesc', descParams: { rank: 'DIAMOND 1' }, type: 'rank' },
  { id: 'm2', daysAgo: 58, icon: Zap, titleKey: 'timelineBestClimbTitle', descKey: 'timelineBestClimbDesc', descParams: { rr: 17, map: 'Sunset' }, type: 'record' },
  { id: 'm3', daysAgo: 25, icon: Swords, titleKey: 'timelineFirstAceTitle', descKey: 'timelineFirstAceDesc', descParams: { map: 'Bind' }, type: 'record' },
  { id: 'm4', daysAgo: 10, icon: Flame, titleKey: 'timelineStreakTitle', descKey: 'timelineStreakDesc', descParams: { n: getStreaks().bestWinStreak, map: 'Ascent' }, type: 'streak' },
  { id: 'm5', daysAgo: 0, icon: Trophy, titleKey: 'timelineTodayTitle', descKey: 'timelineTodayDesc', descParams: { rank: 'Diamond 2' }, type: 'rank' },
];

// Invite-tracking stat — shown in Settings so sharing has a visible payoff instead of
// disappearing into the void.
export const inviteStats = { invited: 12, joined: 4 };

// Referral programme — a personal code and one exclusive cosmetic (a banner) unlocked
// once `rewardAt` friends have joined through it. `referred` mirrors inviteStats.joined
// so the number stays consistent across the invite card, settings, and the locker.
// All local/mock like the rest until there's a real user backend.
export const referralProgram = {
  code: 'KAITO-SCOPE',
  referred: inviteStats.joined,
  rewardAt: 5,
  rewardBannerName: 'Dreamwing Lunari',
};

// Mock Scope+ pricing — no real Stripe integration yet, so these are placeholder
// figures rendered by the plans modal so "See plans" leads somewhere concrete.
const MONTHLY_PRICE = 4.99;
const ANNUAL_PRICE = 49.99;

export const scopePlusPlans = [
  { id: 'monthly', nameKey: 'planMonthly', price: MONTHLY_PRICE, periodKey: 'periodMonth', noteKey: 'plansFlexibleNote' },
  {
    id: 'annual',
    nameKey: 'planAnnual',
    price: ANNUAL_PRICE,
    periodKey: 'periodYear',
    badge: true,
    perMonthEquivalent: ANNUAL_PRICE / 12,
    // What the same year would cost month-by-month — the anchor the per-month figure
    // is compared against.
    anchorPerMonth: MONTHLY_PRICE,
    savingPct: Math.round((1 - ANNUAL_PRICE / (MONTHLY_PRICE * 12)) * 100),
  },
];

// Feature list for the plans modal reuses section titles already translated elsewhere
// in the app, instead of duplicating the same copy under new keys.
export const scopePlusFeatureKeys = [
  'recoTitle', 'scopePerformance', 'synergyTitle', 'alertsTitle',
  'roundBreakdownTitle', 'timePatternsTitle', 'exportTitle',
  'customAccentLabel', 'scopePlusFeatureCosmetics', 'scopePlusFeatureExtraTips', 'scopePlusFeatureNoAds',
];

// Server status badge — mock for now, structured to plug into the real
// `/val/status/v1/platform-data` later (already reachable with the dev key, generous
// rate limits): that endpoint's `maintenances`/`incidents` arrays map directly to the
// 'maintenance'/'degraded' states here, empty-both mapping to 'operational'.
export const serverStatus = { status: 'operational' };
