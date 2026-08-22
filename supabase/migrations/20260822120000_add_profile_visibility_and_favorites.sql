-- Public profile visibility (opt-in): true by default from the first RSO login, so a
-- player is discoverable in search/public profiles unless they turn it off in settings.
-- The rso-callback upsert never lists this column, so a player's choice here survives
-- future logins instead of being reset.
alter table public.users add column is_public boolean not null default true;

-- Slug for the shareable public profile URL (scope.app/u/<slug>), e.g. "kaito-euw1".
-- Generation happens when the public profile feature is wired up; the column is only
-- reserved here.
alter table public.users add column public_slug text;

create unique index users_public_slug_idx on public.users (lower(public_slug)) where public_slug is not null;

-- Followed players (friends or rivals) for quick access without retyping their Riot ID.
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  owner_puuid text not null references public.users (puuid) on delete cascade,
  target_puuid text not null references public.users (puuid) on delete cascade,
  created_at timestamptz not null default now(),
  check (owner_puuid <> target_puuid),
  unique (owner_puuid, target_puuid)
);

create index favorites_owner_puuid_idx on public.favorites (owner_puuid);
create index favorites_target_puuid_idx on public.favorites (target_puuid);

alter table public.favorites enable row level security;
-- No policies: only the service role (used exclusively by Edge Functions) can read/write,
-- same reasoning as public.users and public.oauth_states.
