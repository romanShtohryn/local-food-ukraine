/*
  # Create sellers table for Local Food Ukraine

  1. New Tables
    - `sellers`
      - `id` (uuid, primary key) - Unique identifier for each seller
      - `name` (text) - Seller's name
      - `product` (text) - Products they sell
      - `category` (text) - Product category (milk, meat, honey, vegetables, fruits, eggs)
      - `price` (text) - Price information
      - `contact` (text) - Contact information (phone, telegram, viber)
      - `city` (text) - City or village name
      - `lat` (numeric) - Latitude coordinate
      - `lng` (numeric) - Longitude coordinate
      - `created_at` (timestamptz) - Record creation timestamp
      - `user_id` (uuid) - Optional user ID for authenticated submissions

  2. Security
    - Enable RLS on `sellers` table
    - Add policy for anyone to read seller data (public access)
    - Add policy for anyone to insert new sellers (public submissions)
    - Add policy for authenticated users to update their own sellers
    - Add policy for authenticated users to delete their own sellers

  3. Indexes
    - Index on category for faster filtering
    - Index on city for location searches
    - Spatial index on lat/lng for proximity queries
*/

CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  product text NOT NULL,
  category text NOT NULL CHECK (category IN ('молоко', 'м''ясо', 'мед', 'овочі', 'фрукти', 'яйця')),
  price text DEFAULT '',
  contact text NOT NULL,
  city text DEFAULT '',
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

-- Enable RLS
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read sellers (public data)
CREATE POLICY "Anyone can view sellers"
  ON sellers FOR SELECT
  USING (true);

-- Allow anyone to insert sellers (public submissions)
CREATE POLICY "Anyone can add sellers"
  ON sellers FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update their own sellers
CREATE POLICY "Users can update own sellers"
  ON sellers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own sellers
CREATE POLICY "Users can delete own sellers"
  ON sellers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS sellers_category_idx ON sellers(category);
CREATE INDEX IF NOT EXISTS sellers_city_idx ON sellers(city);
CREATE INDEX IF NOT EXISTS sellers_location_idx ON sellers(lat, lng);
