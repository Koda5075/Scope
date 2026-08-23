-- Server-side upload rate limit, built now (before real key activation) so it's
-- already non-negotiable once moderate-avatar starts making real, billable Claude API
-- calls — a client-side-only limit would do nothing against a bot calling the Edge
-- Function directly.
create table public.avatar_upload_attempts (
  id uuid primary key default gen_random_uuid(),
  puuid text not null references public.users (puuid) on delete cascade,
  created_at timestamptz not null default now()
);

-- Supports the rolling-24h count in try_record_avatar_upload below.
create index avatar_upload_attempts_puuid_created_idx on public.avatar_upload_attempts (puuid, created_at);

alter table public.avatar_upload_attempts enable row level security;
-- No policies: service role only (Edge Function), same reasoning as every other table here.

-- Atomically checks the caller's rolling-24h upload count and records this attempt in
-- one transaction, so two concurrent requests from the same puuid can't both slip
-- through the same slot (a plain check-then-insert from application code would race
-- under READ COMMITTED). The advisory lock serializes concurrent calls for the same
-- puuid while leaving other puuids unaffected. Returns true (and records the attempt)
-- if under the limit, false (records nothing) if the daily cap is already reached.
create or replace function public.try_record_avatar_upload(p_puuid text, p_max_per_day int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  perform pg_advisory_xact_lock(hashtext(p_puuid));

  select count(*) into v_count
  from public.avatar_upload_attempts
  where puuid = p_puuid and created_at > now() - interval '1 day';

  if v_count >= p_max_per_day then
    return false;
  end if;

  insert into public.avatar_upload_attempts (puuid) values (p_puuid);
  return true;
end;
$$;
