# Developer Setup

## Prerequisites

- Git
- Node.js 22 LTS
- npm 10 or later
- PostgreSQL 16 for non-Docker development
- Docker Engine or Docker Desktop with Docker Compose v2 for container development
- PowerShell 5+ or PowerShell 7+ when using the provided Windows scripts
- JDK 21, Android Studio, and Android SDK API 36 for Android builds

The production container uses Node.js 22 and PostgreSQL 16. Other versions are
not part of the currently verified build matrix.

## Local environment

Install dependencies and create the local environment file:

```bash
npm ci
cp .env.example .env
```

Local HTTP development should use:

```env
PORT=5173
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/meeting_room_booking
SESSION_SECRET=replace-with-a-unique-secret-of-at-least-32-characters
SESSION_TIMEOUT_MINUTES=30
COOKIE_SECURE=false
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Do not reuse local database passwords or session secrets in production.

## Database setup

On Windows, use the provided script:

```powershell
.\database\setup-postgres.ps1
```

If `psql` is not in `PATH`:

```powershell
.\database\setup-postgres.ps1 -PsqlPath "C:\Program Files\PostgreSQL\16\bin\psql.exe"
```

Alternatively, apply the PostgreSQL schema directly:

```bash
psql -U postgres -d meeting_room_booking -f database/postgres.sql
```

## Run locally

```bash
npm start
```

Open `http://localhost:5173`. Verify the API and database connection with:

```bash
curl http://localhost:5173/api/health
```

Expected response:

```json
{"ok":true}
```

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Express web application and API |
| `npm run db:setup` | Apply the PostgreSQL schema using local defaults |
| `npm run mobile:prepare` | Generate locally bundled Capacitor web assets |
| `npm run cap:sync` | Prepare assets and synchronize the Android project |
| `npm run android:open` | Open the Android project in Android Studio |

