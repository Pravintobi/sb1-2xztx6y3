/*
  # Update Blue Lock Chapter 1 PDF URL
  
  Updates the PDF URL for Blue Lock's first chapter to point to the Google Drive PDF.
*/

UPDATE chapters 
SET pdf_url = 'https://drive.google.com/file/d/1I0w2bwr_GpbuInicL0x46uorJKOl6V1Y/view?usp=drive_link'
WHERE chapter_number = 1 
AND manga_id = (
  SELECT id 
  FROM manga 
  WHERE title = 'Blue Lock'
);