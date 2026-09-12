// Scope can only ever look up one exact Riot ID at a time (account-v1 has no fuzzy
// search), matching case-insensitively like the users_riot_id_idx unique index.
export function parseRiotId(raw) {
  const trimmed = raw.trim();
  const hashIndex = trimmed.indexOf('#');
  if (hashIndex <= 0 || hashIndex === trimmed.length - 1) return null;
  return { name: trimmed.slice(0, hashIndex), tag: trimmed.slice(hashIndex + 1) };
}

// Suggested referral code for an account, derived from its own nickname rather than a
// hardcoded stranger's name — used as the pre-filled default on both Settings > Privacy
// and the dashboard's Invite Friends card, so the two never show two different fake
// codes for the same account. Only the name half of a Riot ID (before the #tag),
// stripped to [A-Z0-9] and capped at 6 chars, so the result always fits the referral
// code field's own 4-12 char / letters-digits-dashes format.
export function defaultReferralCode(nickname) {
  const base = (nickname?.trim().split('#')[0] || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'KAITO';
  return `${base}-SCOPE`;
}
