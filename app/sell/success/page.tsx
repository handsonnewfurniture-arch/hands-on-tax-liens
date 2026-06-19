'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Home, ExternalLink, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const listingId = searchParams.get('listing_id')

  useEffect(() => {
    if (listingId) {
      fetchListing()
    }
  }, [listingId])

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/marketplace/listings/${listingId}`)
      const data = await res.json()
      if (data.success) {
        setListing(data.listing)
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-forest-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-forest-600 mb-8">
              Your property listing has been published and is now live on the marketplace.
            </p>

            {/* Listing Details */}
            {loading ? (
              <div className="text-forest-600">Loading listing details...</div>
            ) : listing ? (
              <div className="bg-forest-50 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-bold text-lg text-forest-900 mb-4">Listing Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest-600">Property:</span>
                    <span className="font-semibold text-forest-900">
                      {listing.property_address || listing.parcel_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Location:</span>
                    <span className="font-semibold text-forest-900">
                      {listing.county}, {listing.state}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Opening Bid:</span>
                    <span className="font-semibold text-forest-900">
                      ${listing.opening_bid?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest-600">Status:</span>
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* What's Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-forest-900 mb-3 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
                What Happens Next?
              </h3>
              <ul className="space-y-2 text-sm text-forest-700">
                <li>✅ Your listing is now visible to thousands of investors</li>
                <li>✅ You'll receive email notifications when buyers show interest</li>
                <li>✅ The listing will remain active for 90 days</li>
                <li>✅ You can update or remove it anytime from your dashboard</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {listing && (
                <Link href={`/marketplace/${listing.id}`}>
                  <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Your Listing
                  </Button>
                </Link>
              )}
              <Link href="/sell">
                <Button variant="secondary" className="w-full sm:w-auto flex items-center justify-center">
                  <Home className="w-5 h-5 mr-2" />
                  List Another Property
                </Button>
              </Link>
            </div>

            {/* Email Confirmation */}
            <p className="mt-8 text-sm text-forest-600">
              A confirmation email has been sent to your email address with your receipt and listing details.
            </p>
          </Card>

          {/* Help */}
          <div className="text-center mt-8">
            <p className="text-forest-600">
              Need help?{' '}
              <Link href="/contact" className="text-forest-700 font-semibold hover:text-forest-900 underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
