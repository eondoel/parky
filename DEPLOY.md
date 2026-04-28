# Deploying Parky — Vercel + Neon (free)

## Part 1 — Neon (PostgreSQL database)

1. Go to [neon.tech](https://neon.tech) → **Sign up free** (GitHub login works)
2. Click **New Project** → give it a name like `parky` → **Create**
3. On the project dashboard, click **Connection string** → copy the URL  
   It looks like: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
4. Save this — you'll need it in both Vercel and locally

## Part 2 — Run the migration locally first

Add the connection string to your local `.env`:
```
DATABASE_URL="postgresql://..."   ← paste Neon URL here
```

Then run:
```bash
npx prisma migrate dev --name init
npm run db:seed
```

This creates the tables in Neon and seeds the 10 parks.

## Part 3 — Vercel (app hosting)

1. Go to [vercel.com](https://vercel.com) → **Sign up free** with GitHub
2. Click **Add New → Project** → import your `parky` GitHub repo
3. Vercel auto-detects Next.js — don't change any build settings
4. Before clicking **Deploy**, go to **Environment Variables** and add:

| Name | Value |
|---|---|
| `DATABASE_URL` | *(paste your Neon connection string)* |
| `CRON_SECRET` | *(run `openssl rand -hex 32` in your terminal)* |

5. Click **Deploy** — done. Vercel runs `prisma generate && next build` automatically.

## Part 4 — GitHub Actions cron job

The file `.github/workflows/cron.yml` is already in the repo.  
It calls `/api/cron` every 30 minutes to collect wait time snapshots.

You just need to add two secrets to your GitHub repo:

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions**
2. Click **New repository secret** and add:

| Secret | Value |
|---|---|
| `APP_URL` | `https://your-app.vercel.app` *(your Vercel URL, no trailing slash)* |
| `CRON_SECRET` | *(same value you set in Vercel)* |

That's it — GitHub will ping your app every 30 minutes for free.

## Summary

```
Neon (free Postgres) ──► DATABASE_URL
                              │
                         Vercel (Next.js)  ◄── GitHub repo (auto-deploy on push)
                              │
                    GitHub Actions (cron every 30min)
                    └── POST /api/cron → stores snapshots
```
