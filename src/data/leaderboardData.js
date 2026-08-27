// Regional leaderboard — mock data for now, shaped to match Riot's
// `/val/ranked/v1/leaderboards/by-act/{actId}?region={region}` response closely enough
// that swapping this generator for a real fetch (once the production key is approved)
// is a data-source change, not a UI rewrite: same region shard codes, same
// gameName/tagLine/leaderboardRank/rankedRating/competitiveTier fields. That endpoint
// is rate-limited to 10 requests/10s, so the real swap also needs a server-side cache —
// not built here since there's no real data yet to cache.
export const LEADERBOARD_REGIONS = ['eu', 'na', 'ap', 'kr', 'latam', 'br'];

// Deterministic pseudo-random in [0, 1) — kept local to this file (same formula as
// mockData.js's own seededValue) so this module has no dependency on it.
function seededValue(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const NAME_POOL = [
  'Vexen', 'Kairos', 'Nyxa', 'Solenne', 'Draven', 'Ashka', 'Milo', 'Ryuk', 'Cinder', 'Halo',
  'Rook', 'Zephyr', 'Onyx', 'Peregrine', 'Sable', 'Astra', 'Corvus', 'Lumen', 'Rhea', 'Talos',
  'Wren', 'Ember', 'Frost', 'Kite', 'Orbit', 'Pyra', 'Quartz', 'Sever', 'Vale', 'Bastion',
];
const TAG_POOL = ['EUW1', 'NA1', 'AP', 'KR', 'LATAM', 'BR1'];

// A real regional top-30 is Immortal/Radiant only — Diamond or below never appears at
// this scale — so the tier bands only cover that range, most-exclusive first.
const TIER_BANDS = [
  { name: 'Radiant', count: 3 },
  { name: 'Immortal 3', count: 7 },
  { name: 'Immortal 2', count: 10 },
  { name: 'Immortal 1', count: 10 },
];

function tierForRank(rank) {
  let cursor = 0;
  for (const band of TIER_BANDS) {
    cursor += band.count;
    if (rank <= cursor) return band.name;
  }
  return TIER_BANDS[TIER_BANDS.length - 1].name;
}

export function getLeaderboard(region) {
  const regionSeed = (LEADERBOARD_REGIONS.indexOf(region) + 1) * 1000;

  const players = Array.from({ length: 30 }, (_, i) => {
    const rank = i + 1;
    const seed = regionSeed + rank * 13;
    return {
      puuid: `lb-${region}-${rank}`,
      gameName: NAME_POOL[Math.floor(seededValue(seed + 1) * NAME_POOL.length)],
      tagLine: TAG_POOL[Math.floor(seededValue(seed + 2) * TAG_POOL.length)],
      leaderboardRank: rank,
      rankedRating: Math.max(0, Math.round(680 - rank * 8 - seededValue(seed) * 5)),
      competitiveTier: tierForRank(rank),
    };
  });

  // Nova#EUW1 (puuid 'p2' in otherPlayers, mockData.js) is a real connected+public
  // Scope profile at Immortal 1 — planting her at a rank inside that same band gives
  // the "compare with anyone already on Scope" flow a guaranteed real match to demo,
  // instead of relying on the random pool to collide with an actual otherPlayers entry.
  if (region === 'eu') {
    const novaRow = players.find((p) => p.leaderboardRank === 22);
    novaRow.gameName = 'Nova';
    novaRow.tagLine = 'EUW1';
  }

  return players;
}
