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
  'Access-Control-Allow-Headers': 'authorization, content-type',
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
    success_url: `${APP_URL}/?checkout=success`,
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
