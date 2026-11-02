-- ============================================================
-- MAD HAT CONTENT PORTAL — migration 02: friendly links + passcodes
-- Adds madhatcomm.in/portal/<slug> links protected by a passcode.
-- Additive only: no existing data or objects are removed.
-- ============================================================

alter table public.portal_clients add column if not exists slug text;
alter table public.portal_clients add column if not exists passcode text;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'portal_clients_slug_key') then
    alter table public.portal_clients add constraint portal_clients_slug_key unique (slug);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'portal_clients_slug_format') then
    alter table public.portal_clients add constraint portal_clients_slug_format
      check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
  end if;
end $$;

-- Changing a client's passcode also changes their hidden access key,
-- so devices that unlocked with the old passcode are signed out.
create or replace function public.portal_rotate_token() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.passcode is distinct from old.passcode then
    new.token := encode(extensions.gen_random_bytes(18), 'hex');
  end if;
  return new;
end $$;

drop trigger if exists portal_clients_rotate on public.portal_clients;
create trigger portal_clients_rotate before update on public.portal_clients
  for each row execute function public.portal_rotate_token();

-- Failed passcode attempts, used to slow down guessing.
create table if not exists public.portal_unlock_fails (
  id   bigserial primary key,
  slug text not null,
  at   timestamptz not null default now()
);
create index if not exists portal_unlock_fails_idx on public.portal_unlock_fails(slug, at);
alter table public.portal_unlock_fails enable row level security;
revoke all on public.portal_unlock_fails from anon, authenticated;

-- Exchange slug + passcode for the client's access key.
-- Returns {ok:true, token} or {ok:false, error:'wrong'|'locked'}.
-- After 10 wrong tries in 15 minutes, that link is locked for 15 minutes.
create or replace function public.portal_unlock(p_slug text, p_code text) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_slug  text := lower(trim(coalesce(p_slug, '')));
  v_token text;
  v_fails int;
begin
  delete from public.portal_unlock_fails where at < now() - interval '1 day';
  select count(*) into v_fails from public.portal_unlock_fails
   where slug = v_slug and at > now() - interval '15 minutes';
  if v_fails >= 10 then
    return json_build_object('ok', false, 'error', 'locked');
  end if;

  select token into v_token from public.portal_clients
   where slug = v_slug and passcode is not null
     and upper(passcode) = upper(trim(coalesce(p_code, '')));

  if v_token is null then
    insert into public.portal_unlock_fails(slug) values (left(v_slug, 80));
    return json_build_object('ok', false, 'error', 'wrong');
  end if;
  return json_build_object('ok', true, 'token', v_token);
end $$;

revoke all on function public.portal_unlock(text, text) from public;
grant execute on function public.portal_unlock(text, text) to anon, authenticated;
