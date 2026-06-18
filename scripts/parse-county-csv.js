/**
 * Parse county auction CSV data and convert to JSON
 */

const fs = require('fs')
const path = require('path')

// Your CSV data (paste between the quotes)
const csvData = `County,State,Sale Type,Platform,Auction Registration URL,2026 Sale Date / Window,Format,Notes,Source URL,Auction Date
Jefferson,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Jefferson County, AL — Birmingham and Bessemer divisions)",Confirm current year date with county — prior years held in May (e.g. May 5–May 14 range historically),Online only — no in-person registration or auction,Two divisions (Bessemer and Birmingham) may have separate sale dates; both run via GovEase.,https://www.jccal.org/Default.asp?ID=2350&pg=Tax,Not yet confirmed — see Sale Date/Window column
Madison,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Madison County, AL)",Registration opens 30 days prior to auction; confirm exact 2026 date with county,Online,First right of refusal to repurchase the lien at the same rate the following year if the property becomes delinquent again.,https://www.madisoncountyal.gov/departments/tax-collector/tax-sale,Not yet confirmed — see Sale Date/Window column
Mobile,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Mobile County, AL)","May 11, 2026, 8:30am–4:00pm CDT (continues daily until complete)",Online,"Annual sale held between March 1 and June 15; parcel list published no later than March 30, 2026.",https://mobilecopropertytax.com/taxliensale/,2026-05-11`

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')

  const counties = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Handle quoted values with commas
    const values = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    // Map to object
    const county = {
      county: values[0],
      state: values[1],
      saleType: values[2],
      platform: values[3],
      registrationUrl: values[4],
      saleDateWindow: values[5],
      format: values[6],
      notes: values[7],
      sourceUrl: values[8],
      auctionDate: values[9] && values[9] !== 'Not yet confirmed — see Sale Date/Window column'
        ? values[9]
        : null
    }

    counties.push(county)
  }

  return counties
}

// Parse and save
const counties = parseCSV(csvData)

fs.writeFileSync(
  path.join(__dirname, '../data/county-auctions-2026.json'),
  JSON.stringify(counties, null, 2)
)

console.log(`✅ Parsed ${counties.length} counties`)
console.log(`📁 Saved to: data/county-auctions-2026.json`)

// Print summary by state
const byState = {}
counties.forEach(c => {
  if (!byState[c.state]) byState[c.state] = []
  byState[c.state].push(c)
})

console.log('\n📊 Counties by State:')
Object.keys(byState).sort().forEach(state => {
  console.log(`   ${state}: ${byState[state].length} counties`)
})
