import crypto from "node:crypto";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
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
      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    });
  } catch {
    // .env is optional in deployed environments.
  }
}

await loadEnv();

const PORT = Number(process.env.PORT || 5173);
const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/meeting_room_booking";
const SESSION_SECRET = String(process.env.SESSION_SECRET || "");
if (SESSION_SECRET.length < 32 || SESSION_SECRET.includes("change-this-secret") || SESSION_SECRET.includes("replace-this")) {
  throw new Error("SESSION_SECRET must be a unique secret of at least 32 characters.");
}
const COOKIE_SECURE = String(process.env.COOKIE_SECURE ?? (process.env.NODE_ENV === "production")).toLowerCase() === "true";
const SESSION_COOKIE = "atoz_session";
const ALLOWED_ORIGINS = new Set(
  String(process.env.CORS_ALLOWED_ORIGINS || "https://office.atoz.com.mm,https://localhost")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const SESSION_TIMEOUT_MINUTES = Number(process.env.SESSION_TIMEOUT_MINUTES || 30);
if (!Number.isInteger(SESSION_TIMEOUT_MINUTES) || SESSION_TIMEOUT_MINUTES < 5 || SESSION_TIMEOUT_MINUTES > 1440) {
  throw new Error("SESSION_TIMEOUT_MINUTES must be a whole number between 5 and 1440.");
}
const PASSWORD_ITERATIONS = 600000;
const MIN_PASSWORD_LENGTH = 12;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 10;
const EMAIL_ENABLED = String(process.env.EMAIL_ENABLED || "false").toLowerCase() === "true";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER || "";
const DEFAULT_MODULE_PERMISSIONS = {
  administrator: ["dashboard", "bookings", "calendar", "notifications", "rooms", "users", "departments", "cancel-bookings", "module-permissions", "role-setup", "change-password", "settings"],
  manager: ["dashboard", "bookings", "calendar", "notifications", "rooms", "users", "departments", "cancel-bookings", "change-password", "settings"],
  user: ["dashboard", "bookings", "calendar", "notifications", "change-password", "settings"]
};
const CORE_ROLES = ["administrator", "manager", "user"];
const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();
let mailTransport = null;
const loginFailures = new Map();

app.disable("x-powered-by");
app.use((req, res, next) => {
  const origin = String(req.headers.origin || "");
  if (origin) {
    if (!ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ message: "Origin is not allowed." });
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "600");
    res.vary("Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "32kb", strict: true }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  if (COOKIE_SECURE) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
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
  const iterations = PASSWORD_ITERATIONS;
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
    needsUpgrade: iterations < PASSWORD_ITERATIONS
  };
}

function passwordValidationMessage(password) {
  if (String(password).length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (String(password).length > 128) return "Password must be 128 characters or fewer.";
  return "";
}

function loginRateKey(req) {
  const remoteAddress = req.socket.remoteAddress || "unknown";
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const trustedProxy = /^(::ffff:)?10\.|^(::ffff:)?192\.168\.|^(::ffff:)?172\.(1[6-9]|2\d|3[01])\./.test(remoteAddress);
  return trustedProxy && forwarded ? forwarded : remoteAddress;
}

function loginRateLimit(req, res, next) {
  const key = loginRateKey(req);
  const now = Date.now();
  let entry = loginFailures.get(key);
  if (entry && entry.resetAt <= now) {
    loginFailures.delete(key);
    entry = null;
  }
  if (entry?.count >= LOGIN_MAX_FAILURES) {
    res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
    return res.status(429).json({ message: "Too many login attempts. Please try again later." });
  }
  req.loginRateKey = key;
  next();
}

function recordLoginFailure(req) {
  const now = Date.now();
  const entry = loginFailures.get(req.loginRateKey);
  if (!entry || entry.resetAt <= now) {
    loginFailures.set(req.loginRateKey, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
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

function sessionCookie(value, maxAgeSeconds = SESSION_TIMEOUT_MINUTES * 60) {
  const secure = COOKIE_SECURE ? "; Secure" : "";
  const sameSite = COOKIE_SECURE ? "None" : "Lax";
  const expires = maxAgeSeconds <= 0 ? "; Expires=Thu, 01 Jan 1970 00:00:00 GMT" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; SameSite=${sameSite}; Path=/; Max-Age=${maxAgeSeconds}${expires}${secure}`;
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
    requesterName: row.requester_name || "",
    departmentId: row.department_id,
    startTime: toIsoMinute(row.start_time),
    endTime: toIsoMinute(row.end_time),
    attendees: row.attendees,
    status: row.status,
    purpose: row.purpose || "",
    createdAt: toIsoMinute(row.created_at),
    cancelledBy: row.cancelled_by,
    cancelReason: row.cancel_reason || "",
    cancelledAt: toIsoMinute(row.cancelled_at)
  };
}

function notificationRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    bookingId: row.booking_id,
    readAt: toIsoMinute(row.read_at),
    createdAt: toIsoMinute(row.created_at)
  };
}

function escapeEmailHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailConfigured() {
  return Boolean(EMAIL_ENABLED && process.env.SMTP_HOST && MAIL_FROM);
}

function emailStatusMessage() {
  if (!EMAIL_ENABLED) return "disabled; set EMAIL_ENABLED=true in .env to send email.";
  const missing = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!MAIL_FROM) missing.push("MAIL_FROM or SMTP_USER");
  if (missing.length) return `disabled; missing ${missing.join(", ")}.`;
  return `enabled via ${process.env.SMTP_HOST}:${SMTP_PORT}.`;
}

function getMailTransport() {
  if (!emailConfigured()) return null;
  if (!mailTransport) {
    mailTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || ""
      } : undefined,
      requireTLS: !SMTP_SECURE
    });
  }
  return mailTransport;
}

async function sendMailToUser(userId, subject, message) {
  const transport = getMailTransport();
  if (!transport) return;
  const result = await pool.query("SELECT email, name FROM users WHERE id = $1 AND is_active = true", [userId]);
  const user = result.rows[0];
  if (!user?.email) return;
  await transport.sendMail({
    from: MAIL_FROM,
    to: user.email,
    subject,
    text: message,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>${escapeEmailHtml(subject)}</h2>
        <p>${escapeEmailHtml(message)}</p>
        <p style="color:#666;font-size:12px">AtoZ Group Meeting Room Booking System</p>
      </div>
    `
  });
}

function queueMailToUser(userId, subject, message) {
  if (!emailConfigured()) return;
  setImmediate(() => {
    sendMailToUser(userId, subject, message).catch((error) => {
      console.error("Email notification failed:", error.message);
    });
  });
}

function settingsRow(row) {
  const customRoles = Array.isArray(row?.custom_roles) ? row.custom_roles : [];
  const roles = [...new Set([...CORE_ROLES, ...customRoles.map((role) => String(role).trim().toLowerCase()).filter(Boolean)])];
  const modulePermissions = { ...DEFAULT_MODULE_PERMISSIONS, ...(row?.module_permissions || {}) };
  roles.forEach((role) => {
    if (!modulePermissions[role]) modulePermissions[role] = ["dashboard", "bookings", "calendar", "notifications", "change-password", "settings"];
  });
  return {
    modulePermissions,
    roles,
    coreRoles: CORE_ROLES
  };
}

async function migrateSecurity() {
  await pool.query("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
  await pool.query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL");
  await pool.query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancel_reason TEXT");
  await pool.query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS requester_name TEXT");
  await pool.query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'info',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
      read_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query("CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at, created_at)");
  await pool.query(`
    INSERT INTO notifications (user_id, type, title, message, booking_id)
    SELECT b.requester_id,
           'cancelled',
           'Booking cancelled',
           b.title || ' was cancelled by ' || COALESCE(actor.name, 'a user') || '. Reason: ' || COALESCE(NULLIF(b.cancel_reason, ''), 'Not provided'),
           b.id
      FROM bookings b
      LEFT JOIN users actor ON actor.id = b.cancelled_by
     WHERE b.status = 'cancelled'
       AND NOT EXISTS (
         SELECT 1 FROM notifications n WHERE n.booking_id = b.id AND n.type = 'cancelled'
       )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      module_permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
      custom_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CHECK (id = 1)
    )
  `);
  await pool.query("ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS custom_roles JSONB NOT NULL DEFAULT '[]'::jsonb");
  await pool.query(
    "INSERT INTO app_settings (id, module_permissions, custom_roles) VALUES (1, $1::jsonb, '[]'::jsonb) ON CONFLICT (id) DO NOTHING",
    [JSON.stringify(DEFAULT_MODULE_PERMISSIONS)]
  );
  await pool.query("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP");

  const activeAdmins = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'administrator' AND is_active = true");
  if (activeAdmins.rows[0].count === 0) {
    const bootstrapPassword = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || "");
    const passwordError = passwordValidationMessage(bootstrapPassword);
    if (passwordError) throw new Error("No active administrator exists. Set a secure BOOTSTRAP_ADMIN_PASSWORD before starting the application.");
    const department = await pool.query(
      "INSERT INTO departments (name, code) VALUES ('Administration', 'ADM') ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id"
    );
    await pool.query(
      `INSERT INTO users (name, username, email, password, role, department_id, is_active)
       VALUES ($1, $2, $3, $4, 'administrator', $5, true)`,
      [
        process.env.BOOTSTRAP_ADMIN_NAME || "System Administrator",
        process.env.BOOTSTRAP_ADMIN_USERNAME || "admin",
        process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@company.test",
        hashPassword(bootstrapPassword),
        department.rows[0].id
      ]
    );
  }

  const users = await pool.query("SELECT id, password FROM users");
  for (const user of users.rows) {
    if (user.password?.startsWith("pbkdf2$")) continue;
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashPassword(user.password), user.id]);
  }
}

async function allData(user) {
  const [departments, users, rooms, bookings, notifications, settings] = await Promise.all([
    pool.query("SELECT * FROM departments ORDER BY id"),
    pool.query("SELECT id, name, username, email, role, department_id, is_active, created_at FROM users ORDER BY id"),
    pool.query("SELECT * FROM rooms ORDER BY id"),
    pool.query("SELECT * FROM bookings ORDER BY start_time, id"),
    pool.query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 100", [user.id]),
    pool.query("SELECT module_permissions, custom_roles FROM app_settings WHERE id = 1")
  ]);
  return {
    departments: departments.rows.map(departmentRow),
    users: users.rows.map(userRow),
    rooms: rooms.rows.map(roomRow),
    bookings: bookings.rows.map(bookingRow),
    notifications: notifications.rows.map(notificationRow),
    settings: settingsRow(settings.rows[0])
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

function requireAdmin(req, res, next) {
  if (req.user?.role !== "administrator") {
    return res.status(403).json({ message: "Administrator access is required." });
  }
  next();
}

function isAdminDepartment(department) {
  return department?.code === "ADM" || /admin/i.test(department?.name || "");
}

async function canCancelBooking(req, booking) {
  if (req.user.role === "administrator") return true;
  const result = await pool.query("SELECT module_permissions FROM app_settings WHERE id = 1");
  const permissions = result.rows[0]?.module_permissions?.[req.user.role];
  return Array.isArray(permissions) && permissions.includes("cancel-bookings");
}

function isPrivilegedRole(role) {
  return ["administrator", "manager"].includes(String(role).toLowerCase());
}

async function knownRole(role) {
  const result = await pool.query("SELECT custom_roles FROM app_settings WHERE id = 1");
  const customRoles = Array.isArray(result.rows[0]?.custom_roles) ? result.rows[0].custom_roles : [];
  return [...CORE_ROLES, ...customRoles].includes(String(role).trim().toLowerCase());
}

async function userMutationAllowed(req, res, target = null) {
  const requestedRole = String(req.body.role || "").trim().toLowerCase();
  if (!(await knownRole(requestedRole))) {
    res.status(400).json({ message: "Invalid user role." });
    return false;
  }
  if (req.user.role !== "administrator" && (isPrivilegedRole(requestedRole) || isPrivilegedRole(target?.role))) {
    res.status(403).json({ message: "Only administrators can manage privileged accounts or roles." });
    return false;
  }
  if (target?.role === "administrator" && target.is_active && (requestedRole !== "administrator" || req.body.isActive !== true)) {
    const others = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'administrator' AND is_active = true AND id <> $1", [target.id]);
    if (others.rows[0].count === 0) {
      res.status(409).json({ message: "The last active administrator cannot be disabled or demoted." });
      return false;
    }
  }
  req.body.role = requestedRole;
  return true;
}

async function createNotification({ userId, type = "info", title, message, bookingId = null }) {
  await pool.query(
    `INSERT INTO notifications (user_id, type, title, message, booking_id)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, type, title, message, bookingId]
  );
  queueMailToUser(userId, title, message);
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
    `SELECT users.id, users.name, users.username, users.email, users.role, users.department_id, users.is_active, users.created_at,
            sessions.expires_at
       FROM sessions
       JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = $1
        AND sessions.expires_at > CURRENT_TIMESTAMP
        AND users.is_active = true
      LIMIT 1`,
    [tokenHash]
  );
  res.json({
    user: result.rows[0] ? userRow(result.rows[0]) : null,
    sessionExpiresAt: result.rows[0]?.expires_at?.toISOString?.() || null
  });
}));

app.post("/api/login", loginRateLimit, asyncRoute(async (req, res) => {
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
  if (!user || !passwordResult.ok) {
    recordLoginFailure(req);
    return res.status(401).json({ message: "Username or password is incorrect." });
  }
  loginFailures.delete(req.loginRateKey);
  if (passwordResult.needsUpgrade) {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashPassword(password), user.id]);
  }

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("base64url");
  await pool.query("DELETE FROM sessions WHERE user_id = $1 OR expires_at < CURRENT_TIMESTAMP", [user.id]);
  const session = await pool.query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + ($3 || ' minutes')::interval) RETURNING expires_at",
    [tokenHash, user.id, SESSION_TIMEOUT_MINUTES]
  );
  res.setHeader("Set-Cookie", sessionCookie(packSession(token)));
  res.json({ user: userRow(user), sessionExpiresAt: session.rows[0].expires_at.toISOString() });
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

app.get("/api/data", asyncRoute(async (req, res) => {
  res.json(await allData(req.user));
}));

app.get("/api/settings", asyncRoute(async (_req, res) => {
  const result = await pool.query("SELECT module_permissions, custom_roles FROM app_settings WHERE id = 1");
  res.json(settingsRow(result.rows[0]));
}));

app.put("/api/settings", requireAdmin, asyncRoute(async (req, res) => {
  const requestedRoles = Array.isArray(req.body.roles) ? req.body.roles : CORE_ROLES;
  const roles = [...new Set([...CORE_ROLES, ...requestedRoles.map((role) => String(role).trim().toLowerCase()).filter(Boolean)])];
  const customRoles = roles.filter((role) => !CORE_ROLES.includes(role));
  const modulePermissions = { ...DEFAULT_MODULE_PERMISSIONS, ...(req.body.modulePermissions || {}) };
  roles.forEach((role) => {
    if (!modulePermissions[role]) modulePermissions[role] = ["dashboard", "bookings", "calendar", "notifications", "change-password", "settings"];
  });
  Object.keys(modulePermissions).forEach((role) => {
    if (!roles.includes(role)) delete modulePermissions[role];
  });
  const result = await pool.query(
    `UPDATE app_settings
        SET module_permissions = $1::jsonb, custom_roles = $2::jsonb, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING module_permissions, custom_roles`,
    [JSON.stringify(modulePermissions), JSON.stringify(customRoles)]
  );
  res.json(settingsRow(result.rows[0]));
}));

app.post("/api/me/password", asyncRoute(async (req, res) => {
  const oldPassword = String(req.body.oldPassword || "");
  const newPassword = String(req.body.newPassword || "");
  const passwordError = passwordValidationMessage(newPassword);
  if (passwordError) return res.status(400).json({ message: passwordError });
  const result = await pool.query("SELECT id, password FROM users WHERE id = $1", [req.user.id]);
  const passwordResult = result.rows[0] ? verifyPassword(oldPassword, result.rows[0].password) : { ok: false };
  if (!passwordResult.ok) return res.status(400).json({ message: "Old password is incorrect." });
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashPassword(newPassword), req.user.id]);
  res.json({ ok: true });
}));

app.post("/api/notifications/:id/read", asyncRoute(async (req, res) => {
  const result = await pool.query(
    `UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP)
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
    [req.params.id, req.user.id]
  );
  if (!result.rows[0]) return res.status(404).json({ message: "Notification not found." });
  res.json(notificationRow(result.rows[0]));
}));

app.post("/api/notifications/read-all", asyncRoute(async (req, res) => {
  await pool.query("UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP) WHERE user_id = $1", [req.user.id]);
  res.json({ ok: true });
}));

app.get("/api/notifications", asyncRoute(async (req, res) => {
  const result = await pool.query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 100", [req.user.id]);
  res.json({ notifications: result.rows.map(notificationRow) });
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
  const passwordError = passwordValidationMessage(req.body.password);
  if (passwordError) return res.status(400).json({ message: passwordError });
  if (!(await userMutationAllowed(req, res))) return;
  const result = await pool.query(
    `INSERT INTO users (name, username, email, password, role, department_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, username, email, role, department_id, is_active, created_at`,
    [req.body.name, req.body.username, req.body.email, hashPassword(req.body.password), req.body.role, req.body.departmentId, req.body.isActive !== false]
  );
  res.status(201).json(userRow(result.rows[0]));
}));

app.put("/api/users/:id", requireManager, asyncRoute(async (req, res) => {
  const targetResult = await pool.query("SELECT id, role, is_active FROM users WHERE id = $1", [req.params.id]);
  const target = targetResult.rows[0];
  if (!target) return res.status(404).json({ message: "User not found." });
  if (req.body.password) {
    const passwordError = passwordValidationMessage(req.body.password);
    if (passwordError) return res.status(400).json({ message: passwordError });
  }
  if (!(await userMutationAllowed(req, res, target))) return;
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
  const targetResult = await pool.query("SELECT id, role, is_active FROM users WHERE id = $1", [req.params.id]);
  const target = targetResult.rows[0];
  if (!target) return res.status(404).json({ message: "User not found." });
  if (Number(target.id) === Number(req.user.id)) return res.status(409).json({ message: "You cannot delete your own account." });
  if (req.user.role !== "administrator" && isPrivilegedRole(target.role)) {
    return res.status(403).json({ message: "Only administrators can delete privileged accounts." });
  }
  if (target.role === "administrator" && target.is_active) {
    const others = await pool.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'administrator' AND is_active = true AND id <> $1", [target.id]);
    if (others.rows[0].count === 0) return res.status(409).json({ message: "The last active administrator cannot be deleted." });
  }
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
  const booking = bookingRow(result.rows[0]);
  await createNotification({
    userId: requesterId,
    type: "success",
    title: "Booking successful",
    message: `${booking.title} has been booked.`,
    bookingId: booking.id
  });
  res.status(201).json(booking);
}));

app.post("/api/bookings/instant", requireAdmin, asyncRoute(async (req, res) => {
  const title = String(req.body.title || "").trim();
  const requesterName = String(req.body.requesterName || "").trim();
  const purpose = String(req.body.purpose || "").trim();
  const roomId = Number(req.body.roomId);
  const departmentId = Number(req.body.departmentId);
  const attendees = Number(req.body.attendees);
  const startTime = String(req.body.startTime || "");
  const endTime = String(req.body.endTime || "");
  if (!title || title.length > 160) return res.status(400).json({ message: "Meeting title is required and must be 160 characters or fewer." });
  if (!requesterName || requesterName.length > 120) return res.status(400).json({ message: "Requester name is required and must be 120 characters or fewer." });
  if (!Number.isInteger(attendees) || attendees < 1 || attendees > 10000) return res.status(400).json({ message: "Attendees must be a whole number between 1 and 10000." });
  const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!localDateTimePattern.test(startTime) || !localDateTimePattern.test(endTime)) return res.status(400).json({ message: "Select valid From and To times." });
  if (startTime.slice(0, 10) !== endTime.slice(0, 10)) return res.status(400).json({ message: "From and To must be on the same day." });
  const durationMinutes = (new Date(endTime) - new Date(startTime)) / 60000;
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0 || durationMinutes > 480) return res.status(400).json({ message: "To must be after From and no more than 8 hours later." });
  const [roomResult, departmentResult] = await Promise.all([
    pool.query("SELECT id FROM rooms WHERE id = $1 AND is_active = true", [roomId]),
    pool.query("SELECT id FROM departments WHERE id = $1", [departmentId])
  ]);
  if (!roomResult.rows[0]) return res.status(400).json({ message: "Select an active room." });
  if (!departmentResult.rows[0]) return res.status(400).json({ message: "Select a valid department." });
  const conflict = await findConflict({ roomId, startTime, endTime });
  if (conflict) return res.status(409).json({ message: "Room already booked for this time slot.", conflict });
  const result = await pool.query(
    `INSERT INTO bookings (title, room_id, requester_id, requester_name, department_id, start_time, end_time, attendees, status, purpose)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', $9)
     RETURNING *`,
    [title, roomId, req.user.id, requesterName, departmentId, startTime, endTime, attendees, purpose]
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
  const requestedStatus = canManage ? String(req.body.status || existing.rows[0].status) : existing.rows[0].status;
  if (!["pending", "approved"].includes(requestedStatus)) return res.status(400).json({ message: "Invalid booking status." });
  const result = await pool.query(
    `UPDATE bookings
        SET title = $1, room_id = $2, requester_id = $3, department_id = $4, start_time = $5, end_time = $6,
            attendees = $7, status = $8, purpose = $9
      WHERE id = $10
      RETURNING *`,
    [req.body.title, req.body.roomId, requesterId, departmentId, req.body.startTime, req.body.endTime, req.body.attendees, requestedStatus, req.body.purpose || "", req.params.id]
  );
  res.json(bookingRow(result.rows[0]));
}));

app.post("/api/bookings/:id/cancel", asyncRoute(async (req, res) => {
  const reason = String(req.body.reason || "").trim();
  if (!reason) return res.status(400).json({ message: "Cancellation reason is required." });
  const client = await pool.connect();
  let emailNotice = null;
  try {
    await client.query("BEGIN");
    const existing = await client.query("SELECT * FROM bookings WHERE id = $1 FOR UPDATE", [req.params.id]);
    const booking = existing.rows[0];
    if (!booking) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Booking not found." });
    }
    if (booking.status === "cancelled") {
      await client.query("COMMIT");
      return res.json(bookingRow(booking));
    }
    if (!(await canCancelBooking(req, booking))) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "You cannot cancel this booking." });
    }
    const result = await client.query(
      `UPDATE bookings
          SET status = 'cancelled', cancel_reason = $1, cancelled_by = $2, cancelled_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *`,
      [reason, req.user.id, req.params.id]
    );
    const cancelled = bookingRow(result.rows[0]);
    const title = "Booking cancelled";
    const message = `${cancelled.title} was cancelled by ${req.user.name}. Reason: ${reason}`;
    await client.query(
      `INSERT INTO notifications (user_id, type, title, message, booking_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [cancelled.requesterId, "cancelled", title, message, cancelled.id]
    );
    emailNotice = { userId: cancelled.requesterId, title, message };
    await client.query("COMMIT");
    if (emailNotice) queueMailToUser(emailNotice.userId, emailNotice.title, emailNotice.message);
    res.json(cancelled);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}));

app.patch("/api/bookings/:id/status", requireManager, asyncRoute(async (req, res) => {
  if (!["pending", "approved"].includes(req.body.status)) return res.status(400).json({ message: "Invalid booking status." });
  const result = await pool.query("UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *", [req.body.status, req.params.id]);
  res.json(bookingRow(result.rows[0]));
}));

app.delete("/api/bookings/:id", requireManager, asyncRoute(async (req, res) => {
  const existing = await pool.query("SELECT requester_id FROM bookings WHERE id = $1", [req.params.id]);
  if (!existing.rows[0]) return res.status(404).json({ message: "Booking not found." });
  await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
  res.json({ ok: true });
}));

app.use("/assets", express.static(path.join(__dirname, "assets"), { dotfiles: "deny", fallthrough: false }));
app.get(["/app.js", "/styles.css", "/sw.js", "/manifest.json", "/version.json"], (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});
app.get(["/", "/index.html", "/room-display"], async (_req, res) => {
  res.type("html").send(await readFile(path.join(__dirname, "index.html"), "utf8"));
});
app.get("*", (_req, res) => res.status(404).type("text").send("Not found."));

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "23505") return res.status(409).json({ message: "A record with one of those values already exists." });
  if (error.code === "23503") return res.status(409).json({ message: "This record is still in use and cannot be deleted." });
  res.status(500).json({ message: "Server error." });
});

await migrateSecurity();

app.listen(PORT, () => {
  console.log(`AtoZ Meeting Room Booking running at http://127.0.0.1:${PORT}`);
  console.log(`Email notifications ${emailStatusMessage()}`);
});
