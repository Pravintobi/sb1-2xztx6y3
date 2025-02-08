/*
  # Update manga cover images

  1. Changes
    - Updates cover_url for all manga entries with new image URLs
*/

UPDATE manga
SET cover_url = CASE 
  WHEN title = 'Chainsaw Man' 
    THEN 'https://jumpg-assets.tokyo-cdn.com/secure/title/100269/title_thumbnail_portrait_list/311890.jpg?hash=MbYAXkqNhxzvDfsJ1JYHWg&expires=2145884400'
  WHEN title = 'Boruto: Two Blue Vortex'
    THEN 'https://wallpapers.com/images/hd/one-piece-4k-cover-art-ncfciduqxhppiukm.jpg'
  WHEN title = 'One Piece'
    THEN 'https://wallpapers.com/images/hd/one-piece-4k-cover-art-ncfciduqxhppiukm.jpg'
  WHEN title = 'Dandadan'
    THEN 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706906751i/177613222.jpg'
  WHEN title = 'KAIJU NO.8'
    THEN 'https://m.media-amazon.com/images/I/818TKUm2TtL._AC_UF1000,1000_QL80_.jpg'
  ELSE cover_url
END
WHERE title IN ('Chainsaw Man', 'Boruto: Two Blue Vortex', 'One Piece', 'Dandadan', 'KAIJU NO.8');