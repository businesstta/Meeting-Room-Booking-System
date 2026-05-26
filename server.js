import crypto from "node:crypto";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
  try {
    const env = await readFile(path.join(__dirname, ".env"), "utf8");
    env.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separator = trimmed.indexOf("=");
      if (separator === -1) return;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
  } catch {
    // .env is optional in deployed environments.
  }
}

await loadEnv();

const PORT = Number(process.env.PORT || 5173);
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/meeting_room_booking";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-secret-before-production";
const SESSION_COOKIE = "atoz_session";
const SESSION_HOURS = 8;
const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Cache-Control", "no-store");
  next();
});

function toIsoMinute(value) {
  if (!value) return value;
  const date = value instanceof Date ? value : new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const iterations = 210000;
  const hash = crypto.pbkdf2Sync(String(password), salt, iterations, 32, "sha256").toString("base64url");
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored?.startsWith("pbkdf2$")) {
    return { ok: stored === password, needsUpgrade: stored === password };
  }
  const [, iterationsText, salt, expected] = stored.split("$");
  const iterations = Number(iterationsText);
  const actual = crypto.pbkdf2Sync(String(password), salt, iterations, 32, "sha256").toString("base64url");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  return {
    ok: expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer),
    needsUpgrade: false
  };
}

function parseCookies(header = "") {
  return Object.fromEntries(
    header.split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
      const separator = part.indexOf("=");
      return [decodeURIComponent(part.slice(0, separator)), decodeURIComponent(part.slice(separator + 1))];
    })
  );
}

function signToken(token) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("base64url");
}

function packSession(token) {
  return `${token}.${signToken(token)}`;
}

function unpackSession(value) {
  if (!value) return "";
  const [token, signature] = value.split(".");
  if (!token || !signature) return "";
  const expected = signToken(token);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? token : "";
}

function sessionCookie(value, maxAgeSeconds = SESSION_HOURS * 3600) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${secure}`;
}

function userRow(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    role: row.role,
    departmentId: row.department_id,
    isActive: row.is_active,
    createdAt: toIsoMinute(row.created_at)
  };
}

function departmentRow(row) {
  return { id: row.id, name: row.name, code: row.code };
}

function roomRow(row) {
  return {
    id: row.id,
    name: row.name,
    floor: row.floor,
    capacity: row.capacity,
    equipment: row.equipment,
    isActive: row.is_active
  };
}

function bookingRow(row) {
  return {
    id: row.id,
    title: row.title,
    roomId: row.room_id,
    requesterId: row.requester_id,
    departmentId: row.department_id,
    startTime: toIsoMinute(row.start_time),
    endTime: toIsoMinute(row.end_time),
    attendees: row.attendees,
    status: row.status,
    purpose: row.purpose || "",
    createdAt: toIsoMinute(row.created_at)
  };
}

async function migrateSecurity() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP");

  const users = await pool.query("SELECT id, password FROM users");
  for (const user of users.rows) {
    if (user.password?.startsWith("pbkdf2$")) continue;
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashPassword(user.password), user.id]);
  }
}

async function allData() {
  const [departments, users, rooms, bookings] = await Promise.all([
    pool.query("SELECT * FROM departments ORDER BY id"),
    pool.query("SELECT id, name, username, email, role, department_id, is_active, created_at FROM users ORDER BY id"),
    pool.query("SELECT * FROM rooms ORDER BY id"),
    pool.query("SELECT * FROM bookings ORDER BY start_time, id")
  ]);
  return {
    departments: departments.rows.map(departmentRow),
    users: users.rows.map(userRow),
    rooms: rooms.rows.map(roomRow),
    bookings: bookings.rows.map(bookingRow)
  };
}

async function findConflict({ roomId, startTime, endTime, excludeId = null }) {
  const result = await pool.query(
    `SELECT *
       FROM bookings
      WHERE room_id = $1
        AND status <> 'cancelled'
        AND ($4::int IS NULL OR id <> $4)
        AND $2::timestamp < end_time
        AND $3::timestamp > start_time
      ORDER BY start_time
      LIMIT 1`,
    [roomId, startTime, endTime, excludeId]
  );
  return result.rows[0] ? bookingRow(result.rows[0]) : null;
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function requireAuth(req, res, next) {
  try {
    const token = unpackSession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
    if (!token) return res.status(401).json({ message: "Please login first." });
    const tokenHash = crypto.createHash("sha256").update(token).digest("base64url");
    const result = await pool.query(
      `SELECT users.id, users.name, users.username, users.email, users.role, users.department_id, users.is_active, users.created_at
         FROM sessions
         JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = $1
          AND sessions.expires_at > CURRENT_TIMESTAMP
          AND users.is_active = true
        LIMIT 1`,
      [tokenHash]
    );
    if (!result.rows[0]) return res.status(401).json({ message: "Please login first." });
    req.user = userRow(result.rows[0]);
    next();
  } catch (error) {
    next(error);
  }
}

function requireManager(req, res, next) {
  if (!["administrator", "manager"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Manager access is required." });
  }
  next();
}

app.get("/api/health", asyncRoute(async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
}));

app.get("/api/me", asyncRoute(async (req, res) => {
  const token = unpackSession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
  if (!token) return res.json({ user: null });
  const tokenHash = crypto.createHash("sha256").update(token).digest("base64url");
  const result = await pool.query(
    `SELECT users.id, users.name, users.username, users.email, users.role, users.department_id, users.is_active, users.created_at
       FROM sessions
       JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = $1
        AND sessions.expires_at > CURRENT_TIMESTAMP
        AND users.is_active = true
      LIMIT 1`,
    [tokenHash]
  );
  res.json({ user: result.rows[0] ? userRow(result.rows[0]) : null });
}));

app.post("/api/login", asyncRoute(async (req, res) => {
  const login = String(req.body.login || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const result = await pool.query(
    `SELECT *
       FROM users
      WHERE is_active = true
        AND (LOWER(username) = $1 OR LOWER(email) = $1)
      LIMIT 1`,
    [login]
  );
  const user = result.rows[0];
  const passwordResult = user ? verifyPassword(password, user.password) : { ok: false };
  if (!user || !passwordResult.ok) return res.status(401).json({ message: "Username or password is incorrect." });
  if (passwordResult.needsUpgrade) {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashPassword(password), user.id]);
  }

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("base64url");
  await pool.query("DELETE FROM sessions WHERE user_id = $1 OR expires_at < CURRENT_TIMESTAMP", [user.id]);
  await pool.query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + ($3 || ' hours')::interval)",
    [tokenHash, user.id, SESSION_HOURS]
  );
  res.setHeader("Set-Cookie", sessionCookie(packSession(token)));
  res.json({ user: userRow(user) });
}));

app.post("/api/logout", asyncRoute(async (req, res) => {
  const token = unpackSession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("base64url");
    await pool.query("DELETE FROM sessions WHERE token_hash = $1", [tokenHash]);
  }
  res.setHeader("Set-Cookie", sessionCookie("", 0));
  res.json({ ok: true });
}));

app.use("/api", requireAuth);

app.get("/api/data", asyncRoute(async (_req, res) => {
  res.json(await allData());
}));

app.post("/api/departments", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query(
    "INSERT INTO departments (name, code) VALUES ($1, $2) RETURNING *",
    [req.body.name, String(req.body.code || "").toUpperCase()]
  );
  res.status(201).json(departmentRow(result.rows[0]));
}));

app.put("/api/departments/:id", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query(
    "UPDATE departments SET name = $1, code = $2 WHERE id = $3 RETURNING *",
    [req.body.name, String(req.body.code || "").toUpperCase(), req.params.id]
  );
  res.json(departmentRow(result.rows[0]));
}));

app.delete("/api/departments/:id", requireManager, asyncRoute(async (req, res) => {
  await pool.query("DELETE FROM departments WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
}));

app.post("/api/rooms", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query(
    "INSERT INTO rooms (name, floor, capacity, equipment, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [req.body.name, req.body.floor, Number(req.body.capacity), req.body.equipment, req.body.isActive !== false]
  );
  res.status(201).json(roomRow(result.rows[0]));
}));

app.put("/api/rooms/:id", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query(
    "UPDATE rooms SET name = $1, floor = $2, capacity = $3, equipment = $4, is_active = $5 WHERE id = $6 RETURNING *",
    [req.body.name, req.body.floor, Number(req.body.capacity), req.body.equipment, req.body.isActive !== false, req.params.id]
  );
  res.json(roomRow(result.rows[0]));
}));

app.delete("/api/rooms/:id", requireManager, asyncRoute(async (req, res) => {
  await pool.query("DELETE FROM rooms WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
}));

app.post("/api/users", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query(
    `INSERT INTO users (name, username, email, password, role, department_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, username, email, role, department_id, is_active, created_at`,
    [req.body.name, req.body.username, req.body.email, hashPassword(req.body.password), req.body.role, req.body.departmentId, req.body.isActive !== false]
  );
  res.status(201).json(userRow(result.rows[0]));
}));

app.put("/api/users/:id", requireManager, asyncRoute(async (req, res) => {
  const values = [req.body.name, req.body.username, req.body.email, req.body.role, req.body.departmentId, req.body.isActive === true, req.params.id];
  const passwordSql = req.body.password ? ", password = $8" : "";
  if (req.body.password) values.push(hashPassword(req.body.password));
  const result = await pool.query(
    `UPDATE users
        SET name = $1, username = $2, email = $3, role = $4, department_id = $5, is_active = $6${passwordSql}
      WHERE id = $7
      RETURNING id, name, username, email, role, department_id, is_active, created_at`,
    values
  );
  res.json(userRow(result.rows[0]));
}));

app.delete("/api/users/:id", requireManager, asyncRoute(async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
}));

app.post("/api/bookings", asyncRoute(async (req, res) => {
  const canManage = ["administrator", "manager"].includes(req.user.role);
  const requesterId = canManage ? Number(req.body.requesterId) : req.user.id;
  const departmentId = canManage ? Number(req.body.departmentId) : req.user.departmentId;
  const conflict = await findConflict({ roomId: Number(req.body.roomId), startTime: req.body.startTime, endTime: req.body.endTime });
  if (conflict) return res.status(409).json({ message: "Room already booked.", conflict });
  const result = await pool.query(
    `INSERT INTO bookings (title, room_id, requester_id, department_id, start_time, end_time, attendees, status, purpose)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'approved', $8)
     RETURNING *`,
    [req.body.title, Number(req.body.roomId), requesterId, departmentId, req.body.startTime, req.body.endTime, Number(req.body.attendees), req.body.purpose || ""]
  );
  res.status(201).json(bookingRow(result.rows[0]));
}));

app.put("/api/bookings/:id", asyncRoute(async (req, res) => {
  const canManage = ["administrator", "manager"].includes(req.user.role);
  const existing = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ message: "Booking not found." });
  if (!canManage && existing.rows[0].requester_id !== req.user.id) return res.status(403).json({ message: "You can only edit your own bookings." });
  const requesterId = canManage ? Number(req.body.requesterId) : req.user.id;
  const departmentId = canManage ? Number(req.body.departmentId) : req.user.departmentId;
  const conflict = await findConflict({ roomId: Number(req.body.roomId), startTime: req.body.startTime, endTime: req.body.endTime, excludeId: Number(req.params.id) });
  if (conflict) return res.status(409).json({ message: "Room already booked.", conflict });
  const result = await pool.query(
    `UPDATE bookings
        SET title = $1, room_id = $2, requester_id = $3, department_id = $4, start_time = $5, end_time = $6,
            attendees = $7, status = $8, purpose = $9
      WHERE id = $10
      RETURNING *`,
    [req.body.title, req.body.roomId, requesterId, departmentId, req.body.startTime, req.body.endTime, req.body.attendees, req.body.status || existing.rows[0].status, req.body.purpose || "", req.params.id]
  );
  res.json(bookingRow(result.rows[0]));
}));

app.patch("/api/bookings/:id/status", requireManager, asyncRoute(async (req, res) => {
  const result = await pool.query("UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *", [req.body.status, req.params.id]);
  res.json(bookingRow(result.rows[0]));
}));

app.delete("/api/bookings/:id", asyncRoute(async (req, res) => {
  const canManage = ["administrator", "manager"].includes(req.user.role);
  const existing = await pool.query("SELECT requester_id FROM bookings WHERE id = $1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ message: "Booking not found." });
  if (!canManage && existing.rows[0].requester_id !== req.user.id) return res.status(403).json({ message: "You can only delete your own bookings." });
  await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
}));

app.use(express.static(__dirname));
app.get("*", async (_req, res) => {
  res.type("html").send(await readFile(path.join(__dirname, "index.html"), "utf8"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Server error." });
});

await migrateSecurity();

app.listen(PORT, () => {
  console.log(`AtoZ Meeting Room Booking running at http://127.0.0.1:${PORT}`);
});
