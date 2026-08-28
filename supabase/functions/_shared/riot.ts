// Shared Riot API helpers.
//
// RIOT_API_KEY can be a personal daily development key (RGAPI-…, regenerated every
// 24h, ~20 req/s / 100 req/2min, dev/test only) or the production key once approved.
// The read-only VALORANT endpoints below (status, content, ranked leaderboards) work
// with a daily key; account-v1 does too. RSO login and val-match-v1 do not.

const RIOT_API_KEY = Deno.env.get('RIOT_API_KEY')!;

// account-v1 is routed through a continent shard (europe/americas/asia), not the
// platform shard used by the val-* endpoints.
const ACCOUNT_REGION = Deno.env.get('RIOT_ACCOUNT_REGION') ?? 'europe';

// val-status-v1 / val-content-v1 / val-ranked-v1 route through a platform shard.
export const VAL_PLATFORM_REGIONS = ['ap', 'br', 'eu', 'kr', 'latam', 'na'] as const;
export type ValRegion = (typeof VAL_PLATFORM_REGIONS)[number];

export function isValRegion(r: string): r is ValRegion {
  return (VAL_PLATFORM_REGIONS as readonly string[]).includes(r);
}

// competitiveTier integer (Riot's competitivetiers scheme) -> display string that
// src/data/valorantAssets.js getRankIcon() understands. A regional top board is
// Immortal/Radiant only, but the whole ladder is here for safety.
const TIER_NAMES = [
  'Unranked', '', '',
  'Iron 1', 'Iron 2', 'Iron 3',
  'Bronze 1', 'Bronze 2', 'Bronze 3',
  'Silver 1', 'Silver 2', 'Silver 3',
  'Gold 1', 'Gold 2', 'Gold 3',
  'Platinum 1', 'Platinum 2', 'Platinum 3',
  'Diamond 1', 'Diamond 2', 'Diamond 3',
  'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
  'Immortal 1', 'Immortal 2', 'Immortal 3',
  'Radiant',
];

export function tierName(tier: number): string {
  return TIER_NAMES[tier] || 'Immortal 1';
}

async function riotGet(url: string, label: string) {
  if (!RIOT_API_KEY) throw new Error(`${label}: RIOT_API_KEY is not set`);
  const res = await fetch(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
  if (!res.ok) {
    throw new Error(`${label} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

type StatusEntry = {
  id: number;
  maintenance_status?: string;
  incident_severity?: string | null;
  titles?: { locale: string; content: string }[];
  updates?: unknown[];
};

// GET /val/status/v1/platform-data — maintenances / incidents arrays. Maps to the
// same { status, incidents } shape src/data/mockData.js serverStatus uses.
export async function getPlatformStatus(region: ValRegion) {
  const data = (await riotGet(
    `https://${region}.api.riotgames.com/val/status/v1/platform-data`,
    'val-status-v1',
  )) as { maintenances?: StatusEntry[]; incidents?: StatusEntry[] };

  const pickTitle = (e: StatusEntry) =>
    e.titles?.find((x) => x.locale?.startsWith('en'))?.content ?? e.titles?.[0]?.content ?? '';

  const maintenances = data.maintenances ?? [];
  const incidents = data.incidents ?? [];
  const status = maintenances.length ? 'maintenance' : incidents.length ? 'degraded' : 'operational';

  return {
    status,
    incidents: [...maintenances, ...incidents].map(pickTitle).filter(Boolean),
  };
}

// GET /val/content/v1/contents — find the currently active competitive act id.
export async function getActiveActId(region: ValRegion): Promise<string | null> {
  const data = (await riotGet(
    `https://${region}.api.riotgames.com/val/content/v1/contents?locale=en-US`,
    'val-content-v1',
  )) as { acts?: { id: string; isActive: boolean; type?: string }[] };

  const acts = data.acts ?? [];
  const active = acts.find((a) => a.isActive && a.type === 'act') ?? acts.find((a) => a.isActive);
  return active?.id ?? null;
}

type LeaderboardPlayer = {
  puuid?: string;
  gameName?: string;
  tagLine?: string;
  leaderboardRank: number;
  rankedRating: number;
  numberOfWins?: number;
  competitiveTier: number;
};

// GET /val/ranked/v1/leaderboards/by-act/{actId} — maps rows to the shape
// src/data/leaderboardData.js getLeaderboard() returns, so LeaderboardTab renders
// real and mock rows identically.
export async function getRankedLeaderboard(region: ValRegion, actId: string, size = 30) {
  const data = (await riotGet(
    `https://${region}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/${actId}?size=${size}&startIndex=0`,
    'val-ranked-v1',
  )) as { players?: LeaderboardPlayer[] };

  return (data.players ?? []).map((p, i) => ({
    puuid: p.puuid || `lb-${region}-${p.leaderboardRank ?? i + 1}`,
    gameName: p.gameName || '',
    tagLine: p.tagLine || '',
    leaderboardRank: p.leaderboardRank ?? i + 1,
    rankedRating: p.rankedRating ?? 0,
    competitiveTier: tierName(p.competitiveTier),
  }));
}

export async function resolveAccountByPuuid(puuid: string) {
  const res = await fetch(
    `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
    { headers: { 'X-Riot-Token': RIOT_API_KEY } },
  );
  if (!res.ok) {
    throw new Error(`account-v1 by-puuid failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ puuid: string; gameName: string; tagLine: string }>;
}

export async function resolveAccountByRiotId(gameName: string, tagLine: string) {
  const res = await fetch(
    `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    { headers: { 'X-Riot-Token': RIOT_API_KEY } },
  );
  if (!res.ok) {
    throw new Error(`account-v1 by-riot-id failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<{ puuid: string; gameName: string; tagLine: string }>;
}

// TODO(val-match-v1): wire this up once the Riot production API key is approved.
// Match endpoints use the platform shard (euw1/na1/...), which we don't resolve yet —
// see https://developer.riotgames.com/apis#match-v5 for the VALORANT equivalent.
export async function getMatchHistory(_puuid: string, _platformRegion: string): Promise<never> {
  throw new Error('val-match-v1 not wired yet — waiting on Riot production API key approval');
}
