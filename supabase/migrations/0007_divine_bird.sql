/*
  # Add category field to shoes table

  1. Changes
    - Add category field to shoes table with predefined types
    - Set default category as 'Other'
  
  2. Security
    - Inherits existing RLS policies
*/

DO $$ 
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shoes' AND column_name = 'category'
  ) THEN
    CREATE TYPE shoe_category AS ENUM ('Basketball', 'Casual', 'Dress', 'Golf', 'Slides', 'Other');
    ALTER TABLE shoes ADD COLUMN category shoe_category NOT NULL DEFAULT 'Other';
  END IF;
END $$;