/*
  # Fix Authentication and Admin Setup

  1. Changes
    - Drop and recreate admin_users table with proper permissions
    - Add necessary policies for authentication
    - Ensure proper RLS setup
*/

-- First, ensure we have a clean slate for admin_users
DROP TABLE IF EXISTS admin_users CASCADE;

-- Recreate admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can be viewed by authenticated users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can insert new admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM admin_users
    )
  );

-- Ensure first user becomes admin
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM admin_users)
ORDER BY created_at ASC
LIMIT 1;

-- Grant necessary permissions
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_users TO anon;

-- Ensure proper RLS on existing tables
ALTER TABLE manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_updates ENABLE ROW LEVEL SECURITY;

-- Update manga policies
DROP POLICY IF EXISTS "Manga is viewable by everyone" ON manga;
CREATE POLICY "Manga is viewable by everyone"
  ON manga FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage manga"
  ON manga FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM admin_users
    )
  );