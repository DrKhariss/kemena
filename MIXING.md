# Mixing subscription (local)

Mid-Side mixing is integrated into this Kemena app.

## Local test

```bash
npm install
cp .env.example .env.local   # fill Paystack keys when ready
npm run dev
```

Open:

| URL | What |
|-----|------|
| http://localhost:3000/ | Kemena main site |
| http://localhost:3000/mixing | Mixing signup |
| http://localhost:3000/mixing/login | Subscriber / admin login |
| http://localhost:3000/mixing/admin | Admin dashboard |

Default admin (from env): `admin@example.com` / `admin_change_me`

Nav: desktop **MIXING**, mobile **Mixing Services**.

## Demo mode (no Paystack keys)

If `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SECRET_KEY` are missing or still contain the
`REPLACE_WITH` placeholder, the app runs in **demo mode**: the plans page shows a
"no card is charged" notice, clicking *Pay with Paystack* skips the Paystack popup,
and the subscription is activated straight away so you land on the receipt. The
receipt is stamped **Paid (demo)** so nobody mistakes it for a real payment.

Drop real keys into `.env.local` and demo mode turns itself off — the popup and
server-side `transaction/verify` check come back with no code changes.

## Notes

- Mixing API lives under `/mixing/api/*` (Express + SQLite in `server/mixing/`)
- SQLite file: `data/mixing.db` (gitignored)
- `GET /mixing/api/config` tells the frontend whether Paystack is live
- Heads up: a stale service worker from another project on `localhost:3000` will
  swallow the API calls and serve `index.html`. If the API 404s in the browser but
  works in curl, unregister service workers for the origin in DevTools.
