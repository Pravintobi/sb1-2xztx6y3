/*
  # Add image URLs to daily updates

  1. Changes
    - Add image_url column to daily_updates table
    - Update existing records with sample image URLs
*/

-- Add image_url column to daily_updates
ALTER TABLE daily_updates ADD COLUMN IF NOT EXISTS image_url text;

-- Update existing records with sample image URLs
UPDATE daily_updates
SET image_url = CASE 
  WHEN manga_id = (SELECT id FROM manga WHERE title = 'Chainsaw Man') 
    THEN 'https://jumpg-assets.tokyo-cdn.com/secure/title/100269/title_thumbnail_portrait_list/311890.jpg?hash=MbYAXkqNhxzvDfsJ1JYHWg&expires=2145884400'
  WHEN manga_id = (SELECT id FROM manga WHERE title = 'Boruto: Two Blue Vortex')
    THEN 'https://wallpapers.com/images/hd/one-piece-4k-cover-art-ncfciduqxhppiukm.jpg'
  WHEN manga_id = (SELECT id FROM manga WHERE title = 'One Piece')
    THEN 'https://wallpapers.com/images/hd/one-piece-4k-cover-art-ncfciduqxhppiukm.jpg'
  WHEN manga_id = (SELECT id FROM manga WHERE title = 'Dandadan')
    THEN ''
  WHEN manga_id = (SELECT id FROM manga WHERE title = 'KAIJU NO.8')
    THEN 'https://m.media-amazon.com/images/I/818TKUm2TtL._AC_UF1000,1000_QL80_.jpg'
  ELSE 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=400'
END;