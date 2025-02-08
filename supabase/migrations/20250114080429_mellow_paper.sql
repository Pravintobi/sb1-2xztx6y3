/*
  # Add sample chapters for manga

  1. Changes
    - Insert sample chapters for existing manga titles
    - Each chapter includes:
      - Chapter number
      - Title
      - Pages array (dummy URLs) as JSONB
      - Creation date
*/

-- Insert sample chapters for manga
INSERT INTO chapters (manga_id, chapter_number, title, pages, created_at)
SELECT 
  m.id as manga_id,
  chapter_numbers.n as chapter_number,
  CASE 
    WHEN chapter_numbers.n = 1 THEN 'The Beginning'
    WHEN chapter_numbers.n = 2 THEN 'The Journey Continues'
    WHEN chapter_numbers.n = 3 THEN 'Unexpected Turn'
    WHEN chapter_numbers.n = 4 THEN 'Rising Action'
    WHEN chapter_numbers.n = 5 THEN 'The Revelation'
  END as title,
  jsonb_build_array(
    'https://wallpapers.com/images/hd/one-piece-4k-cover-art-ncfciduqxhppiukm.jpg',
    'https://jumpg-assets.tokyo-cdn.com/secure/title/100269/title_thumbnail_portrait_list/311890.jpg?hash=MbYAXkqNhxzvDfsJ1JYHWg&expires=2145884400',
    'https://m.media-amazon.com/images/I/818TKUm2TtL._AC_UF1000,1000_QL80_.jpg'
  ) as pages,
  now() - (random() * interval '60 days') as created_at
FROM 
  manga m,
  (SELECT generate_series(1,5) as n) as chapter_numbers
WHERE 
  m.title IN ('Chainsaw Man', 'Boruto: Two Blue Vortex', 'One Piece', 'Dandadan', 'KAIJU NO.8')
ON CONFLICT DO NOTHING;