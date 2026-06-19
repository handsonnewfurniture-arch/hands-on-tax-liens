/**
 * Featured Deals API - Returns the best deals for homepage
 * Scoring based on: low opening bid, high assessed value, good location
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get active listings with property data
    const { data: listings, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'active')
      .not('assessed_value', 'is', null)
      .not('opening_bid', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500) // Get larger pool to score

    if (error) throw error

    // Score each listing (higher is better)
    const scoredListings = (listings || []).map(listing => {
      let score = 0

      // Discount percentage (higher discount = better deal)
      if (listing.assessed_value && listing.opening_bid) {
        const discount = ((listing.assessed_value - listing.opening_bid) / listing.assessed_value) * 100
        score += Math.min(discount * 2, 100) // Max 100 points for 50%+ discount
      }

      // Low opening bid (under $10k is attractive)
      if (listing.opening_bid < 10000) {
        score += 30
      } else if (listing.opening_bid < 25000) {
        score += 20
      } else if (listing.opening_bid < 50000) {
        score += 10
      }

      // Has images (more professional listing)
      if (listing.images && listing.images.length > 0) {
        score += 20
      }

      // Has property description
      if (listing.property_description && listing.property_description.length > 50) {
        score += 10
      }

      // Property type preference (residential > land > commercial)
      if (listing.property_type === 'residential') {
        score += 15
      } else if (listing.property_type === 'land') {
        score += 10
      }

      // Recent listing (posted in last 7 days)
      const daysSincePosted = (Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSincePosted <= 7) {
        score += 15
      }

      return {
        ...listing,
        deal_score: Math.round(score),
        discount_percentage: listing.assessed_value && listing.opening_bid
          ? Math.round(((listing.assessed_value - listing.opening_bid) / listing.assessed_value) * 100)
          : null
      }
    })

    // Sort by score and return top deals
    const topDeals = scoredListings
      .sort((a, b) => b.deal_score - a.deal_score)
      .slice(0, limit)

    return NextResponse.json({
      deals: topDeals,
      total: topDeals.length,
      success: true
    })

  } catch (error) {
    console.error('Error fetching featured deals:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch deals',
        deals: [],
        total: 0,
        success: false
      },
      { status: 500 }
    )
  }
}
