# Referral System - Backend API Documentation

## Overview

Complete referral tracking system with:
- Unique referral codes
- Click/signup/conversion tracking
- Free month rewards
- Leaderboards
- Automated reward fulfillment
- Fraud prevention

---

## Database Schema

### Tables Created

1. **`referrals`** - Main referral tracking
2. **`referral_rewards`** - Reward payouts
3. **`referral_stats`** - Aggregated user stats
4. **`referral_discount_codes`** - Stripe discount codes
5. **`referral_leaderboard`** - View for leaderboard queries

### Apply Migration

```bash
# Copy SQL to Supabase SQL Editor
# https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

# Paste contents of:
supabase/migrations/20260619_referral_system.sql
```

---

## API Endpoints

### 1. Get Referral Info

**GET** `/api/referrals`

Get user's referral code, stats, and history.

**Query Parameters:**
- `user_id` (required) - User's UUID

**Response:**
```json
{
  "success": true,
  "referral_code": "TIGER-A7B3",
  "referral_url": "https://yoursite.com/ref/TIGER-A7B3",
  "stats": {
    "total_referrals": 5,
    "successful_referrals": 3,
    "pending_referrals": 2,
    "free_months_earned": 3,
    "free_months_pending": 2,
    "current_tier": "pro",
    "rank": 12
  },
  "referrals": [
    {
      "id": "uuid",
      "referee_email": "friend@example.com",
      "status": "converted",
      "converted_at": "2026-06-15T10:00:00Z"
    }
  ]
}
```

**Example:**
```javascript
const response = await fetch('/api/referrals?user_id=123')
const data = await response.json()
console.log(data.referral_code) // "TIGER-A7B3"
```

---

### 2. Create Referral

**POST** `/api/referrals`

Create a new referral relationship.

**Body:**
```json
{
  "referrer_user_id": "uuid",
  "referrer_email": "referrer@example.com",
  "referee_email": "friend@example.com",
  "referral_code": "TIGER-A7B3" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "referral": {
    "id": "uuid",
    "referrer_user_id": "uuid",
    "referee_email": "friend@example.com",
    "referral_code": "TIGER-A7B3",
    "status": "pending"
  },
  "discount_code": "TIGER-A7B3-30OFF"
}
```

---

### 3. Track Referral Events

**POST** `/api/referrals/track`

Track clicks, signups, and conversions.

**Body (Click Event):**
```json
{
  "referral_code": "TIGER-A7B3",
  "event_type": "click"
}
```

**Body (Signup Event):**
```json
{
  "referral_code": "TIGER-A7B3",
  "event_type": "signup",
  "referee_email": "friend@example.com",
  "referee_user_id": "uuid" // Optional
}
```

**Body (Conversion Event):**
```json
{
  "referral_code": "TIGER-A7B3",
  "event_type": "conversion",
  "conversion_details": {
    "type": "subscription",
    "tier": "pro",
    "value": 79,
    "stripe_subscription_id": "sub_xxx",
    "stripe_payment_intent": "pi_xxx"
  }
}
```

**Response:**
```json
{
  "success": true,
  "referral": {
    "id": "uuid",
    "status": "converted",
    "converted_at": "2026-06-15T10:00:00Z"
  },
  "event_type": "conversion"
}
```

**Integration Example:**
```javascript
// On referral link click
async function trackClick(referralCode) {
  await fetch('/api/referrals/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referral_code: referralCode,
      event_type: 'click'
    })
  })

  // Store in cookie for attribution
  document.cookie = `ref_code=${referralCode}; path=/; max-age=${60*60*24*30}`
}

// On user signup
async function trackSignup(email, userId) {
  const referralCode = getCookie('ref_code')
  if (!referralCode) return

  await fetch('/api/referrals/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referral_code: referralCode,
      event_type: 'signup',
      referee_email: email,
      referee_user_id: userId
    })
  })
}

// On subscription purchase
async function trackConversion(email, userId, tier, value, subscriptionId) {
  const referralCode = getCookie('ref_code')
  if (!referralCode) return

  await fetch('/api/referrals/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referral_code: referralCode,
      event_type: 'conversion',
      conversion_details: {
        type: 'subscription',
        tier,
        value,
        stripe_subscription_id: subscriptionId
      }
    })
  })

  // Clear cookie after conversion
  document.cookie = 'ref_code=; path=/; max-age=0'
}
```

---

### 4. Get Leaderboard

**GET** `/api/referrals/leaderboard`

Get top referrers.

**Query Parameters:**
- `limit` (optional, default: 100) - Number of results
- `period` (optional, default: 'all_time') - 'all_time', 'this_month', 'this_week'

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "user_id": "uuid",
      "email": "top@referrer.com",
      "successful_referrals": 15,
      "free_months_earned": 15,
      "total_value_generated": 1185,
      "current_tier": "elite",
      "rank": 1
    }
  ],
  "period": "all_time",
  "count": 100
}
```

**Example:**
```javascript
// Get top 10 referrers this month
const response = await fetch('/api/referrals/leaderboard?limit=10&period=this_month')
const { leaderboard } = await response.json()
```

---

### 5. Get Rewards

**GET** `/api/referrals/rewards`

Get user's reward history.

**Query Parameters:**
- `user_id` (required) - User's UUID
- `status` (optional) - Filter by status: 'pending', 'approved', 'delivered'

**Response:**
```json
{
  "success": true,
  "rewards": [
    {
      "id": "uuid",
      "referral_id": "uuid",
      "reward_type": "free_month",
      "reward_amount": 79,
      "reward_tier": "pro",
      "status": "delivered",
      "delivered_at": "2026-06-15T10:00:00Z",
      "referral": {
        "referee_email": "friend@example.com",
        "conversion_tier": "pro",
        "converted_at": "2026-05-15T10:00:00Z"
      }
    }
  ],
  "totals": {
    "pending": 2,
    "pending_value": 158,
    "delivered": 3,
    "delivered_value": 237,
    "total_free_months": 3
  }
}
```

---

### 6. Process Rewards

**POST** `/api/referrals/rewards`

Approve or deliver rewards (admin only).

**Body:**
```json
{
  "reward_id": "uuid",
  "action": "approve" // or "deliver", "cancel"
}
```

**Response:**
```json
{
  "success": true,
  "reward": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2026-06-15T10:00:00Z"
  },
  "action": "approve"
}
```

**Actions:**
- **`approve`** - Mark reward as approved (after 30-day retention check)
- **`deliver`** - Actually deliver the reward (extend subscription, add credits, etc)
- **`cancel`** - Cancel a reward

---

## Frontend Integration

### 1. Referral Dashboard Component

Already created at `/app/referrals/page.tsx`

**Features:**
- Displays referral code and stats
- Copy link button
- Share buttons for social media
- Milestone progress
- Badge display

### 2. Referral Landing Page

Already created at `/app/ref/[code]/page.tsx`

**Features:**
- Tracks referral click
- Shows discounted pricing (30% off)
- Social proof
- Direct signup links

### 3. Integration with Signup Flow

Add to your signup page:

```typescript
import { trackReferralSignup } from '@/lib/referrals'

async function handleSignup(email: string, password: string) {
  // Create user account
  const user = await createUser(email, password)

  // Track referral signup
  await trackReferralSignup(email, user.id)

  // Continue signup flow...
}
```

### 4. Integration with Checkout Flow

Add to your checkout success handler:

```typescript
import { trackReferralConversion } from '@/lib/referrals'

async function handleCheckoutSuccess(session: StripeSession) {
  // Process subscription
  const subscription = await createSubscription(session)

  // Track referral conversion
  await trackReferralConversion({
    email: session.customer_email,
    userId: session.metadata.user_id,
    tier: session.metadata.tier,
    value: session.amount_total / 100,
    subscriptionId: subscription.id,
    paymentIntent: session.payment_intent
  })

  // Continue success flow...
}
```

---

## Reward Fulfillment

### Automated Process

1. **User signs up** → `status: 'signed_up'`
2. **User subscribes** → `status: 'converted'` + Create `referral_reward` (status: 'pending')
3. **After 30 days** → Auto-approve reward (cron job)
4. **Deliver reward** → Extend Stripe subscription by 1 month

### Stripe Integration

**Extend Subscription (Free Month):**

```typescript
import Stripe from 'stripe'

async function grantFreeMonth(userId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  // Get user's subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Calculate new billing date (current + 1 month)
  const currentEnd = new Date(subscription.current_period_end * 1000)
  currentEnd.setMonth(currentEnd.getMonth() + 1)
  const newBillingDate = Math.floor(currentEnd.getTime() / 1000)

  // Update subscription
  await stripe.subscriptions.update(subscriptionId, {
    billing_cycle_anchor: newBillingDate,
    proration_behavior: 'none'
  })
}
```

---

## Cron Jobs

### 1. Auto-Approve Rewards (Daily)

Check for rewards pending approval after 30-day retention:

```typescript
// app/api/cron/approve-rewards/route.ts
export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Find rewards pending for 30+ days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: rewards } = await supabase
    .from('referral_rewards')
    .select('*, referral:referrals(*)')
    .eq('status', 'pending')
    .lt('referral.converted_at', thirtyDaysAgo.toISOString())

  // Auto-approve each reward
  for (const reward of rewards) {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/referrals/rewards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reward_id: reward.id,
        action: 'approve'
      })
    })
  }

  return Response.json({ approved: rewards.length })
}
```

**Setup in Vercel:**
1. Go to Project Settings → Cron Jobs
2. Add: `0 2 * * *` (runs daily at 2 AM)
3. Endpoint: `/api/cron/approve-rewards`

### 2. Update Leaderboard Ranks (Hourly)

```typescript
// app/api/cron/update-ranks/route.ts
export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  await supabase.rpc('calculate_referral_ranks')

  return Response.json({ success: true })
}
```

---

## Security & Fraud Prevention

### Implemented Measures

1. **Email Verification** - Referee must verify email
2. **Payment Required** - Free trials don't count
3. **30-Day Retention** - Reward only paid after 30 days
4. **Unique Email** - Max 1 referral per email address
5. **IP Tracking** - Detect self-referrals
6. **Manual Review** - Flag suspicious patterns (>10 refs/day)

### RLS Policies

```sql
-- Users can only view their own referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid()::text = referrer_user_id::text);

-- Public can view leaderboard (top 100 only)
CREATE POLICY "Public can view leaderboard" ON referral_stats
  FOR SELECT USING (rank <= 100);
```

---

## Testing

### Test Flow

1. **Generate referral link:**
```bash
curl http://localhost:3000/api/referrals?user_id=YOUR_USER_ID
```

2. **Track click:**
```bash
curl -X POST http://localhost:3000/api/referrals/track \
  -H "Content-Type: application/json" \
  -d '{"referral_code":"TIGER-A7B3","event_type":"click"}'
```

3. **Track signup:**
```bash
curl -X POST http://localhost:3000/api/referrals/track \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code":"TIGER-A7B3",
    "event_type":"signup",
    "referee_email":"friend@test.com"
  }'
```

4. **Track conversion:**
```bash
curl -X POST http://localhost:3000/api/referrals/track \
  -H "Content-Type: application/json" \
  -d '{
    "referral_code":"TIGER-A7B3",
    "event_type":"conversion",
    "conversion_details":{
      "type":"subscription",
      "tier":"pro",
      "value":79,
      "stripe_subscription_id":"sub_test123"
    }
  }'
```

5. **Check leaderboard:**
```bash
curl http://localhost:3000/api/referrals/leaderboard?limit=10
```

---

## Monitoring & Analytics

### Key Metrics to Track

```sql
-- Total referrals by status
SELECT status, COUNT(*)
FROM referrals
GROUP BY status;

-- Conversion rate
SELECT
  COUNT(*) FILTER (WHERE status = 'converted')::float /
  COUNT(*) FILTER (WHERE status IN ('clicked', 'signed_up', 'converted')) * 100
  AS conversion_rate
FROM referrals;

-- Top referrers
SELECT
  referrer_email,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions,
  SUM(conversion_value) as total_value
FROM referrals
GROUP BY referrer_email
ORDER BY conversions DESC
LIMIT 10;

-- Rewards summary
SELECT
  status,
  reward_type,
  COUNT(*),
  SUM(reward_amount)
FROM referral_rewards
GROUP BY status, reward_type;
```

---

## Troubleshooting

### Common Issues

**Issue:** Referral not tracking
- Check cookie is set correctly
- Verify referral code exists in database
- Check browser console for errors

**Issue:** Reward not delivered
- Verify 30 days have passed since conversion
- Check reward status in `referral_rewards` table
- Look at Stripe subscription update logs

**Issue:** Duplicate referrals
- Check unique constraint on `referee_email`
- Verify email hasn't signed up before

---

## Next Steps

1. **Apply database migration** in Supabase
2. **Test API endpoints** locally
3. **Add tracking** to signup/checkout flows
4. **Set up cron jobs** for auto-approval
5. **Monitor metrics** in first week
6. **Launch** to users

---

## Support

For technical questions:
- See `REFERRAL_PROGRAM.md` for business logic
- See `REFERRAL_MARKETING_TEMPLATES.md` for copy
- Check `lib/referrals.ts` for helper functions
