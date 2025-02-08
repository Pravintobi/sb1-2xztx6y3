/*
  # Add banner images table

  1. New Tables
    - `banner_images`
      - `id` (uuid, primary key)
      - `image_url` (text, required)
      - `title` (text)
      - `link` (text)
      - `order` (integer)
      - `active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `banner_images` table
    - Add policy for public read access
*/

CREATE TABLE banner_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text,
  link text,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banner_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Banner images are viewable by everyone"
  ON banner_images FOR SELECT
  TO public
  USING (active = true);