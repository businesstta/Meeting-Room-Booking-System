CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('administrator', 'manager', 'user')),
  department_id INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  equipment TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  room_id INTEGER NOT NULL,
  requester_id INTEGER NOT NULL,
  department_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  attendees INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'cancelled')),
  purpose TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id),
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE INDEX idx_bookings_room_time ON bookings(room_id, start_time, end_time);
CREATE INDEX idx_bookings_department ON bookings(department_id);
CREATE INDEX idx_users_department ON users(department_id);

INSERT INTO departments (id, name, code) VALUES
  (1, 'Administration', 'ADM'),
  (2, 'Human Resources', 'HR'),
  (3, 'Finance', 'FIN'),
  (4, 'Engineering', 'ENG'),
  (5, 'Sales', 'SAL');

INSERT INTO users (id, name, username, email, password, role, department_id) VALUES
  (1, 'Admin Manager', 'admin', 'admin@company.test', 'admin123', 'administrator', 1),
  (2, 'Operations Manager', 'manager', 'manager@company.test', 'manager123', 'manager', 1),
  (3, 'Aye Aye', 'aye', 'aye@company.test', 'user123', 'user', 2),
  (4, 'Min Thu', 'min', 'min@company.test', 'user123', 'user', 4);

INSERT INTO rooms (id, name, floor, capacity, equipment) VALUES
  (1, 'Board Room', 'Level 8', 18, 'TV, Video Conference, Whiteboard'),
  (2, 'Focus Room', 'Level 6', 6, 'Whiteboard, Speaker'),
  (3, 'Training Hall', 'Level 4', 40, 'Projector, Microphone, Stage');
