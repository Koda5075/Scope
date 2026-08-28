// Proxies a VALORANT regional leaderboard (val-ranked-v1) so the Riot key stays
// server-side. Works with a daily development key. Called from
// src/components/tabs/LeaderboardTab.jsx via
// supabase.functions.invoke('val-leaderboard', { body: { region } }); the frontend
// falls back to its mock generator on any non-200.

import { getActiveActId, getRankedLeaderboard, isValRegion } from '../_shared/riot.ts';

const APP_URL = Deno.env.get('APP_URL') ?? '*';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': APP_URL,
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json',
};

// Warm-instance cache: 5 min per region for rows, 12 h for the active act id
// (it only rolls over at the start of a new act, ~every 2 months).
const ROWS_TTL_MS = 5 * 60_000;
const ACT_TTL_MS = 12 * 60 * 60_000;
const rowsCache = new Map<string, { at: number; body: unknown }>();
const actCache = new Map<string, { at: number; id: string }>();

async function readRegion(req: Request): Promise<string> {
  const url = new URL(req.url);
  const qp = url.searchParams.get('region');
  if (qp) return qp.toLowerCase();
  try {
    const body = await req.json();
    return String(body?.region ?? 'eu').toLowerCase();
  } catch {
    return 'eu';
  }
}

async function resolveActId(region: string): Promise<string> {
  const hit = actCache.get(region);
  if (hit && Date.now() - hit.at < ACT_TTL_MS) return hit.id;
  const id = await getActiveActId(region as never);
  if (!id) throw new Error('no active act from val-content-v1');
  actCache.set(region, { at: Date.now(), id });
  return id;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  const region = await readRegion(req);
  if (!isValRegion(region)) {
    return new Response(JSON.stringify({ error: 'invalid_region' }), { status: 400, headers: CORS_HEADERS });
  }

  const hit = rowsCache.get(region);
  if (hit && Date.now() - hit.at < ROWS_TTL_MS) {
    return new Response(JSON.stringify(hit.body), {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=300' },
    });
  }

  try {
    const actId = await resolveActId(region);
    const players = await getRankedLeaderboard(region as never, actId, 30);
    const body = { region, actId, players };
    rowsCache.set(region, { at: Date.now(), body });
    return new Response(JSON.stringify(body), {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=300' },
    });
  } catch (err) {
    console.error('val-leaderboard failed', String(err));
    return new Response(JSON.stringify({ error: 'riot_unavailable' }), { status: 502, headers: CORS_HEADERS });
  }
});
