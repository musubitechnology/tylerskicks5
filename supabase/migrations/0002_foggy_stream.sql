/*
  # Add metadata columns to shoes table

  1. Changes
    - Add `nickname` column for custom shoe names
    - Add `purchase_date` column to track when shoes were bought

  2. Notes
    - Both columns are optional (nullable)
    - No data migration needed as these are new columns
*/

DO $$ 
BEGIN
  -- Add nickname column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shoes' AND column_name = 'nickname'
  ) THEN
    ALTER TABLE shoes ADD COLUMN nickname text;
  END IF;

  -- Add purchase_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shoes' AND column_name = 'purchase_date'
  ) THEN
    ALTER TABLE shoes ADD COLUMN purchase_date date;
  END IF;
END $$;