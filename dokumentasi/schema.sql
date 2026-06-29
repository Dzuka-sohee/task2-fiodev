-- =============================================
-- Fingerspot Attendance System — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Tabel attlogs
CREATE TABLE IF NOT EXISTS attlogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin TEXT NOT NULL,
  user_name TEXT,
  scan_time TIMESTAMPTZ NOT NULL,
  verify_type INTEGER,
  status_code INTEGER,
  device_sn TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attlogs_scan_time ON attlogs (scan_time DESC);
CREATE INDEX IF NOT EXISTS idx_attlogs_pin ON attlogs (pin);

-- 2. Tabel userinfos
CREATE TABLE IF NOT EXISTS userinfos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  card_no TEXT,
  privilege INTEGER DEFAULT 1,
  enabled BOOLEAN DEFAULT true,
  device_sn TEXT,
  raw_payload JSONB,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel pins
CREATE TABLE IF NOT EXISTS pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pin TEXT NOT NULL,
  device_sn TEXT,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel api_requests
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  command TEXT NOT NULL,
  device_sn TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  raw_payload JSONB,
  response JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_requests_created_at ON api_requests (created_at DESC);

-- 5. Tabel webhook_logs
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT,
  device_sn TEXT,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs (created_at DESC);

-- 6. Tabel command_logs
CREATE TABLE IF NOT EXISTS command_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  command TEXT NOT NULL,
  device_sn TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  notes TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabel settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed settings
INSERT INTO settings (key, value) VALUES
  ('cloud_id', ''),
  ('api_key', ''),
  ('webhook_secret', '')
ON CONFLICT (key) DO NOTHING;

-- 8. Supabase Function: attendance_daily_count
CREATE OR REPLACE FUNCTION attendance_daily_count(start_date DATE, end_date DATE)
RETURNS TABLE(scan_date DATE, count BIGINT)
LANGUAGE sql STABLE
AS $$
  SELECT
    DATE(scan_time) AS scan_date,
    COUNT(*) AS count
  FROM attlogs
  WHERE DATE(scan_time) BETWEEN start_date AND end_date
  GROUP BY DATE(scan_time)
  ORDER BY scan_date ASC;
$$;
