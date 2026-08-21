-- Identity anchor: one row per Riot account, keyed by PUUID (stable across name/tag changes).
create table public.users (
  puuid text primary key,
  riot_game_name text not null,
  riot_tag_line text not null,
  region text not null, -- account-v1 continent shard used to resolve this account (europe/americas/asia)
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

-- Riot ID lookups (gameName#tagLine) are case-insensitive on Riot's side.
create unique index users_riot_id_idx on public.users (lower(riot_game_name), lower(riot_tag_line));

alter table public.users enable row level security;
-- No policies: only the service role (used exclusively by Edge Functions) can read/write.
-- It bypasses RLS entirely, so the anon/authenticated roles are fully locked out until we
-- deliberately add read policies once real user sessions exist.

-- Short-lived CSRF tokens for the RSO authorization-code flow (rso-login writes, rso-callback consumes).
create table public.oauth_states (
  state uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.oauth_states enable row level security;

-- Generic per-account cache for Riot API responses (ranked stats, match history, ...).
-- One row per (puuid, cache_key) so different stat "slices" can expire independently.
create table public.stats_cache (
  id uuid primary key default gen_random_uuid(),
  puuid text not null references public.users (puuid) on delete cascade,
  cache_key text not null, -- e.g. 'ranked_stats', 'match_history', 'match:<matchId>'
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  expires_at timestamptz not null,
  unique (puuid, cache_key)
);

create index stats_cache_puuid_idx on public.stats_cache (puuid);
create index stats_cache_expires_at_idx on public.stats_cache (expires_at);

alter table public.stats_cache enable row level security;
