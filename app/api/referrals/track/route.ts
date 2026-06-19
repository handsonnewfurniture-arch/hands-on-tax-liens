/**
 * Referral Tracking API
 * Tracks clicks, sign-ups, and conversions
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

// POST - Track referral event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      referral_code,
      event_type, // 'click', 'signup', 'conversion'
      referee_email,
      referee_user_id,
      conversion_details
    } = body

    if (!referral_code || !event_type) {
      return NextResponse.json(
        { error: 'referral_code and event_type required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find referral by code
    const { data: referral, error: findError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', referral_code)
      .neq('referee_email', 'placeholder@placeholder.com')
      .single()

    if (findError || !referral) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Handle different event types
    switch (event_type) {
      case 'click':
        if (referral.status === 'pending') {
          updateData = {
            ...updateData,
            status: 'clicked',
            clicked_at: new Date().toISOString(),
            referee_ip: ip,
            user_agent: userAgent
          }
        }
        break

      case 'signup':
        if (!referee_email) {
          return NextResponse.json(
            { error: 'referee_email required for signup tracking' },
            { status: 400 }
          )
        }

        // Check if this email already signed up via another referral
        const { data: existingSignup } = await supabase
          .from('referrals')
          .select('id')
          .eq('referee_email', referee_email)
          .eq('status', 'signed_up')
          .neq('id', referral.id)
          .single()

        if (existingSignup) {
          return NextResponse.json(
            { error: 'Email already signed up via another referral' },
            { status: 409 }
          )
        }

        updateData = {
          ...updateData,
          status: 'signed_up',
          referee_email,
          referee_user_id: referee_user_id || null,
          signed_up_at: new Date().toISOString(),
          referee_ip: ip
        }
        break

      case 'conversion':
        if (!conversion_details) {
          return NextResponse.json(
            { error: 'conversion_details required' },
            { status: 400 }
          )
        }

        const {
          type, // 'subscription' or 'listing'
          tier, // 'starter', 'pro', 'elite'
          value, // dollar amount
          stripe_subscription_id,
          stripe_payment_intent
        } = conversion_details

        // Get referrer's current tier
        const { data: referrerProfile } = await supabase
          .from('users')
          .select('subscription_tier')
          .eq('id', referral.referrer_user_id)
          .single()

        const referrerTier = referrerProfile?.subscription_tier || 'starter'
        const tierValues: { [key: string]: number } = {
          starter: 29,
          pro: 79,
          elite: 199
        }

        updateData = {
          ...updateData,
          status: 'converted',
          conversion_type: type,
          conversion_tier: tier,
          conversion_value: value,
          converted_at: new Date().toISOString(),
          referrer_current_tier: referrerTier,
          referrer_reward_amount: tierValues[referrerTier]
        }

        // Create pending reward
        await supabase
          .from('referral_rewards')
          .insert({
            referral_id: referral.id,
            user_id: referral.referrer_user_id,
            reward_type: 'free_month',
            reward_amount: tierValues[referrerTier],
            reward_tier: referrerTier,
            status: 'pending', // Will be approved after 30-day retention
            payment_method: 'subscription_credit'
          })

        // Update referral stats
        await supabase.rpc('update_referral_stats_for_user', {
          p_user_id: referral.referrer_user_id
        })

        break

      default:
        return NextResponse.json(
          { error: 'Invalid event_type' },
          { status: 400 }
        )
    }

    // Update referral
    const { data: updatedReferral, error: updateError } = await supabase
      .from('referrals')
      .update(updateData)
      .eq('id', referral.id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      referral: updatedReferral,
      event_type
    })

  } catch (error) {
    console.error('Error tracking referral:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to track referral',
        success: false
      },
      { status: 500 }
    )
  }
}
