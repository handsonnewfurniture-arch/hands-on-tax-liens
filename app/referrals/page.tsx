'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Copy,
  Check,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Star,
  Trophy,
  Share2,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ReferralDashboard() {
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    total_referrals: 0,
    successful_referrals: 0,
    pending_referrals: 0,
    free_months_earned: 0,
    pending_free_months: 0,
    current_tier: 'pro' as 'starter' | 'pro' | 'elite',
    rank: null as number | null,
    badges: [] as string[]
  })

  // Mock user referral code
  const referralCode = 'TIGER-A7B3'
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${referralCode}`

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // TODO: Replace with actual API call
    // For now, using mock data
    setStats({
      total_referrals: 3,
      successful_referrals: 2,
      pending_referrals: 1,
      free_months_earned: 2,
      pending_free_months: 1,
      current_tier: 'pro',
      rank: 12,
      badges: ['starter', 'rising_star']
    })
  }

  const getTierValue = (tier: 'starter' | 'pro' | 'elite') => {
    const values = {
      starter: 29,
      pro: 79,
      elite: 199
    }
    return values[tier]
  }

  const getTierName = (tier: string) => {
    const names: { [key: string]: string } = {
      starter: 'Starter',
      pro: 'Pro',
      elite: 'Elite'
    }
    return names[tier] || tier
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareVia = (platform: string) => {
    const text = encodeURIComponent(
      `I've been using Hands On Tax Liens to find tax lien investment opportunities. Get 30% off your first 3 months with my link!`
    )
    const url = encodeURIComponent(referralLink)

    const urls: { [key: string]: string } = {
      email: `mailto:?subject=Check out Hands On Tax Liens&body=${text}%0A%0A${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const getBadgeInfo = (badge: string) => {
    const badges: { [key: string]: { label: string; icon: string; color: string } } = {
      starter: { label: 'Starter', icon: '🌟', color: 'blue' },
      rising_star: { label: 'Rising Star', icon: '⭐', color: 'gold' },
      super_referrer: { label: 'Super Referrer', icon: '💫', color: 'purple' },
      elite_advocate: { label: 'Elite Advocate', icon: '🏆', color: 'emerald' },
      legend: { label: 'Legend', icon: '👑', color: 'red' }
    }
    return badges[badge] || { label: badge, icon: '⚡', color: 'gray' }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Share the Wealth 🎁
            </h1>
            <p className="text-xl text-forest-600">
              Earn 1 free month of your plan for every friend who subscribes. Your friends get 30% off. Everyone wins!
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="text-forest-700 font-semibold">
                You're on {getTierName(stats.current_tier)} - Each referral worth ${getTierValue(stats.current_tier)}/month
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="blue">{stats.total_referrals} total</Badge>
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-1">
                {stats.successful_referrals}
              </div>
              <div className="text-sm text-forest-600">Successful Referrals</div>
              {stats.pending_referrals > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {stats.pending_referrals} pending
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="emerald">Free Months</Badge>
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-1">
                {stats.free_months_earned}
              </div>
              <div className="text-sm text-forest-600">
                Free Months Earned (${getTierValue(stats.current_tier) * stats.free_months_earned} value)
              </div>
              {stats.pending_free_months > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  +{stats.pending_free_months} pending
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                {stats.rank && stats.rank <= 10 && (
                  <Badge variant="gold">Top {stats.rank}</Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-1">
                {stats.rank ? `#${stats.rank}` : 'Unranked'}
              </div>
              <div className="text-sm text-forest-600">Leaderboard Rank</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-gold-600" />
                </div>
                <Badge variant="gold">{stats.badges.length} earned</Badge>
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-1">
                {stats.badges.length > 0 ? getBadgeInfo(stats.badges[stats.badges.length - 1]).icon : '🎯'}
              </div>
              <div className="text-sm text-forest-600">Current Badge</div>
            </Card>
          </div>

          {/* Referral Link Section */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-forest-50 to-beige-50 border-2 border-forest-200">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-forest-900 mb-4">
                Your Unique Referral Link
              </h2>
              <p className="text-forest-600 mb-6">
                Share this link to earn 1 free month of {getTierName(stats.current_tier)} (${getTierValue(stats.current_tier)} value) for every paid subscription
              </p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 bg-white border-2 border-forest-300 rounded-xl px-6 py-4 font-mono text-forest-900 text-left overflow-x-auto">
                  {referralLink}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? 'emerald' : 'primary'}
                  className="flex items-center whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => shareVia('email')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  onClick={() => shareVia('whatsapp')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => shareVia('facebook')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  onClick={() => shareVia('twitter')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  onClick={() => shareVia('linkedin')}
                  variant="secondary"
                  size="sm"
                  className="flex items-center"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* How It Works */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-forest-900 mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">Share Your Link</h4>
                    <p className="text-sm text-forest-600">
                      Copy your unique referral link and share it with friends via email, social media, or text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">They Get a Discount</h4>
                    <p className="text-sm text-forest-600">
                      Your friends get 30% off their first 3 months when they sign up using your link.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-gold-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">You Get Free Months</h4>
                    <p className="text-sm text-forest-600">
                      Earn 1 free month of your current plan for every friend who subscribes. Unlimited referrals! (Worth ${getTierValue(stats.current_tier)}/month on {getTierName(stats.current_tier)})
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rewards Tiers */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-forest-900 mb-6">Unlock Rewards</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <div className="font-bold text-forest-900">Starter</div>
                      <div className="text-xs text-forest-600">1 successful referral</div>
                    </div>
                  </div>
                  {stats.successful_referrals >= 1 && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gold-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="font-bold text-forest-900">Rising Star</div>
                      <div className="text-xs text-forest-600">5 referrals → $50 marketplace credit</div>
                    </div>
                  </div>
                  {stats.successful_referrals >= 5 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-500">{5 - stats.successful_referrals} to go</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💫</span>
                    <div>
                      <div className="font-bold text-forest-900">Super Referrer</div>
                      <div className="text-xs text-forest-600">10 referrals → 6 months Elite FREE</div>
                    </div>
                  </div>
                  {stats.successful_referrals >= 10 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-500">{10 - stats.successful_referrals} to go</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-bold text-forest-900">Elite Advocate</div>
                      <div className="text-xs text-forest-600">25 referrals → Annual summit speaker</div>
                    </div>
                  </div>
                  {stats.successful_referrals >= 25 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-500">{25 - stats.successful_referrals} to go</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <div className="font-bold text-forest-900">Legend</div>
                      <div className="text-xs text-forest-600">50 referrals → Lifetime Elite</div>
                    </div>
                  </div>
                  {stats.successful_referrals >= 50 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-xs text-gray-500">{50 - stats.successful_referrals} to go</span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sharing Ideas */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-forest-900 mb-6">
              💡 Sharing Ideas That Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-forest-900">Social Media</h4>
                <p className="text-sm text-forest-600">
                  Post in real estate investor Facebook groups, LinkedIn, or Twitter. Mention the 30% discount!
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-forest-900">Personal Outreach</h4>
                <p className="text-sm text-forest-600">
                  Send 1-on-1 emails or texts to investor friends. Personal messages convert best!
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-forest-900">REIA Meetings</h4>
                <p className="text-sm text-forest-600">
                  Mention it at your local real estate investor association meetings or meetups.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
