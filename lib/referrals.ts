/**
 * Referral System Utilities
 * Helper functions for referral tracking and management
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Get referral code from cookie
export function getReferralCodeFromCookie(): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  const refCookie = cookies.find(c => c.trim().startsWith('ref_code='))

  if (refCookie) {
    return refCookie.split('=')[1]
  }

  return null
}

// Set referral code in cookie
export function setReferralCodeCookie(code: string, days: number = 30) {
  if (typeof document === 'undefined') return

  const expires = new Date()
  expires.setDate(expires.getDate() + days)

  document.cookie = `ref_code=${code}; expires=${expires.toUTCString()}; path=/`
}

// Clear referral code cookie
export function clearReferralCodeCookie() {
  if (typeof document === 'undefined') return

  document.cookie = 'ref_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

// Validate referral code format
export function isValidReferralCode(code: string): boolean {
  // Format: XXXX-XXXX or USERNAME-XXXX
  const pattern = /^[A-Z0-9]+-[A-Z0-9]{4}$/
  return pattern.test(code)
}

// Track referral signup
export async function trackReferralSignup(email: string, userId?: string) {
  try {
    const referralCode = getReferralCodeFromCookie()

    if (!referralCode) {
      console.log('No referral code found in cookie')
      return null
    }

    const response = await fetch('/api/referrals/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'signup',
        referee_email: email,
        referee_user_id: userId
      })
    })

    const data = await response.json()

    if (data.success) {
      console.log('Referral signup tracked successfully')
      // Don't clear cookie yet - wait for conversion
    }

    return data
  } catch (error) {
    console.error('Failed to track referral signup:', error)
    return null
  }
}

// Track referral conversion (subscription purchase)
export async function trackReferralConversion(params: {
  email: string
  userId: string
  tier: 'starter' | 'pro' | 'elite'
  value: number
  subscriptionId: string
  paymentIntent?: string
}) {
  try {
    const referralCode = getReferralCodeFromCookie()

    if (!referralCode) {
      console.log('No referral code found in cookie')
      return null
    }

    const response = await fetch('/api/referrals/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'conversion',
        referee_email: params.email,
        referee_user_id: params.userId,
        conversion_details: {
          type: 'subscription',
          tier: params.tier,
          value: params.value,
          stripe_subscription_id: params.subscriptionId,
          stripe_payment_intent: params.paymentIntent
        }
      })
    })

    const data = await response.json()

    if (data.success) {
      console.log('Referral conversion tracked successfully')
      // Clear cookie after successful conversion
      clearReferralCodeCookie()
    }

    return data
  } catch (error) {
    console.error('Failed to track referral conversion:', error)
    return null
  }
}

// Get user's referral stats
export async function getUserReferralStats(userId: string) {
  try {
    const response = await fetch(`/api/referrals?user_id=${userId}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Failed to fetch referral stats:', error)
    return null
  }
}

// Get referral leaderboard
export async function getReferralLeaderboard(limit: number = 100, period: 'all_time' | 'this_month' | 'this_week' = 'all_time') {
  try {
    const response = await fetch(`/api/referrals/leaderboard?limit=${limit}&period=${period}`)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return null
  }
}

// Calculate tier value for rewards
export function getTierMonthlyValue(tier: 'starter' | 'pro' | 'elite'): number {
  const tierValues = {
    starter: 29,
    pro: 79,
    elite: 199
  }
  return tierValues[tier]
}

// Check if user qualifies for milestone reward
export function checkMilestoneRewards(successfulReferrals: number): {
  milestone: number
  reward: string
  unlocked: boolean
}[] {
  const milestones = [
    { count: 3, reward: '$50 marketplace credit' },
    { count: 5, reward: 'Upgrade to next tier for 3 months' },
    { count: 10, reward: 'Elite upgrade for 6 months' },
    { count: 25, reward: 'Annual summit speaker slot' },
    { count: 50, reward: 'Lifetime Elite membership' }
  ]

  return milestones.map(m => ({
    milestone: m.count,
    reward: m.reward,
    unlocked: successfulReferrals >= m.count
  }))
}

// Get badge for referral count
export function getBadgeForReferrals(count: number): {
  name: string
  emoji: string
  color: string
} | null {
  if (count >= 50) return { name: 'Legend', emoji: '👑', color: 'red' }
  if (count >= 25) return { name: 'Elite Advocate', emoji: '🏆', color: 'emerald' }
  if (count >= 10) return { name: 'Super Referrer', emoji: '💫', color: 'purple' }
  if (count >= 5) return { name: 'Rising Star', emoji: '⭐', color: 'gold' }
  if (count >= 1) return { name: 'Starter', emoji: '🌟', color: 'blue' }
  return null
}

// Format share message for different platforms
export function getShareMessage(referralLink: string, platform: 'email' | 'sms' | 'social'): string {
  const messages = {
    email: `I've been using Hands On Tax Liens to find tax lien investment opportunities. Get 30% off your first 3 months with my link: ${referralLink}`,
    sms: `Check out Hands On Tax Liens for tax lien investing. Get 30% off: ${referralLink}`,
    social: `Learning tax lien investing with @HandsOnTaxLiens 📈 Get 30% off with my link: ${referralLink}`
  }

  return messages[platform]
}
