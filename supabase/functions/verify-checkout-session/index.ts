// Confirms a Stripe Checkout session actually completed before the frontend is allowed
// to flip isPremium — without this, ScopePlansModal's redirect target (?checkout=success)
// could be typed into the URL bar directly to unlock Scope+ for free, since nothing was
// ever verified server-side. The frontend now sends back the session id Stripe put in the
// success_url and this function asks Stripe directly whether that specific session was
// actually paid — a session id alone isn't enough, it has to check out as paid with Stripe.
//
// This only confirms *a* payment happened; it doesn't persist "this account is premium"
// anywhere, because there's no real user session yet (RSO isn't wired up — see
// rso-callback's TODO). Once real accounts exist, this is also where the premium flag
// should get written to the user's row instead of being handed back to the client.
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_URL') ?? '*',
  // supabase-js sends `apikey` and `x-client-info` on every call in addition to
  // `authorization` -- omitting any of these makes the browser's CORS preflight
  // reject the real request client-side (invisible to curl, which ignores CORS).
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  // Deno's `Response` defaults to text/plain for a string body -- without this,
  // supabase-js treats every response as plain text instead of parsing it as JSON,
  // so `data` comes back as a raw string and `data.premium` is silently undefined.
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  let body: { sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: CORS_HEADERS });
  }

  const { sessionId } = body;
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return new Response(JSON.stringify({ error: 'missing_or_invalid_session_id' }), { status: 400, headers: CORS_HEADERS });
  }

  const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  });

  if (!stripeRes.ok) {
    // Includes "no such session" for a made-up id — fail closed either way.
    return new Response(JSON.stringify({ premium: false }), { headers: CORS_HEADERS });
  }

  const session = await stripeRes.json();
  const premium = session.mode === 'subscription' && session.payment_status === 'paid';

  return new Response(JSON.stringify({ premium }), { headers: CORS_HEADERS });
});
