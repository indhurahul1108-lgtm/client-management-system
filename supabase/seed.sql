-- ============================================================
--  DUMMY DATA — Run AFTER schema.sql
--  This inserts demo users, attendance, leave, works etc.
-- ============================================================

-- NOTE: Passwords stored as plain text here for demo.
-- In production, use bcrypt hash. The app will check via API.

-- ── ADMIN ────────────────────────────────────────────────────
INSERT INTO users (id, mobile, password_hash, role, name, photo, address, status, join_date, salary)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '9000000001', 'admin123', 'admin',
  'Arjun Kumar',
  'https://ui-avatars.com/api/?name=Arjun+Kumar&background=3b82f6&color=fff&size=128',
  'Chennai, Tamil Nadu', 'active', '2024-01-01', 0
) ON CONFLICT (mobile) DO NOTHING;

-- ── MANAGERS ─────────────────────────────────────────────────
INSERT INTO users (id, mobile, password_hash, role, name, photo, address, status, join_date, manager_id, department, designation, salary)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  '9000000002', 'manager123', 'manager',
  'Priya Nair',
  'https://ui-avatars.com/api/?name=Priya+Nair&background=7c3aed&color=fff&size=128',
  'Anna Nagar, Chennai', 'active', '2024-03-15', 'm001', 'Accounts', 'Senior Manager', 65000
),
(
  'b0000000-0000-0000-0000-000000000002',
  '9000000003', 'manager123', 'manager',
  'Karthik Raja',
  'https://ui-avatars.com/api/?name=Karthik+Raja&background=7c3aed&color=fff&size=128',
  'Adyar, Chennai', 'active', '2024-04-01', 'm002', 'Operations', 'Manager', 60000
) ON CONFLICT (mobile) DO NOTHING;

-- ── STAFF ────────────────────────────────────────────────────
INSERT INTO users (id, mobile, password_hash, role, name, photo, address, status, join_date, staff_id, manager_id, department, designation, salary)
VALUES
('c0000000-0000-0000-0000-000000000001','9000000004','staff123','staff','Anitha Devi','https://ui-avatars.com/api/?name=Anitha+Devi&background=16a34a&color=fff&size=128','Tambaram, Chennai','active','2024-06-01','s001','m001','Accounts','Senior Accountant',35000),
('c0000000-0000-0000-0000-000000000002','9000000005','staff123','staff','Murugan P','https://ui-avatars.com/api/?name=Murugan+P&background=16a34a&color=fff&size=128','Vadapalani, Chennai','active','2024-06-15','s002','m001','Accounts','Accountant',30000),
('c0000000-0000-0000-0000-000000000003','9000000006','staff123','staff','Deepa S','https://ui-avatars.com/api/?name=Deepa+S&background=16a34a&color=fff&size=128','T.Nagar, Chennai','active','2024-07-01','s003','m001','Accounts','Junior Accountant',28000),
('c0000000-0000-0000-0000-000000000004','9000000007','staff123','staff','Ravi Kumar','https://ui-avatars.com/api/?name=Ravi+Kumar&background=16a34a&color=fff&size=128','Velachery, Chennai','active','2024-07-15','s004','m001','Audit','Audit Assistant',27000),
('c0000000-0000-0000-0000-000000000005','9000000008','staff123','staff','Lavanya M','https://ui-avatars.com/api/?name=Lavanya+M&background=16a34a&color=fff&size=128','Porur, Chennai','active','2024-08-01','s005','m001','Tax','Tax Executive',29000),
('c0000000-0000-0000-0000-000000000006','9000000009','staff123','staff','Vijay S','https://ui-avatars.com/api/?name=Vijay+S&background=16a34a&color=fff&size=128','Guindy, Chennai','active','2024-08-15','s006','m002','Operations','Operations Staff',28000),
('c0000000-0000-0000-0000-000000000007','9000000010','staff123','staff','Senthil K','https://ui-avatars.com/api/?name=Senthil+K&background=16a34a&color=fff&size=128','Perambur, Chennai','inactive','2024-09-01','s007','m002','Operations','Operations Staff',27000),
('c0000000-0000-0000-0000-000000000008','9000000011','staff123','staff','Bala Murugan','https://ui-avatars.com/api/?name=Bala+Murugan&background=16a34a&color=fff&size=128','Royapuram, Chennai','active','2024-09-15','s008','m002','Accounts','Accountant',30000),
('c0000000-0000-0000-0000-000000000009','9000000012','staff123','staff','Kavitha R','https://ui-avatars.com/api/?name=Kavitha+R&background=16a34a&color=fff&size=128','Kodambakkam, Chennai','active','2024-10-01','s009','m002','Tax','Tax Assistant',26000),
('c0000000-0000-0000-0000-000000000010','9000000013','staff123','staff','Sundaram V','https://ui-avatars.com/api/?name=Sundaram+V&background=16a34a&color=fff&size=128','Mylapore, Chennai','active','2024-10-15','s010','m002','Audit','Audit Staff',27000)
ON CONFLICT (mobile) DO NOTHING;

-- ── CLIENTS ──────────────────────────────────────────────────
INSERT INTO users (id, mobile, password_hash, role, name, photo, address, status, join_date, client_id, assigned_staff_id, assigned_manager_id, service)
VALUES
('d0000000-0000-0000-0000-000000000001','9100000001','client123','client','Sri Tech Solutions','https://ui-avatars.com/api/?name=Sri+Tech&background=f97316&color=fff&size=128','Guindy Industrial Estate, Chennai','active','2025-01-10','c001','s001','m001','GST Filing & Annual Audit'),
('d0000000-0000-0000-0000-000000000002','9100000002','client123','client','Global Traders Pvt Ltd','https://ui-avatars.com/api/?name=Global+Traders&background=f97316&color=fff&size=128','Koyambedu, Chennai','active','2025-02-15','c002','s002','m001','TDS Return & Tax Planning'),
('d0000000-0000-0000-0000-000000000003','9100000003','client123','client','Prime Builders','https://ui-avatars.com/api/?name=Prime+Builders&background=f97316&color=fff&size=128','Sholinganallur, Chennai','active','2025-03-01','c003','s003','m001','Income Tax Filing'),
('d0000000-0000-0000-0000-000000000004','9100000004','client123','client','Sunrise Exports','https://ui-avatars.com/api/?name=Sunrise+Exports&background=f97316&color=fff&size=128','Manali, Chennai','active','2025-03-20','c004','s004','m001','Export Documentation & GST'),
('d0000000-0000-0000-0000-000000000005','9100000005','client123','client','Delta Logistics','https://ui-avatars.com/api/?name=Delta+Logistics&background=f97316&color=fff&size=128','Poonamallee, Chennai','active','2025-04-05','c005','s005','m001','Monthly Accounting & Reports'),
('d0000000-0000-0000-0000-000000000006','9100000006','client123','client','Heritage Hotels','https://ui-avatars.com/api/?name=Heritage+Hotels&background=f97316&color=fff&size=128','Anna Salai, Chennai','active','2025-04-20','c006','s006','m002','GST & Payroll Management'),
('d0000000-0000-0000-0000-000000000007','9100000007','client123','client','Lakshmi Textiles','https://ui-avatars.com/api/?name=Lakshmi+Textiles&background=f97316&color=fff&size=128','Erode','active','2025-05-10','c007','s007','m002','Annual Audit & Tax'),
('d0000000-0000-0000-0000-000000000008','9100000008','client123','client','Green Fields Agro','https://ui-avatars.com/api/?name=Green+Fields&background=f97316&color=fff&size=128','Madurai','active','2025-06-01','c008','s008','m002','Accounts & Compliance'),
('d0000000-0000-0000-0000-000000000009','9100000009','client123','client','Coastal Fisheries','https://ui-avatars.com/api/?name=Coastal+Fisheries&background=f97316&color=fff&size=128','Thoothukudi','active','2025-07-15','c009','s009','m002','GST Registration & Filing'),
('d0000000-0000-0000-0000-000000000010','9100000010','client123','client','Royal Constructions','https://ui-avatars.com/api/?name=Royal+Constructions&background=f97316&color=fff&size=128','Coimbatore','active','2025-08-01','c010','s010','m002','Project Accounting & Tax')
ON CONFLICT (mobile) DO NOTHING;

-- ── ATTENDANCE (Sample — last 3 months) ──────────────────────
-- Staff s001 (Anitha Devi) — Oct 2026
INSERT INTO attendance (user_id, staff_name, date, punch_in, punch_out, status, late_minutes, location_name)
VALUES
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-10-08','10:05:00','18:02:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-10-07','10:08:00','17:45:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-10-06','10:30:00','17:00:00','late',20,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-10-03','10:00:00','18:00:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-10-02','10:12:00','17:30:00','late',2,'Chennai, Tamil Nadu'),
-- Sep 2026
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-09-30','09:58:00','18:05:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-09-29','10:45:00','16:30:00','late',35,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-09-28','10:05:00','18:00:00','present',0,'Chennai, Tamil Nadu'),
-- Aug 2026
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-08-31','10:00:00','18:00:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','2026-08-29',NULL,NULL,'absent',0,NULL)
ON CONFLICT (user_id, date) DO NOTHING;

-- Staff s002 (Murugan P)
INSERT INTO attendance (user_id, staff_name, date, punch_in, punch_out, status, late_minutes, location_name)
VALUES
('c0000000-0000-0000-0000-000000000002','Murugan P','2026-10-08','10:25:00','17:30:00','late',15,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000002','Murugan P','2026-10-07','10:05:00','18:00:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000002','Murugan P','2026-10-06',NULL,NULL,'absent',0,NULL),
('c0000000-0000-0000-0000-000000000002','Murugan P','2026-09-30','11:00:00','17:00:00','late',50,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000002','Murugan P','2026-09-29','10:00:00','18:00:00','present',0,'Chennai, Tamil Nadu')
ON CONFLICT (user_id, date) DO NOTHING;

-- Staff s006 (Vijay S — late pattern)
INSERT INTO attendance (user_id, staff_name, date, punch_in, punch_out, status, late_minutes, location_name)
VALUES
('c0000000-0000-0000-0000-000000000006','Vijay S','2026-10-08','10:35:00','17:00:00','late',25,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000006','Vijay S','2026-10-07','10:00:00','18:00:00','present',0,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000006','Vijay S','2026-09-30','11:10:00','17:30:00','late',60,'Chennai, Tamil Nadu'),
('c0000000-0000-0000-0000-000000000006','Vijay S','2026-09-29','10:05:00','18:00:00','present',0,'Chennai, Tamil Nadu')
ON CONFLICT (user_id, date) DO NOTHING;

-- ── LEAVES ───────────────────────────────────────────────────
INSERT INTO leaves (user_id, staff_name, leave_type, from_date, to_date, reason, status, applied_on)
VALUES
('c0000000-0000-0000-0000-000000000002','Murugan P','Sick Leave','2026-10-10','2026-10-11','Fever and cold. Doctor advised rest.','pending','2026-10-07'),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','Annual Leave','2026-10-20','2026-10-23','Family function in hometown.','approved','2026-10-01'),
('c0000000-0000-0000-0000-000000000003','Deepa S','Casual Leave','2026-09-20','2026-09-21','Personal work.','approved','2026-09-18'),
('c0000000-0000-0000-0000-000000000004','Ravi Kumar','Sick Leave','2026-09-15','2026-09-15','Not feeling well.','approved','2026-09-14'),
('c0000000-0000-0000-0000-000000000005','Lavanya M','Casual Leave','2026-10-25','2026-10-25','Personal errand.','pending','2026-10-06'),
('c0000000-0000-0000-0000-000000000006','Vijay S','Emergency Leave','2026-09-10','2026-09-11','Family emergency.','rejected','2026-09-09'),
('c0000000-0000-0000-0000-000000000008','Bala Murugan','Annual Leave','2026-08-01','2026-08-05','Vacation.','approved','2026-07-25');

-- ── SALARIES ─────────────────────────────────────────────────
INSERT INTO salaries (user_id, staff_name, month, basic, allowance, deduction, status, paid_on)
VALUES
('c0000000-0000-0000-0000-000000000001','Anitha Devi','October 2026',35000,5000,2000,'pending',NULL),
('c0000000-0000-0000-0000-000000000001','Anitha Devi','September 2026',35000,5000,1500,'paid','2026-09-30'),
('c0000000-0000-0000-0000-000000000002','Murugan P','October 2026',30000,4000,1500,'pending',NULL),
('c0000000-0000-0000-0000-000000000002','Murugan P','September 2026',30000,4000,2000,'paid','2026-09-30'),
('c0000000-0000-0000-0000-000000000003','Deepa S','October 2026',28000,3500,1000,'paid','2026-10-01'),
('c0000000-0000-0000-0000-000000000004','Ravi Kumar','October 2026',27000,3000,1000,'pending',NULL),
('c0000000-0000-0000-0000-000000000005','Lavanya M','October 2026',29000,4000,1500,'paid','2026-10-01'),
('c0000000-0000-0000-0000-000000000006','Vijay S','October 2026',28000,3500,1500,'pending',NULL),
('c0000000-0000-0000-0000-000000000008','Bala Murugan','October 2026',30000,4000,1000,'pending',NULL);

-- ── WORKS ─────────────────────────────────────────────────────
INSERT INTO works (work_id, title, description, client_id, client_uuid, staff_id, staff_uuid, manager_id, manager_uuid, staff_name, manager_name, start_date, due_date, status, priority, progress)
VALUES
('WRK-001','GST Q2 Filing 2026','Quarterly GST return filing for Q2 (Jul-Sep 2026) including GSTR-1 and GSTR-3B','c001','d0000000-0000-0000-0000-000000000001','s001','c0000000-0000-0000-0000-000000000001','m001','b0000000-0000-0000-0000-000000000001','Anitha Devi','Priya Nair','2026-09-01','2026-10-05','overdue','high',65),
('WRK-002','Annual Audit FY 2025-26','Complete statutory audit for financial year 2025-26','c001','d0000000-0000-0000-0000-000000000001','s001','c0000000-0000-0000-0000-000000000001','m001','b0000000-0000-0000-0000-000000000001','Anitha Devi','Priya Nair','2026-08-01','2026-11-30','in_progress','high',40),
('WRK-003','TDS Return Q2 2026','TDS return filing for Q2 with Form 26Q preparation','c002','d0000000-0000-0000-0000-000000000002','s002','c0000000-0000-0000-0000-000000000002','m001','b0000000-0000-0000-0000-000000000001','Murugan P','Priya Nair','2026-09-01','2026-10-07','overdue','high',80),
('WRK-004','Income Tax Filing FY 25-26','ITR-1 filing for company directors and individual assessment','c003','d0000000-0000-0000-0000-000000000003','s003','c0000000-0000-0000-0000-000000000003','m001','b0000000-0000-0000-0000-000000000001','Deepa S','Priya Nair','2026-09-15','2026-11-15','in_progress','medium',50),
('WRK-005','Export Documentation Review','Review and preparation of export documentation for compliance','c004','d0000000-0000-0000-0000-000000000004','s004','c0000000-0000-0000-0000-000000000004','m001','b0000000-0000-0000-0000-000000000001','Ravi Kumar','Priya Nair','2026-10-01','2026-10-09','in_progress','medium',30),
('WRK-006','Monthly Accounting Oct 2026','Monthly bookkeeping, bank reconciliation and P&L preparation','c005','d0000000-0000-0000-0000-000000000005','s005','c0000000-0000-0000-0000-000000000005','m001','b0000000-0000-0000-0000-000000000001','Lavanya M','Priya Nair','2026-10-01','2026-10-31','pending','low',0),
('WRK-007','GST Registration — Heritage','New GST registration and setup for Heritage Hotels','c006','d0000000-0000-0000-0000-000000000006','s006','c0000000-0000-0000-0000-000000000006','m002','b0000000-0000-0000-0000-000000000002','Vijay S','Karthik Raja','2026-09-01','2026-09-30','completed','medium',100),
('WRK-008','Annual Audit — Lakshmi Textiles','Statutory audit and tax planning for Lakshmi Textiles','c007','d0000000-0000-0000-0000-000000000007','s007','c0000000-0000-0000-0000-000000000007','m002','b0000000-0000-0000-0000-000000000002','Senthil K','Karthik Raja','2026-08-01','2026-10-01','overdue','high',55),
('WRK-009','Compliance Report — Green Fields','Quarterly compliance report and accounts finalization','c008','d0000000-0000-0000-0000-000000000008','s008','c0000000-0000-0000-0000-000000000008','m002','b0000000-0000-0000-0000-000000000002','Bala Murugan','Karthik Raja','2026-10-01','2026-10-25','pending','medium',0),
('WRK-010','GST Filing — Coastal Fisheries','GST registration, GSTR-1 and return filing','c009','d0000000-0000-0000-0000-000000000009','s009','c0000000-0000-0000-0000-000000000009','m002','b0000000-0000-0000-0000-000000000002','Kavitha R','Karthik Raja','2026-09-15','2026-10-15','in_progress','high',70);

-- ── WORK NOTES ────────────────────────────────────────────────
INSERT INTO work_notes (work_id, note)
SELECT id, 'Work started. Initial documents received.' FROM works WHERE work_id='WRK-001';
INSERT INTO work_notes (work_id, note)
SELECT id, 'GSTR-1 data compiled. Awaiting client confirmation.' FROM works WHERE work_id='WRK-001';
INSERT INTO work_notes (work_id, note)
SELECT id, 'Due date passed. Follow-up sent to client.' FROM works WHERE work_id='WRK-001';

INSERT INTO work_notes (work_id, note)
SELECT id, 'Audit planning started. Books received.' FROM works WHERE work_id='WRK-002';
INSERT INTO work_notes (work_id, note)
SELECT id, 'Preliminary review completed. 40% done.' FROM works WHERE work_id='WRK-002';

INSERT INTO work_notes (work_id, note)
SELECT id, 'GST registration approved successfully!' FROM works WHERE work_id='WRK-007';
INSERT INTO work_notes (work_id, note)
SELECT id, 'First return filed. Client trained on process.' FROM works WHERE work_id='WRK-007';

-- ── NOTIFICATIONS ─────────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, type, icon, is_read)
VALUES
-- Admin notifications
('a0000000-0000-0000-0000-000000000001','Leave Request — Murugan P','Sick Leave requested for Oct 10-11. Pending approval.','leave','📋',false),
('a0000000-0000-0000-0000-000000000001','⚠️ Work Overdue — GST Filing','Sri Tech GST Filing is 3 days overdue.','overdue','⚠️',false),
('a0000000-0000-0000-0000-000000000001','Staff Late — Vijay S','Vijay S punched in at 10:35 AM (25 mins late).','attend','🕐',false),
('a0000000-0000-0000-0000-000000000001','New Client Registered','Delta Logistics added as new client.','client','🏢',true),
-- Staff notifications
('c0000000-0000-0000-0000-000000000001','New Work Assigned','Income Tax Filing assigned to you.','work','📌',false),
('c0000000-0000-0000-0000-000000000001','Leave Approved ✅','Annual Leave Oct 20-23 approved.','leave','✅',false),
-- Client notifications
('d0000000-0000-0000-0000-000000000001','Work Status Updated','GST Q2 Filing status updated to Overdue.','work','⚠️',false),
('d0000000-0000-0000-0000-000000000001','Annual Audit Started','Your annual audit has been started.','work','📋',true);
