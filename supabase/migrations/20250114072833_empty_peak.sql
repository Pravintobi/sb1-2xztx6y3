/*
  # Update Dandadan image URL

  1. Changes
    - Update image_url for Dandadan daily updates to use an Unsplash image
*/

UPDATE daily_updates
SET image_url = 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706906751i/177613222.jpg'
WHERE manga_id = (SELECT id FROM manga WHERE title = 'Dandadan');