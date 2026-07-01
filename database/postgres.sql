CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  equipment TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester_name TEXT,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  attendees INTEGER NOT NULL CHECK (attendees > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'cancelled')) DEFAULT 'approved',
  purpose TEXT,
  cancelled_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  cancel_reason TEXT,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_time ON bookings(room_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_department ON bookings(department_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  module_permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (id = 1)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at, created_at);

INSERT INTO app_settings (id, module_permissions, custom_roles) VALUES
  (1, '{"administrator":["dashboard","bookings","calendar","notifications","rooms","users","departments","cancel-bookings","module-permissions","role-setup","change-password","settings"],"manager":["dashboard","bookings","calendar","notifications","rooms","users","departments","cancel-bookings","change-password","settings"],"user":["dashboard","bookings","calendar","notifications","change-password","settings"]}'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO departments (id, name, code) VALUES
  (1, 'Administration', 'ADM'),
  (2, 'Human Resources', 'HR'),
  (3, 'Finance', 'FIN'),
  (4, 'Engineering', 'ENG'),
  (5, 'Sales', 'SAL'),
  (6, 'Information Technology', 'IT')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, name, floor, capacity, equipment, is_active) VALUES
  (1, 'Board Room', 'Level 8', 18, 'TV, Video Conference, Whiteboard', TRUE),
  (2, 'Focus Room', 'Level 6', 6, 'Whiteboard, Speaker', TRUE),
  (3, 'Training Hall', 'Level 4', 40, 'Projector, Microphone, Stage', TRUE),
  (4, '4th Floor Meeting Room', 'Level 4', 15, 'TV, Whiteboard', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));
