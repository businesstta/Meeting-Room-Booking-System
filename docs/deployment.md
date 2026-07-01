# Production Deployment

## Architecture

```text
Browser / PWA ───────────────┐
                             │ HTTPS
Android Room Display APK ────┤
  (locally bundled UI)       ▼
                      OpenResty / Nginx
                             │
                             ▼
                      Node.js Express API ───► SMTP server
                             │
                             ▼
                         PostgreSQL
```

The Android application does not load the production website in its WebView.
It bundles the UI locally and connects only to the HTTPS API.

## Production environment

Start from `.env.docker.example`:

```bash
cp .env.docker.example .env
```

Required production values include:

```env
APP_PORT=5173
POSTGRES_DB=meeting_room_booking
POSTGRES_USER=meeting_app
POSTGRES_PASSWORD=replace-with-a-long-random-password
SESSION_SECRET=replace-with-a-unique-secret-of-at-least-32-characters
SESSION_TIMEOUT_MINUTES=30
BOOTSTRAP_ADMIN_PASSWORD=replace-with-a-unique-password-of-at-least-12-characters
COOKIE_SECURE=true
CORS_ALLOWED_ORIGINS=https://office.atoz.com.mm,https://localhost
```

`https://localhost` is the Android Capacitor origin. Add
`capacitor://localhost` only if an iOS build is introduced and tested.

Never commit the populated `.env` file.

## Deploy

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:5173/api/health
```

Put port 5173 behind a TLS reverse proxy. Public traffic should reach only
ports 80 and 443; PostgreSQL must not be exposed publicly.

## Logs

Run commands from the repository directory or pass `-f compose.yaml`:

```bash
docker compose logs -f --tail=100 app
docker compose logs -f --tail=100 db
```

Application logs must not contain passwords, cookies, session tokens, SMTP
credentials, or complete sensitive request bodies.

## Updating

```bash
git pull --ff-only
docker compose up -d --build app
docker compose ps
```

Back up PostgreSQL before database-affecting releases. See
[backup-restore.md](backup-restore.md).

## Rollback

Use an explicitly tested previous image or Git commit. Do not roll back the
database without confirming schema compatibility and having a current backup.

