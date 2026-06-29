-- =============================================
-- FIX: Add RLS policies for all tables
-- Run this in Supabase SQL Editor
-- =============================================

-- Disable existing policies first to avoid conflicts
-- Settings table
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read settings" ON settings;
DROP POLICY IF EXISTS "Allow anon upsert settings" ON settings;

CREATE POLICY "Allow read settings"
  ON settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow all settings"
  ON settings FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- attlogs
ALTER TABLE attlogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all attlogs" ON attlogs;
CREATE POLICY "Allow all attlogs" ON attlogs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- userinfos
ALTER TABLE userinfos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all userinfos" ON userinfos;
CREATE POLICY "Allow all userinfos" ON userinfos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- pins
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all pins" ON pins;
CREATE POLICY "Allow all pins" ON pins FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- api_requests
ALTER TABLE api_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all api_requests" ON api_requests;
CREATE POLICY "Allow all api_requests" ON api_requests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- webhook_logs
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all webhook_logs" ON webhook_logs;
CREATE POLICY "Allow all webhook_logs" ON webhook_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- command_logs
ALTER TABLE command_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all command_logs" ON command_logs;
CREATE POLICY "Allow all command_logs" ON command_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
