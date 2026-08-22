-- Profile photo, gated behind moderation before it's ever shown as avatar_url.
-- 'none'    — no photo uploaded (falls back to the letter avatar in the UI)
-- 'pending' — uploaded, awaiting the moderate-avatar Edge Function's verdict
-- 'approved'/'rejected' — moderation verdict; avatar_url is only set on 'approved'
alter table public.users add column avatar_url text;
alter table public.users add column avatar_status text not null default 'none'
  check (avatar_status in ('none', 'pending', 'approved', 'rejected'));
alter table public.users add column avatar_rejected_reason text;

-- Human review queue for the "Report this photo" safety net — required in addition to
-- AI moderation, since no automated system is 100% reliable. Anyone can flag a photo on
-- a public profile; a person reviews it. No policies: service role only (Edge Function),
-- same reasoning as every other table here.
create table public.photo_reports (
  id uuid primary key default gen_random_uuid(),
  target_puuid text not null references public.users (puuid) on delete cascade,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index photo_reports_target_puuid_idx on public.photo_reports (target_puuid);
create index photo_reports_status_idx on public.photo_reports (status);

alter table public.photo_reports enable row level security;

-- Private bucket: only the service role (moderate-avatar Edge Function) can read/write.
-- Pending and rejected images are never reachable by URL. Once moderation approves a
-- photo, moderate-avatar mints a long-lived signed URL for it and stores that as
-- avatar_url — the bucket itself stays private the whole time, nothing is ever moved
-- to a public path.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', false)
on conflict (id) do nothing;
