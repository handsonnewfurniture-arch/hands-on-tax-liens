'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Check, ShieldCheck, BookOpen, TrendingUp, MapPin, FileSearch } from 'lucide-react'
import FeaturedDeals from '@/components/FeaturedDeals'
import LiveStats from '@/components/LiveStats'

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-forest-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-forest-600 to-forest-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Image
                  src="/logo.png"
                  alt="Hands On Tax Liens"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <div className="text-xl font-serif font-bold text-forest-900">Hands On Tax Liens</div>
                <div className="text-xs text-forest-600">Education & Marketplace</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/marketplace" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                Marketplace
              </Link>
              <Link href="/counties" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                How It Works
              </Link>
              <Link href="/academy" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                Education
              </Link>
              <Link href="/marketplace/tracker" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                Live Tracker
              </Link>
              <Link href="/pricing" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                Pricing
              </Link>
              <a href="#faq" className="text-forest-700 hover:text-forest-900 font-medium transition-colors">
                FAQ
              </a>
            </div>

            {/* CTA Button */}
            <Link
              href="/pricing"
              className="hidden sm:inline-flex px-6 py-3 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-cream-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Split-Screen Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-beige-50 to-cream-100">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #476252 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              {/* Headline */}
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-forest-900 leading-[1.1] tracking-tight">
                Turn Tax Liens & Tax Deeds Into{' '}
                <span className="text-forest-600 relative inline-block">
                  Real Estate Opportunities
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"></div>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-forest-700 leading-relaxed">
                Learn how to find, research, track, and act on tax lien and tax deed opportunities with education, marketplace tools, and live auction intelligence built for everyday investors.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-cream-50 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  Start Investing Smarter
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-8 py-4 bg-cream-50 hover:bg-white border-2 border-forest-600 text-forest-700 hover:text-forest-900 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Explore the Marketplace →
                </Link>
              </div>

              {/* Risk Disclaimer */}
              <p className="text-sm text-forest-600 italic">
                * Tax lien and tax deed investing carries risk. Past performance does not guarantee future results. This platform provides education and tools, not financial advice.
              </p>
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-forest-100 to-beige-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-cream-200">
                {/* Placeholder for dashboard/mascot image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-forest-500 to-forest-700 rounded-full flex items-center justify-center shadow-xl">
                      <TrendingUp className="w-16 h-16 text-cream-50" />
                    </div>
                    <div className="text-forest-700 font-medium">Premium Dashboard Preview</div>
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      <div className="bg-cream-50 rounded-lg p-3 shadow-md">
                        <div className="text-xs text-forest-600">Active Listings</div>
                        <div className="text-2xl font-bold text-forest-900">1,247</div>
                      </div>
                      <div className="bg-cream-50 rounded-lg p-3 shadow-md">
                        <div className="text-xs text-forest-600">Live Auctions</div>
                        <div className="text-2xl font-bold text-forest-900">38</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative gold accent */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-gold-300 to-gold-400 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -z-10 -top-6 -left-6 w-48 h-48 bg-gradient-to-br from-forest-300 to-forest-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Banner */}
      <LiveStats />

      {/* Featured Deals Section */}
      <FeaturedDeals />

      {/* Social Proof Strip */}
      <section className="bg-forest-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-cream-300 text-sm uppercase tracking-wider font-semibold">Trusted Data Sources & Tools</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {[
              { icon: MapPin, label: 'County Data' },
              { icon: TrendingUp, label: 'Auction Intel' },
              { icon: ShieldCheck, label: 'Investor Tools' },
              { icon: FileSearch, label: 'Property Research' },
              { icon: BookOpen, label: 'Due Diligence' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-cream-100/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-cream-200" />
                </div>
                <span className="text-cream-200 text-sm font-medium text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zig-Zag Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-cream-100 to-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">

          {/* Benefit 1 - Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-gold-100 border border-gold-300 rounded-full">
                <span className="text-forest-700 font-semibold text-sm">Marketplace</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 leading-tight">
                Find Hidden Property Opportunities
              </h2>
              <p className="text-lg text-forest-700 leading-relaxed">
                Browse tax lien and tax deed listings, filter by county, state, auction date, price range, and asset type, then save the deals that match your strategy.
              </p>
              <ul className="space-y-3">
                {['Advanced search filters', 'Save favorite listings', 'Real-time updates', 'Property details & photos'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0" />
                    <span className="text-forest-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace" className="inline-flex items-center text-forest-700 hover:text-forest-900 font-semibold group">
                Explore Marketplace
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] bg-gradient-to-br from-beige-100 to-cream-100 rounded-2xl shadow-xl overflow-hidden border border-forest-200/30">
              <div className="absolute inset-0 flex items-center justify-center text-forest-600">
                <FileSearch className="w-24 h-24 opacity-30" />
              </div>
            </div>
          </div>

          {/* Benefit 2 - Image Left */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-forest-100 to-beige-100 rounded-2xl shadow-xl overflow-hidden border border-forest-200/30 order-2 lg:order-1">
              <div className="absolute inset-0 flex items-center justify-center text-forest-600">
                <TrendingUp className="w-24 h-24 opacity-30" />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-gold-100 border border-gold-300 rounded-full">
                <span className="text-forest-700 font-semibold text-sm">Live Tracker</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 leading-tight">
                Track Auctions in Real Time
              </h2>
              <p className="text-lg text-forest-700 leading-relaxed">
                Use live auction tracking to monitor purchases, parcel numbers, winning bids, statuses, and transaction history without refreshing the page.
              </p>
              <ul className="space-y-3">
                {['Live purchase updates', 'Transaction history', 'Winning bid tracking', 'Export data for analysis'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0" />
                    <span className="text-forest-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace/tracker" className="inline-flex items-center text-forest-700 hover:text-forest-900 font-semibold group">
                View Live Tracker
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Benefit 3 - Image Right */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-gold-100 border border-gold-300 rounded-full">
                <span className="text-forest-700 font-semibold text-sm">Education</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 leading-tight">
                Learn Before You Bid
              </h2>
              <p className="text-lg text-forest-700 leading-relaxed">
                Access education, checklists, and due diligence resources so you understand redemption periods, risks, title research, and local auction rules before taking action.
              </p>
              <ul className="space-y-3">
                {['Step-by-step courses', 'Due diligence checklists', 'State-by-state guides', 'Risk assessment tools'].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0" />
                    <span className="text-forest-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/academy" className="inline-flex items-center text-forest-700 hover:text-forest-900 font-semibold group">
                Start Learning
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] bg-gradient-to-br from-beige-100 to-cream-100 rounded-2xl shadow-xl overflow-hidden border border-forest-200/30">
              <div className="absolute inset-0 flex items-center justify-center text-forest-600">
                <BookOpen className="w-24 h-24 opacity-30" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-beige-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Choose Your Investment Plan
            </h2>
            <p className="text-xl text-forest-700 max-w-2xl mx-auto">
              Start learning for free, upgrade when you're ready to invest
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Starter Plan */}
            <div className="bg-cream-50 border-2 border-forest-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-forest-900 mb-2">Starter</h3>
                <p className="text-forest-600 text-sm">For beginners learning tax liens</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-forest-900">Free</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Marketplace browsing',
                  'Basic education library',
                  'Save up to 10 deals',
                  'Community access',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
                    <span className="text-forest-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3 px-6 bg-forest-100 hover:bg-forest-200 text-forest-900 rounded-xl font-semibold text-center transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="bg-gradient-to-br from-forest-700 to-forest-800 border-4 border-gold-400 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-shadow relative transform lg:scale-105">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full shadow-lg">
                  <span className="text-forest-900 font-bold text-sm">Most Popular</span>
                </div>
              </div>

              <div className="mb-6 mt-2">
                <h3 className="font-serif text-2xl font-bold text-cream-50 mb-2">Pro</h3>
                <p className="text-cream-200 text-sm">For active tax lien investors</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-cream-50">$49<span className="text-lg text-cream-300">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Full marketplace access',
                  'Live auction purchase tracker',
                  'Unlimited saved deals',
                  'Transaction history',
                  'Advanced filters',
                  'Due diligence checklists',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-cream-100">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3 px-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-forest-900 rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all"
              >
                Go Pro
              </Link>
            </div>

            {/* Elite Plan */}
            <div className="bg-cream-50 border-2 border-forest-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold text-forest-900 mb-2">Elite</h3>
                <p className="text-forest-600 text-sm">For serious investors & teams</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold text-forest-900">$99<span className="text-lg text-forest-600">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Pro',
                  'Priority auction alerts',
                  'Portfolio tracking',
                  'Team access',
                  'Advanced reporting',
                  'Premium support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
                    <span className="text-forest-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full py-3 px-6 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-cream-50 rounded-xl font-semibold text-center transition-all"
              >
                Apply for Elite
              </Link>
            </div>

          </div>

          {/* Disclaimer */}
          <p className="text-center text-forest-600 text-sm mt-8 italic">
            All plans include a 14-day money-back guarantee. No long-term contracts.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gradient-to-b from-cream-100 to-beige-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-forest-700">
              Everything you need to know about tax lien investing
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {[
              {
                question: 'What are tax liens and tax deeds?',
                answer: 'Tax liens are legal claims placed on properties when owners fail to pay property taxes. Investors can purchase these liens at auction and earn interest when the owner pays back taxes. Tax deeds are properties sold by the county when taxes remain unpaid after the redemption period, allowing investors to potentially acquire real estate at below-market prices.',
              },
              {
                question: 'Is this financial or legal advice?',
                answer: 'No. Hands On Tax Liens is an educational platform and marketplace tool. We provide information, research tools, and tracking features, but we do not provide financial advice, legal advice, or investment recommendations. Always consult with licensed professionals (attorneys, CPAs, financial advisors) before making investment decisions.',
              },
              {
                question: 'Can I buy tax liens directly on the platform?',
                answer: 'Our marketplace allows you to browse, research, and track tax lien opportunities, but purchases happen through official county auctions (either in-person or online through county systems). We help you find and prepare for these auctions, but we are not the auction platform itself. Our Live Tracker helps you monitor real-time auction results.',
              },
              {
                question: 'How does the live auction tracker work?',
                answer: 'The Live Tracker monitors real-time auction activity across multiple counties. You can see parcel numbers, winning bids, buyer information, and transaction statuses as they happen. This helps you understand market trends, competitive bidding patterns, and pricing data without attending every auction in person. Pro and Elite members get full access.',
              },
              {
                question: 'What should I research before bidding?',
                answer: 'Before bidding on any tax lien or tax deed, you should research: property title history, redemption period length, outstanding liens and mortgages, property condition and location, comparable sales values, and local auction rules. Our platform provides checklists, educational resources, and due diligence tools to help guide your research process.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-cream-50 border border-forest-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-beige-50 transition-colors"
                >
                  <span className="font-semibold text-forest-900 text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-forest-600 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-forest-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-cream-50 mb-6 leading-tight">
            Ready to Get Hands On With Tax Liens?
          </h2>
          <p className="text-xl md:text-2xl text-cream-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join a platform built to help you learn, track, and discover tax lien and tax deed opportunities with confidence.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-forest-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
          >
            Join Hands On Tax Liens
          </Link>
          <p className="text-cream-300 text-sm mt-6">
            Start with a free account • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-950 border-t border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-lg flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Hands On Tax Liens"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-cream-100 text-lg">Hands On Tax Liens</span>
              </div>
              <p className="text-cream-400 text-sm leading-relaxed max-w-md">
                An educational platform and marketplace for tax lien and tax deed investors. Learn, research, and track opportunities with confidence.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-cream-100 mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Marketplace</Link></li>
                <li><Link href="/academy" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Education</Link></li>
                <li><Link href="/blog" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Blog</Link></li>
                <li><Link href="/portfolio" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Portfolio</Link></li>
                <li><Link href="/pricing" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-cream-100 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-cream-400 hover:text-cream-200 text-sm transition-colors">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="border-t border-forest-800 pt-8 space-y-4">
            <p className="text-cream-500 text-xs leading-relaxed">
              <strong>Risk Disclosure:</strong> Tax lien and tax deed investing involves significant risk. Properties may have title defects, structural issues, environmental problems, or other unknown liabilities. Redemption rates vary by location and market conditions. There is no guarantee of profit or return on investment. You may lose all invested capital.
            </p>
            <p className="text-cream-500 text-xs leading-relaxed">
              <strong>Not Financial Advice:</strong> Hands On Tax Liens provides educational content, research tools, and marketplace access. We do not provide financial advice, legal advice, or investment recommendations. Always consult licensed professionals before making investment decisions.
            </p>
            <p className="text-cream-500 text-xs text-center">
              © 2026 Hands On Tax Liens. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
