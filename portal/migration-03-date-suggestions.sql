-- ============================================================
-- MAD HAT CONTENT PORTAL — migration 03: calendar date suggestions
-- • Clients can suggest a new go-live date (drag on the calendar);
--   Mad Hat accepts or declines before it changes.
-- • Adds "Planned" and "In production" statuses (visible to clients)
--   and more content types.
-- No data is removed. The two check constraints are replaced with
-- wider ones that still allow every existing value.
-- ============================================================

alter table public.portal_items add column if not exists proposed_date date;
alter table public.portal_items add column if not exists proposed_by   text;
alter table public.portal_items add column if not exists proposed_at   timestamptz;

alter table public.portal_items drop constraint if exists portal_items_status_check;
alter table public.portal_items add constraint portal_items_status_check
  check (status in ('draft','planned','in_progress','in_review','changes_requested','approved','scheduled','published'));

alter table public.portal_items drop constraint if exists portal_items_type_check;
alter table public.portal_items add constraint portal_items_type_check
  check (type in ('creative','video','blog','document','social','email','other',
                  'website','case_study','investor','pr','research','sales','brief'));

-- Client suggests a new go-live date. Pass null to withdraw the suggestion.
create or replace function public.portal_propose_date(
  p_token text, p_item uuid, p_author text, p_date date
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_item public.portal_items;
  v_note text;
begin
  perform public.portal_item_for_token(p_token, p_item);
  if coalesce(trim(p_author), '') = '' then
    raise exception 'name_required' using errcode = 'P0001';
  end if;
  select * into v_item from public.portal_items where id = p_item;
  if v_item.status = 'published' then
    raise exception 'already_live' using errcode = 'P0001';
  end if;

  if p_date is null or p_date = v_item.scheduled_for then
    if v_item.proposed_date is null then return row_to_json(v_item); end if;
    update public.portal_items set proposed_date = null, proposed_by = null, proposed_at = null
     where id = p_item returning * into v_item;
    v_note := 'Withdrew the suggested date change.';
  else
    update public.portal_items
       set proposed_date = p_date, proposed_by = left(trim(p_author), 80), proposed_at = now()
     where id = p_item returning * into v_item;
    v_note := 'Suggested moving the go-live date from '
      || coalesce(to_char(v_item.scheduled_for, 'FMDD Mon YYYY'), 'no date')
      || ' to ' || to_char(p_date, 'FMDD Mon YYYY') || '.';
  end if;

  insert into public.portal_comments(item_id, author, body, kind)
  values (p_item, left(trim(p_author), 80), v_note, 'status');
  return row_to_json(v_item);
end $$;

revoke all on function public.portal_propose_date(text, uuid, text, date) from public;
grant execute on function public.portal_propose_date(text, uuid, text, date) to anon, authenticated;
