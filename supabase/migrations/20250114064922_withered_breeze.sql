/*
  # Add sample manga data

  1. Changes
    - Insert sample manga data with titles, authors, cover images and view counts
*/

-- Insert sample manga data
INSERT INTO manga (title, author, cover_url, views, description) VALUES
  ('Chainsaw Man', 'TATSUKI FUJIMOTO', 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&q=80&w=400', 341112, 'A young man becomes a devil hunter to pay off his father''s debts.'),
  ('Boruto: Two Blue Vortex', 'MASASHI KISHIMOTO / MIKIO IKEMOTO', 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=400', 319436, 'The next generation of ninja continues the legacy.'),
  ('One Piece', 'EIICHIRO ODA', 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=400', 310157, 'Follow Luffy''s journey to become the Pirate King.'),
  ('Dandadan', 'YUKINOBU TATSU', 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&q=80&w=400', 241474, 'A supernatural romance story like no other.'),
  ('KAIJU NO.8', 'NAOYA MATSUMOTO', 'https://images.unsplash.com/photo-1615393904572-b3424b3e3acd?auto=format&fit=crop&q=80&w=400', 160680, 'A man gains the power to become a kaiju.'),
  ('SPY x FAMILY', 'TATSUYA ENDO', 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?auto=format&fit=crop&q=80&w=400', 155966, 'A spy must create a fake family for his mission.'),
  ('Blue Lock', 'YUKI TABATA', 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=400', 155520, 'A magicless boy aims to become the Wizard King.'),
  ('Drama Queen', 'KURAKU ICHIKAWA', 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&q=80&w=400', 123709, 'A high school drama with a twist.'),
  ('Kagurabachi', 'TAKERU HOKAZONO', 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&q=80&w=400', 117896, 'A tale of revenge and swordmanship.'),
  ('SAKAMOTO DAYS', 'YUTO SUZUKI', 'https://static.wikia.nocookie.net/sakamoto-days/images/f/f3/Volume_09.png/revision/latest?cb=20221017035143', 117278, 'A retired assassin runs a convenience store.')
ON CONFLICT (id) DO UPDATE 
SET 
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  cover_url = EXCLUDED.cover_url,
  views = EXCLUDED.views,
  description = EXCLUDED.description;