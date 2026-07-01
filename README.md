# AtoZ Group Meeting Room Booking System

Company meeting room booking system with a responsive PWA interface, PostgreSQL database, role-based access, notifications, room display panels, and optional email alerts.

## Stack

- Frontend: HTML, CSS, modern JavaScript modules
- Backend: Node.js + Express
- Database: PostgreSQL
- Email: Nodemailer SMTP integration
- PWA: Web App Manifest + Service Worker cache
- Android Room Panel APK wrapper: Capacitor
- Auth: Server-side sessions with HttpOnly cookies
- Passwords: PBKDF2 hashed passwords

## Main Features

- Dashboard with today schedule, room availability, busy/free room labels, and total booking hours
- Booking management with date, department, room filters and sorting
- Calendar with Month, Work week, and Day views
- Outlook-style booking interactions from calendar date/time slots
- Booking conflict validation, availability checking, and conflict popup
- Auto-approved bookings when the room is free
- Administrator and manager users can view all bookings
- Normal users can view only their own booking records
- Configurable `Can cancel bookings` capability in Module Permissions
- Required cancellation reason with confirmation popup
- Every cancellation creates an in-app notification for the original requester
- Notification page with unread count, read status, and mark all as read
- Opening one notification marks that notification as read and updates the unread badge
- Faster notification refresh through lightweight polling
- Room Display panel for tablets outside meeting rooms
- Administrator-only access to Room Display login
- Room Display shows busy/free state by room and day schedule
- Room Display `Book Now` popup for immediate bookings
- `Book Now` captures meeting title, From/To time in 12-hour AM/PM format, attendees, requester name, room, department, and purpose
- From and To controls remain side-by-side on the Room Display layout
- Instant bookings enforce room, department, time-range, attendee, and conflict validation on the API
- Android Room Panel wrapper that opens Room Display mode directly
- Departments, users, and rooms CRUD with delete confirmations
- Department page can assign existing users instead of recreating users
- Module Permissions settings for role-based menu/module access
- Role Setup page for administrator-created custom roles
- Change Password page for all roles
- Language switch: English / Burmese
- Theme switch: Light / Dark navy mode
- Collapsible left navigation with icons
- Responsive layout for desktop, tablet, and mobile

## Role Behavior

| Role | Access |
| --- | --- |
| administrator | Full system access, module permissions, users, departments, rooms, bookings, calendar, notifications, room display |
| manager | Can view all bookings and manage workflow modules and capabilities allowed by settings |
| user | Can book rooms and view only their own bookings, calendar, dashboard, notifications, and change password; cancellation can be granted by permission |

Module visibility can be changed by an administrator from:

```text
Settings > Module Permissions
```

The same grid includes the `Can cancel bookings` capability. The API enforces
this permission; it is not only a menu or button visibility setting.

Custom roles can be created by an administrator from:

```text
Settings > Role Setup
```

Password change is available from:

```text
Settings > Change Password
```

## PostgreSQL Setup

Create and seed the database. If `psql` is already in PATH:

```powershell
.\database\setup-postgres.ps1
```

If `psql` is not in PATH, pass the full path:

```powershell
.\database\setup-postgres.ps1 -PsqlPath "C:\Program Files\PostgreSQL\bin\psql.exe"
```

The script creates `meeting_room_booking` and applies seed data from:

```text
database/postgres.sql
```

## Environment Setup

Install Node dependencies once:

```powershell
npm install
```

Create `.env` from `.env.example`, then update the PostgreSQL connection and session secret:

```text
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/meeting_room_booking
PORT=5173
SESSION_SECRET=replace-with-a-long-random-secret
SESSION_TIMEOUT_MINUTES=30
COOKIE_SECURE=false
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://office.atoz.com.mm,https://localhost,capacitor://localhost
```

Start the web app and API:

```powershell
npm start
```

Open the app:

```text
http://localhost:5173
```

## Docker Deployment

Copy the Docker environment template and replace both secret values:

```bash
cp .env.docker.example .env
docker compose up -d --build
```

Check container status and the application health endpoint:

```bash
docker compose ps
curl http://127.0.0.1:5173/api/health
```

PostgreSQL data is retained in the `postgres_data` Docker volume. Production
HTTPS deployments must use `COOKIE_SECURE=true`; this also enables the HSTS
response header. Sessions expire after 30 minutes by default and require
the user to sign in again. Set `SESSION_TIMEOUT_MINUTES` to a whole number from
5 through 1440 to change the timeout.

## Android Room Panel APK

The Android wrapper is prepared with Capacitor for tablets mounted outside meeting rooms.
Its installed name is `AtoZ Meeting Room Booking`, package ID is
`com.atozgroup.roompanel`, and current Android version is `1.2` (code `3`).

The production wrapper bundles the Room Display HTML, CSS, JavaScript, and
images inside the application. It does not load a remote website into the
Capacitor WebView. The bundled client sends credentialed API requests only to:

```text
https://office.atoz.com.mm/api
```

Before building or installing the APK:

1. Make sure `https://office.atoz.com.mm` is reachable from the tablet.
2. Keep the `server` configuration absent from `capacitor.config.json`.
3. Keep `allowNavigation` absent and Android cleartext traffic disabled.
4. Keep the mobile API origin restricted in `mobile-www/index.html` and the backend `CORS_ALLOWED_ORIGINS` setting.
5. Run `npm run cap:sync` whenever web or Capacitor files change. This command prepares locally bundled assets before synchronizing Android.

Install Android build tools on the build PC:

```powershell
choco install temurin21 androidstudio -y
```

Then restart PowerShell and build the debug APK:

```powershell
npm run cap:sync
npm run android:build:debug
```

On this Windows development machine, the build script uses Android Studio's bundled JDK:

```text
C:\Program Files\Android\Android Studio\jbr
```

The debug APK will be created at:

```text
android/app/build/outputs/apk/debug/AtoZ Meeting Room Booking.apk
```

The debug APK is for internal testing only. Production uses R8 code
minification, resource shrinking, disabled backups, no custom JavaScript
bridge, and a signed release AAB.

Create an upload keystore once and keep it outside the repository:

```powershell
keytool -genkeypair -v -keystore C:\secure\atoz-release.jks -alias atoz-meeting-room -keyalg RSA -keysize 4096 -validity 10000
```

Set signing values in the build environment. Do not commit the actual values:

```powershell
$env:ANDROID_KEYSTORE_FILE="C:\secure\atoz-release.jks"
$env:ANDROID_KEYSTORE_PASSWORD="your-keystore-password"
$env:ANDROID_KEY_ALIAS="atoz-meeting-room"
$env:ANDROID_KEY_PASSWORD="your-key-password"
```

Build the signed release AAB:

```powershell
npm run cap:sync
cd android
.\gradlew.bat bundleRelease -PrequireReleaseSigning=true
```

The release bundle is created at:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Open Android Studio when release inspection or Play deployment is needed:

```powershell
npm run android:open
```

## Email Notification Setup

Email sending is optional and disabled by default. The app will still create in-app notifications when email is disabled.

To enable email, set these values in `.env`:

```text
EMAIL_ENABLED=true
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=meetingroom@yourcompany.com
SMTP_PASS=your-smtp-password-or-app-password
MAIL_FROM="AtoZ Meeting Room <meetingroom@yourcompany.com>"
```

Email is sent to the email address saved in each user account. Current email events include:

- Booking successful notification
- Booking cancelled notification
- Manager/admin cancellation notification to the original requester

For security, do not commit `.env` to GitHub. Use environment variables or server-side secrets on production.

## Initial Administrator

Fresh Docker installations do not create accounts with predictable passwords.
Set `BOOTSTRAP_ADMIN_PASSWORD` to a unique value of at least 12 characters in
the server-side `.env` file before the first startup. The bootstrap values are
used only when the database has no active administrator.

## Core Tables

- `departments`
- `users`
- `rooms`
- `bookings`
- `sessions`
- `notifications`
- `app_settings`

## API Overview

- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/data`
- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `POST /api/notifications/read-all`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/me/password`
- CRUD endpoints for departments, rooms, users, and bookings
- `POST /api/bookings/:id/cancel`
- `POST /api/bookings/instant` (administrator-authenticated Room Display booking)

## Production Notes

- Set a strong unique `SESSION_SECRET`
- Never ship or seed predictable account passwords
- Set `BOOTSTRAP_ADMIN_PASSWORD` only through server-side deployment secrets
- Keep `.env` outside Git commits
- Use HTTPS in production
- Keep Capacitor UI files bundled locally; do not add `server.url` or `allowNavigation`
- Keep `CORS_ALLOWED_ORIGINS` restricted to the production web and Capacitor origins
- Publish a signed release AAB, never the debug APK
- Back up the Android upload keystore securely
- Put Node.js behind Nginx or another reverse proxy
- Use a production PostgreSQL backup plan
- Restrict server firewall ports
- Use SMTP app passwords or service credentials instead of personal passwords
- Review module permissions before company rollout

## Main Workflow

1. Administrator creates or reviews departments, users, rooms, and module permissions.
2. Users log in and book a room from Bookings or Calendar.
3. The system checks room availability and prevents time conflicts.
4. If free, the booking is auto-approved.
5. The requester receives in-app notification and optional email.
6. A role with `Can cancel bookings` can cancel a booking when needed.
7. Cancellation requires a reason and always creates a requester notification.
8. Room Display panels show room busy/free state and the daily schedule.
9. An administrator can use the Room Display `Book Now` popup for an immediate conflict-checked booking.
