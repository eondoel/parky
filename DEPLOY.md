# Deploying Parky to Railway

## 1. Create a new Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Select **Deploy from GitHub repo** → connect this repo
3. Railway auto-detects Next.js via Nixpacks

## 2. Add a PostgreSQL database

In your project dashboard:
1. Click **+ New** → **Database** → **PostgreSQL**
2. Railway will automatically inject `DATABASE_URL` into your app service

## 3. Set environment variables

In your app service → **Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | *(auto-filled from the Postgres service)* |
| `CRON_SECRET` | *(run `openssl rand -hex 32` to generate)* |
| `NODE_ENV` | `production` |

## 4. Deploy

Railway will run:
```
npm install → prisma generate → next build
```
Then on startup:
```
prisma migrate deploy && next start
```

## 5. Set up the cron job (data collection)

Railway has built-in cron jobs:

1. In your project → **+ New** → **Cron Job**
2. Set the **Schedule** to `*/30 * * * *` (every 30 minutes)
3. Set the **Command** to:
   ```
   curl -s -X POST https://YOUR-APP.up.railway.app/api/cron \
     -H "Authorization: Bearer $CRON_SECRET"
   ```
4. Add the `CRON_SECRET` variable to the cron job service too

## 6. Run the initial seed (optional)

After first deploy, open a Railway shell and run:
```bash
npm run db:seed
```
This seeds the parks table so the DB is ready before data collection begins.

## Data Collection

- The cron job hits `/api/cron` every 30 minutes
- Each run collects wait time snapshots for all 10 parks (~800–1500 attractions)
- After a few days you'll have enough data for the Analyzer page to show meaningful charts
- After a week you'll have day-of-week patterns; after a month, seasonal patterns
