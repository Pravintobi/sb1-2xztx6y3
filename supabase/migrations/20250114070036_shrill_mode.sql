/*
  # Add daily updates table

  1. New Tables
    - `daily_updates`
      - `id` (uuid, primary key)
      - `manga_id` (uuid, references manga)
      - `chapter_number` (integer)
      - `update_date` (timestamptz)
      - `is_new` (boolean)

  2. Security
    - Enable RLS on `daily_updates` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS daily_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id uuid REFERENCES manga(id) ON DELETE CASCADE,
  chapter_number integer NOT NULL,
  update_date timestamptz DEFAULT now(),
  is_new boolean DEFAULT false
);

ALTER TABLE daily_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily updates are viewable by everyone"
  ON daily_updates FOR SELECT
  TO public
  USING (true);

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS daily_updates_date_idx ON daily_updates(update_date DESC);