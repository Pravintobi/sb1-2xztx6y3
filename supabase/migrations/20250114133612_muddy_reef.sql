/*
  # Add PDF storage bucket and policies

  1. New Features
    - Create storage bucket for PDFs
    - Add storage policies for authenticated users
    - Add storage URL column to chapters table
*/

-- Create storage bucket for PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('manga_pdfs', 'manga_pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload PDFs
CREATE POLICY "Authenticated users can upload PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'manga_pdfs' 
  AND (storage.extension(name) = 'pdf')
);

-- Allow public to read PDFs
CREATE POLICY "Public users can read PDFs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'manga_pdfs');

-- Add storage_url column to chapters if it doesn't exist
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS storage_url text;