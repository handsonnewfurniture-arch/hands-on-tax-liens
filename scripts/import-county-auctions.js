/**
 * Import County Auctions 2026 Calendar
 *
 * Loads CSV data and imports to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Importing County Auctions 2026 Calendar...\n')

  // Step 1: Apply migration
  console.log('📊 Step 1: Creating county_auctions_2026 table...')

  const migrationPath = path.join(__dirname, '../supabase/migrations/20260618_county_auctions_calendar.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  // Note: You'll need to run this SQL manually in Supabase Dashboard
  // or use Supabase CLI: supabase db push
  console.log('⚠️  Please run this migration in Supabase Dashboard:')
  console.log('   1. Go to: https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new')
  console.log('   2. Paste SQL from: supabase/migrations/20260618_county_auctions_calendar.sql')
  console.log('   3. Run it\n')
  console.log('Press Enter once migration is complete...')

  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdin.once('data', resolve)
  })

  // Step 2: Load CSV
  console.log('\n📥 Step 2: Loading CSV data...')

  const csvPath = path.join(__dirname, '../data/county-auctions-2026-full.csv')
  const counties = []

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        counties.push(row)
      })
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`✅ Loaded ${counties.length} counties from CSV\n`)

  // Step 3: Transform and insert
  console.log('💾 Step 3: Importing to database...')

  const records = counties.map(row => {
    // Parse auction date
    let auctionDate = null
    const dateStr = row['Auction Date']?.trim()

    if (dateStr && dateStr !== 'Not yet confirmed — see Sale Date/Window column' && dateStr !== 'Recurring: first Tuesday of the month' && !dateStr.includes('Recurring')) {
      // Try to parse date
      try {
        auctionDate = new Date(dateStr).toISOString().split('T')[0]
      } catch (e) {
        console.log(`   ⚠️  Could not parse date for ${row.County}, ${row.State}: ${dateStr}`)
      }
    }

    return {
      county: row.County,
      state: row.State,
      sale_type: row['Sale Type'],
      platform: row.Platform,
      registration_url: row['Auction Registration URL'],
      auction_date: auctionDate,
      sale_date_window: row['2026 Sale Date / Window'],
      format: row.Format,
      notes: row.Notes || null,
      source_url: row['Source URL']
    }
  })

  // Insert in batches of 50
  const batchSize = 50
  let imported = 0

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('county_auctions_2026')
      .upsert(batch, {
        onConflict: 'county,state'
      })

    if (error) {
      console.error(`   ❌ Error importing batch ${Math.floor(i / batchSize) + 1}:`, error)
    } else {
      imported += batch.length
      process.stdout.write(`\r   Imported ${imported}/${records.length} counties...`)
    }
  }

  console.log('\n')

  // Step 4: Verify
  const { count } = await supabase
    .from('county_auctions_2026')
    .select('*', { count: 'exact', head: true })

  console.log('✅ Import complete!\n')
  console.log('📊 Summary:')
  console.log(`   Total counties in database: ${count}`)

  // Count by state
  const { data: byState } = await supabase
    .from('county_auctions_2026')
    .select('state')

  const stateCounts = {}
  byState?.forEach(row => {
    stateCounts[row.state] = (stateCounts[row.state] || 0) + 1
  })

  console.log('\n   Counties by state:')
  Object.keys(stateCounts).sort().forEach(state => {
    console.log(`      ${state}: ${stateCounts[state]}`)
  })

  // Show upcoming auctions
  const { data: upcoming } = await supabase
    .from('county_auctions_2026')
    .select('*')
    .not('auction_date', 'is', null)
    .order('auction_date', { ascending: true })
    .limit(5)

  if (upcoming && upcoming.length > 0) {
    console.log('\n   📅 Next 5 upcoming auctions:')
    upcoming.forEach(auction => {
      console.log(`      ${auction.auction_date}: ${auction.county}, ${auction.state} (${auction.platform})`)
    })
  }

  console.log('\n🎯 Next steps:')
  console.log('   1. Visit /counties to see the full auction calendar')
  console.log('   2. Deploy to Vercel: vercel --prod')
}

main().catch(console.error)
