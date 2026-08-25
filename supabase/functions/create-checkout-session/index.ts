// Creates a Stripe Checkout session for the Scope+ subscription (test mode). The
// secret key never leaves the server — the frontend only ever gets back the
// short-lived Checkout URL to redirect to. Called from ScopePlansModal.jsx.
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const APP_URL = Deno.env.get('APP_URL')!; // frontend origin Checkout bounces back to

// Test-mode Scope+ prices (Stripe dashboard, product "Scope+"). Kept server-side
// only so the frontend never has to know — or trust — a Stripe price id directly.
const PRICE_IDS: Record<string, string> = {
  monthly: 'price_1U84NzRbV4Nt6513nypNeql2',
  annual: 'price_1U84hoRbV4Nt65131hshLigW',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': APP_URL ?? '*',
  // supabase-js sends `apikey` and `x-client-info` on every call in addition to
  // `authorization` -- omitting any of these makes the browser's CORS preflight
  // reject the real request client-side (invisible to curl, which ignores CORS).
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  // Deno's `Response` defaults to text/plain for a string body -- without this,
  // supabase-js treats every response as plain text instead of parsing it as JSON,
  // so `data` comes back as a raw string and `data.url` is silently undefined.
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: CORS_HEADERS });
  }

  const priceId = body.plan ? PRICE_IDS[body.plan] : undefined;
  if (!priceId) {
    return new Response(JSON.stringify({ error: 'invalid_plan' }), { status: 400, headers: CORS_HEADERS });
  }

  const params = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    // {CHECKOUT_SESSION_ID} is filled in by Stripe on redirect — the frontend passes it
    // to verify-checkout-session so the payment is confirmed with Stripe directly
    // instead of trusting the `checkout=success` query param on its own (that param is
    // trivial to type into the URL bar; the session id alone isn't enough either since
    // verify-checkout-session re-checks payment_status with the secret key server-side).
    success_url: `${APP_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/?checkout=cancel`,
  });

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!stripeRes.ok) {
    console.error('Stripe checkout session creation failed', await stripeRes.text());
    return new Response(JSON.stringify({ error: 'stripe_error' }), { status: 502, headers: CORS_HEADERS });
  }

  const session = await stripeRes.json();
  return new Response(JSON.stringify({ url: session.url }), { headers: CORS_HEADERS });
});
