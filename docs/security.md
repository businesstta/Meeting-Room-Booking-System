# Security Model

## Authentication and sessions

- Passwords use PBKDF2-HMAC-SHA256.
- New hashes use 600,000 iterations, a random 16-byte salt, and a 32-byte key.
- Passwords must contain 12–128 characters.
- Session tokens contain 32 random bytes and only their SHA-256 hashes are
  stored in PostgreSQL.
- Production cookies are `HttpOnly`, `Secure`, and `SameSite=None` so the
  locally bundled Capacitor origin can call the HTTPS API.
- Session duration is configured by `SESSION_TIMEOUT_MINUTES` from 5 to 1,440
  minutes.
- A successful login removes older sessions for the same user.
- Logout deletes the current server-side session.

Changing a password does not currently invalidate every existing session. That
is a documented security improvement, not a behavior to assume.

## Login protection

Failed logins are limited to 10 attempts per client IP during a 15-minute
window. The response becomes HTTP 429 with `Retry-After` when the limit is
reached. This is IP-based rate limiting, not account lockout, and the in-memory
counter resets when the application restarts.

## CORS and CSRF

The API accepts browser origins only from `CORS_ALLOWED_ORIGINS`. Production
normally allows the public web origin and Android Capacitor's
`https://localhost` origin. Credentialed requests are enabled only for these
explicit origins; wildcard CORS is not used.

JSON requests and strict Origin validation provide the current CSRF boundary.
The application does not use a separate synchronizer CSRF token. Requests
without an `Origin` header remain possible for trusted server-side monitoring
and administration tools.

## Authorization

- Administrators manage settings, custom roles, and privileged accounts.
- Managers and administrators manage rooms, departments, and users, with
  additional restrictions preventing managers from controlling privileged
  accounts.
- `Can cancel bookings` is checked by the API, not only by the UI.
- The last active administrator cannot be deleted, disabled, or demoted.
- Normal users cannot change a booking's requester or department through the
  booking API.

`GET /api/data` currently returns shared scheduling datasets to authenticated
accounts. The frontend applies additional visibility filtering. Do not treat
frontend filtering as an API authorization boundary; introduce server-side
data scoping if booking or directory records must be confidential by role.

## Cancellation audit trail

Cancellation requires a reason. The booking records:

- `cancelled_by`: user ID of the actor
- `cancel_reason`: required explanation
- `cancelled_at`: server timestamp

The requester receives an in-app notification. Optional SMTP delivery uses the
same notification message.

This is a cancellation audit trail, not a general immutable audit log. Changes
to rooms, users, permissions, and other records are not currently written to a
dedicated audit table.

## Android security

- UI assets are bundled locally.
- `server.url` and `allowNavigation` are absent.
- Cleartext traffic and Android backups are disabled.
- Only the `INTERNET` permission is explicitly requested by the app.
- No custom JavaScript bridge or native plugin is exposed.
- Release builds enable R8 minification and resource shrinking.
- Production publishing requires a private upload key and signed AAB.

## Secret handling

Never commit `.env`, database passwords, session secrets, SMTP credentials,
keystores, signing passwords, production backups, session cookies, or tokens.

