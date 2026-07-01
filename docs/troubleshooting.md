# Troubleshooting

## `psql` is not recognized

Pass the complete PostgreSQL executable path:

```powershell
.\database\setup-postgres.ps1 -PsqlPath "C:\Program Files\PostgreSQL\16\bin\psql.exe"
```

## Port 5173 is already in use

Change `PORT` for local development or `APP_PORT` for Docker. Ensure the reverse
proxy points to the same port.

## Database connection failed

Check:

- `DATABASE_URL`
- PostgreSQL service/container health
- database username, password, host, and database name
- firewall and Docker network configuration

```bash
docker compose ps
docker compose logs --tail=100 db
```

## Docker reports no configuration file

Run the command from the repository directory:

```bash
cd /root/Meeting-Room-Booking-System
docker compose logs -f --tail=100 app
```

Or specify the file explicitly:

```bash
docker compose -f /root/Meeting-Room-Booking-System/compose.yaml logs -f --tail=100 app
```

## Application container keeps restarting

```bash
docker compose logs --tail=200 app
docker compose config
```

Common causes include a missing/placeholder `SESSION_SECRET`, invalid session
timeout, unavailable database, or missing bootstrap administrator password on a
fresh database.

## Browser receives `Origin is not allowed`

Add the exact browser origin to `CORS_ALLOWED_ORIGINS`. Do not use `*` with
credentialed requests. Production Android uses `https://localhost`.

After changing Docker environment values:

```bash
docker compose up -d --force-recreate app
```

## APK opens but API login fails

Verify:

- `capacitor.config.json` has no `server` section
- `mobile-www/index.html` uses the correct HTTPS `api-origin`
- production CORS includes `https://localhost`
- `COOKIE_SECURE=true`
- the TLS certificate is valid on the device
- the tablet date and time are correct

Then regenerate and rebuild:

```bash
npm run cap:sync
cd android
./gradlew assembleDebug
```

## Android SDK location not found

Set `ANDROID_HOME`/`ANDROID_SDK_ROOT` or create `android/local.properties`:

```properties
sdk.dir=/absolute/path/to/Android/Sdk
```

## Release signing is required

Set all four variables before the guarded production build:

- `ANDROID_KEYSTORE_FILE`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Use `.env.android.example` as a names-only reference. Do not store real values
in that file.

## Old PWA assets remain visible

Use the in-app refresh action or clear the site's service worker/cache. Android
bundled UI updates require installing a newly built APK/AAB version.

