/*
  # Add shoe history tracking

  1. New Tables
    - `shoe_history`
      - `id` (uuid, primary key)
      - `shoe_id` (uuid, references shoes)
      - `type` (text, either 'worn' or 'cleaned')
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `shoe_history` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS shoe_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shoe_id uuid REFERENCES shoes(id) ON DELETE CASCADE,
  type text CHECK (type IN ('worn', 'cleaned')),
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shoe_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON shoe_history FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON shoe_history FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
ON shoe_history FOR DELETE
TO authenticated
USING (true);