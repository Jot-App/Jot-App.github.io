-- ============================================================
-- MAD HAT CONTENT PORTAL — Supabase setup
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to re-run: it only creates what's missing.
--
-- How access works:
--   • Clients never touch the tables directly. They open a secret
--     link (portal/?c=<token>) and the page calls the portal_*
--     functions below, which only ever return or change that one
--     client's content.
--   • You (the admin) sign in with email + password. Anyone whose
--     email is in portal_admins gets full read/write.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Tables ----------

create table if not exists public.portal_admins (
  email text primary key
);

create table if not exists public.portal_clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  token       text not null unique default encode(gen_random_bytes(18), 'hex'),
  created_at  timestamptz not null default now()
);

create table if not exists public.portal_campaigns (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.portal_clients(id) on delete cascade,
  name        text not null,
  description text,
  color       text not null default '#9333EA',
  start_date  date,
  end_date    date,
  created_at  timestamptz not null default now()
);

create table if not exists public.portal_items (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.portal_campaigns(id) on delete cascade,
  title         text not null,
  type          text not null default 'creative'
                check (type in ('creative','video','blog','document','social','email','other')),
  status        text not null default 'in_review'
                check (status in ('draft','in_review','changes_requested','approved','scheduled','published')),
  link_url      text,
  preview_url   text,
  description   text,
  scheduled_for date,
  feedback_due  date,
  version       int  not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.portal_comments (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references public.portal_items(id) on delete cascade,
  author      text not null,
  body        text,
  kind        text not null default 'comment'
              check (kind in ('comment','approved','changes_requested','status')),
  from_agency boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists portal_campaigns_client_idx on public.portal_campaigns(client_id);
create index if not exists portal_items_campaign_idx   on public.portal_items(campaign_id);
create index if not exists portal_comments_item_idx    on public.portal_comments(item_id);

create or replace function public.portal_touch() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists portal_items_touch on public.portal_items;
create trigger portal_items_touch before update on public.portal_items
  for each row execute function public.portal_touch();

-- ---------- Admin check ----------

create or replace function public.portal_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.portal_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- Row level security ----------
-- RLS on, and the only policies are for admins. Anonymous visitors
-- get nothing from the tables; they go through the functions below.

alter table public.portal_admins    enable row level security;
alter table public.portal_clients   enable row level security;
alter table public.portal_campaigns enable row level security;
alter table public.portal_items     enable row level security;
alter table public.portal_comments  enable row level security;

drop policy if exists admin_all on public.portal_clients;
create policy admin_all on public.portal_clients   for all to authenticated
  using (public.portal_is_admin()) with check (public.portal_is_admin());

drop policy if exists admin_all on public.portal_campaigns;
create policy admin_all on public.portal_campaigns for all to authenticated
  using (public.portal_is_admin()) with check (public.portal_is_admin());

drop policy if exists admin_all on public.portal_items;
create policy admin_all on public.portal_items     for all to authenticated
  using (public.portal_is_admin()) with check (public.portal_is_admin());

drop policy if exists admin_all on public.portal_comments;
create policy admin_all on public.portal_comments  for all to authenticated
  using (public.portal_is_admin()) with check (public.portal_is_admin());

drop policy if exists admin_read_self on public.portal_admins;
create policy admin_read_self on public.portal_admins for select to authenticated
  using (public.portal_is_admin());

-- Table privileges for signed-in users (RLS above still limits them to admins).
grant select, insert, update, delete on
  public.portal_clients, public.portal_campaigns, public.portal_items, public.portal_comments
  to authenticated;
grant select on public.portal_admins to authenticated;
revoke all on public.portal_admins, public.portal_clients, public.portal_campaigns,
  public.portal_items, public.portal_comments from anon;

-- ---------- Client-link functions ----------

-- Everything one client is allowed to see. Drafts are hidden.
create or replace function public.portal_get(p_token text) returns json
language plpgsql stable security definer set search_path = public as $$
declare
  v_client public.portal_clients;
begin
  select * into v_client from public.portal_clients where token = p_token;
  if not found then
    raise exception 'invalid_link' using errcode = 'P0001';
  end if;

  return json_build_object(
    'client', json_build_object('id', v_client.id, 'name', v_client.name),
    'campaigns', coalesce((
      select json_agg(c order by c.start_date nulls last, c.created_at)
      from public.portal_campaigns c where c.client_id = v_client.id), '[]'::json),
    'items', coalesce((
      select json_agg(i order by i.scheduled_for nulls last, i.created_at)
      from public.portal_items i
      join public.portal_campaigns c on c.id = i.campaign_id
      where c.client_id = v_client.id and i.status <> 'draft'), '[]'::json),
    'comments', coalesce((
      select json_agg(m order by m.created_at)
      from public.portal_comments m
      join public.portal_items i on i.id = m.item_id
      join public.portal_campaigns c on c.id = i.campaign_id
      where c.client_id = v_client.id and i.status <> 'draft'), '[]'::json)
  );
end $$;

-- Internal: confirm an item belongs to the client behind a token.
create or replace function public.portal_item_for_token(p_token text, p_item uuid)
returns uuid
language plpgsql stable security definer set search_path = public as $$
declare v_id uuid;
begin
  select i.id into v_id
  from public.portal_items i
  join public.portal_campaigns c on c.id = i.campaign_id
  join public.portal_clients  k on k.id = c.client_id
  where k.token = p_token and i.id = p_item and i.status <> 'draft';
  if v_id is null then
    raise exception 'not_allowed' using errcode = 'P0001';
  end if;
  return v_id;
end $$;

create or replace function public.portal_comment(
  p_token text, p_item uuid, p_author text, p_body text
) returns json
language plpgsql security definer set search_path = public as $$
declare v_row public.portal_comments;
begin
  perform public.portal_item_for_token(p_token, p_item);
  if coalesce(trim(p_author), '') = '' or coalesce(trim(p_body), '') = '' then
    raise exception 'name_and_comment_required' using errcode = 'P0001';
  end if;
  insert into public.portal_comments(item_id, author, body, kind)
  values (p_item, left(trim(p_author), 80), left(trim(p_body), 5000), 'comment')
  returning * into v_row;
  return row_to_json(v_row);
end $$;

-- Approve or request changes. A note is required for changes.
create or replace function public.portal_decide(
  p_token text, p_item uuid, p_author text, p_decision text, p_note text default null
) returns json
language plpgsql security definer set search_path = public as $$
declare v_row public.portal_comments;
begin
  perform public.portal_item_for_token(p_token, p_item);
  if p_decision not in ('approved', 'changes_requested') then
    raise exception 'bad_decision' using errcode = 'P0001';
  end if;
  if coalesce(trim(p_author), '') = '' then
    raise exception 'name_required' using errcode = 'P0001';
  end if;
  if p_decision = 'changes_requested' and coalesce(trim(p_note), '') = '' then
    raise exception 'note_required' using errcode = 'P0001';
  end if;

  update public.portal_items set status = p_decision where id = p_item;

  insert into public.portal_comments(item_id, author, body, kind)
  values (p_item, left(trim(p_author), 80), nullif(left(trim(coalesce(p_note, '')), 5000), ''), p_decision)
  returning * into v_row;
  return row_to_json(v_row);
end $$;

revoke all on function public.portal_item_for_token(text, uuid) from public, anon, authenticated;
grant execute on function public.portal_get(text)                              to anon, authenticated;
grant execute on function public.portal_comment(text, uuid, text, text)        to anon, authenticated;
grant execute on function public.portal_decide(text, uuid, text, text, text)   to anon, authenticated;

-- ---------- File storage for creatives ----------
-- Public-read bucket (file URLs are long and random); only admins can upload.

insert into storage.buckets (id, name, public)
values ('portal-assets', 'portal-assets', true)
on conflict (id) do nothing;

drop policy if exists portal_assets_admin_write on storage.objects;
create policy portal_assets_admin_write on storage.objects for insert to authenticated
  with check (bucket_id = 'portal-assets' and public.portal_is_admin());

drop policy if exists portal_assets_admin_update on storage.objects;
create policy portal_assets_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'portal-assets' and public.portal_is_admin());

drop policy if exists portal_assets_admin_delete on storage.objects;
create policy portal_assets_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'portal-assets' and public.portal_is_admin());

-- ---------- Make yourself the admin ----------
-- Change the email to the one you'll sign in with, then run.
insert into public.portal_admins(email) values ('amitbahirat.13@gmail.com')
on conflict do nothing;
