'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  DollarSign,
  TrendingDown,
  Home,
  Calendar,
  ExternalLink,
  Star,
  Zap
} from 'lucide-react'

interface Deal {
  id: string
  parcel_id: string
  property_address: string | null
  city: string | null
  state: string
  county: string
  zip_code: string | null
  property_type: string | null
  opening_bid: number
  assessed_value: number | null
  auction_date: string | null
  images: string[] | null
  property_description: string | null
  deal_score: number
  discount_percentage: number | null
}

export default function FeaturedDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals/featured?limit=9')
      const data = await res.json()
      if (data.success) {
        setDeals(data.deals)
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPropertyTypeIcon = (type: string | null) => {
    if (type === 'residential') return '🏠'
    if (type === 'commercial') return '🏢'
    if (type === 'land') return '🌲'
    return '📍'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
        <p className="mt-4 text-forest-600">Loading deals...</p>
      </div>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-cream-50 to-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-gold-500" />
            <span className="px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold">
              🔥 Hot Deals Updated Daily
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
            Featured Property Opportunities
          </h2>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto">
            Hand-picked deals with the highest potential returns. These properties won't last long.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {deals.map((deal, index) => (
            <Link
              key={deal.id}
              href={`/marketplace/${deal.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-forest-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-forest-100 to-beige-100 overflow-hidden">
                {deal.images && deal.images.length > 0 ? (
                  <Image
                    src={deal.images[0]}
                    alt={deal.property_address || deal.parcel_id}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-6xl">{getPropertyTypeIcon(deal.property_type)}</div>
                  </div>
                )}

                {/* Deal Badge */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-gold-500 text-white rounded-full text-xs font-bold flex items-center shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    Top {index + 1} Deal
                  </div>
                )}

                {/* Discount Badge */}
                {deal.discount_percentage && deal.discount_percentage > 0 && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                    {deal.discount_percentage}% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Location */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-forest-900 mb-1 line-clamp-1 group-hover:text-forest-600 transition-colors">
                      {deal.property_address || `Parcel ${deal.parcel_id}`}
                    </h3>
                    <div className="flex items-center text-sm text-forest-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {deal.city ? `${deal.city}, ` : ''}{deal.county}, {deal.state}
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                {deal.property_type && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-xs font-semibold capitalize">
                      <Home className="w-3 h-3 mr-1" />
                      {deal.property_type}
                    </span>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-forest-600">Opening Bid</span>
                    <span className="text-xl font-bold text-forest-900">
                      {formatCurrency(deal.opening_bid)}
                    </span>
                  </div>

                  {deal.assessed_value && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forest-600">Assessed Value</span>
                      <span className="text-forest-700 font-semibold">
                        {formatCurrency(deal.assessed_value)}
                      </span>
                    </div>
                  )}

                  {deal.discount_percentage && deal.discount_percentage > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forest-600">Potential Savings</span>
                      <span className="text-green-600 font-bold flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        {formatCurrency((deal.assessed_value || 0) - deal.opening_bid)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Auction Date */}
                {deal.auction_date && (
                  <div className="flex items-center text-xs text-forest-600 mb-4 pb-4 border-b border-forest-100">
                    <Calendar className="w-4 h-4 mr-1" />
                    Auction: {new Date(deal.auction_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-600 font-medium group-hover:text-forest-900 transition-colors">
                    View Details
                  </span>
                  <ExternalLink className="w-4 h-4 text-forest-600 group-hover:text-forest-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-cream-50 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Browse All {deals.length > 0 ? '3,000+' : ''} Properties
            <ExternalLink className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
