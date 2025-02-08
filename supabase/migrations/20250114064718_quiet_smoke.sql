/*
  # Add views tracking to manga table

  1. Changes
    - Add `views` column to manga table with default value of 0
    - Add index on views column for faster sorting
*/

-- Add views column
ALTER TABLE manga ADD COLUMN IF NOT EXISTS views bigint DEFAULT 0;

-- Add index for faster sorting
CREATE INDEX IF NOT EXISTS manga_views_idx ON manga(views DESC);

-- Update existing manga with random view counts for testing
UPDATE manga SET views = floor(random() * 1000000);