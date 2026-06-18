/**
 * County Auctions 2026 Calendar API
 * Returns comprehensive auction schedule from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build query
    let query = supabase
      .from('county_auctions_2026')
      .select('*')

    // Filter by state
    const state = searchParams.get('state')
    if (state && state !== 'all') {
      query = query.eq('state', state)
    }

    // Filter by platform
    const platform = searchParams.get('platform')
    if (platform && platform !== 'all') {
      query = query.ilike('platform', `%${platform}%`)
    }

    // Search
    const search = searchParams.get('search')
    if (search) {
      query = query.or(`county.ilike.%${search}%,state.ilike.%${search}%,platform.ilike.%${search}%`)
    }

    // Sort by auction date (upcoming first, nulls last)
    query = query.order('auction_date', { ascending: true, nullsLast: true })

    const { data, error, count } = await query

    if (error) throw error

    // Get unique states for filter
    const { data: allCounties } = await supabase
      .from('county_auctions_2026')
      .select('state')

    const states = [...new Set(allCounties?.map(c => c.state) || [])].sort()

    return NextResponse.json({
      counties: data || [],
      total: count || data?.length || 0,
      states,
      success: true
    })

  } catch (error) {
    console.error('Error fetching counties:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch counties',
        counties: [],
        total: 0,
        states: [],
        success: false
      },
      { status: 500 }
    )
  }
}
