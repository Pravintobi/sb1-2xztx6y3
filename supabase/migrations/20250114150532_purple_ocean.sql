-- Update SAKAMOTO DAYS cover URL in daily_updates
UPDATE daily_updates
SET image_url = (
  SELECT cover_url
  FROM manga
  WHERE title = 'SAKAMOTO DAYS'
)
WHERE manga_id = (
  SELECT id
  FROM manga
  WHERE title = 'SAKAMOTO DAYS'
);