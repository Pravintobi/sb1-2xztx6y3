/*
  # Add new admin user

  1. Changes
    - Add a new admin user to admin_users table
*/

-- Insert a new admin user
INSERT INTO admin_users (user_id)
SELECT id 
FROM auth.users 
WHERE email = 'admin@example.com'  -- Replace with the actual email of the user you want to make admin
ON CONFLICT (user_id) DO NOTHING;