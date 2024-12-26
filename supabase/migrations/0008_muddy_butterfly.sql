/*
  # Add purchase price field to shoes table

  1. Changes
    - Add purchase_price column as numeric(10,2) to store currency amounts
    - Column is nullable since it's optional
  
  2. Notes
    - Using numeric(10,2) to properly store currency values
    - Allows for amounts up to 99,999,999.99
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shoes' AND column_name = 'purchase_price'
  ) THEN
    ALTER TABLE shoes ADD COLUMN purchase_price numeric(10,2);
  END IF;
END $$;