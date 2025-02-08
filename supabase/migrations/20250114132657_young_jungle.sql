/*
  # Add Blue Lock chapters

  1. Changes
    - Add sample chapters for Blue Lock manga
    - Include chapter titles and PDF URLs
*/

-- Insert chapters for Blue Lock
INSERT INTO chapters (manga_id, chapter_number, title, pages, pdf_url, created_at)
SELECT 
  m.id as manga_id,
  chapter_numbers.n as chapter_number,
  CASE 
    WHEN chapter_numbers.n = 1 THEN 'The First Selection'
    WHEN chapter_numbers.n = 2 THEN 'Ego''s Dream'
    WHEN chapter_numbers.n = 3 THEN 'Team Z'
    WHEN chapter_numbers.n = 4 THEN 'Striker Battle'
    WHEN chapter_numbers.n = 5 THEN 'The King'
  END as title,
  jsonb_build_array(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGZOErM_VGqGlbeTRrvlZUwTMnX7VKG6u9A&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGZOErM_VGqGlbeTRrvlZUwTMnX7VKG6u9A&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGZOErM_VGqGlbeTRrvlZUwTMnX7VKG6u9A&s'
  ) as pages,
  CASE 
    WHEN chapter_numbers.n = 1 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    WHEN chapter_numbers.n = 2 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/TAMReview.pdf'
    WHEN chapter_numbers.n = 3 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/rotation.pdf'
    WHEN chapter_numbers.n = 4 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/basicapi.pdf'
    WHEN chapter_numbers.n = 5 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/annotation-line.pdf'
  END as pdf_url,
  now() - ((5 - chapter_numbers.n) * interval '7 days') as created_at
FROM 
  manga m,
  (SELECT generate_series(1,5) as n) as chapter_numbers
WHERE 
  m.title = 'Blue Lock'
ON CONFLICT DO NOTHING;