/**
 * Cron Job: Update Leaderboard Ranks
 * Runs hourly to recalculate referral leaderboard rankings
 *
 * Setup in Vercel:
 * 1. Go to Project Settings → Cron Jobs
 * 2. Schedule: 0 * * * * (Hourly)
 * 3. Path: /api/cron/update-ranks
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (optional security)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the database function to recalculate ranks
    const { error } = await supabase.rpc('calculate_referral_ranks')

    if (error) throw error

    // Get stats after update
    const { data: stats, error: statsError } = await supabase
      .from('referral_stats')
      .select('user_id, rank, successful_referrals')
      .gt('successful_referrals', 0)
      .order('rank', { ascending: true })
      .limit(10)

    if (statsError) throw statsError

    console.log(`✅ Updated leaderboard ranks for ${stats?.length || 0} users`)

    return NextResponse.json({
      success: true,
      users_ranked: stats?.length || 0,
      top_10: stats || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update ranks',
        success: false
      },
      { status: 500 }
    )
  }
}
