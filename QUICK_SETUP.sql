-- County Auctions 2026 - Quick Setup
-- Copy this entire file and paste into Supabase SQL Editor
-- https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new

-- Step 1: Create table
CREATE TABLE IF NOT EXISTS county_auctions_2026 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county TEXT NOT NULL,
  state TEXT NOT NULL,
  sale_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  registration_url TEXT NOT NULL,
  auction_date DATE,
  sale_date_window TEXT NOT NULL,
  format TEXT NOT NULL,
  notes TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_county_state UNIQUE(county, state)
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_county_auctions_state ON county_auctions_2026(state);
CREATE INDEX IF NOT EXISTS idx_county_auctions_date ON county_auctions_2026(auction_date);
CREATE INDEX IF NOT EXISTS idx_county_auctions_platform ON county_auctions_2026(platform);

-- Step 3: Enable Row Level Security
ALTER TABLE county_auctions_2026 ENABLE ROW LEVEL SECURITY;

-- Step 4: Allow public read access
CREATE POLICY "Public read access" ON county_auctions_2026 FOR SELECT USING (true);

-- Step 5: Insert sample data (your first counties)
INSERT INTO county_auctions_2026 (county, state, sale_type, platform, registration_url, auction_date, sale_date_window, format, notes, source_url) VALUES
('St. Johns', 'FL', 'Tax lien certificate', 'Zeus Auction', 'https://www.zeusauction.com', '2026-05-29', 'May 29, 2026, 9:00 AM', 'Online', 'One of the few FL counties running its own platform. 4,535 properties, $22.3M in delinquent taxes.', 'https://sjctax.us/tax-certificate-sales/'),
('Mobile', 'AL', 'Tax lien certificate', 'GovEase', 'https://www.govease.com', '2026-05-11', 'May 11, 2026, 8:30am–4:00pm CDT', 'Online', 'Annual sale held between March 1 and June 15; parcel list published no later than March 30, 2026.', 'https://mobilecopropertytax.com/taxliensale/'),
('Orange', 'FL', 'Tax lien certificate', 'LienHub', 'https://lienhub.com/county/orange/certsale/main', '2026-06-01', 'June 1, 2026, 8:00am–4:00pm', 'Online', 'Over 19,000 tax-delinquent parcels typically listed; high institutional competition.', 'https://www.octaxcol.com/taxes/about-property-tax/tax-certificate-deed-sales/'),
('Miami-Dade', 'FL', 'Tax lien certificate', 'LienHub', 'https://lienhub.com/county/miamidade/certsale/main', '2026-05-11', 'Bidding window opens ~May 11, 2026 and runs 23 days', 'Online', 'Largest FL county by lien volume (~$270M certificates/year); heavily institutional.', 'https://lienhub.com/county/miamidade/certsale/main'),
('Pinellas', 'FL', 'Tax lien certificate', 'LienHub', 'https://lienhub.com', '2026-06-01', 'Annual sale, on or before June 1, 2026', 'Online', 'Unsold certificates struck to the county; county-held certs become purchasable starting first business day of September.', 'https://pinellastaxcollector.gov/property-tax/tax-certificate-and-tax-deed/');

-- Verify
SELECT county, state, auction_date, platform FROM county_auctions_2026 ORDER BY auction_date;
