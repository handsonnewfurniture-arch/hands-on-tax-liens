/**
 * Create Listing API - Charges $5.50 listing fee via Stripe
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!

const LISTING_FEE = 550 // $5.50 in cents

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      parcel_id,
      property_address,
      city,
      state,
      county,
      zip_code,
      property_type,
      opening_bid,
      assessed_value,
      auction_date,
      auction_url,
      property_description,
      seller_name,
      seller_email,
      seller_phone
    } = body

    // Validation
    if (!parcel_id || !county || !state || !opening_bid || !seller_email || !property_description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia'
    })

    // Create draft listing in database
    const { data: listing, error: dbError } = await supabase
      .from('marketplace_listings')
      .insert({
        parcel_id,
        property_address: property_address || null,
        city: city || null,
        state,
        county,
        zip_code: zip_code || null,
        property_type: property_type || 'residential',
        opening_bid: parseFloat(opening_bid),
        assessed_value: assessed_value ? parseFloat(assessed_value) : null,
        auction_date: auction_date || null,
        auction_url: auction_url || null,
        property_description,
        seller_name,
        seller_email,
        seller_phone: seller_phone || null,
        status: 'pending_payment', // Will be set to 'active' after payment
        listing_type: 'user_submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Property Listing Fee',
              description: `List ${property_address || parcel_id} on marketplace`,
              images: []
            },
            unit_amount: LISTING_FEE
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/sell/success?listing_id=${listing.id}`,
      cancel_url: `${request.nextUrl.origin}/sell?canceled=true`,
      client_reference_id: listing.id,
      metadata: {
        listing_id: listing.id,
        parcel_id,
        seller_email
      },
      customer_email: seller_email
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      listing_id: listing.id
    })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to create listing',
        success: false
      },
      { status: 500 }
    )
  }
}
