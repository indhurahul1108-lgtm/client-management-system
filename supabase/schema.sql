-- ============================================================
--  CLIENT MANAGEMENT SYSTEM — SUPABASE SQL SETUP
--  Run this in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- ── 1. USERS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mobile        VARCHAR(15) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,          -- store bcrypt hash
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin','manager','staff','client')),
  name          VARCHAR(100) NOT NULL,
  photo         TEXT,
  address       TEXT,
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive')),
  join_date     DATE DEFAULT CURRENT_DATE,
  -- role-specific IDs
  staff_id      VARCHAR(20) UNIQUE,
  client_id     VARCHAR(20) UNIQUE,
  manager_id    VARCHAR(20),
  -- assignments
  assigned_staff_id   VARCHAR(20),  -- for clients
  assigned_manager_id VARCHAR(20),  -- for staff/clients
  -- extra
  department    VARCHAR(100),
  designation   VARCHAR(100),
  salary        NUMERIC(12,2),
  service       VARCHAR(200),       -- for clients: type of service
  mobile_alt    VARCHAR(15),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ── 2. ATTENDANCE TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  staff_name      VARCHAR(100),
  date            DATE NOT NULL,
  punch_in        TIME,
  punch_out       TIME,
  punch_in_photo  TEXT,             -- URL / base64
  punch_out_photo TEXT,
  punch_in_lat    DOUBLE PRECISION,
  punch_in_lng    DOUBLE PRECISION,
  punch_out_lat   DOUBLE PRECISION,
  punch_out_lng   DOUBLE PRECISION,
  location_name   TEXT,
  status          VARCHAR(20) DEFAULT 'absent' CHECK (status IN ('present','late','absent','leave','half_day')),
  late_minutes    INTEGER DEFAULT 0,
  note            TEXT,             -- admin correction note
  corrected_by    UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ── 3. LEAVES TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaves (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  staff_name   VARCHAR(100),
  leave_type   VARCHAR(50) NOT NULL,
  from_date    DATE NOT NULL,
  to_date      DATE NOT NULL,
  reason       TEXT,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  approved_by  UUID REFERENCES users(id),
  approved_at  TIMESTAMPTZ,
  reject_reason TEXT,
  applied_on   DATE DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── 4. SALARIES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS salaries (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  staff_name   VARCHAR(100),
  month        VARCHAR(20),          -- e.g. "October 2026"
  basic        NUMERIC(12,2) DEFAULT 0,
  allowance    NUMERIC(12,2) DEFAULT 0,
  deduction    NUMERIC(12,2) DEFAULT 0,
  net_salary   NUMERIC(12,2) GENERATED ALWAYS AS (basic + allowance - deduction) STORED,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid')),
  paid_on      DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── 5. WORKS TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS works (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id       VARCHAR(20) UNIQUE,       -- e.g. WRK-001
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  client_id     VARCHAR(20),              -- references users.client_id
  client_uuid   UUID REFERENCES users(id),
  staff_id      VARCHAR(20),              -- references users.staff_id
  staff_uuid    UUID REFERENCES users(id),
  manager_id    VARCHAR(20),
  manager_uuid  UUID REFERENCES users(id),
  staff_name    VARCHAR(100),
  manager_name  VARCHAR(100),
  start_date    DATE,
  due_date      DATE NOT NULL,
  status        VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','overdue','on_hold','cancelled')),
  priority      VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  progress      INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  last_updated  DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── 6. WORK NOTES TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS work_notes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id    UUID REFERENCES works(id) ON DELETE CASCADE,
  added_by   UUID REFERENCES users(id),
  note       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 7. CLIENT REQUESTS TABLE ───────────────────────────────
CREATE TABLE IF NOT EXISTS client_requests (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_uuid  UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id    VARCHAR(20),
  request_type VARCHAR(100),
  reason       TEXT,
  from_date    DATE,
  to_date      DATE,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  response     TEXT,
  responded_by UUID REFERENCES users(id),
  applied_on   DATE DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── 8. NOTIFICATIONS TABLE ─────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  message      TEXT,
  type         VARCHAR(50),          -- leave, work, attend, system, client
  is_read      BOOLEAN DEFAULT false,
  icon         VARCHAR(10),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── 9. MESSAGES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_uuid   UUID REFERENCES works(id) ON DELETE CASCADE,
  sender_id   UUID REFERENCES users(id),
  sender_role VARCHAR(20),
  sender_name VARCHAR(100),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 10. DOCUMENTS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_uuid UUID REFERENCES users(id),
  work_uuid   UUID REFERENCES works(id),
  name        VARCHAR(200) NOT NULL,
  type        VARCHAR(50),           -- invoice, agreement, report, certificate
  file_url    TEXT,                  -- Supabase Storage URL
  file_size   VARCHAR(30),
  icon        VARCHAR(10),
  uploaded_by UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 11. AUDIT LOGS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  user_name   VARCHAR(100),
  action      VARCHAR(100) NOT NULL,
  module      VARCHAR(50),
  description TEXT,
  ip_address  VARCHAR(50),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 12. SYSTEM SETTINGS TABLE ──────────────────────────────
CREATE TABLE IF NOT EXISTS system_settings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key           VARCHAR(100) UNIQUE NOT NULL,
  value         TEXT,
  updated_by    UUID REFERENCES users(id),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Default settings
INSERT INTO system_settings (key, value) VALUES
  ('shift_start',        '10:00'),
  ('grace_minutes',      '10'),
  ('company_name',       'Your Company Name'),
  ('company_address',    'Your Company Address'),
  ('office_lat',         '13.0827'),
  ('office_lng',         '80.2707'),
  ('allowed_radius_km',  '0.5'),
  ('office_start_time',  '09:00'),
  ('office_end_time',    '18:00'),
  ('late_after_time',    '10:10')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
--  ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance      ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves          ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE works           ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- NOTE: We use a custom auth approach (mobile + password in users table)
-- with JWT custom claims. For now, use service_role key from backend API.
-- Frontend uses anon key with RLS policies based on user metadata.

-- ============================================================
--  INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date       ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_leaves_user           ON leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status         ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_works_client          ON works(client_uuid);
CREATE INDEX IF NOT EXISTS idx_works_staff           ON works(staff_uuid);
CREATE INDEX IF NOT EXISTS idx_works_status          ON works(status);
CREATE INDEX IF NOT EXISTS idx_works_due_date        ON works(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_work         ON messages(work_uuid);
CREATE INDEX IF NOT EXISTS idx_documents_client      ON documents(client_uuid);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created    ON audit_logs(created_at DESC);
