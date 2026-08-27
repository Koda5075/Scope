// Unlock rules for the cosmetics locker: every preset banner and spray is either
// free, gated behind Scope+, or gated behind one of the existing achievement badges
// (badgeDefs in mockData.js). Locked items still show in the locker, greyed, with the
// requirement spelled out — same "visible but locked" treatment as the Badges tab.
//
// Badge ids come straight from badgeDefs: teamPlayer, aceX3, headshots200, streak5,
// newTier, top15, comeback, nightOwl, earlyBird, marathon, supportStar, rivalSlayer,
// explorer, versatile. In the current mock, nightOwl / marathon / explorer are the
// three locked badges, so cosmetics tied to those demo the locked state.

import { badgeDefs, isBadgeUnlocked } from './mockData.js';
import { getAllPlayerCards } from './valorantAssets.js';
import { getAllSprays } from './valorantCosmetics.js';

const badge = (badgeId) => ({ kind: 'badge', badgeId });
const PREMIUM = { kind: 'premium' };
const FREE = { kind: 'free' };

// Keyed by player-card name (see PLAYER_CARDS in valorantAssets.js).
const BANNER_RULES = {
  'Pass the Sticks': badge('teamPlayer'),
  "Serpent's Celebration": badge('aceX3'),
  'The Way Forward': badge('comeback'),
  Clutch: badge('streak5'),
  'Battle Sage': badge('supportStar'),
  '5 Years: Redemption': badge('newTier'),
  Outlaw: badge('rivalSlayer'),
  'Judge Schema': badge('headshots200'),
  'Epilogue: Bot Means Business': badge('top15'),
  'Dance It All Away': badge('earlyBird'),
  'Dimensional Folding': badge('versatile'),
  'Boot Camp // So Much More': badge('marathon'),
  "Horrors I've Seen": badge('nightOwl'),
  'Loong Kee': badge('explorer'),
  'V25: Prelude To Paris': PREMIUM,
  Hivemind: PREMIUM,
  'Radiant Skincare': PREMIUM,
  'Dreamwing Lunari': PREMIUM,
  'PREMIER V25A4': PREMIUM,
  Nocturnum: PREMIUM,
};

// Keyed by spray id (see SPRAYS in valorantCosmetics.js).
const SPRAY_RULES = {
  'f20b1abe-478b-9a51-590c-30b08181fd79': badge('headshots200'), // Radianite Hazard
  'ed3208ac-454a-43a0-e77a-6e83328ddf0c': badge('earlyBird'), // Bunny Hop
  '2df9762d-452d-0c80-d1f3-12aa8f6ebcf3': badge('streak5'), // Clutch or Kick
  '65e1df93-41ac-b192-d791-3382491f58cc': badge('rivalSlayer'), // Gotta One Tap
  '67481014-423a-3175-4f5e-d0ba9422f887': badge('top15'), // Party's Here
  '2d9be381-4686-b392-310e-8bb2a6707f7e': badge('marathon'), // Pity Party
  '7e85d0ab-4cc5-d869-5485-798aae7e8656': badge('nightOwl'), // Hot Seat
  'fe86a4c5-4e92-324b-4c0d-a7a837d0d548': badge('supportStar'), // Cans On
  '67af5786-4cb7-f2d7-07c6-0d874ffff5ce': badge('versatile'), // Pixel TactiBunny
  '47700b6e-439a-5a71-8b8c-c1bb0ec9a4a9': badge('explorer'), // Party of 1
  'ef3977c1-4e22-e53e-d571-4ea8ed6e5fc9': badge('aceX3'), // Fragger's Fall
  '38b459ee-46f6-5f3b-147c-6a9492f667b2': badge('nightOwl'), // I Sleep
  '3da0e460-4f94-92db-4a57-66b0ba605a2b': badge('streak5'), // Dumpster Fire
  'eece70be-4f84-facb-49b0-fe95290eff67': badge('rivalSlayer'), // Salt Shaker
  '3910377e-4449-0f51-ceff-2b8e62d23241': badge('teamPlayer'), // Hearts Array
  '890c4f6d-4794-3d88-617b-1b906c7a8ea6': badge('aceX3'), // Clutch
  '5b5fc918-4d57-9fa9-1a5d-1b84c43a121e': badge('comeback'), // Rage
  '6550c96f-491d-7e4c-e923-84bf433d0b3f': PREMIUM, // Shock Heart
  '0dc378e3-4936-7c9f-a1ba-fd90999b3a10': PREMIUM, // A Prime Valentine's Gift
  '13cc701a-4321-e105-3b66-01affe7da31a': PREMIUM, // Claim the Crown
  'ecaa869c-4982-51bf-c0b4-54a287120ec5': PREMIUM, // Radiant Riffs
  '35d8fb90-49a9-641e-ff08-b4bc20421908': PREMIUM, // Boom!
};

export function getBannerLocker() {
  return getAllPlayerCards().map((b) => ({ ...b, rule: BANNER_RULES[b.name] ?? FREE }));
}

export function getSprayLocker(lang) {
  return getAllSprays(lang).map((s) => ({ ...s, rule: SPRAY_RULES[s.id] ?? FREE }));
}

export function isCosmeticUnlocked(rule, isPremium) {
  if (!rule || rule.kind === 'free') return true;
  if (rule.kind === 'premium') return !!isPremium;
  if (rule.kind === 'badge') {
    const def = badgeDefs.find((b) => b.id === rule.badgeId);
    return !!def && isBadgeUnlocked(def);
  }
  return false;
}

// Short human string for a locked item's requirement. `t` is the active translation
// bundle; badge names reuse t.badges[id].label (same labels the Badges tab shows).
export function describeCosmeticLock(rule, t) {
  if (!rule || rule.kind === 'free') return '';
  if (rule.kind === 'premium') return 'Scope+';
  if (rule.kind === 'badge') {
    const label = t.badges?.[rule.badgeId]?.label ?? rule.badgeId;
    return (t.lockerLockedByBadge ?? '{badge}').replace('{badge}', label);
  }
  return '';
}
