# Mixing subscription (frontend)

Mid-Side mixing UI lives in this Kemena app. The API is a **separate repo**:
`kemena-mixing-api` (sibling folder, deploy to Hostinger).

## Local test

Terminal 1 — API:

```bash
cd ../kemena-mixing-api
cp .env.example .env   # Paystack / admin / JWT
npm install
npm run dev            # http://localhost:3001
```

Terminal 2 — Kemena:

```bash
cp .env.example .env.local
# ensure VITE_API_BASE=http://localhost:3001
npm install
npm run dev            # http://localhost:3000
```

Open:

| URL | What |
|-----|------|
| http://localhost:3000/ | Kemena main site |
| http://localhost:3000/mixing | Mixing signup |
| http://localhost:3000/mixing/login | Subscriber / admin login |
| http://localhost:3000/mixing/admin | Admin dashboard |

Default admin (API env): `admin@example.com` / `admin_change_me`

Nav: desktop **MIXING**, mobile **Mixing Services**.

## Subscriber account

After payment, create a password and open `/mixing/account`. Mixes are submitted
**in the app** (title, stem link, genre/BPM/key, notes) and stored in the API’s
MySQL DB. Status pipeline:

`submitted` → `in_progress` → `revision` → `delivered`

## Demo mode (no Paystack keys)

Configured on the **API** side. If Paystack keys are missing or still contain
`REPLACE_WITH`, payments complete in demo mode. Put real keys in
`kemena-mixing-api/.env` and restart the API.

## Production

| Piece | Where |
|-------|--------|
| Site | https://kemenamusic.com (mixing UI at `/mixing`) |
| API | https://magenta-rhinoceros-715254.hostingersite.com |

`vite build` reads `.env.production` → `import.meta.env.VITE_API_BASE` (origin only):

`VITE_API_BASE=https://magenta-rhinoceros-715254.hostingersite.com`

`api.js` appends `/mixing/api`, so signup posts to `${VITE_API_BASE}/mixing/api/signup`.

If signup POSTs to `https://kemenamusic.com/mixing/api/...` and 404s, the frontend was built without that env — rebuild/redeploy with `.env.production` (or set `VITE_API_BASE` in the host’s build secrets).

On the API Hostinger app, `CORS_ORIGIN` must include `https://kemenamusic.com` (and `https://www.kemenamusic.com` if you use www).

**Direct URL 404s** (`/mixing` in the address bar): the static host must serve `index.html` for unknown paths. `public/.htaccess` ships that rewrite into `dist/` on build — upload the whole `dist` folder (including `.htaccess`). Nav clicks can work while hard loads fail until that file is on the server.

## Notes

- Frontend env: `VITE_API_BASE` = API **origin only**; code adds `/mixing/api`
- API repo owns Paystack, JWT, admin seed, MySQL, and **transactional email** (Resend)
- Cross-origin cookies need the API’s `CORS_ORIGIN` to include this site’s origin

## Transactional email (API)

Mails fire from `kemena-mixing-api` after signup, payment activation, mix submit/status,
subscription status changes, and password-reset requests.

Set in the API `.env` (see `kemena-mixing-api/.env.example`):

| Var | Purpose |
|-----|---------|
| `RESEND_API_KEY` | Resend API key. If missing / still `REPLACE`, mails log to console (demo) |
| `MAIL_FROM` | Verified From, e.g. `Mid-Side Audio <noreply@yourdomain.com>` |
| `MAIL_ADMIN_TO` | Desk alerts; defaults to `ADMIN_EMAIL` |
| `FRONTEND_URL` | CTA link origin (defaults to first `CORS_ORIGIN`) |

Password reset: `/mixing/forgot-password` → email → `/mixing/reset-password?token=…`
