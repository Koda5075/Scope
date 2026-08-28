import { getSupabase } from './supabaseClient.js';

// Thin client for the read-only Riot proxy edge functions (val-status, val-leaderboard).
// Every failure path — supabase env not configured, function 4xx/5xx, network error,
// slow response — resolves to null, so callers can `?? mock` without a try/catch.

async function invokeSafe(name, body, timeoutMs = 6000) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return null; // VITE_SUPABASE_* not set — stay on mock
  }

  try {
    const timeout = new Promise((resolve) => setTimeout(() => resolve({ data: null, error: 'timeout' }), timeoutMs));
    const { data, error } = await Promise.race([supabase.functions.invoke(name, { body }), timeout]);
    if (error || !data || data.error) return null;
    return data;
  } catch {
    return null;
  }
}

// { status: 'operational' | 'degraded' | 'maintenance', incidents: string[] } | null
export function fetchValStatus(region = 'eu') {
  return invokeSafe('val-status', { region });
}

// { region, actId, players: [{ puuid, gameName, tagLine, leaderboardRank, rankedRating, competitiveTier }] } | null
export function fetchValLeaderboard(region = 'eu') {
  return invokeSafe('val-leaderboard', { region });
}
