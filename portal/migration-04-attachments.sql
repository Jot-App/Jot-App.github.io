-- ============================================================
-- MAD HAT CONTENT PORTAL — migration 04: files for review
-- Adds a list of uploaded files (images, PDFs, videos) to each piece,
-- and limits the storage bucket to those file types, 50 MB each.
-- Additive only.
-- ============================================================
alter table public.portal_items add column if not exists attachments jsonb not null default '[]'::jsonb;

update storage.buckets
   set file_size_limit = 52428800,
       allowed_mime_types = array['image/*','application/pdf','video/mp4','video/quicktime','video/webm']
 where id = 'portal-assets';

-- Admins need SELECT as well as DELETE to remove files from storage.
drop policy if exists portal_assets_admin_select on storage.objects;
create policy portal_assets_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'portal-assets' and public.portal_is_admin());
