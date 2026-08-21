// Starts the RSO authorization-code flow: mints a CSRF state, stores it, and
// redirects the browser to Riot's authorize endpoint. Meant to be linked to
// directly (e.g. <a href=".../functions/v1/rso-login">), not fetched via XHR.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const RIOT_CLIENT_ID = Deno.env.get('RIOT_CLIENT_ID')!;
const RSO_REDIRECT_URI = Deno.env.get('RSO_REDIRECT_URI')!; // must match Riot's registered redirect URI exactly
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: stateRow, error } = await supabase
    .from('oauth_states')
    .insert({})
    .select('state')
    .single();

  if (error || !stateRow) {
    console.error('failed to create oauth state', error);
    return new Response('Could not start login', { status: 500 });
  }

  const authorizeUrl = new URL('https://auth.riotgames.com/authorize');
  authorizeUrl.searchParams.set('client_id', RIOT_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', RSO_REDIRECT_URI);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', 'openid');
  authorizeUrl.searchParams.set('state', stateRow.state);

  return Response.redirect(authorizeUrl.toString(), 302);
});
