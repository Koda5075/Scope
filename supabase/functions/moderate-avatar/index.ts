// Moderates a profile photo before it's ever exposed as a user's avatar_url. Called
// after the client uploads the raw image to the private `avatars` storage bucket at
// `pending/<puuid>/<file>` (upload itself isn't wired to the frontend yet — there's no
// real logged-in user/session to attach an upload to until RSO goes live — but this
// function is complete and independently testable once that exists).
//
// Fail-closed by design: any error (download, Claude API, unparseable response) leaves
// the photo un-approved rather than defaulting to accepted. A human "report" safety net
// (see report-photo) exists alongside this because no automated moderation is 100%
// reliable — this function is not meant to be the only line of defense.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

const BUCKET = 'avatars';
const CLAUDE_MODEL = 'claude-sonnet-5';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_URL') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODERATION_PROMPT = `You are a content moderator for a gaming stats app (VALORANT). A user has
uploaded this image as their profile picture. Decide whether it violates content policy for a
general-audience profile picture: sexual or nude content, hateful or extremist symbols/imagery,
graphic violence or gore, or any other content inappropriate as a public profile picture.

Respond with ONLY a JSON object, no other text, no markdown fences:
{"flagged": boolean, "category": "sexual" | "hateful" | "violence" | "extremist" | "other" | "none", "reason": string}

"reason" must be one short sentence, phrased so it's safe to show directly to the user who
uploaded the image (no graphic detail).`;

const EXTENSION_MEDIA_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

function mediaTypeFromPath(path: string): string | null {
  const ext = path.split('.').pop()?.toLowerCase();
  return ext ? EXTENSION_MEDIA_TYPES[ext] ?? null : null;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function rejectAndCleanUp(
  supabase: ReturnType<typeof createClient>,
  puuid: string,
  storagePath: string,
  reason: string,
) {
  // Don't hold onto rejected images — delete immediately rather than keeping them
  // around for later inspection.
  await supabase.storage.from(BUCKET).remove([storagePath]);
  await supabase
    .from('users')
    .update({ avatar_status: 'rejected', avatar_rejected_reason: reason, avatar_url: null })
    .eq('puuid', puuid);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  let body: { puuid?: string; storagePath?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: CORS_HEADERS });
  }

  const { puuid, storagePath } = body;
  if (!puuid || !storagePath) {
    return new Response(JSON.stringify({ error: 'missing_params' }), { status: 400, headers: CORS_HEADERS });
  }

  const mediaType = mediaTypeFromPath(storagePath);
  if (!mediaType) {
    return new Response(JSON.stringify({ error: 'unsupported_image_type' }), { status: 400, headers: CORS_HEADERS });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: imageBlob, error: downloadError } = await supabase.storage.from(BUCKET).download(storagePath);
  if (downloadError || !imageBlob) {
    console.error('avatar download failed', downloadError);
    // Fail closed: leave avatar_status as-is (pending) rather than approving.
    return new Response(JSON.stringify({ error: 'download_failed' }), { status: 500, headers: CORS_HEADERS });
  }

  const base64 = arrayBufferToBase64(await imageBlob.arrayBuffer());

  let verdict: { flagged: boolean; category: string; reason: string };
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
              { type: 'text', text: MODERATION_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      throw new Error(`Claude API ${claudeRes.status}: ${await claudeRes.text()}`);
    }

    const claudeJson = await claudeRes.json();
    const rawText = claudeJson.content?.[0]?.text ?? '';
    // Claude was told not to use markdown fences, but strip them defensively rather
    // than fail-closing on a formatting quirk instead of an actual moderation problem.
    const cleanedText = rawText.trim().replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
    verdict = JSON.parse(cleanedText);
    if (typeof verdict.flagged !== 'boolean') throw new Error('malformed verdict shape');
  } catch (err) {
    console.error('moderation call failed', err);
    // Fail closed: a broken/unavailable moderation call must never result in an
    // auto-approved photo. Leave it pending — the human report queue is a secondary
    // net, not a substitute for this check succeeding.
    return new Response(JSON.stringify({ error: 'moderation_failed' }), { status: 502, headers: CORS_HEADERS });
  }

  if (verdict.flagged) {
    await rejectAndCleanUp(supabase, puuid, storagePath, verdict.reason);
    return new Response(JSON.stringify({ status: 'rejected', reason: verdict.reason }), { headers: CORS_HEADERS });
  }

  // Signed URL rather than a public bucket: the bucket stays private end-to-end, and
  // only ever-approved paths get a servable URL. 10-year expiry as a pragmatic stand-in
  // for "effectively permanent" — a real deployment should refresh this before expiry
  // rather than assume it never lapses.
  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10);

  if (signError || !signed) {
    console.error('signed URL creation failed', signError);
    return new Response(JSON.stringify({ error: 'sign_failed' }), { status: 500, headers: CORS_HEADERS });
  }

  await supabase
    .from('users')
    .update({ avatar_status: 'approved', avatar_url: signed.signedUrl, avatar_rejected_reason: null })
    .eq('puuid', puuid);

  return new Response(JSON.stringify({ status: 'approved', avatarUrl: signed.signedUrl }), { headers: CORS_HEADERS });
});
