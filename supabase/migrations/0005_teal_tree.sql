-- Create a function to increment wear_count
CREATE OR REPLACE FUNCTION increment_wear_count()
RETURNS integer
LANGUAGE sql
AS $$
  SELECT COALESCE(wear_count, 0) + 1
  FROM shoes
  WHERE id = current_setting('shoes.id')::uuid
$$;