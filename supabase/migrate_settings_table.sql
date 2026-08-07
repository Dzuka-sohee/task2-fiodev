-- Settings table migration (idempotent - safe to run multiple times)
-- Run this in Supabase SQL Editor

-- 1. Create new table (skip if exists)
CREATE TABLE IF NOT EXISTS settings_new (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cloud_id text DEFAULT '',
  webhook_secret text DEFAULT '',
  device_timezone text DEFAULT 'Asia/Jakarta',
  api_key text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- 2. Migrate data from old table if it still exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'settings' AND schemaname = 'public') THEN
    -- Check if old table has key/value columns (old format)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'settings' AND column_name = 'key'
    ) THEN
      INSERT INTO settings_new (cloud_id, webhook_secret, device_timezone, api_key)
      SELECT
        MAX(CASE WHEN key = 'cloud_id' THEN value END),
        MAX(CASE WHEN key = 'webhook_secret' THEN value END),
        MAX(CASE WHEN key = 'device_timezone' THEN value END),
        MAX(CASE WHEN key = 'api_key' THEN value END)
      FROM settings;

      DROP TABLE settings;
      ALTER TABLE settings_new RENAME TO settings;
    END IF;
  ELSE
    -- settings table doesn't exist, just rename new table
    ALTER TABLE settings_new RENAME TO settings;
  END IF;
END $$;

-- 3. Ensure at least one row exists
INSERT INTO settings (cloud_id, webhook_secret, device_timezone, api_key)
SELECT '', '', 'Asia/Jakarta', ''
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- 4. Done! (RLS not required for this table)
