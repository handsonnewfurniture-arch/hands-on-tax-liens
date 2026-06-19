/**
 * Referral Rewards API
 * Manage and fulfill referral rewards
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia'
})

export const dynamic = 'force-dynamic'

// GET - Get user's rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status') // 'pending', 'approved', 'delivered'

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from('referral_rewards')
      .select(`
        *,
        referral:referrals(
          referee_email,
          conversion_tier,
          converted_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: rewards, error } = await query

    if (error) throw error

    // Calculate totals
    const totals = {
      pending: rewards.filter(r => r.status === 'pending').length,
      pending_value: rewards
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0),
      delivered: rewards.filter(r => r.status === 'delivered').length,
      delivered_value: rewards
        .filter(r => r.status === 'delivered')
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0),
      total_free_months: rewards
        .filter(r => r.status === 'delivered' && r.reward_type === 'free_month')
        .length
    }

    return NextResponse.json({
      success: true,
      rewards: rewards || [],
      totals
    })

  } catch (error) {
    console.error('Error fetching rewards:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch rewards',
        success: false
      },
      { status: 500 }
    )
  }
}

// POST - Approve and fulfill reward
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      reward_id,
      action // 'approve', 'deliver', 'cancel'
    } = body

    if (!reward_id || !action) {
      return NextResponse.json(
        { error: 'reward_id and action required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get reward
    const { data: reward, error: fetchError } = await supabase
      .from('referral_rewards')
      .select('*, referral:referrals(*)')
      .eq('id', reward_id)
      .single()

    if (fetchError || !reward) {
      return NextResponse.json(
        { error: 'Reward not found' },
        { status: 404 }
      )
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    switch (action) {
      case 'approve':
        // Check if 30 days have passed since conversion
        const convertedAt = new Date(reward.referral.converted_at)
        const daysSinceConversion = (Date.now() - convertedAt.getTime()) / (1000 * 60 * 60 * 24)

        if (daysSinceConversion < 30) {
          return NextResponse.json(
            {
              error: `Must wait 30 days after conversion. ${Math.ceil(30 - daysSinceConversion)} days remaining.`,
              success: false
            },
            { status: 400 }
          )
        }

        updateData = {
          ...updateData,
          status: 'approved',
          approved_at: new Date().toISOString()
        }
        break

      case 'deliver':
        if (reward.status !== 'approved') {
          return NextResponse.json(
            { error: 'Reward must be approved first' },
            { status: 400 }
          )
        }

        // Deliver the reward based on type
        if (reward.reward_type === 'free_month') {
          // Get user's subscription
          const { data: user } = await supabase
            .from('users')
            .select('stripe_customer_id, stripe_subscription_id')
            .eq('id', reward.user_id)
            .single()

          if (!user?.stripe_subscription_id) {
            return NextResponse.json(
              { error: 'User has no active subscription' },
              { status: 400 }
            )
          }

          // Update Stripe subscription with 1 free month
          // This extends the billing cycle by 1 month
          const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id)

          // Calculate new billing date (add 1 month)
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
          const newBillingDate = Math.floor(currentPeriodEnd.getTime() / 1000)

          await stripe.subscriptions.update(user.stripe_subscription_id, {
            billing_cycle_anchor: newBillingDate,
            proration_behavior: 'none'
          })

          updateData = {
            ...updateData,
            status: 'delivered',
            delivered_at: new Date().toISOString(),
            payment_reference: user.stripe_subscription_id
          }

          // Update stats
          await supabase
            .from('referral_stats')
            .update({
              free_months_redeemed: supabase.raw('free_months_redeemed + 1'),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', reward.user_id)
        }

        else if (reward.reward_type === 'marketplace_credit') {
          // Add marketplace credit to user account
          // TODO: Implement marketplace credit system
          updateData = {
            ...updateData,
            status: 'delivered',
            delivered_at: new Date().toISOString()
          }
        }

        else if (reward.reward_type === 'tier_upgrade') {
          // Upgrade user's tier
          const { data: user } = await supabase
            .from('users')
            .select('subscription_tier')
            .eq('id', reward.user_id)
            .single()

          const tierUpgrades: { [key: string]: string } = {
            starter: 'pro',
            pro: 'elite'
          }

          const newTier = tierUpgrades[user?.subscription_tier || 'starter']

          // Update Stripe subscription to new tier
          // TODO: Implement tier upgrade logic

          updateData = {
            ...updateData,
            status: 'delivered',
            delivered_at: new Date().toISOString()
          }
        }
        break

      case 'cancel':
        updateData = {
          ...updateData,
          status: 'cancelled'
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update reward
    const { data: updatedReward, error: updateError } = await supabase
      .from('referral_rewards')
      .update(updateData)
      .eq('id', reward_id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      reward: updatedReward,
      action
    })

  } catch (error) {
    console.error('Error processing reward:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process reward',
        success: false
      },
      { status: 500 }
    )
  }
}
