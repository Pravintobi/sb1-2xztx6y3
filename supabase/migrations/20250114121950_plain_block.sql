/*
  # Add PDF support to chapters

  1. Changes
    - Add pdf_url column to chapters table
    - Update sample chapters with PDF URLs
    - Add index for faster PDF lookups

  2. Security
    - Maintain existing RLS policies
*/

-- Add pdf_url column to chapters table
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS pdf_url text;

-- Create index for faster PDF lookups
CREATE INDEX IF NOT EXISTS chapters_pdf_idx ON chapters(pdf_url);

-- Update sample chapters with PDF URLs
UPDATE chapters 
SET pdf_url = CASE 
  WHEN chapter_number = 1 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  WHEN chapter_number = 2 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/TAMReview.pdf'
  WHEN chapter_number = 3 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/rotation.pdf'
  WHEN chapter_number = 4 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/basicapi.pdf'
  WHEN chapter_number = 5 THEN 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/test/pdfs/annotation-line.pdf'
END
WHERE chapter_number BETWEEN 1 AND 5;