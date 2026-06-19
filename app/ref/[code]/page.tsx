'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Gift, Star, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function ReferralLanding() {
  const params = useParams()
  const router = useRouter()
  const referralCode = params.code as string

  const [referrer, setReferrer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    if (referralCode && !tracked) {
      trackClick()
      setTracked(true)
    }
  }, [referralCode, tracked])

  const trackClick = async () => {
    try {
      // Track the click
      await fetch('/api/referrals/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: referralCode,
          event_type: 'click'
        })
      })

      // Store referral code in cookie for attribution
      document.cookie = `ref_code=${referralCode}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
    } catch (error) {
      console.error('Failed to track referral click:', error)
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Starter',
      originalPrice: 29,
      discountedPrice: 20.30,
      features: [
        'County database access',
        'Auction calendar',
        'Beginner lessons',
        'Weekly newsletter',
        'Basic opportunity feed',
        'Community forum access'
      ]
    },
    {
      name: 'Pro',
      originalPrice: 79,
      discountedPrice: 55.30,
      features: [
        'Everything in Starter',
        'Investor scores (0-100)',
        'Portfolio tracker',
        'Advanced lessons',
        'Crime risk analysis',
        'Email support',
        'Downloadable spreadsheets'
      ],
      popular: true
    },
    {
      name: 'Elite',
      originalPrice: 199,
      discountedPrice: 139.30,
      features: [
        'Everything in Pro',
        'AI opportunity finder',
        'Advanced analytics',
        'Capital deployment tools',
        'Priority support',
        'Custom research',
        'Strategy sessions'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full mb-6">
              <Gift className="w-5 h-5 text-green-600" />
              <span className="text-forest-700 font-semibold">
                Special Referral Offer
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-forest-900 mb-6">
              Welcome! 🎉
            </h1>

            <p className="text-xl md:text-2xl text-forest-600 max-w-3xl mx-auto mb-4">
              Your friend invited you to join Hands On Tax Liens
            </p>

            <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-green-600 mb-8">
              <Star className="w-8 h-8 fill-green-600" />
              <span>Get 30% Off Your First 3 Months</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-forest-900 mb-2">Join 5,000+ Investors</h3>
                <p className="text-sm text-forest-600">
                  Active community learning tax lien investing
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-bold text-forest-900 mb-2">3,000+ Properties</h3>
                <p className="text-sm text-forest-600">
                  Live marketplace with investment opportunities
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-forest-900 mb-2">Risk-Free Guarantee</h3>
                <p className="text-sm text-forest-600">
                  30-day money-back guarantee, cancel anytime
                </p>
              </Card>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative ${
                  plan.popular ? 'border-4 border-gold-400 shadow-2xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" className="px-4 py-2 text-sm font-bold">
                      🔥 Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-forest-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <span className="text-3xl font-bold text-forest-900">
                        ${plan.discountedPrice}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg text-gray-500 line-through">
                        ${plan.originalPrice}
                      </span>
                      <Badge variant="red" className="text-xs">
                        Save 30%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      For your first 3 months
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-forest-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?ref=${referralCode}&plan=${plan.name.toLowerCase()}`}
                  className="block"
                >
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* Social Proof */}
          <Card className="p-8 bg-gradient-to-br from-forest-50 to-beige-50 mb-12">
            <h3 className="text-2xl font-bold text-forest-900 text-center mb-8">
              What Our Members Say
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-forest-700 mb-4">
                  "I found my first tax lien deal in week 2. ROI: 18%. The Academy is worth 10x the price."
                </p>
                <p className="text-sm text-forest-600 font-semibold">
                  — Sarah M., Pro Member
                </p>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-forest-700 mb-4">
                  "Clear, actionable lessons. Finally understand tax liens. The county calendar alone saves hours."
                </p>
                <p className="text-sm text-forest-600 font-semibold">
                  — James T., Elite Member
                </p>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-forest-700 mb-4">
                  "The marketplace has deals you won't find anywhere else. Love the investor scores."
                </p>
                <p className="text-sm text-forest-600 font-semibold">
                  — Maria L., Starter Member
                </p>
              </div>
            </div>
          </Card>

          {/* FAQ / Guarantee */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-100 border-2 border-green-400 rounded-xl mb-6">
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-forest-700 font-bold">
                30-Day Money-Back Guarantee • Cancel Anytime
              </span>
            </div>

            <p className="text-forest-600 max-w-2xl mx-auto">
              Try Hands On Tax Liens risk-free for 30 days. If you're not satisfied, we'll refund your money—no questions asked.
              Your special 30% discount is automatically applied at checkout using code: <span className="font-mono font-bold">{referralCode}-30OFF</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
