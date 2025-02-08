/*
  # Add sample data for daily updates

  1. Changes
    - Insert sample daily updates data linking to existing manga
    - Add recent chapters with some marked as new
*/

-- Insert sample daily updates
INSERT INTO daily_updates (manga_id, chapter_number, update_date, is_new)
SELECT 
  id as manga_id,
  CASE 
    WHEN title = 'Chainsaw Man' THEN 145
    WHEN title = 'Boruto: Two Blue Vortex' THEN 4
    WHEN title = 'One Piece' THEN 1107
    WHEN title = 'Dandadan' THEN 118
    WHEN title = 'KAIJU NO.8' THEN 96
    WHEN title = 'SPY x FAMILY' THEN 89
    WHEN title = 'Black Clover' THEN 368
    WHEN title = 'Drama Queen' THEN 45
    WHEN title = 'Kagurabachi' THEN 23
    WHEN title = 'SAKAMOTO DAYS' THEN 152
  END as chapter_number,
  now() - (random() * interval '3 days') as update_date,
  CASE 
    WHEN random() < 0.3 THEN true  -- 30% chance of being new
    ELSE false
  END as is_new
FROM manga
WHERE title IN (
  'Chainsaw Man',
  'Boruto: Two Blue Vortex',
  'One Piece',
  'Dandadan',
  'KAIJU NO.8',
  'SPY x FAMILY',
  'Black Clover',
  'Drama Queen',
  'Kagurabachi',
  'SAKAMOTO DAYS'
)
ON CONFLICT DO NOTHING;