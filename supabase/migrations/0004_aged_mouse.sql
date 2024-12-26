/*
  # Create storage bucket for shoe images
  
  1. Storage
    - Creates a new public storage bucket for shoe images
    - Sets appropriate security policies
*/

DO $$ 
BEGIN
  -- Create storage bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('shoe-images', 'shoe-images', true)
  ON CONFLICT (id) DO NOTHING;

  -- Create storage policy for authenticated users
  CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shoe-images');

  -- Create storage policy for public viewing
  CREATE POLICY "Allow public to view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'shoe-images');
END $$;