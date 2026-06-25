# AtoZ Group Meeting Room Booking System

Company meeting room booking system with a responsive PWA interface, PostgreSQL database, role-based access, notifications, room display panels, and optional email alerts.

## Stack

- Frontend: HTML, CSS, modern JavaScript modules
- Backend: Node.js + Express
- Database: PostgreSQL
- Email: Nodemailer SMTP integration
- PWA: Web App Manifest + Service Worker cache
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
- Admin Department manager can cancel bookings for urgent room priority
- Required cancellation reason with confirmation popup
- Cancellation notification sent to the original requester
- Notification page with unread count, read status, and mark all as read
- Faster notification refresh through lightweight polling
- Room Display panel for tablets outside meeting rooms
- Administrator-only access to Room Display login
- Room Display shows busy/free state by room and day schedule
- Departments, users, and rooms CRUD with delete confirmations
- Department page can assign existing users instead of recreating users
- Module Permissions settings for role-based menu/module access
- Change Password page for all roles
- Language switch: English / Burmese
- Theme switch: Light / Dark navy mode
- Collapsible left navigation with icons
- Responsive layout for desktop, tablet, and mobile

## Role Behavior

| Role | Access |
| --- | --- |
| administrator | Full system access, module permissions, users, departments, rooms, bookings, calendar, notifications, room display |
| manager | Can view all bookings, cancel bookings, manage normal workflow modules allowed by settings |
| user | Can book rooms and view only their own bookings, calendar, dashboard, notifications, and change password |

Module visibility can be changed by an administrator from:

```text
Settings > Module Permissions
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
```

Start the web app and API:

```powershell
npm start
```

Open the app:

```text
http://localhost:5173
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

## Default Users

Seed data may include default accounts for initial testing. Change all default passwords before company production use.

Common seed examples:

- Administrator: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Normal user: `aye` / `user123`
- Normal user: `it` / `user123`

The actual current credentials may differ if the database has already been edited through the app.

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
- `GET /api/public/room-panel`

## Production Notes

- Set a strong unique `SESSION_SECRET`
- Change all default account passwords
- Keep `.env` outside Git commits
- Use HTTPS in production
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
6. Administrator or manager can cancel bookings when needed.
7. Cancellation requires a reason and notifies the requester.
8. Room Display panels can show room busy/free state outside meeting rooms.
