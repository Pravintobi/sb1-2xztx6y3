/*
  # Update banner images

  1. Changes
    - Delete existing banner images
    - Insert new banner images with updated URLs
*/

-- First, delete existing banner images
DELETE FROM banner_images;

-- Insert new banner images
INSERT INTO banner_images (image_url, title, link, "order", active) VALUES
  ('https://i.pinimg.com/1200x/cd/67/79/cd6779ec817a72f12c420457ed9f111d.jpg', 'Featured Manga 1', '/manga/1', 1, true),
  ('https://i.pinimg.com/1200x/e0/84/d2/e084d2a2b3d9f396d503221228dd4fe4.jpg', 'Featured Manga 2', '/manga/2', 2, true),
  ('https://i.pinimg.com/1200x/3d/62/25/3d6225706f79d99dedae53a5afae5fb1.jpg', 'Featured Manga 3', '/manga/3', 3, true);