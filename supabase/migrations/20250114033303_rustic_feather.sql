/*
  # Initial Schema for Manga Reader Platform

  1. New Tables
    - `manga`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cover_url` (text)
      - `author` (text)
      - `status` (text)
      - `created_at` (timestamp)
    - `chapters`
      - `id` (uuid, primary key)
      - `manga_id` (uuid, foreign key)
      - `chapter_number` (integer)
      - `title` (text)
      - `pages` (jsonb)
      - `created_at` (timestamp)
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `manga_id` (uuid, foreign key)
      - `chapter_id` (uuid, foreign key)
      - `page_number` (integer)
      - `created_at` (timestamp)
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `manga_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create manga table
CREATE TABLE manga (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_url text,
  author text,
  status text DEFAULT 'ongoing',
  created_at timestamptz DEFAULT now()
);

-- Create chapters table
CREATE TABLE chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manga_id uuid REFERENCES manga(id) ON DELETE CASCADE,
  chapter_number integer NOT NULL,
  title text,
  pages jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id uuid REFERENCES manga(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE,
  page_number integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, manga_id, chapter_id)
);

-- Create favorites table
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id uuid REFERENCES manga(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, manga_id)
);

-- Enable Row Level Security
ALTER TABLE manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Manga is viewable by everyone"
  ON manga FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Chapters are viewable by everyone"
  ON chapters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own progress"
  ON user_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);