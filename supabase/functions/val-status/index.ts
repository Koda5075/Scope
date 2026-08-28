// Proxies VALORANT platform status (val-status-v1) so the Riot key stays server-side.
// Works with a daily development key. Called from src/components/ServerStatusBadge.jsx
// via supabase.functions.invoke('val-status', { body: { region } }); the frontend
// falls back to its mock on any non-200, so an unset/expired key just means "mock".

import { getPlatformStatus, isValRegion } from '../_shared/riot.ts';

const APP_URL = Deno.env.get('APP_URL') ?? '*';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': APP_URL,
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json',
};

// Warm-instance cache. Status changes rarely; one lookup per region per minute is plenty.
const TTL_MS = 60_000;
const cache = new Map<string, { at: number; body: unknown }>();

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  const region = await readRegion(req);
  if (!isValRegion(region)) {
    return new Response(JSON.stringify({ error: 'invalid_region' }), { status: 400, headers: CORS_HEADERS });
  }

  const hit = cache.get(region);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return new Response(JSON.stringify(hit.body), {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=60' },
    });
  }

  try {
    const body = await getPlatformStatus(region);
    cache.set(region, { at: Date.now(), body });
    return new Response(JSON.stringify(body), {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=60' },
    });
  } catch (err) {
    console.error('val-status failed', String(err));
    return new Response(JSON.stringify({ error: 'riot_unavailable' }), { status: 502, headers: CORS_HEADERS });
  }
});
