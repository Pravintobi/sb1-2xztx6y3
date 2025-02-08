-- Update Dandadan image URL
UPDATE daily_updates
SET image_url = 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706906751i/177613222.jpg'
WHERE manga_id = (SELECT id FROM manga WHERE title = 'Dandadan');

-- Ensure the update is applied
UPDATE daily_updates
SET image_url = COALESCE(image_url, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706906751i/177613222.jpg')
WHERE manga_id = (SELECT id FROM manga WHERE title = 'Dandadan');