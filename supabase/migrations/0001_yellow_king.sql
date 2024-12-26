/*
  # Initial Schema Setup for Shoe Collection App

  1. New Tables
    - `shoes`: Stores shoe collection information
      - Basic info (name, brand, model)
      - Image URL for shoe photos
      - Color array (up to 4 colors)
      - Maintenance tracking (last worn, last cleaned, wear count)
      - Timestamps
    
    - `outfits`: Stores outfit combinations
      - Description of the outfit
      - Reference to associated shoe
      - Timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access
    - Authenticated write access
*/

-- Create shoes table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS shoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    image_url text,
    colors text[] CHECK (array_length(colors, 1) <= 4),
    last_worn timestamptz,
    last_cleaned timestamptz,
    wear_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create outfits table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS outfits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    description text NOT NULL,
    shoe_id uuid REFERENCES shoes(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

-- Create policies (with IF NOT EXISTS checks)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view shoes" ON shoes;
  CREATE POLICY "Anyone can view shoes"
    ON shoes
    FOR SELECT
    TO public
    USING (true);

  DROP POLICY IF EXISTS "Only authenticated users can modify shoes" ON shoes;
  CREATE POLICY "Only authenticated users can modify shoes"
    ON shoes
    FOR ALL
    TO authenticated
    USING (true);

  DROP POLICY IF EXISTS "Anyone can view outfits" ON outfits;
  CREATE POLICY "Anyone can view outfits"
    ON outfits
    FOR SELECT
    TO public
    USING (true);

  DROP POLICY IF EXISTS "Only authenticated users can modify outfits" ON outfits;
  CREATE POLICY "Only authenticated users can modify outfits"
    ON outfits
    FOR ALL
    TO authenticated
    USING (true);
END $$;