// Real Valorant art assets from valorant-api.com (the community mirror of Riot's game
// content — val-content-v1 itself only returns localized names/IDs, not renderable
// image URLs). Hardcoded here rather than fetched live: no backend proxy exists yet to
// call the authenticated val-content-v1 endpoint, so this stands in as the mock/static
// catalog until the real integration is wired up, same as the rest of src/data.
// URLs verified reachable (200) on 2026-08-23.

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

// Keyed by "TIER RANK" upper-cased (e.g. "DIAMOND 2") — current episode's icon set.
const RANK_ICONS = {
  'PLATINUM 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/16/largeicon.png',
  'DIAMOND 1': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
  'DIAMOND 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png',
  'DIAMOND 3': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/largeicon.png',
  'IMMORTAL 1': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png',
  'IMMORTAL 2': 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/25/largeicon.png',
};

export function getAgentIcon(name) {
  return AGENT_ICONS[name];
}

export function getMapImage(name) {
  return MAP_IMAGES[name];
}

export function getRankIcon(rankName) {
  if (!rankName) return undefined;
  return RANK_ICONS[rankName.toUpperCase()];
}
