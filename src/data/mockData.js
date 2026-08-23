import { Users, Flame, TrendingUp, Swords, Target, Trophy, RotateCcw, Moon, Sunrise, Hourglass, HeartHandshake, Crosshair, Compass, Shuffle, Zap, ShieldAlert } from 'lucide-react';
import { getAllAgentNames } from './valorantAssets.js';

// `s` is a plain session index (1-based) rather than a pre-formatted "S1" string, so the
// chart's tick/tooltip formatters can render it as a full "Session 1" label per locale
// instead of a cryptic abbreviation.
export const rrHistory = [
  { s: 1, rr: 38 }, { s: 2, rr: 52 }, { s: 3, rr: 45 }, { s: 4, rr: 61 },
  { s: 5, rr: 57 }, { s: 6, rr: 74 }, { s: 7, rr: 67 },
];

// Tier ladder shared by every progressive badge (kept in English — same convention as
// rank names, which stay untranslated across all 6 locales already).
export const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Diamond'];
export const TIER_COLORS = ['#CD7F32', '#C0C4C9', '#F2C94C', '#7DD3E8'];

// Badges with a natural cumulative counter get a 4-tier progression (tiers = thresholds,
// value = current count). One-off or snapshot-style achievements (Comeback, Marathon,
// Explorer, time-of-day patterns, current percentile/rank-tier reached) keep the simple
// single-state display — forcing 4 levels on those wouldn't mean anything.
// Single-state badges (no tiers/value) carry their own `unlocked` flag since there's no
// numeric threshold to derive it from — a mix of true/false so the Badges tab has real
// locked entries to show, not just achievements.
export const badgeDefs = [
  { id: 'teamPlayer', icon: Users, tiers: [10, 25, 50, 100], value: 38 },
  { id: 'aceX3', icon: Swords, tiers: [1, 3, 10, 25], value: 7 },
  { id: 'headshots200', icon: Target, tiers: [100, 500, 1000, 2500], value: 640 },
  { id: 'streak5', icon: Flame, tiers: [3, 5, 10, 30], value: 8 },
  { id: 'newTier', icon: TrendingUp, unlocked: true },
  { id: 'top15', icon: Trophy, unlocked: true },
  { id: 'comeback', icon: RotateCcw, unlocked: true },
  { id: 'nightOwl', icon: Moon, unlocked: false },
  { id: 'earlyBird', icon: Sunrise, unlocked: true },
  { id: 'marathon', icon: Hourglass, unlocked: false },
  { id: 'supportStar', icon: HeartHandshake, tiers: [200, 500, 1000, 2000], value: 740 },
  { id: 'rivalSlayer', icon: Crosshair, tiers: [1, 5, 15, 30], value: 4 },
  { id: 'explorer', icon: Compass, unlocked: false },
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

export const agentStats = [
  { name: 'Jett', games: 14, wr: 64 },
  { name: 'Reyna', games: 9, wr: 56 },
  { name: 'Sova', games: 6, wr: 50 },
  { name: 'Omen', games: 5, wr: 40 },
  { name: 'Killjoy', games: 4, wr: 75 },
  { name: 'Cypher', games: 3, wr: 33 },
];

// atkWr/defWr are separate win rates for rounds started on attack vs. defense on that
// map — a real tactical signal (e.g. a map you're strong on overall but weak on one
// side) that the combined `wr` alone hides. bestAgent is the agent with the best
// winrate specifically on that map (agent x map cross-reference).
export const mapStats = [
  { name: 'Bind', games: 8, wr: 62, atkWr: 58, defWr: 67, bestAgent: 'Jett' },
  { name: 'Ascent', games: 6, wr: 50, atkWr: 61, defWr: 39, bestAgent: 'Reyna' },
  { name: 'Haven', games: 5, wr: 40, atkWr: 33, defWr: 47, bestAgent: 'Sova' },
  { name: 'Split', games: 4, wr: 55, atkWr: 50, defWr: 60, bestAgent: 'Jett' },
  { name: 'Icebox', games: 3, wr: 67, atkWr: 71, defWr: 63, bestAgent: 'Sova' },
  { name: 'Fracture', games: 3, wr: 45, atkWr: 40, defWr: 50, bestAgent: 'Killjoy' },
  { name: 'Pearl', games: 2, wr: 70, atkWr: 65, defWr: 75, bestAgent: 'Jett' },
  { name: 'Sunset', games: 2, wr: 55, atkWr: 60, defWr: 50, bestAgent: 'Sova' },
];

// Round-type and clutch breakdown — Scope+. Pistol/eco-force winrates and clutch
// success rate by man-disadvantage situation, instead of just the flat clutch count
// already shown for free on the Overview tab.
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

export const friends = [
  { name: 'Nova#EUW1', acs: 261 },
  { name: 'KAITO#EUW1', acs: 238, isYou: true },
  { name: 'Miro#EUW1', acs: 204 },
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

export const weaponStats = [
  { name: 'Vandal', accuracy: 24, kills: 142, favorite: true },
  { name: 'Phantom', accuracy: 21, kills: 88 },
  { name: 'Operator', accuracy: 41, kills: 37 },
  { name: 'Spectre', accuracy: 19, kills: 41 },
  { name: 'Sheriff', accuracy: 28, kills: 33 },
  { name: 'Classic', accuracy: 18, kills: 29 },
  { name: 'Guardian', accuracy: 33, kills: 22 },
  { name: 'Ghost', accuracy: 22, kills: 18 },
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

// First 7 entries (daysAgo 0-6) intentionally reproduce the numbers that used to be
// hardcoded in OverviewTab's session summary (7 games, 5W-2L, best 24/9, worst 8/17),
// so the default filter (all modes, last 7 days) renders identically to before. The
// rest only surface once a wider period filter is selected.
export const recentGames = [
  { id: 'g1', mode: 'competitive', map: 'Bind', result: 'win', score: '13-9', agent: 'Jett', kda: '24/9/6', acs: 289, daysAgo: 0 },
  { id: 'g2', mode: 'competitive', map: 'Ascent', result: 'win', score: '13-11', agent: 'Reyna', kda: '18/10/4', acs: 245, daysAgo: 1 },
  { id: 'g3', mode: 'competitive', map: 'Haven', result: 'loss', score: '9-13', agent: 'Sova', kda: '12/15/5', acs: 198, daysAgo: 1 },
  { id: 'g4', mode: 'unrated', map: 'Split', result: 'win', score: '13-8', agent: 'Jett', kda: '15/11/7', acs: 210, daysAgo: 2 },
  { id: 'g5', mode: 'competitive', map: 'Bind', result: 'win', score: '13-10', agent: 'Reyna', kda: '16/13/3', acs: 225, daysAgo: 3 },
  { id: 'g6', mode: 'unrated', map: 'Icebox', result: 'win', score: '13-7', agent: 'Sova', kda: '14/10/5', acs: 201, daysAgo: 4 },
  { id: 'g7', mode: 'competitive', map: 'Haven', result: 'loss', score: '7-13', agent: 'Jett', kda: '8/17/2', acs: 139, daysAgo: 6 },
  { id: 'g8', mode: 'competitive', map: 'Bind', result: 'loss', score: '10-13', agent: 'Reyna', kda: '10/16/4', acs: 175, daysAgo: 10 },
  { id: 'g9', mode: 'unrated', map: 'Fracture', result: 'win', score: '13-9', agent: 'Sova', kda: '13/9/8', acs: 198, daysAgo: 18 },
  { id: 'g10', mode: 'competitive', map: 'Pearl', result: 'win', score: '13-6', agent: 'Jett', kda: '20/12/5', acs: 233, daysAgo: 25 },
  { id: 'g11', mode: 'deathmatch', map: 'Lotus', result: 'loss', score: '9-13', agent: 'Reyna', kda: '9/14/0', acs: 150, daysAgo: 40 },
  { id: 'g12', mode: 'competitive', map: 'Sunset', result: 'win', score: '13-11', agent: 'Sova', kda: '17/11/6', acs: 219, daysAgo: 58 },
  // Older than everything above — only surface when browsing a past Act (see `acts` below).
  { id: 'g13', mode: 'competitive', map: 'Ascent', result: 'win', score: '13-7', agent: 'Jett', kda: '19/8/5', acs: 227, daysAgo: 70 },
  { id: 'g14', mode: 'unrated', map: 'Bind', result: 'loss', score: '8-13', agent: 'Sova', kda: '9/13/6', acs: 168, daysAgo: 82 },
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

export const acts = [
  { id: 'e9a3', label: 'Episode 9 — Act III', minDaysAgo: 0, maxDaysAgo: 29, current: true },
  { id: 'e9a2', label: 'Episode 9 — Act II', minDaysAgo: 30, maxDaysAgo: 59 },
  { id: 'e9a1', label: 'Episode 9 — Act I', minDaysAgo: 60, maxDaysAgo: 89 },
];

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

  const fillers = Array.from({ length: 9 }, (_, i) => {
    const n = seededValue(seed + i * 7);
    return {
      name: `${shuffledNames[i % shuffledNames.length]}#${FILLER_TAGS[(seed + i) % FILLER_TAGS.length]}`,
      team: i < 4 ? 'A' : 'B',
      agent: shuffledAgents[i % shuffledAgents.length],
      kills: Math.max(2, Math.round(yourKills * (0.4 + n * 0.9))),
      deaths: Math.max(3, Math.round(yourDeaths * (0.5 + (1 - n) * 0.8))),
      assists: Math.max(0, Math.round(yourAssists * (0.3 + n * 1.1))),
      acs: Math.max(80, Math.round(game.acs * (0.4 + n * 0.9))),
    };
  });

  const [teamScore, enemyScore] = game.score.split('-').map(Number);
  const totalRounds = teamScore + enemyScore;

  const n1 = seededValue(seed + 501);
  const n2 = seededValue(seed + 502);
  const n3 = seededValue(seed + 503);
  const n4 = seededValue(seed + 504);
  const n5 = seededValue(seed + 505);

  const headshotPct = Math.round(20 + n1 * 25);
  const accuracyPct = Math.round(15 + n2 * 20);
  const firstBloods = Math.max(0, Math.round(n3 * 5));
  const firstDeaths = Math.max(0, Math.round((1 - n3) * 4));
  const clutchesWon = n4 > 0.6 ? 1 : 0;
  const clutchesPlayed = Math.max(clutchesWon, n4 > 0.3 ? 1 : 0);
  const damageDealt = Math.round(yourKills * (120 + n5 * 40) + yourAssists * 25);
  const damageReceived = Math.round(yourDeaths * (110 + (1 - n5) * 40) + 200);
  const avgDamageRound = totalRounds ? Math.round(damageDealt / totalRounds) : 0;

  const ecoRoundsWon = Math.max(0, Math.round(n1 * 3));
  const ecoRoundsPlayed = ecoRoundsWon + Math.round(n2 * 2) + 1;
  const avgSpend = Math.round(2400 + n3 * 1400);

  // Rivals only make sense against the enemy team — picking from all fillers could
  // otherwise land on a teammate, who you never actually fight in competitive modes.
  const enemyFillers = fillers.filter((f) => f.team !== 'A');
  const rivalIdx = Math.floor(n4 * enemyFillers.length);
  const targetIdx = Math.floor(n5 * enemyFillers.length);

  const you = {
    name: 'KAITO#EUW1',
    team: 'A',
    isYou: true,
    agent: game.agent,
    kills: yourKills,
    deaths: yourDeaths,
    assists: yourAssists,
    acs: game.acs,
    headshotPct,
    accuracyPct,
    firstBloods,
    firstDeaths,
    clutchesWon,
    clutchesPlayed,
    damageDealt,
    damageReceived,
    avgDamageRound,
    economy: { ecoRoundsWon, ecoRoundsPlayed, avgSpend },
    rivals: {
      toughest: { name: enemyFillers[rivalIdx]?.name, count: Math.max(2, Math.round(1 + n1 * 3)) },
      favorite: { name: enemyFillers[targetIdx]?.name, count: Math.max(2, Math.round(1 + n2 * 3)) },
    },
  };
  const players = [you, ...fillers].sort((a, b) => b.acs - a.acs);

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
export const alertsFeed = [
  { id: 'a1', icon: Trophy, messageKey: 'alertMsgGoalReached', params: { rank: 'Diamond 2' }, daysAgo: 0, read: false },
  { id: 'a2', icon: ShieldAlert, messageKey: 'alertMsgDerankRisk', params: { rr: 8 }, daysAgo: 2, read: false },
  { id: 'a3', icon: Flame, messageKey: 'alertMsgStreak', params: { n: 3 }, daysAgo: 5, read: true },
];

export function getUnreadAlertsCount(alerts = alertsFeed) {
  return alerts.filter((a) => !a.read).length;
}

// "My Progress" timeline — narrative milestones, distinct from the Badges grid. Sourced
// from the same underlying data where possible (bestWinStreak from getStreaks) so it
// stays consistent with the rest of the mock dataset rather than being invented in
// isolation.
export const progressionTimeline = [
  { id: 'm1', daysAgo: 82, icon: TrendingUp, titleKey: 'timelineFirstDiamondTitle', descKey: 'timelineFirstDiamondDesc' },
  { id: 'm2', daysAgo: 58, icon: Zap, titleKey: 'timelineBestClimbTitle', descKey: 'timelineBestClimbDesc', descParams: { rr: 17 } },
  { id: 'm3', daysAgo: 25, icon: Swords, titleKey: 'timelineFirstAceTitle', descKey: 'timelineFirstAceDesc', descParams: { map: 'Bind' } },
  { id: 'm4', daysAgo: 10, icon: Flame, titleKey: 'timelineStreakTitle', descKey: 'timelineStreakDesc', descParams: { n: getStreaks().bestWinStreak } },
  { id: 'm5', daysAgo: 0, icon: Trophy, titleKey: 'timelineTodayTitle', descKey: 'timelineTodayDesc', descParams: { rank: 'Diamond 2' } },
];

// Invite-tracking stat — shown in Settings so sharing has a visible payoff instead of
// disappearing into the void.
export const inviteStats = { invited: 12, joined: 4 };

// Mock Scope+ pricing — no real Stripe integration yet, so these are placeholder
// figures rendered by the plans modal so "See plans" leads somewhere concrete.
export const scopePlusPlans = [
  { id: 'monthly', nameKey: 'planMonthly', price: 6.99, periodKey: 'periodMonth' },
  { id: 'annual', nameKey: 'planAnnual', price: 59.99, periodKey: 'periodYear', badge: true, perMonthEquivalent: 5.0 },
];

// Feature list for the plans modal reuses section titles already translated elsewhere
// in the app, instead of duplicating the same copy under new keys.
export const scopePlusFeatureKeys = [
  'recoTitle', 'scopePerformance', 'synergyTitle', 'alertsTitle',
  'roundBreakdownTitle', 'timePatternsTitle', 'exportTitle',
];
