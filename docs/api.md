# API Guide

Base URL in production:

```text
https://office.atoz.com.mm/api
```

Request and response fields use camelCase. Unless noted otherwise, requests and
responses use `application/json`.

## Authentication

Authentication uses an HttpOnly server-side session cookie. Browser and
Capacitor requests must include credentials. Do not read or copy the cookie into
JavaScript storage.

### `POST /api/login`

Authentication: public, rate limited.

```json
{
  "login": "username-or-email",
  "password": "account-password"
}
```

Success: HTTP 200 with a sanitized user and `sessionExpiresAt`. Failure: HTTP
401. Excessive failures: HTTP 429 with `Retry-After`.

### `POST /api/logout`

Deletes the current session and expires the cookie.

### `GET /api/me`

Returns `{ "user": null }` without a valid session; otherwise returns the
current user and session expiration.

## Authorization summary

| Access | Endpoints |
| --- | --- |
| Public | `GET /api/health`, `GET /api/me`, `POST /api/login`, `POST /api/logout` |
| Any authenticated user | data, notifications, own password, booking create, permitted booking edit, permitted cancellation |
| Manager or administrator | room/department CRUD, user CRUD with privileged-account restrictions, booking status/delete |
| Administrator | settings, custom roles, Instant Meeting |

Module visibility is separate from endpoint authorization except for the
`Can cancel bookings` capability, which the cancellation API explicitly checks.

## Bookings

### `POST /api/bookings`

Authentication: required. Roles: all authenticated roles.

```json
{
  "title": "Weekly Meeting",
  "roomId": 1,
  "requesterId": 3,
  "departmentId": 2,
  "startTime": "2026-07-01T09:00",
  "endTime": "2026-07-01T10:00",
  "attendees": 6,
  "purpose": "Weekly planning"
}
```

For normal users, the server ignores submitted `requesterId` and
`departmentId` values and uses the authenticated account. Administrators and
managers may create on behalf of another user. A successful booking returns HTTP
201 and creates a requester notification.

Common errors:

- 401: no valid session
- 409: room conflict
- 500: database constraint or unexpected server failure

### `PUT /api/bookings/:id`

Normal users can edit only their own booking and cannot change requester,
department, or status. Managers and administrators can manage those fields.
Room conflicts return HTTP 409.

### `POST /api/bookings/:id/cancel`

Authentication: required. Capability: administrator or a role granted
`cancel-bookings`.

```json
{
  "reason": "Room required for an urgent customer meeting"
}
```

The API records the actor, reason, and timestamp and creates a requester
notification. Errors include 400 for missing reason, 403 for insufficient
permission, and 404 for an unknown booking.

### `POST /api/bookings/instant`

Authentication: administrator. Intended for the Room Display `Book Now` popup.

```json
{
  "title": "Visitor Discussion",
  "requesterName": "External Visitor",
  "roomId": 1,
  "departmentId": 2,
  "startTime": "2026-07-01T13:30",
  "endTime": "2026-07-01T14:00",
  "attendees": 4,
  "purpose": "Project discussion"
}
```

From and To must be on the same day, To must be after From, and the range may
not exceed eight hours. The room must be active and conflict-free.

### Status and deletion

- `PATCH /api/bookings/:id/status`: manager/administrator; body is
  `{ "status": "pending" }` or `{ "status": "approved" }`.
- `DELETE /api/bookings/:id`: manager/administrator; permanently deletes the
  booking. Prefer cancellation when history and accountability matter.

## Notifications

- `GET /api/notifications`: returns up to 100 notifications for the current user.
- `POST /api/notifications/:id/read`: marks one owned notification read.
- `POST /api/notifications/read-all`: marks all current-user notifications read.

## Settings and roles

- `GET /api/settings`: authenticated.
- `PUT /api/settings`: administrator only.

Settings writes accept `roles` and `modulePermissions`. Do not grant access by
UI changes alone; server endpoints must enforce sensitive capabilities.

## Password change

### `POST /api/me/password`

```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password-of-at-least-12-characters"
}
```

The current implementation changes the password but does not invalidate all
other existing sessions.

## Resource management

Manager/administrator endpoints:

- `POST|PUT|DELETE /api/departments[/:id]`
- `POST|PUT|DELETE /api/rooms[/:id]`
- `POST|PUT|DELETE /api/users[/:id]`

Managers cannot create, modify, or delete privileged manager/administrator
accounts. The last active administrator is protected from deletion, disabling,
or demotion.

## Shared data

`GET /api/data` returns departments, sanitized users, rooms, bookings,
notifications for the current user, and settings. The frontend applies
additional role-based display filtering, but the API response itself contains
shared scheduling data. See [security.md](security.md) before treating these
records as confidential by role.

## Common response codes

| Code | Meaning |
| --- | --- |
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful CORS preflight |
| 400 | Invalid input |
| 401 | Missing or expired session |
| 403 | Origin or role/capability denied |
| 404 | Resource not found |
| 409 | Conflict, protected last administrator, or duplicate/in-use record |
| 429 | Login rate limit reached |
| 500 | Unexpected server error |

