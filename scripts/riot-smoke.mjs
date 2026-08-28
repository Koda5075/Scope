// Riot API smoke test — confirms a key in supabase/functions/.env can reach the
// read-only VALORANT endpoints Scope proxies (val-status, val-content, val-ranked)
// and, optionally, account-v1. Hits Riot directly; deploying the edge functions is
// separate. The key is never printed.
//
//   node scripts/riot-smoke.mjs                 # status + content + ranked (eu)
//   node scripts/riot-smoke.mjs Name#Tag        # also resolve that Riot ID
//   RIOT_REGION=na node scripts/riot-smoke.mjs  # different platform shard

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv(path) {
  try {
    const out = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
    return out;
  } catch {
    return {};
  }
}

const env = loadEnv(resolve(root, 'supabase/functions/.env'));
const KEY = process.env.RIOT_API_KEY || env.RIOT_API_KEY;
const REGION = (process.env.RIOT_REGION || 'eu').toLowerCase();
const ACCOUNT_REGION = process.env.RIOT_ACCOUNT_REGION || env.RIOT_ACCOUNT_REGION || 'europe';

if (!KEY) {
  console.error('No RIOT_API_KEY found. Put it in supabase/functions/.env:');
  console.error('  RIOT_API_KEY=RGAPI-...');
  process.exit(1);
}

const H = { 'X-Riot-Token': KEY };
let failed = false;

async function get(url) {
  const res = await fetch(url, { headers: H });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json, text };
}

function line(ok, msg) {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failed = true;
}

// 1. val-status-v1
{
  const r = await get(`https://${REGION}.api.riotgames.com/val/status/v1/platform-data`);
  if (r.ok) {
    const m = r.json?.maintenances?.length ?? 0;
    const i = r.json?.incidents?.length ?? 0;
    line(true, `val-status ${REGION} -> ${m ? 'maintenance' : i ? 'degraded' : 'operational'} (${m} maint, ${i} incidents)`);
  } else {
    line(false, `val-status ${REGION} -> HTTP ${r.status} ${r.text.slice(0, 120)}`);
  }
}

// 2. val-content-v1 -> active act id
let actId = null;
{
  const r = await get(`https://${REGION}.api.riotgames.com/val/content/v1/contents?locale=en-US`);
  if (r.ok) {
    const acts = r.json?.acts ?? [];
    const active = acts.find((a) => a.isActive && a.type === 'act') ?? acts.find((a) => a.isActive);
    actId = active?.id ?? null;
    line(!!actId, `val-content ${REGION} -> active act ${actId ?? '(none found)'}`);
  } else {
    line(false, `val-content ${REGION} -> HTTP ${r.status} ${r.text.slice(0, 120)}`);
  }
}

// 3. val-ranked-v1 leaderboard (needs the act id)
if (actId) {
  const r = await get(`https://${REGION}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/${actId}?size=3&startIndex=0`);
  if (r.ok) {
    const p = r.json?.players ?? [];
    const top = p[0];
    const who = top ? `${top.gameName || '(hidden)'}#${top.tagLine || '??'} ${top.rankedRating}RR` : '(no rows)';
    line(p.length > 0, `val-ranked ${REGION} -> ${r.json?.totalPlayers ?? p.length} players, #1 ${who}`);
  } else {
    line(false, `val-ranked ${REGION} -> HTTP ${r.status} ${r.text.slice(0, 120)}`);
  }
}

// 4. account-v1 (optional, only if a Riot ID is passed)
const riotId = process.argv[2];
if (riotId && riotId.includes('#')) {
  const [name, tag] = riotId.split('#');
  const r = await get(
    `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
  );
  if (r.ok) {
    line(true, `account-v1 ${ACCOUNT_REGION} -> ${r.json.gameName}#${r.json.tagLine} puuid ${String(r.json.puuid).slice(0, 8)}…`);
  } else {
    line(false, `account-v1 ${ACCOUNT_REGION} -> HTTP ${r.status} ${r.text.slice(0, 120)}`);
  }
}

console.log(failed ? '\nSome checks failed.' : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
