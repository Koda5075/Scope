// Human review safety net for profile photos, required alongside AI moderation (see
// moderate-avatar) since no automated system catches everything. Anyone viewing a
// public profile can flag its photo; this just queues it for a person to look at —
// no automated action is taken here.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_URL') ?? '*',
  // supabase-js sends `apikey` and `x-client-info` on every call in addition to
  // `authorization` -- omitting any of these makes the browser's CORS preflight
  // reject the real request client-side (invisible to curl, which ignores CORS).
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  // Deno's `Response` defaults to text/plain for a string body -- without this,
  // supabase-js treats every response as plain text instead of parsing it as JSON.
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  let body: { targetPuuid?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: CORS_HEADERS });
  }

  const { targetPuuid, reason } = body;
  if (!targetPuuid) {
    return new Response(JSON.stringify({ error: 'missing_params' }), { status: 400, headers: CORS_HEADERS });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error } = await supabase.from('photo_reports').insert({
    target_puuid: targetPuuid,
    reason: reason?.slice(0, 500) ?? null,
  });

  if (error) {
    console.error('photo report insert failed', error);
    return new Response(JSON.stringify({ error: 'insert_failed' }), { status: 500, headers: CORS_HEADERS });
  }

  return new Response(JSON.stringify({ status: 'reported' }), { headers: CORS_HEADERS });
});
