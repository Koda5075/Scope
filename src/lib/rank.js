// Valorant has TWO RR systems, and the rank card has to render both:
//
//  • Iron → Ascendant — each sub-tier (1/2/3) has its own 0-100 RR bar. Hit 100 and you
//    promote; the bar resets to 0. A "Diamond 2" player is always 0-100 RR.
//
//  • Immortal 1/2/3 — ONE continuous counter that never resets between the sub-tiers:
//      0-99   RR → Immortal 1
//      100-199 RR → Immortal 2
//      200+   RR → Immortal 3   (no upper cap — a player can sit at Immortal 3, 400 RR)
//    Radiant is the top ~500 of an act's leaderboard, not an RR threshold, so it carries
//    no sub-tier RR of its own.

export function isImmortal(rank = '') {
  return /^\s*immortal/i.test(rank);
}

export function isRadiant(rank = '') {
  return /^\s*radiant/i.test(rank);
}

// Sub-tier number (1 / 2 / 3) from a rank string like "Immortal 3" or "DIAMOND 2".
// Radiant and anything without a trailing digit is treated as 1.
export function subTier(rank = '') {
  const m = String(rank).trim().match(/([123])\s*$/);
  return m ? Number(m[1]) : 1;
}

// The continuous-counter RR band an Immortal sub-tier falls in. Immortal 3's upper
// bound is a display ceiling only (the real tier is uncapped).
export function immortalRrBand(rank) {
  const s = subTier(rank);
  if (s <= 1) return [0, 100];
  if (s === 2) return [100, 200];
  return [200, 400];
}

// A plausible RR value for a rank. `seed01` is a 0..1 number (deterministic where a
// caller has a seeded RNG) used to place the value inside the band. Immortal → the
// continuous total (can exceed 100); everything else → a 0-100 sub-tier value; Radiant
// → null (no sub-tier RR shown).
export function rrForRank(rank, seed01 = 0.5) {
  const s = Math.max(0, Math.min(1, seed01));
  if (isRadiant(rank)) return null;
  if (isImmortal(rank)) {
    const [lo, hi] = immortalRrBand(rank);
    return Math.round(lo + s * (hi - lo));
  }
  return Math.round(4 + s * 92); // 4..96 within the sub-tier
}

// How the rank card should render one RR value + its progress bar:
//   non-Immortal   → "{rr} RR / 100", bar = rr%
//   Immortal 1/2   → "{rr} RR / {100|200}", bar = progress through that band toward promotion
//   Immortal 3     → "{rr} RR" (no goal — uncapped), bar scaled against a soft display max
//   Radiant / null → nothing
export function rankRrDisplay(rank, rr) {
  if (rr == null || isRadiant(rank)) return { rr: null, goal: null, barPct: null };
  const clamp = (n) => Math.max(0, Math.min(100, n));
  if (!isImmortal(rank)) {
    return { rr, goal: 100, barPct: clamp(rr) };
  }
  const s = subTier(rank);
  const [lo, hi] = immortalRrBand(rank);
  if (s >= 3) return { rr, goal: null, barPct: clamp(((rr - lo) / (hi - lo)) * 100) };
  return { rr, goal: hi, barPct: clamp(((rr - lo) / (hi - lo)) * 100) };
}
