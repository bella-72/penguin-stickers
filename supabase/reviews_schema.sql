-- Reviews Table Schema for Penguin Stick
-- Run this SQL in your Supabase SQL Editor to set up the reviews table

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NULLABLE REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_name for faster lookups
CREATE INDEX IF NOT EXISTS reviews_user_name_idx ON reviews(user_name);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for anon users to read all reviews
CREATE POLICY IF NOT EXISTS "Allow read all reviews" ON reviews
  FOR SELECT
  TO anon
  USING (true);

-- Create RLS policy for authenticated users to read all reviews
CREATE POLICY IF NOT EXISTS "Allow authenticated read reviews" ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS policy for anyone to insert reviews (anonymous or authenticated)
CREATE POLICY IF NOT EXISTS "Allow anyone to create reviews" ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create RLS policy for users to update their own reviews by name
CREATE POLICY IF NOT EXISTS "Allow update own reviews" ON reviews
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: Create a unique constraint on user_name to prevent duplicate reviews from same name
-- ALTER TABLE reviews ADD CONSTRAINT unique_user_name UNIQUE(user_name);
-- (Commented out for now to allow multiple reviews, remove the comment if you want one review per name only)

