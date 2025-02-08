-- Update SAKAMOTO DAYS views to make it appear in hottest section
UPDATE manga 
SET views = 250000  -- This will place it in the top 5
WHERE title = 'SAKAMOTO DAYS';