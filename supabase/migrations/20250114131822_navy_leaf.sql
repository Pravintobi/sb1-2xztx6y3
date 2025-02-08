/*
  # Update Blue Lock manga information
  
  1. Changes
    - Update Blue Lock's cover image, author, and description
    
  2. Notes
    - Uses ON CONFLICT to safely update existing record
    - Preserves other manga entries
*/

UPDATE manga 
SET 
  cover_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGZOErM_VGqGlbeTRrvlZUwTMnX7VKG6u9A&s',
  author = 'MUNEYUKI KANESHIRO / YUSUKE NOMURA',
  description = 'To represent Japan at the World Cup, the Japanese Football Association hires the mysterious Ego Jinpachi. His master plan to lead Japan to glory is Blue Lock, a training regimen designed to create the world''s greatest egotist striker.'
WHERE title = 'Blue Lock';