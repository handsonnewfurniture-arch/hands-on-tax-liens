/**
 * Direct CSV import to county_auctions_2026 table
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Importing County Auctions from CSV...\n')

  const csvPath = path.join(__dirname, '../data/county-auctions-2026-full.csv')

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath)
    return
  }

  const counties = []

  // Parse CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => counties.push(row))
      .on('end', resolve)
      .on('error', reject)
  })

  console.log(`📊 Parsed ${counties.length} counties from CSV\n`)

  // Transform to database format
  const records = counties.map(row => {
    let auctionDate = null
    const dateStr = row['Auction Date']?.trim()

    if (dateStr && dateStr !== 'Not yet confirmed — see Sale Date/Window column' && dateStr !== '') {
      try {
        const parsed = new Date(dateStr)
        if (!isNaN(parsed.getTime())) {
          auctionDate = parsed.toISOString().split('T')[0]
        }
      } catch (e) {
        console.log(`⚠️  Could not parse date for ${row.County}, ${row.State}: ${dateStr}`)
      }
    }

    return {
      county: row.County?.trim(),
      state: row.State?.trim(),
      sale_type: row['Sale Type']?.trim(),
      platform: row.Platform?.trim(),
      registration_url: row['Auction Registration URL']?.trim(),
      auction_date: auctionDate,
      sale_date_window: row['2026 Sale Date / Window']?.trim(),
      format: row.Format?.trim(),
      notes: row.Notes?.trim() || null,
      source_url: row['Source URL']?.trim()
    }
  }).filter(r => r.county && r.state) // Filter out any invalid rows

  console.log(`✅ Transformed ${records.length} valid records\n`)
  console.log('📤 Importing to database...\n')

  // Batch upsert
  const batchSize = 50
  let imported = 0

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    const { data, error } = await supabase
      .from('county_auctions_2026')
      .upsert(batch, {
        onConflict: 'county,state',
        ignoreDuplicates: false
      })

    if (error) {
      console.error(`❌ Error importing batch ${Math.floor(i/batchSize) + 1}:`, error.message)
    } else {
      imported += batch.length
      console.log(`✅ Imported batch ${Math.floor(i/batchSize) + 1} (${imported}/${records.length})`)
    }
  }

  console.log(`\n🎉 Import complete! ${imported} counties imported\n`)

  // Get summary stats
  const { data: allCounties } = await supabase
    .from('county_auctions_2026')
    .select('*')

  if (allCounties) {
    console.log('📊 Database Summary:')
    console.log(`   Total counties: ${allCounties.length}`)

    // Group by state
    const byState = {}
    allCounties.forEach(c => {
      byState[c.state] = (byState[c.state] || 0) + 1
    })

    console.log('\n📍 Counties by State:')
    Object.entries(byState)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([state, count]) => {
        console.log(`   ${state}: ${count}`)
      })

    // Upcoming auctions
    const upcoming = allCounties
      .filter(c => c.auction_date)
      .sort((a, b) => new Date(a.auction_date) - new Date(b.auction_date))
      .slice(0, 10)

    console.log('\n📅 Next 10 Upcoming Auctions:')
    upcoming.forEach(c => {
      console.log(`   ${c.auction_date} - ${c.county}, ${c.state} (${c.platform})`)
    })
  }
}

main().catch(console.error)
