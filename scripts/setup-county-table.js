/**
 * Setup county_auctions_2026 table programmatically
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Setting up county_auctions_2026 table...\n')

  // Test if table exists by trying to query it
  console.log('📊 Checking if table exists...')
  const { data: testData, error: testError } = await supabase
    .from('county_auctions_2026')
    .select('count')
    .limit(1)

  if (!testError) {
    console.log('✅ Table already exists!')
    const { count } = await supabase
      .from('county_auctions_2026')
      .select('*', { count: 'exact', head: true })
    console.log(`   Current records: ${count || 0}`)
    return
  }

  if (testError.code === 'PGRST204') {
    console.log('❌ Table does not exist. Creating via SQL...\n')

    console.log('⚠️  Note: Supabase JS client cannot create tables directly.')
    console.log('📋 Please run this SQL in Supabase Dashboard:\n')
    console.log('https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new\n')
    console.log('─'.repeat(80))

    const sql = `
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

CREATE INDEX IF NOT EXISTS idx_county_auctions_state ON county_auctions_2026(state);
CREATE INDEX IF NOT EXISTS idx_county_auctions_date ON county_auctions_2026(auction_date);
CREATE INDEX IF NOT EXISTS idx_county_auctions_platform ON county_auctions_2026(platform);

ALTER TABLE county_auctions_2026 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON county_auctions_2026 FOR SELECT USING (true);
`

    console.log(sql)
    console.log('─'.repeat(80))
    console.log('\n✅ Copy the SQL above and run it in Supabase Dashboard')
    console.log('   Then run: node scripts/import-county-auctions.js')
  } else {
    console.error('❌ Unexpected error:', testError)
  }
}

main().catch(console.error)
