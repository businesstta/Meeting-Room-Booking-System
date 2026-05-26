# AtoZ Group Meeting Room Booking System

Responsive meeting room booking web app with a left navigation panel, department-based users, manager and administrator roles, PWA support, and a PostgreSQL-backed API.

## Stack

- Frontend: HTML, CSS, modern JavaScript modules
- Backend: Node.js + Express
- PWA: Web App Manifest + Service Worker cache
- Database: PostgreSQL
- Database schema and seed: `database/postgres.sql`

## PostgreSQL Setup

Create and seed the database. If `psql` is already in PATH:

```powershell
.\database\setup-postgres.ps1
```

If `psql` is not in PATH, pass the full path. On this machine it may be under Odoo's PostgreSQL folder:

```powershell
.\database\setup-postgres.ps1 -PsqlPath "C:\Program Files\Odoo 19.0.20260320\PostgreSQL\bin\psql.exe"
```

The script creates `meeting_room_booking` and applies seed data.

## Run With PostgreSQL

Install Node dependencies once:

```powershell
npm install
```

Create `.env` from `.env.example`, then update the PostgreSQL password if needed:

```text
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/meeting_room_booking
PORT=5173
```

Start the web app and API:

```powershell
npm start
```

Then visit:

```text
http://localhost:5173
```

## Default Users

- Administrator: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Normal user: `aye` / `user123`
- Normal user: `it` / `user123`

Passwords are stored with PBKDF2 hashes, and login uses server-side sessions with an HttpOnly cookie. Before deploying, set a long unique `SESSION_SECRET` in `.env` and change all default account passwords.

## Core Tables

- `departments`
- `users`
- `rooms`
- `bookings`

## Main Workflow

1. Administrator or manager opens the dashboard.
2. Create departments and normal users by department.
3. Create meeting rooms with floor, capacity, and equipment.
4. Users create booking requests.
5. Manager or administrator approves, cancels, or reviews bookings.
6. PWA caches static files for launch. API data comes from PostgreSQL.
