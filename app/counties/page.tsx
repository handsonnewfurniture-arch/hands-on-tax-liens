'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Star,
  ChevronDown
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface County {
  id: string
  county: string
  state: string
  sale_type: string
  platform: string
  registration_url: string
  auction_date: string | null
  sale_date_window: string
  format: string
  notes: string | null
  source_url: string | null
}

export default function Counties() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [counties, setCounties] = useState<County[]>([])
  const [loading, setLoading] = useState(true)
  const [allStates, setAllStates] = useState<string[]>([])

  useEffect(() => {
    fetchCounties()
  }, [])

  const fetchCounties = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/counties/auctions')
      const data = await res.json()

      if (data.success) {
        setCounties(data.counties)
        setAllStates(data.states || [])
      }
    } catch (error) {
      console.error('Failed to fetch counties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Old hardcoded data for reference
  const oldCounties = [
  
    {
      "id": 1,
      "state": "Florida",
      "county": "Broward",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 469000,
      "population": null,
      "crimeScore": 55,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.broward.org/RecordsTaxesTreasury",
      "notes": "No longer uses DeedAuction. Check Records, Taxes & Treasury Division. Contact: taxdeedclerk@broward.org"
    },
    {
      "id": 2,
      "state": "Florida",
      "county": "Miami-Dade",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 547000,
      "population": null,
      "crimeScore": 52,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Largest Florida county by volume. Very competitive market."
    },
    {
      "id": 3,
      "state": "Florida",
      "county": "Palm Beach",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 513700,
      "population": null,
      "crimeScore": 58,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.mypalmbeachclerk.com/departments/courts/tax-deeds",
      "notes": "Monthly auctions at 9:30 AM. Strong luxury market."
    },
    {
      "id": 4,
      "state": "Florida",
      "county": "Orange",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 432500,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Orlando area. Annual tax certificate sale June 1st. Contact: 877-361-7325"
    },
    {
      "id": 5,
      "state": "Florida",
      "county": "Hillsborough",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 420000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://hillsborough.realtaxdeed.com",
      "notes": "Tampa area. Auctions held Thursdays at 10:00 AM."
    },
    {
      "id": 6,
      "state": "Florida",
      "county": "Pinellas",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 385000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.mypinellasclerk.org",
      "notes": "St. Petersburg area. LienHub auctions available."
    },
    {
      "id": 7,
      "state": "Florida",
      "county": "Lee",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 395000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.leeclerk.org/departments/courts/property-sales/tax-deed-sales",
      "notes": "Fort Myers area. Research files available online."
    },
    {
      "id": 8,
      "state": "Florida",
      "county": "Polk",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Central Florida. Lower home values, good for beginners."
    },
    {
      "id": 9,
      "state": "Florida",
      "county": "Duval",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 63,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Jacksonville area. Consistent auction schedule."
    },
    {
      "id": 10,
      "state": "Florida",
      "county": "Seminole",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 375000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Orlando suburbs. Family-friendly areas."
    },
    {
      "id": 11,
      "state": "Florida",
      "county": "Pasco",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 295000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Tampa suburbs. Affordable market."
    },
    {
      "id": 12,
      "state": "Florida",
      "county": "Volusia",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 310000,
      "population": null,
      "crimeScore": 66,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://volusia.realtaxdeed.com",
      "notes": "Daytona Beach area. Sales at 9:00 AM ET."
    },
    {
      "id": 13,
      "state": "Florida",
      "county": "Sarasota",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 495000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "High-end market. Gulf Coast location."
    },
    {
      "id": 14,
      "state": "Florida",
      "county": "Brevard",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 340000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Space Coast area. Melbourne/Cocoa Beach."
    },
    {
      "id": 15,
      "state": "Florida",
      "county": "Manatee",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Bradenton area. Growing market."
    },
    {
      "id": 16,
      "state": "Arizona",
      "county": "Maricopa",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 468000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "high",
      "investorScore": 26,
      "auctionWebsite": "https://maricopa.arizonataxsale.com",
      "notes": "Phoenix metro. Held in February. $500 minimum deposit. Bid in 1% increments."
    },
    {
      "id": 17,
      "state": "Arizona",
      "county": "Pima",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 341000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 36,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Tucson area. RealAuction.com platform. Bidding starts at 16%."
    },
    {
      "id": 18,
      "state": "Arizona",
      "county": "Pinal",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 36,
      "auctionWebsite": "https://pinal.arizonataxsale.com",
      "notes": "Phoenix suburbs. Held in February. Wire/ACH deposit required one day prior."
    },
    {
      "id": 19,
      "state": "Arizona",
      "county": "Yavapai",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 380000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "low",
      "investorScore": 46,
      "auctionWebsite": "https://yavapai.arizonataxsale.com",
      "notes": "Prescott area. Lower competition. Beautiful mountain area."
    },
    {
      "id": 20,
      "state": "Arizona",
      "county": "Coconino",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "low",
      "investorScore": 46,
      "auctionWebsite": "https://coconino.arizonataxsale.com",
      "notes": "Flagstaff area. Low crime. Tourism market."
    },
    {
      "id": 21,
      "state": "Arizona",
      "county": "Yuma",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 265000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 46,
      "auctionWebsite": "https://yuma.arizonataxsale.com",
      "notes": "Agricultural area. Affordable properties."
    },
    {
      "id": 22,
      "state": "Arizona",
      "county": "Mohave",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 16,
      "redemptionMonths": 36,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 46,
      "auctionWebsite": "https://mohave.arizonataxsale.com",
      "notes": "Lake Havasu area. Retirement community."
    },
    {
      "id": 23,
      "state": "Illinois",
      "county": "DuPage",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 374100,
      "population": null,
      "crimeScore": 80,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.dupagecounty.gov/elected_officials/treasurer/tax_sale_information.php",
      "notes": "November auction. Low crime. Suburban Chicago. Registration Oct 1-30."
    },
    {
      "id": 24,
      "state": "Illinois",
      "county": "Lake",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.lakecountyil.gov/200/Tax-Sales",
      "notes": "North suburbs. Good school districts."
    },
    {
      "id": 25,
      "state": "Illinois",
      "county": "Will",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 295000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "Southwest suburbs. Growing area."
    },
    {
      "id": 26,
      "state": "Illinois",
      "county": "Kane",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "Aurora/Elgin area. Affordable suburbs."
    },
    {
      "id": 27,
      "state": "Illinois",
      "county": "McHenry",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 305000,
      "population": null,
      "crimeScore": 82,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "Rural area. Very low crime. Lake communities."
    },
    {
      "id": 28,
      "state": "Illinois",
      "county": "Champaign",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 215000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "College town. University of Illinois. Student housing market."
    },
    {
      "id": 29,
      "state": "Illinois",
      "county": "Sangamon",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "Springfield (state capital). Stable government employment."
    },
    {
      "id": 30,
      "state": "Illinois",
      "county": "Peoria",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 30,
      "medianHomeValue": 155000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.iltaxsale.com",
      "notes": "Downstate. Very affordable. Low competition."
    },
    {
      "id": 31,
      "state": "Iowa",
      "county": "Polk",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 276000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "medium",
      "investorScore": 44,
      "auctionWebsite": "https://www.polkcountyiowa.gov/treasurer/information-for-tax-sale-buyers/",
      "notes": "Des Moines area. Third Monday in June. Strong capital city market."
    },
    {
      "id": 32,
      "state": "Iowa",
      "county": "Linn",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 225000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://treasurer-linncounty-gis.hub.arcgis.com/",
      "notes": "Cedar Rapids. Low crime. Tech corridor."
    },
    {
      "id": 33,
      "state": "Iowa",
      "county": "Scott",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 205000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://www.scottcountyiowa.gov/treasurer/tax-sale",
      "notes": "Davenport/Quad Cities. Mississippi River location."
    },
    {
      "id": 34,
      "state": "Iowa",
      "county": "Johnson",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 265000,
      "population": null,
      "crimeScore": 80,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://www.iowataxauction.com",
      "notes": "Iowa City. University of Iowa. Very low crime."
    },
    {
      "id": 35,
      "state": "Iowa",
      "county": "Black Hawk",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://www.iowataxauction.com",
      "notes": "Waterloo/Cedar Falls. Affordable market."
    },
    {
      "id": 36,
      "state": "Iowa",
      "county": "Story",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 82,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://www.iowataxauction.com",
      "notes": "Ames. Iowa State University. Very safe."
    },
    {
      "id": 37,
      "state": "Iowa",
      "county": "Dubuque",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 24,
      "redemptionMonths": 21,
      "medianHomeValue": 195000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "low",
      "investorScore": 54,
      "auctionWebsite": "https://www.iowataxauction.com",
      "notes": "Mississippi River town. Historic area."
    },
    {
      "id": 38,
      "state": "Texas",
      "county": "Harris",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 320000,
      "population": null,
      "crimeScore": 58,
      "competitionLevel": "high",
      "investorScore": 35,
      "auctionWebsite": "https://www.hctax.net/Property/TaxSales",
      "notes": "Houston area. First Tuesday monthly 10am-4pm. Bayou City Event Center."
    },
    {
      "id": 39,
      "state": "Texas",
      "county": "Dallas",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 350000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 35,
      "auctionWebsite": "Contact County Constable by precinct",
      "notes": "Major metro. Check constable for sale schedules."
    },
    {
      "id": 40,
      "state": "Texas",
      "county": "Bexar",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 273000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "medium",
      "investorScore": 45,
      "auctionWebsite": "Contact Tax Assessor-Collector",
      "notes": "San Antonio. Affordable major metro market."
    },
    {
      "id": 41,
      "state": "Texas",
      "county": "Travis",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 485000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "high",
      "investorScore": 35,
      "auctionWebsite": "https://www.realauction.com",
      "notes": "Austin. Check RealAuction 15 days before sale. Tech hub."
    },
    {
      "id": 42,
      "state": "Texas",
      "county": "Tarrant",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 295000,
      "population": null,
      "crimeScore": 63,
      "competitionLevel": "medium",
      "investorScore": 45,
      "auctionWebsite": "Contact County Sheriff",
      "notes": "Fort Worth. DFW metroplex."
    },
    {
      "id": 43,
      "state": "Texas",
      "county": "Collin",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 445000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "medium",
      "investorScore": 45,
      "auctionWebsite": "Contact County Constable",
      "notes": "North Dallas suburbs. Plano/McKinney. Excellent schools."
    },
    {
      "id": 44,
      "state": "Texas",
      "county": "Denton",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 385000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "medium",
      "investorScore": 45,
      "auctionWebsite": "Contact County Sheriff",
      "notes": "DFW suburbs. Growing tech corridor."
    },
    {
      "id": 45,
      "state": "Texas",
      "county": "El Paso",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 25,
      "redemptionMonths": 6,
      "medianHomeValue": 215000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "low",
      "investorScore": 55,
      "auctionWebsite": "Contact County Sheriff",
      "notes": "Border city. Very affordable."
    },
    {
      "id": 46,
      "state": "Indiana",
      "county": "Marion",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 195000,
      "population": null,
      "crimeScore": 55,
      "competitionLevel": "medium",
      "investorScore": 30,
      "auctionWebsite": "https://www.govease.com",
      "notes": "Indianapolis. October 13-16, 2026. $2,500 deposit. 10am-4pm."
    },
    {
      "id": 47,
      "state": "Indiana",
      "county": "Hamilton",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 385000,
      "population": null,
      "crimeScore": 85,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.hamiltoncounty.in.gov/452/Real-Property-Tax-Sale",
      "notes": "Carmel/Noblesville. October 8, 2026 at 10am. Very low crime. Top schools."
    },
    {
      "id": 48,
      "state": "Indiana",
      "county": "Lake",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 175000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.onyxelectronics.com",
      "notes": "Gary/Hammond. May 4-7, 2026. Register at zeusauction.com. Very affordable."
    },
    {
      "id": 49,
      "state": "Indiana",
      "county": "Allen",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 195000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.g-uts.com/tax-sale-information/",
      "notes": "Fort Wayne. Affordable Midwest market."
    },
    {
      "id": 50,
      "state": "Indiana",
      "county": "St. Joseph",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.g-uts.com/tax-sale-information/",
      "notes": "South Bend. Notre Dame University area."
    },
    {
      "id": 51,
      "state": "Indiana",
      "county": "Tippecanoe",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 215000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.g-uts.com/tax-sale-information/",
      "notes": "Lafayette/West Lafayette. Purdue University."
    },
    {
      "id": 52,
      "state": "Ohio",
      "county": "Franklin",
      "auctionType": "Tax Lien Certificate",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://treasurer.franklincountyohio.gov/Delinquent-Taxes/Tax-Lein-Sale/Buyer-Information",
      "notes": "Columbus. Bulk sale (not individual liens). $500 deposit. October/November."
    },
    {
      "id": 53,
      "state": "Ohio",
      "county": "Cuyahoga",
      "auctionType": "Tax Lien Certificate",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://cuyahogacounty.gov/treasury/delinquency/tax-lien-certificate-sales",
      "notes": "Cleveland. Bulk sale via negotiated sale. No deposit required but registration needed."
    },
    {
      "id": 54,
      "state": "Ohio",
      "county": "Hamilton",
      "auctionType": "Tax Lien Certificate",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 215000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.hcso.org/community-services/search-property-sales/tax-lien-certificate-sales/",
      "notes": "Cincinnati. Bulk sale/auction. Not designed for individual investors."
    },
    {
      "id": 55,
      "state": "Ohio",
      "county": "Montgomery",
      "auctionType": "Tax Lien Certificate",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 155000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Treasurer",
      "notes": "Dayton. More accessible than major metros."
    },
    {
      "id": 56,
      "state": "Ohio",
      "county": "Summit",
      "auctionType": "Tax Lien Certificate",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 175000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Treasurer",
      "notes": "Akron. Affordable Rust Belt market."
    },
    {
      "id": 57,
      "state": "West Virginia",
      "county": "Kanawha",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 12,
      "redemptionMonths": 5,
      "medianHomeValue": 155000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact Sheriff's Tax Office",
      "notes": "Charleston (capital). October/November sale. 18 months after delinquency."
    },
    {
      "id": 58,
      "state": "West Virginia",
      "county": "Berkeley",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 12,
      "redemptionMonths": 5,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact Sheriff's Tax Office",
      "notes": "Eastern panhandle. Near DC market. Growing area."
    },
    {
      "id": 59,
      "state": "West Virginia",
      "county": "Cabell",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 12,
      "redemptionMonths": 5,
      "medianHomeValue": 135000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact Sheriff's Tax Office",
      "notes": "Huntington. Marshall University. Very affordable."
    },
    {
      "id": 60,
      "state": "West Virginia",
      "county": "Jefferson",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 12,
      "redemptionMonths": 5,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact Sheriff's Tax Office",
      "notes": "Eastern panhandle. Harpers Ferry. Historic area. Low crime."
    },
    {
      "id": 61,
      "state": "Maryland",
      "county": "Montgomery",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 6,
      "medianHomeValue": 585000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.montgomerycountymd.gov/Finance/TaxSale-general.html",
      "notes": "DC suburbs. Payment due June 9, 2026 by 4pm ET. High-value properties."
    },
    {
      "id": 62,
      "state": "Maryland",
      "county": "Prince George's",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 6,
      "medianHomeValue": 395000,
      "population": null,
      "crimeScore": 58,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://taxsale.princegeorgescountymd.gov/",
      "notes": "DC suburbs. Internet-based sealed bid auction."
    },
    {
      "id": 63,
      "state": "Maryland",
      "county": "Baltimore",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 6,
      "medianHomeValue": 335000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.baltimorecountymd.gov/departments/budfin/taxpayer-services/tax-sale",
      "notes": "Baltimore suburbs. Spring/summer auctions."
    },
    {
      "id": 64,
      "state": "Maryland",
      "county": "Anne Arundel",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 6,
      "medianHomeValue": 485000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Treasurer",
      "notes": "Annapolis area. Internet-based auctions now available."
    },
    {
      "id": 65,
      "state": "Mississippi",
      "county": "DeSoto",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.desotocountyms.gov/508/Tax-Sale",
      "notes": "Memphis suburbs. Last Monday in August. Growing market."
    },
    {
      "id": 66,
      "state": "Mississippi",
      "county": "Hinds",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 165000,
      "population": null,
      "crimeScore": 55,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.hindscountyms.com/delinquent-property-tax-lists-and-tax-sale-lists",
      "notes": "Jackson (capital). First Monday in April or last Monday in August."
    },
    {
      "id": 67,
      "state": "Mississippi",
      "county": "Madison",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 82,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.madison-co.com/search-delinquent-property-taxes",
      "notes": "Jackson suburbs. Very low crime. Best schools in state."
    },
    {
      "id": 68,
      "state": "Mississippi",
      "county": "Rankin",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 235000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.govease.com",
      "notes": "Jackson suburbs. Low crime. Family-friendly."
    },
    {
      "id": 69,
      "state": "Georgia",
      "county": "Fulton",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 20,
      "redemptionMonths": 12,
      "medianHomeValue": 395000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 30,
      "auctionWebsite": "https://fultoncountyga.gov/inside-fulton-county/fulton-county-departments/sheriff/tax-sales",
      "notes": "Atlanta. First Tuesday monthly 10am-4pm. No July sale."
    },
    {
      "id": 70,
      "state": "Georgia",
      "county": "Cobb",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 20,
      "redemptionMonths": 12,
      "medianHomeValue": 365000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "medium",
      "investorScore": 40,
      "auctionWebsite": "https://www.cobbtax.gov/property/tax_sale/index.php",
      "notes": "Atlanta suburbs. May 5 & Nov 3, 2026. Pre-registration required."
    },
    {
      "id": 71,
      "state": "Georgia",
      "county": "DeKalb",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 20,
      "redemptionMonths": 12,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "medium",
      "investorScore": 40,
      "auctionWebsite": "Contact County Marshal",
      "notes": "Atlanta metro. First Tuesday monthly at 10am."
    },
    {
      "id": 72,
      "state": "Georgia",
      "county": "Gwinnett",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 20,
      "redemptionMonths": 12,
      "medianHomeValue": 345000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 40,
      "auctionWebsite": "Contact County Sheriff",
      "notes": "Northeast Atlanta suburbs. Growing tech corridor."
    },
    {
      "id": 73,
      "state": "South Carolina",
      "county": "Charleston",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 485000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.charlestoncounty.gov/departments/delinquent-tax/tax-sale.php",
      "notes": "Coastal city. Sealed bid sale Jan-Feb. No registration needed."
    },
    {
      "id": 74,
      "state": "South Carolina",
      "county": "Greenville",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 315000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "Contact County Tax Department",
      "notes": "Upstate. BMW manufacturing. Growing economy."
    },
    {
      "id": 75,
      "state": "South Carolina",
      "county": "Richland",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 235000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "https://www.richlandcountysc.gov/Property-Business/Taxes/Delinquent-Taxes/Tax-Sale",
      "notes": "Columbia (capital). Annual tax sales and sealed bid auctions."
    },
    {
      "id": 76,
      "state": "South Carolina",
      "county": "Horry",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 12,
      "medianHomeValue": 325000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Tax Department",
      "notes": "Myrtle Beach. Tourism market. Vacation properties."
    },
    {
      "id": 77,
      "state": "North Carolina",
      "county": "Mecklenburg",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 385000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "Contact County Tax Administration",
      "notes": "Charlotte. 150-200 properties. 10-day upset bid system."
    },
    {
      "id": 78,
      "state": "North Carolina",
      "county": "Wake",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.wake.gov/departments-government/tax-administration/real-estate/foreclosures",
      "notes": "Raleigh. June 23, 2026 auction. Research Triangle. Tech hub."
    },
    {
      "id": 79,
      "state": "North Carolina",
      "county": "Durham",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 345000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Tax Administration",
      "notes": "Research Triangle. Duke University."
    },
    {
      "id": 80,
      "state": "North Carolina",
      "county": "Guilford",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 225000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "low",
      "investorScore": 48,
      "auctionWebsite": "Contact County Tax Administration",
      "notes": "Greensboro/High Point. Affordable market."
    },
    {
      "id": 81,
      "state": "New Jersey",
      "county": "Bergen",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 625000,
      "population": null,
      "crimeScore": 78,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "Contact Municipal Tax Collector",
      "notes": "NYC suburbs. Very high property values. Fall/winter auctions by municipality."
    },
    {
      "id": 82,
      "state": "New Jersey",
      "county": "Essex",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 435000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "Contact Municipal Tax Collector",
      "notes": "Newark area. Varies by municipality."
    },
    {
      "id": 83,
      "state": "New Jersey",
      "county": "Middlesex",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 485000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact Municipal Tax Collector",
      "notes": "Central NJ. NYC/Philly commuters."
    },
    {
      "id": 84,
      "state": "New Jersey",
      "county": "Hudson",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 545000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "Contact Municipal Tax Collector",
      "notes": "Jersey City/Hoboken. NYC commuters. Waterfront properties."
    },
    {
      "id": 85,
      "state": "Pennsylvania",
      "county": "Philadelphia",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 55,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.bid4assets.com/philataxsales",
      "notes": "Major city. Sheriff's office conducts online auctions via Bid4Assets."
    },
    {
      "id": 86,
      "state": "Pennsylvania",
      "county": "Allegheny",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 195000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact County Sheriff",
      "notes": "Pittsburgh. Special auction provisions separate from other PA counties."
    },
    {
      "id": 87,
      "state": "Pennsylvania",
      "county": "Montgomery",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 385000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.montgomerycountypa.gov/2331/Upset-Sale",
      "notes": "Philadelphia suburbs. Annual upset sale. Registration Oct 1-30."
    },
    {
      "id": 88,
      "state": "Michigan",
      "county": "Wayne",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 165000,
      "population": null,
      "crimeScore": 52,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.waynecountymi.gov/Government/Elected-Officials/Treasurer/Claims-Auctions",
      "notes": "Detroit metro. March foreclosure. Claims for surplus proceeds available."
    },
    {
      "id": 89,
      "state": "Michigan",
      "county": "Oakland",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.tax-sale.info",
      "notes": "Detroit suburbs. Q3-Q4 2026 auction. Call 248-858-0611."
    },
    {
      "id": 90,
      "state": "Michigan",
      "county": "Macomb",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 225000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.macombgov.org/departments/treasurers-office/tax-foreclosure/auction-and-claims",
      "notes": "Detroit suburbs. Check after July 1, 2026 for parcel list."
    },
    {
      "id": 91,
      "state": "Colorado",
      "county": "Denver",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 14,
      "redemptionMonths": 36,
      "medianHomeValue": 585000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "high",
      "investorScore": 24,
      "auctionWebsite": "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Department-of-Finance/Our-Divisions/Treasury/Property-Taxes/Real-Estate-Delinquent-Taxes-and-Tax-Lien-Sale",
      "notes": "State capital. High property values. Competitive market."
    },
    {
      "id": 92,
      "state": "Colorado",
      "county": "Jefferson",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 14,
      "redemptionMonths": 36,
      "medianHomeValue": 595000,
      "population": null,
      "crimeScore": 75,
      "competitionLevel": "medium",
      "investorScore": 34,
      "auctionWebsite": "https://www.jeffco.us/2430/Tax-Lien-Sale",
      "notes": "Denver suburbs. November 2026 auction. Mountain communities."
    },
    {
      "id": 93,
      "state": "Colorado",
      "county": "Arapahoe",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 14,
      "redemptionMonths": 36,
      "medianHomeValue": 535000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "medium",
      "investorScore": 34,
      "auctionWebsite": "https://www.arapahoeco.gov/your_county/county_departments/treasurer/tax_lien_sale/",
      "notes": "Denver suburbs. Files available Oct. Online bidding opens ~1 month prior."
    },
    {
      "id": 94,
      "state": "Colorado",
      "county": "El Paso",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 14,
      "redemptionMonths": 36,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "low",
      "investorScore": 44,
      "auctionWebsite": "Contact County Treasurer",
      "notes": "Colorado Springs. Military market. More affordable than Denver."
    },
    {
      "id": 95,
      "state": "Nevada",
      "county": "Clark",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "high",
      "investorScore": 28,
      "auctionWebsite": "https://www.clarkcountynv.gov/government/elected_officials/county_treasurer/real-property-tax-auction",
      "notes": "Las Vegas. April auction. Redemption until 5pm 3rd business day before sale."
    },
    {
      "id": 96,
      "state": "Nevada",
      "county": "Washoe",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 515000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.washoecounty.gov/treas/TaxSale.php",
      "notes": "Reno/Tahoe. April auction. Fast-growing market."
    },
    {
      "id": 97,
      "state": "Alabama",
      "county": "Jefferson",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 12,
      "redemptionMonths": 36,
      "medianHomeValue": 215000,
      "population": null,
      "crimeScore": 58,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "https://www.govease.com",
      "notes": "Birmingham. May 5+ auction. Transitioned to tax lien format 2025+."
    },
    {
      "id": 98,
      "state": "Alabama",
      "county": "Madison",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 12,
      "redemptionMonths": 36,
      "medianHomeValue": 265000,
      "population": null,
      "crimeScore": 72,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact County Tax Collector",
      "notes": "Huntsville. First week of May. NASA/defense contractor market. 256-532-3370."
    },
    {
      "id": 99,
      "state": "Alabama",
      "county": "Mobile",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 12,
      "redemptionMonths": 36,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 60,
      "competitionLevel": "low",
      "investorScore": 42,
      "auctionWebsite": "Contact County Tax Collector",
      "notes": "Gulf Coast. Port city. Affordable market."
    },
    {
      "id": 100,
      "state": "Tennessee",
      "county": "Shelby",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 195000,
      "population": null,
      "crimeScore": 55,
      "competitionLevel": "medium",
      "investorScore": 30,
      "auctionWebsite": "https://www.zeusauction.com",
      "notes": "Memphis. Chancery Court conducts sales. Online via ZeusAuction since April 2024."
    },
    {
      "id": 101,
      "state": "Tennessee",
      "county": "Davidson",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 425000,
      "population": null,
      "crimeScore": 62,
      "competitionLevel": "high",
      "investorScore": 20,
      "auctionWebsite": "https://chanceryclerkandmaster.nashville.gov/fees/delinquent-tax-sales/",
      "notes": "Nashville. In-person only at Metro Courthouse. Register day of sale before noon."
    },
    {
      "id": 102,
      "state": "Tennessee",
      "county": "Knox",
      "auctionType": "Tax Deed (Redeemable)",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Hybrid",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 285000,
      "population": null,
      "crimeScore": 68,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://trustee.knoxcounty.org/services/tax-sale",
      "notes": "Knoxville. Advertisement goes live April 27, 2026."
    },
    {
      "id": 103,
      "state": "Missouri",
      "county": "St. Louis City",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 185000,
      "population": null,
      "crimeScore": 50,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "Contact City Collector",
      "notes": "July 14, Aug 11, Oct 6, 2026 sales. Uses tax deeds (not liens like most MO)."
    },
    {
      "id": 104,
      "state": "Missouri",
      "county": "St. Louis County",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 245000,
      "population": null,
      "crimeScore": 65,
      "competitionLevel": "medium",
      "investorScore": 30,
      "auctionWebsite": "Contact County Collector",
      "notes": "Sealed bid ~Aug 25. Check county Real Property Tax Sales page."
    },
    {
      "id": 105,
      "state": "Missouri",
      "county": "Jackson",
      "auctionType": "Tax Deed",
      "auctionDate": "2026-07-01",
      "auctionFormat": "In-Person",
      "maxInterestRate": 18,
      "redemptionMonths": 24,
      "medianHomeValue": 225000,
      "population": null,
      "crimeScore": 58,
      "competitionLevel": "medium",
      "investorScore": 38,
      "auctionWebsite": "https://www.16thcircuit.org/delinquent-land-tax-sale-overview",
      "notes": "Kansas City. Uses tax deeds. Independence sale July 31, KC sale Aug 7, 2026."
    },
    {
      "id": 106,
      "state": "Missouri",
      "county": "Clay",
      "auctionType": "Tax Lien",
      "auctionDate": "2026-07-01",
      "auctionFormat": "Online",
      "maxInterestRate": 10,
      "redemptionMonths": 12,
      "medianHomeValue": 265000,
      "population": null,
      "crimeScore": 70,
      "competitionLevel": "low",
      "investorScore": 40,
      "auctionWebsite": "https://www.civicsource.com",
      "notes": "KC suburbs. Registration closes noon CST. Sale at 10am CST. Aug 25 redemption deadline."
    }
  
  ]

  // Filter counties based on search and state filter
  const filteredCounties = counties.filter((county) => {
    const matchesSearch = searchQuery === '' ||
      county.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      county.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      county.platform.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesState = stateFilter === 'all' ||
      county.state === stateFilter

    return matchesSearch && matchesState
  })

  // Sort filtered counties
  const sortedCounties = [...filteredCounties].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        // Sort by auction date (nulls last)
        if (!a.auction_date && !b.auction_date) return 0
        if (!a.auction_date) return 1
        if (!b.auction_date) return -1
        return new Date(a.auction_date).getTime() - new Date(b.auction_date).getTime()
      case 'state':
        return a.state.localeCompare(b.state)
      case 'county':
        return a.county.localeCompare(b.county)
      default:
        return 0
    }
  })

  // Get upcoming auctions
  const upcomingAuctions = counties
    .filter(c => c.auction_date)
    .sort((a, b) => new Date(a.auction_date!).getTime() - new Date(b.auction_date!).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="page-header mb-4">County Auctions 2026</h1>
            <p className="text-xl text-gray-300">
              {loading ? 'Loading...' : `Explore ${sortedCounties.length} of ${counties.length} counties across ${allStates.length} states with upcoming auction schedules`}
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counties, states, platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>

              <div className="relative">
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="all">All States ({allStates.length})</option>
                  {allStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="date">Auction Date</option>
                  <option value="state">State</option>
                  <option value="county">County Name</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <Button variant="secondary" className="flex items-center justify-center" onClick={fetchCounties}>
                <Filter className="w-5 h-5 mr-2" />
                Refresh
              </Button>
            </div>
          </Card>

          {/* Top Counties Summary */}
          {upcomingAuctions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {upcomingAuctions.map((county, idx) => (
                <Card key={county.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {idx === 0 ? 'Next Auction' : `Upcoming ${idx + 1}`}
                      </div>
                      <div className="text-2xl font-bold">{county.county}, {county.state}</div>
                    </div>
                    <Badge variant={idx === 0 ? 'gold' : 'gray'}>
                      {county.auction_date ? new Date(county.auction_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'TBD'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {county.platform} • {county.format}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {/* Counties Grid */}
          <div className="space-y-4">
            {loading ? (
              <Card className="p-8 text-center">
                <p className="text-gray-400">Loading counties...</p>
              </Card>
            ) : sortedCounties.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-400">No counties found matching your criteria</p>
              </Card>
            ) : (
              sortedCounties.map((county) => (
                <Card key={county.id} hover className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* County Info */}
                    <div className="lg:col-span-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xl font-bold">{county.county}, {county.state}</h3>
                          </div>
                          <p className="text-sm text-gray-400">{county.sale_type}</p>
                        </div>
                      </div>
                      <Badge variant="blue" className="text-sm">
                        {county.platform}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Auction Date
                        </div>
                        <div className="text-sm font-semibold">
                          {county.auction_date
                            ? new Date(county.auction_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'See window'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Format</div>
                        <Badge variant="emerald" className="text-xs">
                          {county.format}
                        </Badge>
                      </div>

                      <div className="col-span-2">
                        <div className="text-xs text-gray-400 mb-1">Sale Window</div>
                        <div className="text-sm">
                          {county.sale_date_window}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                      <a
                        href={county.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-center text-sm flex items-center justify-center"
                      >
                        Register
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                      {county.source_url && (
                        <a
                          href={county.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-center text-sm flex items-center justify-center"
                        >
                          County Website
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {county.notes && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-300">
                        {county.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Info */}
          {!loading && counties.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-400">
                Showing {sortedCounties.length} of {counties.length} counties across {allStates.length} states
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
