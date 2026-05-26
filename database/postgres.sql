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
  role TEXT NOT NULL CHECK (role IN ('administrator', 'manager', 'user')),
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
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  attendees INTEGER NOT NULL CHECK (attendees > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'cancelled')) DEFAULT 'approved',
  purpose TEXT,
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

INSERT INTO departments (id, name, code) VALUES
  (1, 'Administration', 'ADM'),
  (2, 'Human Resources', 'HR'),
  (3, 'Finance', 'FIN'),
  (4, 'Engineering', 'ENG'),
  (5, 'Sales', 'SAL'),
  (6, 'Information Technology', 'IT')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, username, email, password, role, department_id, is_active) VALUES
  (1, 'Admin Manager', 'admin', 'admin@company.test', 'admin123', 'administrator', 1, TRUE),
  (2, 'Operations Manager', 'manager', 'manager@company.test', 'manager123', 'manager', 1, TRUE),
  (3, 'Aye Aye', 'aye', 'aye@company.test', 'user123', 'user', 2, TRUE),
  (4, 'Min Thu', 'min', 'min@company.test', 'user123', 'user', 4, TRUE),
  (5, 'IT Department', 'it', 'it@atoz.com.mm', 'user123', 'user', 6, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, name, floor, capacity, equipment, is_active) VALUES
  (1, 'Board Room', 'Level 8', 18, 'TV, Video Conference, Whiteboard', TRUE),
  (2, 'Focus Room', 'Level 6', 6, 'Whiteboard, Speaker', TRUE),
  (3, 'Training Hall', 'Level 4', 40, 'Projector, Microphone, Stage', TRUE),
  (4, '4th Floor Meeting Room', 'Level 4', 15, 'TV, Whiteboard', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, title, room_id, requester_id, department_id, start_time, end_time, attendees, status, purpose) VALUES
  (1, 'Weekly Leadership Sync', 1, 2, 1, CURRENT_DATE + TIME '09:00', CURRENT_DATE + TIME '10:00', 10, 'approved', 'Weekly priorities and blockers.'),
  (2, 'Hiring Interview', 2, 3, 2, CURRENT_DATE + TIME '13:30', CURRENT_DATE + TIME '14:30', 4, 'pending', 'Candidate panel interview.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('rooms_id_seq', (SELECT MAX(id) FROM rooms));
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));
