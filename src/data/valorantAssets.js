// Real Valorant art assets from valorant-api.com (the community mirror of Riot's game
// content — val-content-v1 itself only returns localized names/IDs, not renderable
// image URLs). Hardcoded here rather than fetched live: no backend proxy exists yet to
// call the authenticated val-content-v1 endpoint, so this stands in as the mock/static
// catalog until the real integration is wired up, same as the rest of src/data.
// URLs verified reachable (200) on 2026-08-23; player card URLs added and verified on
// 2026-08-24.

const AGENT_ICONS = {
  Jett: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png',
  Reyna: 'https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png',
  Sova: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png',
  Omen: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png',
  Sage: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png',
  Killjoy: 'https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png',
  Neon: 'https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png',
  Cypher: 'https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png',
  Breach: 'https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/displayicon.png',
  Phoenix: 'https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png',
  Gekko: 'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png',
  Fade: 'https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png',
  Deadlock: 'https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/displayicon.png',
  Tejo: 'https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/displayicon.png',
  Raze: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/displayicon.png',
  Chamber: 'https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/displayicon.png',
  'KAY/O': 'https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png',
  Skye: 'https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png',
  Harbor: 'https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/displayicon.png',
  Vyse: 'https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/displayicon.png',
  Viper: 'https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png',
  Astra: 'https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/displayicon.png',
  Brimstone: 'https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png',
  Iso: 'https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/displayicon.png',
  Clove: 'https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/displayicon.png',
  Yoru: 'https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png',
  Waylay: 'https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/displayicon.png',
};

// Official VALORANT "Player Card" cosmetics (wide art) — the Scope+ profile-banner
// gallery. Distinct from MAP_IMAGES: player cards are the game's actual in-client
// profile-banner cosmetic, so they're the thematically correct "official" option here,
// vs. map splash art which was only ever a stand-in.
const PLAYER_CARDS = {
  'Dayglo Duo': 'https://media.valorant-api.com/playercards/1711d20d-4b1c-c64a-14be-d4ae58a457c6/wideart.png',
  'Afternoon Asada': 'https://media.valorant-api.com/playercards/c8b2f5fd-4331-b172-f3b7-c8a26f356a1f/wideart.png',
  'Pass the Sticks': 'https://media.valorant-api.com/playercards/eef542d2-4724-bc47-f53f-239f8c9c2623/wideart.png',
  'Dance It All Away': 'https://media.valorant-api.com/playercards/d32e58b1-4191-7315-ad4a-9da58b3f23dd/wideart.png',
  'V25: Prelude To Paris': 'https://media.valorant-api.com/playercards/d2d3caf9-499f-2ac8-9722-54961c3bcbf5/wideart.png',
  'Dimensional Folding': 'https://media.valorant-api.com/playercards/e8787c31-4a39-9636-94a5-77b298d26ba7/wideart.png',
  "Serpent's Celebration": 'https://media.valorant-api.com/playercards/41244f42-43f5-f795-9be8-d2b9edba458a/wideart.png',
  'The Way Forward': 'https://media.valorant-api.com/playercards/33c1f011-4eca-068c-9751-f68c788b2eee/wideart.png',
  Hivemind: 'https://media.valorant-api.com/playercards/fc209787-414b-10d0-dcac-04832fc2c654/wideart.png',
};

const MAP_IMAGES = {
  Bind: { splash: 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png', icon: 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/listviewicon.png' },
  Ascent: { splash: 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png', icon: 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicon.png' },
  Haven: { splash: 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png', icon: 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicon.png' },
  Split: { splash: 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png', icon: 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/listviewicon.png' },
  Icebox: { splash: 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/splash.png', icon: 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicon.png' },
  Fracture: { splash: 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/splash.png', icon: 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicon.png' },
  Pearl: { splash: 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/splash.png', icon: 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/listviewicon.png' },
  Lotus: { splash: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png', icon: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/listviewicon.png' },
  Sunset: { splash: 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png', icon: 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/listviewicon.png' },
};

const WEAPON_ICONS = {
  Vandal: 'https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png',
  Phantom: 'https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png',
  Operator: 'https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png',
  Classic: 'https://media.valorant-api.com/weapons/29a0cfab-485b-f5d5-779a-b59f85e204a8/displayicon.png',
  Spectre: 'https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png',
  Guardian: 'https://media.valorant-api.com/weapons/4ade7faa-4cf1-8376-95ef-39884480959b/displayicon.png',
  Sheriff: 'https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png',
  Judge: 'https://media.valorant-api.com/weapons/ec845bf4-4f79-ddda-a3da-0db3774b2794/displayicon.png',
  Marshal: 'https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png',
  Bulldog: 'https://media.valorant-api.com/weapons/ae3de142-4d85-2547-dd26-4e90bed35cf7/displayicon.png',
  Ghost: 'https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-6481dfc3bb4e/displayicon.png',
};

// Keyed by "TIER RANK" upper-cased (e.g. "DIAMOND 2") — current episode's icon set.
const RANK_ICONS = {
  'PLATINUM 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/16/largeicon.png',
  'DIAMOND 1': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
  'DIAMOND 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png',
  'DIAMOND 3': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/largeicon.png',
  'IMMORTAL 1': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png',
  'IMMORTAL 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/25/largeicon.png',
};

// Full rank ladder for the "how ranking works" pyramid — same competitivetiers episode
// UUID as RANK_ICONS above, walked by tier number (verified reachable 3-27 on
// 2026-08-24). Iron through Immortal have 3 sub-tiers each (baseTier..baseTier+2);
// Radiant has just one. Colors are a stylized approximation of the real palette, same
// as the rest of this mock UI.
const RANK_TIER_BASE_UUID = '03621f52-342b-cf4e-4f86-9350a49c6d04';

const RANK_GROUPS = [
  { name: 'Iron', baseTier: 3, subTiers: 3, color: '#6B6B6B' },
  { name: 'Bronze', baseTier: 6, subTiers: 3, color: '#CD7F32' },
  { name: 'Silver', baseTier: 9, subTiers: 3, color: '#C0C4C9' },
  { name: 'Gold', baseTier: 12, subTiers: 3, color: '#F2C94C' },
  { name: 'Platinum', baseTier: 15, subTiers: 3, color: '#3FA9A0' },
  { name: 'Diamond', baseTier: 18, subTiers: 3, color: '#A97FE0' },
  { name: 'Ascendant', baseTier: 21, subTiers: 3, color: '#2FBE7C' },
  { name: 'Immortal', baseTier: 24, subTiers: 3, color: '#B93A46' },
  { name: 'Radiant', baseTier: 27, subTiers: 1, color: '#FFF3B0' },
];

export function getAgentIcon(name) {
  return AGENT_ICONS[name];
}

export function getAllAgentNames() {
  return Object.keys(AGENT_ICONS);
}

export function getWeaponIcon(name) {
  return WEAPON_ICONS[name];
}

export function getMapImage(name) {
  return MAP_IMAGES[name];
}

// Map splash art doubles as the preset profile-banner gallery — real Valorant art,
// already verified reachable, needs no moderation since it's Scope-provided rather
// than user-uploaded.
export function getAllMapImages() {
  return Object.entries(MAP_IMAGES).map(([name, img]) => ({ name, ...img }));
}

// Scope+ profile-banner gallery — official art, no moderation needed (Riot-provided,
// not user content).
export function getAllPlayerCards() {
  return Object.entries(PLAYER_CARDS).map(([name, url]) => ({ name, url }));
}

export function getRankIcon(rankName) {
  if (!rankName) return undefined;
  return RANK_ICONS[rankName.toUpperCase()];
}

// Every rank group (Iron..Radiant) with its real sub-tier icons, for the rank pyramid.
export function getRankLadder() {
  return RANK_GROUPS.map((group) => ({
    ...group,
    tiers: Array.from({ length: group.subTiers }, (_, i) => ({
      label: group.subTiers > 1 ? `${group.name} ${i + 1}` : group.name,
      icon: `https://media.valorant-api.com/competitivetiers/${RANK_TIER_BASE_UUID}/${group.baseTier + i}/largeicon.png`,
    })),
  }));
}

// Same ladder, flattened to one entry per individual tier (25 total: 3 each for
// Iron..Immortal, 1 for Radiant) — each carries its group name (for looking up
// how-to-reach copy shared across a rank's sub-tiers) and sub-tier index (1-3, or 1 for
// Radiant), for a per-tier accordion rather than a per-rank one.
export function getFlatRankTiers() {
  return getRankLadder().flatMap((group) =>
    group.tiers.map((tier, i) => ({
      key: tier.label,
      label: tier.label,
      icon: tier.icon,
      color: group.color,
      groupName: group.name,
      subTier: i + 1,
    })),
  );
}
