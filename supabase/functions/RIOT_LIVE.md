# Live Riot data (val-status, val-leaderboard)

Two read-only proxies that let the frontend show real VALORANT data without ever
exposing the Riot key. Both work with a **personal daily development key**
(`RGAPI-…`, regenerated every 24 h at <https://developer.riotgames.com>). The
frontend falls back to its mock on any failure, so nothing breaks when the key is
absent or expired.

| Function | Riot endpoint | Feeds |
|---|---|---|
| `val-status` | `val-status-v1` `/platform-data` | `ServerStatusBadge` |
| `val-leaderboard` | `val-content-v1` (active act) + `val-ranked-v1` `/leaderboards/by-act` | `LeaderboardTab` |

Not covered by a daily key, still pending Riot production approval / an RSO app:
`val-match-v1` (match history) and RSO "Log in with Riot".

## 1. Smoke-test the key (no deploy needed)

```
# supabase/functions/.env  (gitignored — never commit)
RIOT_API_KEY=RGAPI-...
RIOT_ACCOUNT_REGION=europe

npm run riot:smoke                 # status + content + ranked (eu)
npm run riot:smoke -- aspas#000    # also resolve a Riot ID via account-v1
```

`403 / 401` on every line ⇒ bad or expired key. A `404` on `account-v1` alone is
fine (that Riot ID just doesn't exist) — it still proves auth works.

## 2. Run the functions locally

```
supabase functions serve --env-file supabase/functions/.env
# then, in another shell:
curl 'http://localhost:54321/functions/v1/val-status?region=eu'
curl 'http://localhost:54321/functions/v1/val-leaderboard?region=eu'
```

Set `APP_URL=http://localhost:5173` in the env file so the browser CORS check passes
when the running Vite app calls them.

## 3. Deploy

```
supabase secrets set RIOT_API_KEY=RGAPI-... RIOT_ACCOUNT_REGION=europe APP_URL=https://scopestats.com
supabase functions deploy val-status val-leaderboard
```

`config.toml` already sets `verify_jwt = false` for both. `git push` does **not**
deploy functions — this step is manual. A daily key must be re-set every 24 h;
swap in the production key once approved and it just keeps working.

## Rate limits

Daily key: ~20 req/s, 100 req/2 min app-wide. Each function keeps a warm-instance
per-region cache (status 60 s, leaderboard rows 5 min, active-act id 12 h), so
inbound traffic is decoupled from Riot calls — a region is fetched at most once per
TTL regardless of how many users hit it.
