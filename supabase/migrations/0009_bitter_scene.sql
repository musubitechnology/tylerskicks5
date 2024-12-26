/*
  # Add shoe size field

  1. Changes
    - Add `size` column to shoes table
    - Size is stored as a decimal to support half sizes
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shoes' AND column_name = 'size'
  ) THEN
    ALTER TABLE shoes ADD COLUMN size numeric(3,1);
  END IF;
END $$;