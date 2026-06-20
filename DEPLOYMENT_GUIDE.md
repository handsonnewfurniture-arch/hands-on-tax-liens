# Referral System - Deployment & Monitoring Guide

## 🚀 Pre-Deployment Checklist

### ✅ Database
- [x] Migration applied (`20260619_referral_system.sql`)
- [x] Constraint fix applied (`20260619_fix_referral_code_unique.sql`)
- [x] All 4 tables created and verified
- [x] Triggers functioning correctly

### ✅ Code Integration
- [x] Checkout flow integrated (Stripe webhook)
- [x] Referral tracking helper functions in `lib/referrals.ts`
- [x] API endpoints deployed (6 total)
- [ ] Signup flow integrated (pending auth implementation)

### ✅ Testing
- [x] 20/20 comprehensive tests passing
- [x] Multiple referrals verified working
- [x] Stats triggers verified
- [x] Reward creation verified

---

## 📋 Deployment Steps

### Step 1: Environment Variables

Add these to your production environment (Vercel, Railway, etc.):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cljadnzzbhekjfwbzzrz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cron Job Security (Optional)
CRON_SECRET=your_random_secret_here
```

### Step 2: Deploy Code

```bash
# Commit latest changes
git add .
git commit -m "Deploy referral system to production"
git push origin main

# Vercel will auto-deploy, or:
vercel --prod
```

### Step 3: Set Up Cron Jobs

#### In Vercel Dashboard:

1. Go to **Project Settings** → **Cron Jobs**

2. **Add Job #1: Approve Rewards**
   - **Path:** `/api/cron/approve-rewards`
   - **Schedule:** `0 2 * * *` (Daily at 2 AM)
   - **Description:** Auto-approve rewards after 30-day retention

3. **Add Job #2: Update Ranks**
   - **Path:** `/api/cron/update-ranks`
   - **Schedule:** `0 * * * *` (Every hour)
   - **Description:** Recalculate leaderboard rankings

4. **Optional:** Add authorization header
   - **Headers:** `Authorization: Bearer ${CRON_SECRET}`

#### Test Cron Jobs:

```bash
# Test approve-rewards
curl https://yoursite.com/api/cron/approve-rewards \
  -H "Authorization: Bearer your_cron_secret"

# Test update-ranks
curl https://yoursite.com/api/cron/update-ranks \
  -H "Authorization: Bearer your_cron_secret"
```

### Step 4: Verify Production

Run smoke tests against production:

```bash
# 1. Generate referral code
curl https://yoursite.com/api/referrals?user_id=test-user-123

# 2. Get leaderboard
curl https://yoursite.com/api/referrals/leaderboard?limit=10

# 3. Check rewards endpoint
curl https://yoursite.com/api/referrals/rewards?user_id=test-user-123
```

---

## 📊 Monitoring Setup

### 1. Supabase Dashboard Queries

Save these as custom queries in Supabase SQL Editor:

#### **Referral Performance**
```sql
-- Daily referral metrics
SELECT
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE status = 'clicked') as clicks,
  COUNT(*) FILTER (WHERE status = 'signed_up') as signups,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::numeric /
        NULLIF(COUNT(*) FILTER (WHERE status = 'signed_up'), 0) * 100, 2) as conversion_rate
FROM referrals
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### **Top Referrers**
```sql
-- Top 20 referrers by conversions
SELECT
  rs.email,
  rs.successful_referrals,
  rs.free_months_earned,
  rs.total_value_generated,
  rs.rank
FROM referral_stats rs
WHERE rs.successful_referrals > 0
ORDER BY rs.successful_referrals DESC
LIMIT 20;
```

#### **Pending Rewards**
```sql
-- Rewards waiting for approval
SELECT
  rr.id,
  rr.user_id,
  rr.reward_amount,
  rr.status,
  r.converted_at,
  DATE_PART('day', NOW() - r.converted_at) as days_since_conversion
FROM referral_rewards rr
JOIN referrals r ON r.id = rr.referral_id
WHERE rr.status = 'pending'
ORDER BY r.converted_at ASC;
```

#### **Conversion Funnel**
```sql
-- Referral funnel analysis
SELECT
  'Clicked' as stage,
  COUNT(*) as count,
  100.0 as percentage
FROM referrals
WHERE status IN ('clicked', 'signed_up', 'converted')

UNION ALL

SELECT
  'Signed Up' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric /
    (SELECT COUNT(*) FROM referrals WHERE status IN ('clicked', 'signed_up', 'converted')) * 100, 1) as percentage
FROM referrals
WHERE status IN ('signed_up', 'converted')

UNION ALL

SELECT
  'Converted' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric /
    (SELECT COUNT(*) FROM referrals WHERE status IN ('clicked', 'signed_up', 'converted')) * 100, 1) as percentage
FROM referrals
WHERE status = 'converted'

ORDER BY percentage DESC;
```

### 2. Key Metrics Dashboard

Create a monitoring dashboard tracking:

**Daily Metrics:**
- New referral clicks
- New signups from referrals
- New conversions
- Conversion rate (signups → conversions)

**Weekly Metrics:**
- Total active referrers
- Average referrals per referrer
- Total rewards pending/approved/delivered
- Revenue from referrals

**Monthly Metrics:**
- CAC via referrals vs paid ads
- ROI by tier
- Top 10 referrers
- Churn rate of referred users

### 3. Alerts Setup

Set up alerts for:

**Critical Issues:**
- ❌ API endpoint returning 500 errors
- ❌ Webhook processing failures
- ❌ Database trigger failures

**Business Metrics:**
- 📉 Conversion rate drops below 10%
- 📈 Pending rewards > $1,000
- 🎉 New referrer reaches 10+ conversions

### 4. Logging

Monitor application logs for:

```bash
# Success patterns
✅ Referral signup tracked successfully
✅ Referral conversion tracked successfully
✅ Approved reward [id] for user [id]

# Warning patterns
⚠️ No referral code found in cookie
⚠️ Referral conversion tracking failed

# Error patterns
❌ Failed to track referral
❌ Failed to approve reward
❌ Webhook error
```

---

## 🔍 Troubleshooting

### Issue: Referrals Not Tracking

**Check:**
1. Cookie is set correctly on referral page
2. Browser isn't blocking cookies
3. Referral code exists in database
4. API endpoint is accessible

**Debug:**
```bash
# Check if code exists
curl https://yoursite.com/api/referrals?user_id=USER_ID

# Try manual tracking
curl -X POST https://yoursite.com/api/referrals/track \
  -H "Content-Type: application/json" \
  -d '{"referral_code":"CODE","event_type":"click"}'
```

### Issue: Rewards Not Being Approved

**Check:**
1. Cron job is running (check Vercel logs)
2. 30 days have passed since conversion
3. Reward status is 'pending'
4. Database trigger is working

**Debug:**
```sql
-- Check pending rewards
SELECT * FROM referral_rewards
WHERE status = 'pending'
ORDER BY created_at ASC;

-- Manually approve a reward
UPDATE referral_rewards
SET status = 'approved', approved_at = NOW()
WHERE id = 'reward_id';
```

### Issue: Stats Not Updating

**Check:**
1. Database trigger exists
2. `update_referral_stats()` function is working
3. No database errors in logs

**Debug:**
```sql
-- Manually trigger stats update
SELECT update_referral_stats();

-- Check trigger
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'update_referral_stats_trigger';
```

---

## 📈 Success Metrics

After launch, track these KPIs:

### Week 1:
- ✅ All cron jobs running successfully
- ✅ No API errors in production
- ✅ First referrals being tracked
- ✅ Webhooks processing correctly

### Month 1:
- 🎯 Target: 50+ referral signups
- 🎯 Target: 10+ conversions
- 🎯 Target: 20% conversion rate
- 🎯 Target: CAC < $75

### Month 3:
- 🎯 Target: 200+ referral signups
- 🎯 Target: 50+ conversions
- 🎯 Target: 25% conversion rate
- 🎯 Target: 30% of new users from referrals

---

## 🎉 Launch Announcement

Once deployed, announce the referral program:

**Email to existing users:**
- Subject: "Earn Free Months - Refer Friends to [Your App]"
- Body: Explain program, share their referral link, show rewards

**In-app banner:**
- "🎁 New: Refer friends, get free months!"
- Click opens referral dashboard

**Social media:**
- Announce the program
- Show example rewards
- Encourage sharing

---

## 📞 Support

For technical issues:
- Check `REFERRAL_API_DOCS.md` for API documentation
- Run `comprehensive-test.js` to verify system
- Review Supabase logs for database errors
- Check Vercel logs for API errors

For business questions:
- See `REFERRAL_PROGRAM.md` for economics
- Review SQL queries above for analytics
- Monitor conversion funnel weekly
