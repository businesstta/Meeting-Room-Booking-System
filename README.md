# AtoZ Group Meeting Room Booking System

Responsive meeting-room booking platform with a PWA, PostgreSQL-backed Express
API, role and capability controls, notifications, tablet Room Display, and a
production-hardened Capacitor Android wrapper.

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

The Android WebView loads only bundled application files. It calls the backend
through `https://office.atoz.com.mm/api`; `server.url`, `allowNavigation`, and
cleartext traffic are not used.

## Stack

- HTML, CSS, and modern JavaScript modules
- Node.js 22 and Express
- PostgreSQL 16
- Docker Compose
- PWA manifest and service worker
- Capacitor 8 Android wrapper, JDK 21, Android API 36
- Nodemailer SMTP integration
- Server-side sessions using HttpOnly cookies
- PBKDF2-HMAC-SHA256 password hashing

## Main features

- Dashboard, filters, room availability, and utilization metrics
- Booking creation/editing with availability and conflict validation
- Month, work-week, and day calendar views
- Role-based navigation and administrator-defined custom roles
- API-enforced `Can cancel bookings` capability
- Required cancellation reason, actor/timestamp audit fields, and requester notification
- Room Display with busy/free status, schedule, timeline, and `Book Now` popup
- From/To AM/PM controls for immediate Room Display bookings
- In-app notifications, unread state, polling, and optional SMTP delivery
- Department, room, and user administration
- English/Burmese and light/dark UI options
- Responsive PWA and locally bundled Android tablet application

## Roles and authorization

| Role | Behavior |
| --- | --- |
| administrator | Full administration, settings, roles, Room Display and Instant Meeting |
| manager | Operational management subject to privileged-account restrictions |
| user | Booking and standard modules allowed by role settings |

Module visibility is configured under `Settings > Module Permissions`.
Sensitive server operations still enforce API authorization. In particular,
`Can cancel bookings` is checked by the cancellation endpoint and is not merely
a hidden/visible button.

See [docs/security.md](docs/security.md) for exact boundaries and known gaps.

## Prerequisites

- Git
- Node.js 22 LTS and npm 10+
- PostgreSQL 16 or Docker Compose v2
- PowerShell 5+/7+ for provided Windows scripts
- JDK 21, Android Studio, and Android SDK API 36 for Android builds

Full developer setup: [docs/setup.md](docs/setup.md).

## Quick start

```bash
npm ci
cp .env.example .env
# Edit DATABASE_URL and SESSION_SECRET
npm start
```

Open `http://localhost:5173` and check:

```bash
curl http://localhost:5173/api/health
```

## Environment separation

Local development uses `.env.example`:

```env
COOKIE_SECURE=false
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Production Docker uses `.env.docker.example`:

```env
COOKIE_SECURE=true
CORS_ALLOWED_ORIGINS=https://office.atoz.com.mm,https://localhost
```

`https://localhost` is the Android Capacitor origin. Never copy local secrets,
database passwords, or `COOKIE_SECURE=false` into production.

## Docker deployment

```bash
cp .env.docker.example .env
# Replace every placeholder secret
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:5173/api/health
```

Detailed deployment and logs: [docs/deployment.md](docs/deployment.md).

## Android Room Display

Generate bundled assets and synchronize Android:

```bash
npm run cap:sync
```

Debug builds are for internal testing only. Production requires a private upload
keystore and a guarded, signed release AAB:

```bash
cd android
./gradlew bundleRelease -PrequireReleaseSigning=true
```

Read [docs/android-build.md](docs/android-build.md) before building or publishing.
The current Android version is defined only in
`android/app/build.gradle` to prevent documentation drift.

## Documentation

- [Developer setup](docs/setup.md)
- [Production deployment](docs/deployment.md)
- [API guide](docs/api.md)
- [Security model](docs/security.md)
- [Backup and restore](docs/backup-restore.md)
- [Android production build](docs/android-build.md)
- [Troubleshooting](docs/troubleshooting.md)

## Backup

Back up before database-affecting releases and test restoration regularly.
Native PostgreSQL and Docker commands are documented in
[docs/backup-restore.md](docs/backup-restore.md).

## API summary

- Public: health, login/logout, current-session lookup
- Authenticated: shared data, notifications, password change, bookings
- Manager/administrator: room, department, user, status and deletion operations
- Administrator: settings, roles, and Room Display Instant Meeting

Examples, request bodies, roles, and response codes: [docs/api.md](docs/api.md).

## Security summary

- Strong deployment secrets are mandatory.
- Production cookies are HttpOnly, Secure, and SameSite=None.
- Credentialed CORS uses explicit origins; wildcard CORS is not allowed.
- Login failures are rate-limited by client IP.
- Passwords require 12–128 characters and use PBKDF2 with 600,000 iterations.
- Session tokens are random and stored only as SHA-256 hashes in PostgreSQL.
- Android UI files are bundled locally with cleartext and backups disabled.
- Release builds use R8 minification and resource shrinking.
- `.env`, keystores, credentials, tokens, and database dumps must never enter Git.

See [docs/security.md](docs/security.md) for limitations and audit behavior.

## Screenshots and demo material

Recommended release documentation includes sanitized captures of:

- Dashboard
- Calendar and booking form
- Room Display and Book Now popup
- Module Permissions
- Notifications
- Responsive PWA view

Use demo accounts and synthetic bookings only. Do not capture employee names,
emails, internal meeting purposes, or production room schedules.

## Main workflow

1. An administrator configures departments, rooms, users, roles, and permissions.
2. A user creates a booking; the API checks room conflicts and auto-approves it.
3. The requester receives an in-app notification and optional email.
4. A permitted role may cancel with a required reason; the API records actor and time.
5. Room Display shows live status and supports administrator-authenticated Book Now.
