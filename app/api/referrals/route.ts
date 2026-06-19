/**
 * Referrals API
 * Main endpoint for referral management
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

// Generate unique referral code
function generateReferralCode(userName?: string): string {
  const random = nanoid(4).toUpperCase()
  if (userName) {
    const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)
    return `${cleanName}-${random}`
  }
  return `REF-${random}`
}

// GET - Get user's referral info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get or create referral code for user
    const { data: existingReferrals } = await supabase
      .from('referrals')
      .select('referral_code')
      .eq('referrer_user_id', userId)
      .limit(1)
      .single()

    let referralCode = existingReferrals?.referral_code

    // If user doesn't have a code yet, create one
    if (!referralCode) {
      // Get user email for code generation
      const { data: profile } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      referralCode = generateReferralCode(profile?.full_name || profile?.email)

      // Create a placeholder referral record
      await supabase
        .from('referrals')
        .insert({
          referrer_user_id: userId,
          referrer_email: profile?.email || '',
          referee_email: 'placeholder@placeholder.com', // Will be updated when actual referral happens
          referral_code: referralCode,
          status: 'pending'
        })
    }

    // Get user's referral stats
    const { data: stats } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get user's referrals history
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', userId)
      .neq('referee_email', 'placeholder@placeholder.com')
      .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      referral_code: referralCode,
      referral_url: `${request.nextUrl.origin}/ref/${referralCode}`,
      stats: stats || {
        total_referrals: 0,
        successful_referrals: 0,
        pending_referrals: 0,
        free_months_earned: 0,
        free_months_pending: 0,
        current_tier: 'starter',
        rank: null
      },
      referrals: referrals || []
    })

  } catch (error) {
    console.error('Error fetching referral info:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch referral info',
        success: false
      },
      { status: 500 }
    )
  }
}

// POST - Create new referral
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      referrer_user_id,
      referrer_email,
      referee_email,
      referral_code
    } = body

    if (!referrer_user_id || !referrer_email || !referee_email) {
      return NextResponse.json(
        { error: 'referrer_user_id, referrer_email, and referee_email required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if referee already exists
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referee_email', referee_email)
      .single()

    if (existingReferral) {
      return NextResponse.json(
        { error: 'This email has already been referred' },
        { status: 409 }
      )
    }

    // Generate referral code if not provided
    const code = referral_code || generateReferralCode()

    // Create referral
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert({
        referrer_user_id,
        referrer_email,
        referee_email,
        referral_code: code,
        status: 'pending',
        referral_url: `${request.nextUrl.origin}/ref/${code}`
      })
      .select()
      .single()

    if (error) throw error

    // Generate discount code for referee
    const discountCode = `${code}-30OFF`

    await supabase
      .from('referral_discount_codes')
      .insert({
        code: discountCode,
        referral_id: referral.id,
        discount_type: 'percentage',
        discount_value: 30,
        duration: 'repeating',
        duration_in_months: 3
      })

    return NextResponse.json({
      success: true,
      referral,
      discount_code: discountCode
    })

  } catch (error) {
    console.error('Error creating referral:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create referral',
        success: false
      },
      { status: 500 }
    )
  }
}
