/**
 * County Auction Data API
 * Returns comprehensive 2026 auction schedule across all states
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// This would normally load from a database or JSON file
// For now, returning a sample to demonstrate structure
const COUNTY_AUCTIONS = [
  {
    county: "St. Johns",
    state: "FL",
    saleType: "Tax lien certificate",
    platform: "Zeus Auction",
    registrationUrl: "https://www.zeusauction.com",
    auctionDate: "2026-05-29",
    saleDateWindow: "May 29, 2026 @ 9:00 AM",
    format: "Online",
    notes: "One of the few FL counties running its own platform. 4,535 properties, $22.3M in delinquent taxes.",
    sourceUrl: "https://sjctax.us/tax-certificate-sales/"
  },
  {
    county: "Jefferson",
    state: "AL",
    saleType: "Tax lien certificate",
    platform: "GovEase",
    registrationUrl: "https://www.govease.com",
    auctionDate: null,
    saleDateWindow: "May 5-14 range (historically)",
    format: "Online",
    notes: "Two divisions (Bessemer and Birmingham) may have separate sale dates; both run via GovEase.",
    sourceUrl: "https://www.jccal.org/Default.asp?ID=2350&pg=Tax"
  },
  {
    county: "Mobile",
    state: "AL",
    saleType: "Tax lien certificate",
    platform: "GovEase",
    registrationUrl: "https://www.govease.com",
    auctionDate: "2026-05-11",
    saleDateWindow: "May 11, 2026, 8:30am–4:00pm CDT",
    format: "Online",
    notes: "Annual sale held between March 1 and June 15; parcel list published no later than March 30, 2026.",
    sourceUrl: "https://mobilecopropertytax.com/taxliensale/"
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const state = searchParams.get('state')
  const platform = searchParams.get('platform')
  const search = searchParams.get('search')?.toLowerCase()

  let filtered = [...COUNTY_AUCTIONS]

  // Filter by state
  if (state && state !== 'all') {
    filtered = filtered.filter(c => c.state === state)
  }

  // Filter by platform
  if (platform && platform !== 'all') {
    filtered = filtered.filter(c => c.platform.toLowerCase().includes(platform.toLowerCase()))
  }

  // Search filter
  if (search) {
    filtered = filtered.filter(c =>
      c.county.toLowerCase().includes(search) ||
      c.state.toLowerCase().includes(search) ||
      c.platform.toLowerCase().includes(search)
    )
  }

  // Sort by auction date (upcoming first)
  filtered.sort((a, b) => {
    if (!a.auctionDate) return 1
    if (!b.auctionDate) return -1
    return new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime()
  })

  return NextResponse.json({
    counties: filtered,
    total: filtered.length,
    allStates: [...new Set(COUNTY_AUCTIONS.map(c => c.state))].sort()
  })
}
