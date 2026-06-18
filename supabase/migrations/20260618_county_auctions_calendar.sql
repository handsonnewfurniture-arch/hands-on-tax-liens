-- County Auctions Calendar 2026
-- Stores comprehensive auction schedule across all states

CREATE TABLE IF NOT EXISTS county_auctions_2026 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Location
  county TEXT NOT NULL,
  state TEXT NOT NULL,

  -- Auction Details
  sale_type TEXT NOT NULL, -- 'Tax lien certificate', 'Tax deed', etc.
  platform TEXT NOT NULL, -- 'GovEase', 'Bid4Assets', 'Zeus Auction', etc.
  registration_url TEXT NOT NULL,

  -- Dates
  auction_date DATE, -- Confirmed date (if available)
  sale_date_window TEXT NOT NULL, -- Description of sale window/schedule

  -- Format & Details
  format TEXT NOT NULL, -- 'Online', 'In-person', 'Mixed', etc.
  notes TEXT,
  source_url TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT unique_county_state UNIQUE(county, state)
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_county_auctions_state ON county_auctions_2026(state);
CREATE INDEX IF NOT EXISTS idx_county_auctions_date ON county_auctions_2026(auction_date);
CREATE INDEX IF NOT EXISTS idx_county_auctions_platform ON county_auctions_2026(platform);

-- Enable Row Level Security
ALTER TABLE county_auctions_2026 ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view auction data)
CREATE POLICY "Public read access" ON county_auctions_2026
  FOR SELECT
  USING (true);

-- Comment
COMMENT ON TABLE county_auctions_2026 IS 'Comprehensive 2026 county tax sale auction calendar across all states';
