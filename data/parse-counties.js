const fs = require('fs')

// Your full CSV data
const csvData = `County,State,Sale Type,Platform,Auction Registration URL,2026 Sale Date / Window,Format,Notes,Source URL,Auction Date
Jefferson,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Jefferson County, AL — Birmingham and Bessemer divisions)",Confirm current year date with county — prior years held in May (e.g. May 5–May 14 range historically),Online only — no in-person registration or auction,Two divisions (Bessemer and Birmingham) may have separate sale dates; both run via GovEase.,https://www.jccal.org/Default.asp?ID=2350&pg=Tax,Not yet confirmed — see Sale Date/Window column
Madison,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Madison County, AL)",Registration opens 30 days prior to auction; confirm exact 2026 date with county,Online,First right of refusal to repurchase the lien at the same rate the following year if the property becomes delinquent again.,https://www.madisoncountyal.gov/departments/tax-collector/tax-sale,Not yet confirmed — see Sale Date/Window column
Mobile,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Mobile County, AL)","May 11, 2026, 8:30am–4:00pm CDT (continues daily until complete)",Online,"Annual sale held between March 1 and June 15; parcel list published no later than March 30, 2026.",https://mobilecopropertytax.com/taxliensale/,2026-05-11
Shelby,AL,Tax lien certificate,GovEase,http://taxlienauction.shelbyal.com/ (links to GovEase registration),"Registration opened March 3, closed March 30, 2026",Online,"Dedicated county subdomain for tax lien info, registration handled via GovEase.",http://taxlienauction.shelbyal.com/,2026-03-30
Tuscaloosa,AL,Tax lien certificate,GovEase,"https://www.govease.com (register, then select Tuscaloosa County, AL)","April 29, 2026, 9:00am (continues until complete)",Online,"Max bid 12% simple interest, prorated monthly; lowest acceptable bid 0%.",https://www.tuscco.com/government/departments/tax-collector/tax-lien-sale/,2026-04-29
St. Johns,FL,Tax lien certificate,County-run (sjctax.us),https://sjctax.us/tax-certificate-sales/,05/29/2026,Online,One of the few FL counties running its own platform rather than LienHub/RealAuction.,https://floridarevenue.com/property/Documents/2026TaxCertSale.pdf,2026-05-29`

// Parse CSV
const lines = csvData.trim().split('\n')
const counties = []

for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  const match = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),"([^"]+)",([^,]+),([^,]+),([^,]+),([^,]+),(.+)$/)
  
  if (match) {
    const auctionDateRaw = match[10].trim()
    const auctionDate = auctionDateRaw && !auctionDateRaw.includes('Not yet confirmed') && !auctionDateRaw.includes('see Sale Date') && !auctionDateRaw.includes('Recurring')
      ? auctionDateRaw
      : null
    
    counties.push({
      county: match[1].trim(),
      state: match[2].trim(),
      saleType: match[3].trim(),
      platform: match[4].trim(),
      registrationUrl: match[5].trim(),
      saleDateWindow: match[6].trim(),
      format: match[7].trim(),
      notes: match[8].trim(),
      sourceUrl: match[9].trim(),
      auctionDate
    })
  }
}

fs.writeFileSync('county-auctions-2026.json', JSON.stringify(counties, null, 2))
console.log(`✅ Parsed ${counties.length} counties`)
