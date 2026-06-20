/**
 * Cron Job: Auto-Approve Referral Rewards
 * Runs daily to approve rewards after 30-day retention period
 *
 * Setup in Vercel:
 * 1. Go to Project Settings → Cron Jobs
 * 2. Schedule: 0 2 * * * (Daily at 2 AM)
 * 3. Path: /api/cron/approve-rewards
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

    // Find rewards pending approval for 30+ days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: pendingRewards, error: queryError } = await supabase
      .from('referral_rewards')
      .select(`
        id,
        user_id,
        reward_amount,
        referral:referrals (
          id,
          converted_at,
          referee_email
        )
      `)
      .eq('status', 'pending')
      .lt('referral.converted_at', thirtyDaysAgo.toISOString())

    if (queryError) throw queryError

    const approvedRewards: string[] = []
    const failedRewards: string[] = []

    // Auto-approve each eligible reward
    for (const reward of pendingRewards || []) {
      try {
        const { error: updateError } = await supabase
          .from('referral_rewards')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', reward.id)

        if (updateError) throw updateError

        approvedRewards.push(reward.id)

        console.log(`✅ Approved reward ${reward.id} for user ${reward.user_id} ($${reward.reward_amount})`)

      } catch (error) {
        console.error(`❌ Failed to approve reward ${reward.id}:`, error)
        failedRewards.push(reward.id)
      }
    }

    return NextResponse.json({
      success: true,
      approved: approvedRewards.length,
      failed: failedRewards.length,
      total_checked: (pendingRewards || []).length,
      approved_ids: approvedRewards,
      failed_ids: failedRewards,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to approve rewards',
        success: false
      },
      { status: 500 }
    )
  }
}
