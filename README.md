# Beyond the Backpack — Registration Website

A production-ready, mobile-first registration site for **Beyond the Backpack**, hosted by the
Central Mississippi Association of Realtists (CMAR). Built with Next.js (App Router) so it
deploys directly to Vercel.

---

## 1. Folder Structure

```
beyond-the-backpack/
├── app/
│   ├── api/register/route.js   # Handles form submissions: validates, stores, emails
│   ├── layout.js                # Root layout, fonts, SEO metadata
│   ├── page.js                  # Homepage — assembles all sections
│   └── globals.css              # All styling (design tokens, components, responsive rules)
├── components/
│   ├── Hero.js                  # Hero section with headline + CTA
│   ├── EventInfo.js              # Date / time / location cards
│   ├── Services.js               # Service cards grid
│   ├── ImportantInfo.js          # Highlighted "must read" notices
│   ├── RegistrationForm.js       # Full multi-section form + confirmation screen
│   └── Footer.js                 # CMAR contact footer
├── lib/
│   ├── email.js                  # Resend email-sending helper
│   └── supabase.js               # Optional Supabase storage helper
├── public/images/                # Placeholder mockup graphics + CM seal logo
├── scripts/generate-qr.js        # Generates a QR code linking to the registration page
├── .env.example                  # All required/optional environment variables
├── package.json
└── README.md
```

---

## 2. Local Development

```bash
npm install
cp .env.example .env.local   # then fill in your real values (see section 4)
npm run dev
```

Visit `http://localhost:3000`.

---

## 3. Deploying to Vercel

1. Push this project to a GitHub (or GitLab/Bitbucket) repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import that repository.
3. Vercel auto-detects Next.js — no build settings need to change.
4. Before your first deploy (or right after), add your environment variables:
   **Project → Settings → Environment Variables** — add every variable from
   `.env.example` for both **Production** and **Preview**.
5. Click **Deploy**. Your site will be live at `https://<your-project>.vercel.app`
   (or a custom domain you connect under **Settings → Domains**).
6. Update `NEXT_PUBLIC_SITE_URL` in your Vercel environment variables to match
   your real deployed URL, then redeploy (Vercel → Deployments → Redeploy) so
   SEO tags point to the right place.

That's it — no servers to manage, no database to host unless you opt into Supabase (section 5).

---

## 4. Connecting the Email Notification Service (required)

Every registration automatically emails **kaye@thefokusteam.com** and
**cmarealtist@gmail.com** with the subject **"New Beyond the Backpack Registration"**.
This uses [Resend](https://resend.com), a straightforward transactional email API.

1. Create a free Resend account at [resend.com](https://resend.com).
2. Go to **API Keys** and create a new key.
3. Set it as `RESEND_API_KEY` in your environment variables (locally in `.env.local`,
   and in Vercel under Project Settings).
4. **For quick testing**, you can leave `EMAIL_FROM` as the default
   (`onboarding@resend.dev`) — Resend's shared sandbox sender works immediately
   with no setup, but is rate-limited and meant for testing only.
5. **For production**, verify your own sending domain in Resend
   (**Domains → Add Domain**, then add the DNS records they give you to
   your domain registrar). Once verified, change `EMAIL_FROM` to something like:
   ```
   EMAIL_FROM="Beyond the Backpack <registrations@cmarealtist.com>"
   ```
6. `EMAIL_TO` controls who receives notifications (comma-separated). It already
   defaults to the two addresses requested, but you can add more any time
   without touching code.

If email sending fails for any reason (bad API key, Resend outage, etc.), the
website tells the registering parent to call CMAR directly at 601-301-4144
rather than silently losing their registration — check your Vercel function
logs (**Project → Logs**) if you ever see this happen.

---

## 5. Optional: Secure Registration Storage (Supabase)

The brief asked for registrations to be stored securely, without an admin
dashboard. This template stores every registration in a private
[Supabase](https://supabase.com) Postgres table — Supabase gives you a simple
built-in **Table Editor** in their dashboard to view submissions any time,
without you having to build or maintain an admin panel yourself.

**This is entirely optional.** If you skip this section, the site still works
perfectly — every registration is still emailed automatically. Storage is
"best effort": if it ever fails, the family's registration and email
notification still go through.

To enable it:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run:

   ```sql
   create table registrations (
     id uuid primary key default gen_random_uuid(),
     parent_name text,
     phone text,
     email text,
     student_name text,
     student_age text,
     grade text,
     school text,
     registration_type text,
     hair_service text,
     appointment_slot text,
     ack_late_policy boolean,
     backpack_requested boolean,
     special_notes text,
     photo_release text,
     submitted_at timestamptz default now()
   );

   alter table registrations enable row level security;
   -- No public policies are created on purpose — only the server-side
   -- service role key (never exposed to the browser) can read/write this
   -- table, keeping registrant data private.
   ```

3. In Supabase, go to **Project Settings → API** and copy your **Project URL**
   and **service_role key** (not the anon/public key).
4. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment
   variables (locally and in Vercel).
5. Redeploy. New registrations will now appear in Supabase's Table Editor
   under the `registrations` table.

---

## 6. Replacing the Images

`public/images/` currently contains real photos: `gallery-1.jpg` (haircut,
tall/portrait), `gallery-3.jpg` (backpack & supplies, square), `gallery-4.jpg`
(community volunteer moment, square), and `logo.png` (the official CMAR seal).
To swap any of them out later:

1. Add your new image to `public/images/`, matching the same shape as the
   file it's replacing:
   - `gallery-1.jpg` — tall/portrait, ~800×1000px
   - `gallery-3.jpg` and `gallery-4.jpg` — square, ~800×800px
   - `logo.png` — square, ~500×500px, ideally transparent or white background
2. Keep the same filename (easiest — no code changes needed), or if you use
   a new filename, update the matching `src="/images/..."` in
   `components/Hero.js` and its `alt` text to describe the new photo.

No other code changes are required — Next.js automatically serves whatever's
in `public/images/`.

---

## 6.5 Appointment Time Slots

Families who select a hair service now also pick a specific appointment time.
Capacity is based on your **actual staff**, not an arbitrary number:

- **Haircuts (3 barbers):** 45-minute slots (10:00, 10:45, 11:30, 12:15),
  **3 people max per slot**.
- **Silk Press, Natural Updo, Kids Ponytail, and Kids Braided Styles
  (3 stylists):** 60-minute slots (10:00, 11:00, 12:00). These four
  services **share one pool of 3 spots per slot** — since the same 3
  stylists can perform any of them, booking a Silk Press counts against
  the same hourly capacity as a Natural Updo. It's not 3 spots *per style
  type*; it's 3 stylist-hours total, whichever styles families choose.

To change staffing, edit `BARBER_COUNT` and `STYLIST_COUNT` at the top of
`lib/slots.js` — every slot's capacity updates automatically, no other
code changes needed.

**Live remaining-spot counts require Supabase** (see section 5 above). Without
it, the site still shows the slot times, but can't display or enforce a
"X spots left" count, since there's nowhere to persistently track who
booked what. With Supabase connected, the form:
- Shows real-time remaining capacity per slot (fetched from `/api/slots`)
- Rejects a submission server-side if a slot filled up between when the
  page loaded and when the family submitted (prevents overbooking)

---

## 7. Generating the Registration QR Code

Once your site is deployed and you know its real URL, generate a QR code
that links straight to the registration form:

```bash
node scripts/generate-qr.js https://your-deployed-site.vercel.app
```

This creates `public/images/registration-qr.png` — a scannable QR code
pointing at `https://your-deployed-site.vercel.app/#register`. Use this image
on printed flyers, social posts, or anywhere you want people to scan and
register directly. Re-run the script any time your URL changes (e.g. after
connecting a custom domain).

---

## 8. What the Registration Form Collects

- **Parent/Guardian:** name, phone, email
- **Student:** name, age, grade, school
- **Registration type:** Hair Service + Backpack / Hair Service Only / Backpack & School Supplies Only
  (the hair-service picker only appears when relevant)
- **Hair service** (if applicable): Haircut, Silk Press, Natural Updo, Kids Ponytail Style, or Kids Braided Style
- **Special notes:** allergies, medical concerns, anything else
- **Seven required acknowledgements**, including parent consent and the liability release
- **Optional photo/video release** (Yes or No — either is accepted)

All required fields and acknowledgements are validated both in the browser
(for instant feedback) and again on the server (so nothing incomplete or
invalid can ever be submitted, emailed, or stored).

---

## 9. Accessibility, SEO & Performance Notes

- Semantic landmarks (`header`, `main`, `section`, `footer`), labeled form
  fields, and visible keyboard focus states throughout.
- `prefers-reduced-motion` is respected — animations and smooth-scroll are
  disabled for people who request it.
- SEO metadata (title, description, Open Graph tags) is set in `app/layout.js`
  — update `NEXT_PUBLIC_SITE_URL` so Open Graph image/URL tags are correct.
- No client-side dependencies beyond React itself, and all imagery is
  lightweight SVG until you swap in final photos — keeping load times fast.

---

## 10. Support

For questions about the event itself: **601-301-4144** or
**cmarealtist@gmail.com**. For questions about the website code, this README
covers every integration point (email, storage, images, QR) end to end.
