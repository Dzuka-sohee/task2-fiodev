-- =============================================
-- FIX: Add RLS policies for settings table
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable RLS (if not already)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anon to read settings
CREATE POLICY "Allow anon read settings"
  ON settings FOR SELECT
  TO anon
  USING (true);

-- Allow anon to upsert settings
CREATE POLICY "Allow anon upsert settings"
  ON settings FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Also enable RLS for other tables and add policies
ALTER TABLE attlogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all attlogs" ON attlogs FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE userinfos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all userinfos" ON userinfos FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all pins" ON pins FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE api_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all api_requests" ON api_requests FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all webhook_logs" ON webhook_logs FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE command_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all command_logs" ON command_logs FOR ALL TO anon USING (true) WITH CHECK (true);
