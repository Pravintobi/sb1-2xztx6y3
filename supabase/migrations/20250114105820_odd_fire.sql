/*
  # Update RLS policies for manga tables

  1. Changes
    - Drop existing policies
    - Recreate policies for manga table updates
    - Recreate policies for chapter updates
    - Recreate policies for banner image updates
    - Recreate policies for daily updates management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own manga" ON manga;
DROP POLICY IF EXISTS "Users can update chapters they've read" ON chapters;
DROP POLICY IF EXISTS "Users can view active banners" ON banner_images;
DROP POLICY IF EXISTS "Users can view all updates" ON daily_updates;

-- Recreate manga table policies
CREATE POLICY "Users can update their own manga"
  ON manga FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM favorites WHERE manga_id = id
  ));

-- Recreate chapters table policies
CREATE POLICY "Users can update chapters they've read"
  ON chapters FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_progress WHERE chapter_id = id
  ));

-- Recreate banner_images table policies
CREATE POLICY "Users can view active banners"
  ON banner_images FOR SELECT
  TO public
  USING (active = true);

-- Recreate daily_updates table policies
CREATE POLICY "Users can view all updates"
  ON daily_updates FOR SELECT
  TO public
  USING (true);