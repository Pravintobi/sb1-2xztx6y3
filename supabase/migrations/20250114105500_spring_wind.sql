/*
  # Update RLS policies for manga tables

  1. Changes
    - Add policies for manga table updates
    - Add policies for chapter updates
    - Add policies for banner image updates
    - Add policies for daily updates management
*/

-- Update manga table policies
CREATE POLICY "Users can update their own manga"
  ON manga FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM favorites WHERE manga_id = id
  ));

-- Update chapters table policies
CREATE POLICY "Users can update chapters they've read"
  ON chapters FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_progress WHERE chapter_id = id
  ));

-- Update banner_images table policies
CREATE POLICY "Users can view active banners"
  ON banner_images FOR SELECT
  TO public
  USING (active = true);

-- Update daily_updates table policies
CREATE POLICY "Users can view all updates"
  ON daily_updates FOR SELECT
  TO public
  USING (true);