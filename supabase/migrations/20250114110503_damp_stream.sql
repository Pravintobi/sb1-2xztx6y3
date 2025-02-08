/*
  # Add admin functionality
  
  1. New Tables
    - `admin_users` table to track admin users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on admin_users table
    - Add policy for admin status checks
*/

DO $$ 
BEGIN
  -- Only create the table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'admin_users') THEN
    -- Create admin_users table
    CREATE TABLE admin_users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now(),
      UNIQUE(user_id)
    );

    -- Enable RLS
    ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can read their own admin status"
      ON admin_users FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    -- Insert initial admin user (first registered user becomes admin)
    INSERT INTO admin_users (user_id)
    SELECT id FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;
END $$;