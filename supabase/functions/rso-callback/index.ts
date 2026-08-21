// RSO redirects here with ?code&state after the player signs in. We exchange the
// code for a token, resolve the PUUID, look up the Riot ID via account-v1 (the
// endpoint already available on a Development key), and upsert the user row.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { resolveAccountByPuuid } from '../_shared/riot.ts';

const RIOT_CLIENT_ID = Deno.env.get('RIOT_CLIENT_ID')!;
const RIOT_CLIENT_SECRET = Deno.env.get('RIOT_CLIENT_SECRET')!;
const RSO_REDIRECT_URI = Deno.env.get('RSO_REDIRECT_URI')!;
const APP_URL = Deno.env.get('APP_URL')!; // frontend origin to bounce back to, e.g. http://localhost:5173
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function redirectWithError(reason: string) {
  return Response.redirect(`${APP_URL}/?login_error=${encodeURIComponent(reason)}`, 302);
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return redirectWithError('missing_params');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Consume the state token so it can't be replayed.
  const { data: stateRow } = await supabase
    .from('oauth_states')
    .delete()
    .eq('state', state)
    .select()
    .maybeSingle();

  if (!stateRow) {
    return redirectWithError('invalid_state');
  }

  const tokenRes = await fetch('https://auth.riotgames.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${RIOT_CLIENT_ID}:${RIOT_CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: RSO_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    console.error('RSO token exchange failed', await tokenRes.text());
    return redirectWithError('token_exchange');
  }

  const { access_token: accessToken } = await tokenRes.json();

  const userinfoRes = await fetch('https://auth.riotgames.com/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userinfoRes.ok) {
    console.error('RSO userinfo failed', await userinfoRes.text());
    return redirectWithError('userinfo');
  }

  const { sub: puuid } = await userinfoRes.json();

  let account;
  try {
    account = await resolveAccountByPuuid(puuid);
  } catch (err) {
    console.error(err);
    return redirectWithError('account_lookup');
  }

  const { error: upsertError } = await supabase.from('users').upsert(
    {
      puuid,
      riot_game_name: account.gameName,
      riot_tag_line: account.tagLine,
      region: Deno.env.get('RIOT_ACCOUNT_REGION') ?? 'europe',
      last_login_at: new Date().toISOString(),
    },
    { onConflict: 'puuid' },
  );

  if (upsertError) {
    console.error('user upsert failed', upsertError);
    return redirectWithError('user_upsert');
  }

  // TODO: issue a real app session (signed cookie or custom Supabase JWT) instead
  // of handing the PUUID back in a query param — fine for the skeleton/demo, not for prod.
  return Response.redirect(`${APP_URL}/?puuid=${encodeURIComponent(puuid)}`, 302);
});
