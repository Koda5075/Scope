// Scope can only ever look up one exact Riot ID at a time (account-v1 has no fuzzy
// search), matching case-insensitively like the users_riot_id_idx unique index.
export function parseRiotId(raw) {
  const trimmed = raw.trim();
  const hashIndex = trimmed.indexOf('#');
  if (hashIndex <= 0 || hashIndex === trimmed.length - 1) return null;
  return { name: trimmed.slice(0, hashIndex), tag: trimmed.slice(hashIndex + 1) };
}
