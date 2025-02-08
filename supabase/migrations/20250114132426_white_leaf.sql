/*
  # Add Blue Lock manga data

  1. Changes
    - Add unique constraint on manga title
    - Ensure Blue Lock exists with correct information
    - Add to daily updates
*/

-- First add a unique constraint on the title column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'manga_title_key'
  ) THEN
    ALTER TABLE manga ADD CONSTRAINT manga_title_key UNIQUE (title);
  END IF;
END $$;

-- Insert or update Blue Lock
INSERT INTO manga (
  title,
  author,
  cover_url,
  views,
  description
)
VALUES (
  'Blue Lock',
  'MUNEYUKI KANESHIRO / YUSUKE NOMURA',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGZOErM_VGqGlbeTRrvlZUwTMnX7VKG6u9A&s',
  155520,
  'To represent Japan at the World Cup, the Japanese Football Association hires the mysterious Ego Jinpachi. His master plan to lead Japan to glory is Blue Lock, a training regimen designed to create the world''s greatest egotist striker.'
)
ON CONFLICT ON CONSTRAINT manga_title_key 
DO UPDATE SET 
  author = EXCLUDED.author,
  cover_url = EXCLUDED.cover_url,
  description = EXCLUDED.description,
  views = EXCLUDED.views;

-- Add to daily updates
INSERT INTO daily_updates (
  manga_id,
  chapter_number,
  update_date,
  is_new,
  image_url
)
SELECT 
  id as manga_id,
  125 as chapter_number,
  now() - interval '1 day' as update_date,
  true as is_new,
  cover_url as image_url
FROM manga 
WHERE title = 'Blue Lock'
ON CONFLICT DO NOTHING;