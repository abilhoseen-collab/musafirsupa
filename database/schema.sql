-- ======================================
-- এয়ার ট্রাভেল এজেন্সি ম্যানেজমেন্ট সিস্টেম
-- ডাটাবেস স্কিমা - সম্পূর্ণ
-- ======================================

-- ========================================
-- 1. ব্যবহারকারী ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  status VARCHAR(50) DEFAULT 'active',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. এয়ারলাইন্স এবং দেশ
-- ========================================
CREATE TABLE IF NOT EXISTS airlines (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10) UNIQUE,
  country VARCHAR(100),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(10) UNIQUE,
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. টিকেট ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY,
  airline_id UUID REFERENCES airlines(id) ON DELETE CASCADE,
  destination_country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  route VARCHAR(255),
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 4. গ্রাহক ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  address TEXT,
  city VARCHAR(100),
  nid VARCHAR(50),
  passport_number VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 5. টিকেট বিক্রয়
-- ========================================
CREATE TABLE IF NOT EXISTS ticket_sales (
  id UUID PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_sold DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) DEFAULT 0,
  sold_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 6. বুকিং ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  ticket_sale_id UUID NOT NULL REFERENCES ticket_sales(id) ON DELETE CASCADE,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  departure_date DATE,
  return_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  seat_number VARCHAR(10),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 7. পেমেন্ট ট্র্যাকিং
-- ========================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_banking')),
  reference_number VARCHAR(100),
  transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 8. ওমরাহ গ্রুপ ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS umrah_groups (
  id UUID PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  group_size INTEGER NOT NULL CHECK (group_size > 0),
  total_budget DECIMAL(12, 2),
  coordinator_name VARCHAR(255),
  coordinator_phone VARCHAR(20),
  coordinator_email VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 9. ওমরাহ যাত্রী তথ্য
-- ========================================
CREATE TABLE IF NOT EXISTS umrah_pilgrims (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES umrah_groups(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  passport_number VARCHAR(50) UNIQUE NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  nationality VARCHAR(100),
  emergency_contact VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  cost_per_person DECIMAL(10, 2),
  health_issues TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 10. ওমরাহ খরচ ব্যবস্থাপনা
-- ========================================
CREATE TABLE IF NOT EXISTS umrah_expenses (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES umrah_groups(id) ON DELETE CASCADE,
  expense_type VARCHAR(100) CHECK (expense_type IN ('hotel', 'transport', 'guide', 'meals', 'visa', 'insurance', 'utilities', 'other')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) DEFAULT 'BDT',
  description TEXT,
  vendor_name VARCHAR(255),
  invoice_number VARCHAR(100),
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 11. ওমরাহ ট্রান্সপোর্ট পরিকল্পনা
-- ========================================
CREATE TABLE IF NOT EXISTS umrah_transport (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES umrah_groups(id) ON DELETE CASCADE,
  transport_type VARCHAR(100) CHECK (transport_type IN ('bus', 'flight', 'train', 'car')),
  vehicle_number VARCHAR(50),
  driver_name VARCHAR(255),
  driver_phone VARCHAR(20),
  departure_location VARCHAR(255),
  destination_location VARCHAR(255),
  departure_date_time TIMESTAMP,
  arrival_date_time TIMESTAMP,
  cost_per_person DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 12. ওমরাহ হোটেল বুকিং
-- ========================================
CREATE TABLE IF NOT EXISTS umrah_hotels (
  id UUID PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES umrah_groups(id) ON DELETE CASCADE,
  hotel_name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  check_in_date DATE,
  check_out_date DATE,
  rooms_count INTEGER CHECK (rooms_count > 0),
  cost_per_room DECIMAL(10, 2),
  total_cost DECIMAL(12, 2),
  contact_person VARCHAR(255),
  contact_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 13. দৈনিক ডেটা ব্যাকআপ লগ
-- ========================================
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID PRIMARY KEY,
  backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  backup_type VARCHAR(50),
  status VARCHAR(50),
  file_path VARCHAR(500),
  file_size_mb DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ইনডেক্স তৈরি করুন (পারফরম্যান্সের জন্য)
-- ========================================

-- ব্যবহারকারী ইনডেক্স
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- টিকেট ইনডেক্স
CREATE INDEX idx_tickets_airline ON tickets(airline_id);
CREATE INDEX idx_tickets_country ON tickets(destination_country_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- গ্রাহক ইনডেক্স
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_passport ON customers(passport_number);

-- টিকেট বিক্রয় ইনডেক্স
CREATE INDEX idx_ticket_sales_customer ON ticket_sales(customer_id);
CREATE INDEX idx_ticket_sales_ticket ON ticket_sales(ticket_id);
CREATE INDEX idx_ticket_sales_created_at ON ticket_sales(created_at);

-- বুকিং ইনডেক্স
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_departure_date ON bookings(departure_date);

-- পেমেন্ট ইনডেক্স
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_status ON payments(status);

-- ওমরাহ ইনডেক্স
CREATE INDEX idx_umrah_groups_created ON umrah_groups(created_at);
CREATE INDEX idx_umrah_groups_status ON umrah_groups(status);
CREATE INDEX idx_umrah_pilgrims_group ON umrah_pilgrims(group_id);
CREATE INDEX idx_umrah_pilgrims_passport ON umrah_pilgrims(passport_number);
CREATE INDEX idx_umrah_expenses_group ON umrah_expenses(group_id);
CREATE INDEX idx_umrah_transport_group ON umrah_transport(group_id);
CREATE INDEX idx_umrah_hotels_group ON umrah_hotels(group_id);

-- ========================================
-- স্যাম্পল ডেটা ইনসার্ট করুন (প্রথম সেটআপের জন্য)
-- ========================================

-- Admin ব্যবহারকারী (পাসওয়ার্ড: password123)
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye7FVqJN3WG5W7MCKWlvYlFUGLYWD5k/C', 'admin', '01700000001')
ON CONFLICT (email) DO NOTHING;

-- এয়ারলাইন্স
INSERT INTO airlines (id, name, code, country) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'বাংলাদেশ এয়ারওয়েজ', 'BD', 'Bangladesh'),
('a50e8400-e29b-41d4-a716-446655440002', 'সৌদি আরেবিয়ান এয়ারওয়েজ', 'SV', 'Saudi Arabia'),
('a50e8400-e29b-41d4-a716-446655440003', 'এমিরেটস', 'EK', 'UAE')
ON CONFLICT (name) DO NOTHING;

-- দেশসমূহ
INSERT INTO countries (id, name, code, region) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'সৌদি আরব', 'SA', 'Middle East'),
('c50e8400-e29b-41d4-a716-446655440002', 'সংযুক্ত আরব আমিরাত', 'AE', 'Middle East'),
('c50e8400-e29b-41d4-a716-446655440003', 'মালয়েশিয়া', 'MY', 'Southeast Asia')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- ভিউ তৈরি করুন (দ্রুত রিপোর্টিংের জন্য)
-- ========================================

CREATE OR REPLACE VIEW vw_daily_sales AS
SELECT
  DATE(ts.created_at) as sale_date,
  COUNT(*) as total_transactions,
  SUM(ts.total_amount) as total_revenue,
  AVG(ts.total_amount) as average_sale,
  COUNT(DISTINCT ts.customer_id) as unique_customers
FROM ticket_sales ts
GROUP BY DATE(ts.created_at)
ORDER BY sale_date DESC;

CREATE OR REPLACE VIEW vw_customer_details AS
SELECT
  c.id,
  c.name,
  c.phone,
  c.email,
  COUNT(ts.id) as total_tickets_purchased,
  SUM(ts.total_amount) as total_spent,
  SUM(p.amount) as total_paid,
  COUNT(DISTINCT b.id) as total_bookings
FROM customers c
LEFT JOIN ticket_sales ts ON c.id = ts.customer_id
LEFT JOIN payments p ON c.id = p.customer_id
LEFT JOIN bookings b ON c.id = b.customer_id
GROUP BY c.id, c.name, c.phone, c.email;

CREATE OR REPLACE VIEW vw_umrah_group_summary AS
SELECT
  ug.id,
  ug.group_name,
  ug.departure_date,
  ug.return_date,
  ug.total_budget,
  COUNT(DISTINCT up.id) as pilgrims_count,
  COALESCE(SUM(ue.amount), 0) as total_expenses,
  ug.total_budget - COALESCE(SUM(ue.amount), 0) as budget_remaining,
  ug.status
FROM umrah_groups ug
LEFT JOIN umrah_pilgrims up ON ug.id = up.group_id
LEFT JOIN umrah_expenses ue ON ug.id = ue.group_id
GROUP BY ug.id, ug.group_name, ug.departure_date, ug.return_date, ug.total_budget, ug.status;