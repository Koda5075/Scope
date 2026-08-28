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

// Riot IDs on a regional leaderboard carry that region's own tag lines — an EU board
// never shows a #KR or #BR1 tag. Keyed by the shard codes in LEADERBOARD_REGIONS so a
// row's tag always matches the region filter it was fetched under.
const REGION_TAGS = {
  eu: ['EUW', 'EUNE', 'EU1', 'TR1', 'RU1'],
  na: ['NA1', 'NA2', 'NA'],
  ap: ['AP', 'SG2', 'OCE', 'JP1'],
  kr: ['KR1', 'KR2', 'KR'],
  latam: ['LAN', 'LAS', 'LA1', 'LA2'],
  br: ['BR1', 'BR2', 'BR'],
};

// A real regional top-30 is Immortal/Radiant only — Diamond or below never appears at
// this scale — so the tier bands only cover that range, most-exclusive first. Each
// band carries the RR window it spans (rrHi at the band's top rank, rrLo at its
// bottom) so a row's rankedRating always lands inside the band its tier names — no
// more "Immortal 1 with 500 RR".
const TIER_BANDS = [
  { name: 'Radiant', count: 3, rrHi: 950, rrLo: 780 },
  { name: 'Immortal 3', count: 7, rrHi: 720, rrLo: 520 },
  { name: 'Immortal 2', count: 10, rrHi: 490, rrLo: 300 },
  { name: 'Immortal 1', count: 10, rrHi: 270, rrLo: 110 },
];

// Which band a global rank falls in, and its 0-based position within that band.
function bandForRank(rank) {
  let start = 0;
  for (const band of TIER_BANDS) {
    if (rank <= start + band.count) return { band, posInBand: rank - start - 1 };
    start += band.count;
  }
  const last = TIER_BANDS[TIER_BANDS.length - 1];
  return { band: last, posInBand: last.count - 1 };
}

export function getLeaderboard(region) {
  const regionSeed = (LEADERBOARD_REGIONS.indexOf(region) + 1) * 1000;

  const tagPool = REGION_TAGS[region] ?? REGION_TAGS.eu;

  const players = Array.from({ length: 30 }, (_, i) => {
    const rank = i + 1;
    const seed = regionSeed + rank * 13;
    const { band, posInBand } = bandForRank(rank);
    // Interpolate across the band's RR window by position, minus a small seeded
    // wobble so it isn't a perfectly straight line — still monotonic overall and
    // always within the band.
    const span = Math.max(band.count - 1, 1);
    const rr = Math.round(band.rrHi - (band.rrHi - band.rrLo) * (posInBand / span) - seededValue(seed) * 6);
    return {
      puuid: `lb-${region}-${rank}`,
      gameName: NAME_POOL[Math.floor(seededValue(seed + 1) * NAME_POOL.length)],
      tagLine: tagPool[Math.floor(seededValue(seed + 2) * tagPool.length)],
      leaderboardRank: rank,
      rankedRating: Math.max(0, rr),
      competitiveTier: band.name,
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
    // Miro#EUW1 ('p3') is also a connected+public Scope profile — planting a second
    // known row makes the "Scope users only" leaderboard filter show a real list.
    const miroRow = players.find((p) => p.leaderboardRank === 27);
    miroRow.gameName = 'Miro';
    miroRow.tagLine = 'EUW1';
  }

  return players;
}
