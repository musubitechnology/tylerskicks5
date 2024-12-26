/*
  # Update RLS policies for shoes table

  1. Changes
    - Drop existing policies
    - Create new policies for authenticated users
    - Allow public read access
    - Allow authenticated users full CRUD access
    
  2. Security
    - Maintains RLS protection
    - Ensures authenticated users can manage shoes
    - Allows public viewing of collection
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view shoes" ON shoes;
DROP POLICY IF EXISTS "Only authenticated users can modify shoes" ON shoes;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON shoes FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON shoes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON shoes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON shoes FOR DELETE
TO authenticated
USING (true);