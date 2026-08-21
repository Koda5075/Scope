// Shared Riot API helpers used by the RSO edge functions.

const RIOT_API_KEY = Deno.env.get('RIOT_API_KEY')!;

// account-v1 is routed through a continent shard (europe/americas/asia), not the
// platform shard (euw1/na1/...) used by match-v5/val-match-v1.
const ACCOUNT_REGION = Deno.env.get('RIOT_ACCOUNT_REGION') ?? 'europe';

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
