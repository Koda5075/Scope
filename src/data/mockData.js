import { Users, Flame, TrendingUp, Swords, Target, Trophy, RotateCcw, Moon, Sunrise, Hourglass, HeartHandshake, Crosshair, Compass, Shuffle } from 'lucide-react';

export const rrHistory = [
  { s: 'S1', rr: 38 }, { s: 'S2', rr: 52 }, { s: 'S3', rr: 45 }, { s: 'S4', rr: 61 },
  { s: 'S5', rr: 57 }, { s: 'S6', rr: 74 }, { s: 'S7', rr: 67 },
];

export const badgeDefs = [
  { id: 'teamPlayer', icon: Users }, { id: 'aceX3', icon: Swords },
  { id: 'headshots200', icon: Target }, { id: 'streak5', icon: Flame },
  { id: 'newTier', icon: TrendingUp }, { id: 'top15', icon: Trophy },
  { id: 'comeback', icon: RotateCcw }, { id: 'nightOwl', icon: Moon },
  { id: 'earlyBird', icon: Sunrise }, { id: 'marathon', icon: Hourglass },
  { id: 'supportStar', icon: HeartHandshake }, { id: 'rivalSlayer', icon: Crosshair },
  { id: 'explorer', icon: Compass }, { id: 'versatile', icon: Shuffle },
];

export const agentStats = [
  { name: 'Jett', games: 14, wr: 64 },
  { name: 'Reyna', games: 9, wr: 56 },
  { name: 'Sova', games: 6, wr: 50 },
];

export const mapStats = [
  { name: 'Bind', games: 8, wr: 62 },
  { name: 'Ascent', games: 6, wr: 50 },
  { name: 'Haven', games: 5, wr: 40 },
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
  { name: 'Classic', accuracy: 18, kills: 29 },
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
];

const FILLER_NAMES = ['Nova', 'Miro', 'Shade', 'Kestrel', 'Ondine', 'Rasp', 'Tally', 'Brix', 'Wisp'];
const FILLER_TAGS = ['EUW1', 'NA1', 'EU', 'KR'];
const FILLER_AGENTS = ['Jett', 'Reyna', 'Sova', 'Omen', 'Sage', 'Killjoy', 'Neon', 'Cypher', 'Breach'];

// Builds a deterministic 10-player scoreboard (you + 9 filler players) around a game's
// known kda/acs, instead of hand-writing ten rows per match.
export function getMatchScoreboard(gameId) {
  const game = recentGames.find((g) => g.id === gameId);
  if (!game) return null;

  const [yourKills, yourDeaths, yourAssists] = game.kda.split('/').map(Number);
  const seed = gameId.charCodeAt(gameId.length - 1) + gameId.length;

  const fillers = Array.from({ length: 9 }, (_, i) => {
    const n = seededValue(seed + i * 7);
    return {
      name: `${FILLER_NAMES[(seed + i) % FILLER_NAMES.length]}#${FILLER_TAGS[i % FILLER_TAGS.length]}`,
      team: i < 4 ? 'A' : 'B',
      agent: FILLER_AGENTS[(seed + i * 3) % FILLER_AGENTS.length],
      kills: Math.max(2, Math.round(yourKills * (0.4 + n * 0.9))),
      deaths: Math.max(3, Math.round(yourDeaths * (0.5 + (1 - n) * 0.8))),
      assists: Math.max(0, Math.round(yourAssists * (0.3 + n * 1.1))),
      acs: Math.max(80, Math.round(game.acs * (0.4 + n * 0.9))),
    };
  });

  const you = { name: 'KAITO#EUW1', team: 'A', isYou: true, agent: game.agent, kills: yourKills, deaths: yourDeaths, assists: yourAssists, acs: game.acs };
  const players = [you, ...fillers].sort((a, b) => b.acs - a.acs);

  return { ...game, players };
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
