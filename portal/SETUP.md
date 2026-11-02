# Content Review Portal: setup

Lives at **madhatcomm.in/portal/**. It has three modes:

| URL | Who | What they can do |
|---|---|---|
| `/portal/<link-name>` (e.g. `/portal/sunfan`) | A client's team | Enter the passcode once per device, then see their campaigns (not drafts), comment, approve or request changes |
| `/portal/?c=<secret>` | A client's team | Older-style private link, still works, no passcode |
| `/portal/` | You | Sign in; add clients, campaigns and content; reply; change status; copy client links |
| `/portal/?demo` | Anyone | Sample data in the browser only. Use it to try the portal or show it to a client |

Until you add the Supabase keys, the page always opens in demo mode.

---

> **Status (2 Nov 2026):** Steps 1 and 2 are done. The database is set up in "Jot-App's Project" and the keys are in `index.html`. Still to do: create your login (step 1.2) and deploy (step 3).

## 1. Set up your existing Supabase project (≈5 min)

Use the project you already have. Don't create a new one. The portal only adds things whose names start with `portal_` (and a storage bucket named `portal-assets`), so it sits alongside your existing tables without touching them.

1. Open your existing project. Go to **SQL Editor → New query**, paste all of `supabase-setup.sql` and click **Run**.
   - Before running, check **Table Editor** for any existing tables named `portal_clients`, `portal_campaigns`, `portal_items`, `portal_comments` or `portal_admins`. If any exist, tell me before running. The script would reuse them instead of creating them.
   - The last line adds `amitbahirat.13@gmail.com` as admin. Change it first if you'll sign in with another email.
2. **Authentication → Users**: if that email already has a user in this project, use its existing password. Otherwise **Add user → Create new user**, enter the email and a password, and tick **Auto confirm user**.
3. **Leave the sign-up setting alone.** Your other app on this project may rely on people signing up. That's safe here: a signed-in user who isn't in `portal_admins` sees nothing in the portal.

## 2. Add the keys to the page

**Project Settings → API**. Copy the **Project URL** and the **anon / public** key into the `PORTAL_CONFIG` block near the top of `portal/index.html`:

```js
supabaseUrl: 'https://xxxx.supabase.co',
supabaseAnonKey: 'eyJhbGciOi...',
```

The anon key is meant to be public. With the setup SQL in place, it can't read any table directly. It can only call the three functions that are scoped to a client's secret link.

**Never paste the `service_role` key into the page.**

## 3. Deploy

Commit `portal/` to the `Jot-App.github.io` repo. GitHub Pages serves it at madhatcomm.in/portal/. The page has `noindex` set, so it won't show up in Google. Don't link it from the sitemap or the nav.

## Day-to-day

1. **+ Client**: set the name, link name (e.g. `sunfan`) and passcode. It then shows a ready-to-send message with the link and passcode. To cut off access, use **Edit client → New code**: everyone using the old passcode is signed out.
   - Friendly links work through the site's `404.html`, which forwards `/portal/<name>` to the portal. After 10 wrong passcodes in 15 minutes, that link pauses for 15 minutes.
2. **+ Campaign**: add a name, dates and a colour. The colour is used on cards and the calendar.
3. **+ Content**: add a title, type and a link (Drive, Docs, Figma or YouTube).
   - Upload an image or video as a preview, or let Drive/YouTube links preview automatically. For Drive, the file must be shared as "anyone with the link".
   - Set **Goes live on** and **Feedback needed by**. These drive the calendar and the overdue flags.
   - Save as **Draft** to keep it hidden from the client until it's ready.
4. When the client requests changes, upload the revision and click **New version uploaded** in the item panel. That bumps it to v2 and puts it back to "Awaiting feedback".
5. After approval, set the status to **Scheduled**, then **Live**.

### How the client side works
- They type their name once (it's remembered on their device) and leave comments.
- **Approve** can include an optional note. **Request changes** needs a note saying what to change.
- Every approval and change request appears in the thread with name and time, so you have a record.
- The calendar shows go-live dates as solid bars and feedback deadlines as dashed red. A deadline is struck through once feedback is in.

### Revoking a link
Delete the client. That removes all their content too. To rotate a link without deleting, run this in the SQL Editor:
```sql
update portal_clients set token = encode(gen_random_bytes(18),'hex') where name = 'Client name';
```

### Limits worth knowing
- Anyone holding a client's link can approve as any name. That's the trade-off for no logins. If a client needs a stricter sign-off trail, per-person logins can be added later.
- Uploaded previews are stored in a public bucket under random file names. Keep truly confidential files on Drive and link them instead.
- The free Supabase tier gives 1 GB of file storage. Free projects are paused after a week with no activity. Normal client use keeps the project active, but if it does get paused, restore it from the Supabase dashboard.
- Nothing emails you when a client comments yet. That's the natural next addition (a Supabase webhook to email or Slack).
