import { Users, Flame, TrendingUp, Swords, Target, Trophy } from 'lucide-react';

export const rrHistory = [
  { s: 'S1', rr: 38 }, { s: 'S2', rr: 52 }, { s: 'S3', rr: 45 }, { s: 'S4', rr: 61 },
  { s: 'S5', rr: 57 }, { s: 'S6', rr: 74 }, { s: 'S7', rr: 67 },
];

export const badgeDefs = [
  { id: 'teamPlayer', icon: Users }, { id: 'aceX3', icon: Swords },
  { id: 'headshots200', icon: Target }, { id: 'streak5', icon: Flame },
  { id: 'newTier', icon: TrendingUp }, { id: 'top15', icon: Trophy },
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
