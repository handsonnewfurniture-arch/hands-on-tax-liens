'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  DollarSign,
  MapPin,
  FileText,
  Image as ImageIcon,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const LISTING_FEE = 5.50

export default function SellProperty() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    // Property Details
    parcel_id: '',
    property_address: '',
    city: '',
    state: '',
    county: '',
    zip_code: '',
    property_type: 'residential',

    // Pricing
    opening_bid: '',
    assessed_value: '',

    // Auction Details
    auction_date: '',
    auction_url: '',

    // Description
    property_description: '',

    // Contact
    seller_name: '',
    seller_email: '',
    seller_phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create Stripe checkout session for listing fee
      const response = await fetch('/api/sell/create-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing')
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const isStep1Valid = () => {
    return formData.parcel_id && formData.county && formData.state
  }

  const isStep2Valid = () => {
    return formData.opening_bid && parseFloat(formData.opening_bid) > 0
  }

  const isStep3Valid = () => {
    return formData.seller_email && formData.property_description
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              List Your Property
            </h1>
            <p className="text-xl text-forest-600 mb-6">
              Reach thousands of investors for just ${LISTING_FEE.toFixed(2)}
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-100 border border-gold-300 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-gold-600" />
              <span className="text-forest-700 font-semibold">Pay only when published</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Property Details' },
                { num: 2, label: 'Pricing' },
                { num: 3, label: 'Review & Pay' }
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step >= s.num
                          ? 'bg-forest-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {s.num}
                    </div>
                    <span className="text-xs mt-2 text-forest-600 text-center">{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        step > s.num ? 'bg-forest-600' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Property Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-forest-900 mb-6 flex items-center">
                    <Home className="w-6 h-6 mr-2" />
                    Property Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Parcel ID / APN *
                      </label>
                      <input
                        type="text"
                        name="parcel_id"
                        value={formData.parcel_id}
                        onChange={handleChange}
                        className="input-glass w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Property Address
                      </label>
                      <input
                        type="text"
                        name="property_address"
                        value={formData.property_address}
                        onChange={handleChange}
                        className="input-glass w-full"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-glass w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        County *
                      </label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        className="input-glass w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="input-glass w-full"
                        placeholder="FL"
                        maxLength={2}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="input-glass w-full"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Property Type
                      </label>
                      <select
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleChange}
                        className="input-glass w-full"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                        <option value="industrial">Industrial</option>
                        <option value="mixed_use">Mixed Use</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid()}
                      variant="primary"
                      className="flex items-center"
                    >
                      Next: Pricing
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-forest-900 mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2" />
                    Pricing & Auction Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Opening Bid *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-600">$</span>
                        <input
                          type="number"
                          name="opening_bid"
                          value={formData.opening_bid}
                          onChange={handleChange}
                          className="input-glass w-full pl-8"
                          placeholder="10,000"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Assessed Value
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-600">$</span>
                        <input
                          type="number"
                          name="assessed_value"
                          value={formData.assessed_value}
                          onChange={handleChange}
                          className="input-glass w-full pl-8"
                          placeholder="50,000"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Auction Date
                      </label>
                      <input
                        type="date"
                        name="auction_date"
                        value={formData.auction_date}
                        onChange={handleChange}
                        className="input-glass w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Auction Website
                      </label>
                      <input
                        type="url"
                        name="auction_url"
                        value={formData.auction_url}
                        onChange={handleChange}
                        className="input-glass w-full"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="secondary"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid()}
                      variant="primary"
                      className="flex items-center"
                    >
                      Next: Review
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Pay */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-forest-900 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Review & Payment
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-2">
                        Property Description *
                      </label>
                      <textarea
                        name="property_description"
                        value={formData.property_description}
                        onChange={handleChange}
                        className="input-glass w-full"
                        rows={4}
                        placeholder="Describe the property, its condition, location details, etc."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-forest-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="seller_name"
                          value={formData.seller_name}
                          onChange={handleChange}
                          className="input-glass w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-forest-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="seller_email"
                          value={formData.seller_email}
                          onChange={handleChange}
                          className="input-glass w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-forest-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="seller_phone"
                          value={formData.seller_phone}
                          onChange={handleChange}
                          className="input-glass w-full"
                        />
                      </div>
                    </div>

                    {/* Listing Summary */}
                    <Card className="p-6 bg-forest-50 border-2 border-forest-200">
                      <h3 className="font-bold text-lg text-forest-900 mb-4">Listing Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-forest-600">Property:</span>
                          <span className="font-semibold text-forest-900">
                            {formData.property_address || formData.parcel_id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-forest-600">Location:</span>
                          <span className="font-semibold text-forest-900">
                            {formData.county}, {formData.state}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-forest-600">Opening Bid:</span>
                          <span className="font-semibold text-forest-900">
                            ${parseFloat(formData.opening_bid || '0').toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-forest-300 my-3"></div>
                        <div className="flex justify-between text-lg">
                          <span className="text-forest-700 font-bold">Listing Fee:</span>
                          <span className="font-bold text-forest-900">
                            ${LISTING_FEE.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card>

                    {error && (
                      <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="secondary"
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isStep3Valid() || loading}
                      variant="primary"
                      className="flex items-center"
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          Pay ${LISTING_FEE.toFixed(2)} & Publish
                          <CheckCircle2 className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>

          {/* Why List With Us */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-forest-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="font-bold text-forest-900 mb-2">Targeted Audience</h3>
              <p className="text-sm text-forest-600">
                Reach investors actively searching for tax lien & deed opportunities
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-bold text-forest-900 mb-2">Low Cost</h3>
              <p className="text-sm text-forest-600">
                Just ${LISTING_FEE.toFixed(2)} per listing. No monthly fees or commissions
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-forest-900 mb-2">Quick & Easy</h3>
              <p className="text-sm text-forest-600">
                List in minutes. Goes live immediately after payment
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
