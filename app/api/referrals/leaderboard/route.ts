/**
 * Referral Leaderboard API
 * Returns top referrers
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const period = searchParams.get('period') || 'all_time' // 'all_time', 'this_month', 'this_week'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get base leaderboard
    let query = supabase
      .from('referral_stats')
      .select('*')
      .gt('successful_referrals', 0)
      .order('successful_referrals', { ascending: false })
      .order('total_value_generated', { ascending: false })
      .limit(limit)

    const { data: leaderboard, error } = await query

    if (error) throw error

    // For period-based leaderboards, calculate from referrals
    if (period === 'this_month' || period === 'this_week') {
      const startDate = new Date()
      if (period === 'this_month') {
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
      } else {
        // Start of week (Sunday)
        const day = startDate.getDay()
        startDate.setDate(startDate.getDate() - day)
        startDate.setHours(0, 0, 0, 0)
      }

      const { data: periodReferrals } = await supabase
        .from('referrals')
        .select('referrer_user_id, referrer_email, conversion_value')
        .eq('status', 'converted')
        .gte('converted_at', startDate.toISOString())

      // Aggregate by user
      const periodStats: { [key: string]: any } = {}
      periodReferrals?.forEach(ref => {
        if (!periodStats[ref.referrer_user_id]) {
          periodStats[ref.referrer_user_id] = {
            user_id: ref.referrer_user_id,
            email: ref.referrer_email,
            referrals: 0,
            total_value: 0
          }
        }
        periodStats[ref.referrer_user_id].referrals += 1
        periodStats[ref.referrer_user_id].total_value += ref.conversion_value || 0
      })

      // Sort and format
      const periodLeaderboard = Object.values(periodStats)
        .sort((a, b) => b.referrals - a.referrals || b.total_value - a.total_value)
        .slice(0, limit)
        .map((stat, index) => ({
          ...stat,
          rank: index + 1,
          period
        }))

      return NextResponse.json({
        success: true,
        leaderboard: periodLeaderboard,
        period,
        count: periodLeaderboard.length
      })
    }

    // Add ranks to all-time leaderboard
    const rankedLeaderboard = leaderboard.map((stat, index) => ({
      ...stat,
      rank: index + 1
    }))

    return NextResponse.json({
      success: true,
      leaderboard: rankedLeaderboard,
      period: 'all_time',
      count: rankedLeaderboard.length
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
        success: false
      },
      { status: 500 }
    )
  }
}
