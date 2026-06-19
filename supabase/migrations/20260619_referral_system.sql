-- Referral System Database Schema
-- Created: 2026-06-19

-- ============================================
-- REFERRALS TABLE
-- Tracks all referral relationships
-- ============================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referrer info
  referrer_user_id UUID NOT NULL,
  referrer_email TEXT NOT NULL,

  -- Referee info
  referee_email TEXT NOT NULL,
  referee_user_id UUID,

  -- Referral code and tracking
  referral_code TEXT UNIQUE NOT NULL,
  referral_url TEXT,

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'clicked', 'signed_up', 'converted', 'rewarded', 'expired')),

  -- Conversion details
  conversion_type TEXT CHECK (conversion_type IN ('subscription', 'listing', 'annual_plan')),
  conversion_tier TEXT CHECK (conversion_tier IN ('starter', 'pro', 'elite')),
  conversion_value DECIMAL(10,2),

  -- Referrer reward details
  referrer_reward_type TEXT DEFAULT 'free_month' CHECK (referrer_reward_type IN ('free_month', 'marketplace_credit', 'tier_upgrade', 'lifetime_access')),
  referrer_reward_amount DECIMAL(10,2),
  referrer_reward_status TEXT DEFAULT 'pending' CHECK (referrer_reward_status IN ('pending', 'approved', 'delivered', 'failed')),
  referrer_current_tier TEXT,

  -- Referee discount details
  referee_discount_code TEXT,
  referee_discount_applied BOOLEAN DEFAULT false,
  referee_discount_amount DECIMAL(10,2),

  -- Tracking metadata
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer_ip TEXT,
  referee_ip TEXT,
  user_agent TEXT,

  -- Timestamps
  clicked_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '120 days'),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_referee_email UNIQUE(referee_email),
  CONSTRAINT valid_conversion CHECK (
    (status = 'converted' AND conversion_type IS NOT NULL) OR
    (status != 'converted')
  )
);

-- ============================================
-- REFERRAL REWARDS TABLE
-- Tracks reward payouts
-- ============================================

CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,

  -- Reward details
  reward_type TEXT NOT NULL CHECK (reward_type IN ('free_month', 'marketplace_credit', 'tier_upgrade', 'cash', 'lifetime_access')),
  reward_amount DECIMAL(10,2) NOT NULL,
  reward_tier TEXT, -- Which tier gets the free month

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'delivered', 'failed', 'cancelled')),

  -- Payment/delivery details
  payment_method TEXT CHECK (payment_method IN ('subscription_credit', 'marketplace_credit', 'stripe_payout', 'tier_upgrade')),
  payment_reference TEXT, -- Stripe payment intent, subscription ID, etc

  -- Timestamps
  approved_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '365 days'),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL STATS TABLE
-- Aggregated stats per user
-- ============================================

CREATE TABLE IF NOT EXISTS referral_stats (
  user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,

  -- Referral counts
  total_referrals INT DEFAULT 0,
  successful_referrals INT DEFAULT 0,
  pending_referrals INT DEFAULT 0,
  clicked_referrals INT DEFAULT 0,

  -- Free months tracking
  free_months_earned INT DEFAULT 0,
  free_months_pending INT DEFAULT 0,
  free_months_redeemed INT DEFAULT 0,

  -- Financial tracking
  total_value_generated DECIMAL(10,2) DEFAULT 0,
  marketplace_credits_earned DECIMAL(10,2) DEFAULT 0,
  marketplace_credits_pending DECIMAL(10,2) DEFAULT 0,

  -- Tier info
  current_tier TEXT,
  upgraded_to_tier TEXT,
  upgrade_expires_at TIMESTAMPTZ,

  -- Badges and achievements
  badges JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',

  -- Leaderboard
  rank INT,
  all_time_rank INT,

  -- Timestamps
  first_referral_at TIMESTAMPTZ,
  last_referral_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL DISCOUNT CODES TABLE
-- Pre-generated discount codes for Stripe
-- ============================================

CREATE TABLE IF NOT EXISTS referral_discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  code TEXT UNIQUE NOT NULL,
  referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,

  -- Stripe details
  stripe_coupon_id TEXT,
  stripe_promotion_code TEXT,

  -- Discount details
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'amount')),
  discount_value DECIMAL(10,2) NOT NULL, -- 30 for 30% off
  duration TEXT DEFAULT 'repeating' CHECK (duration IN ('once', 'repeating', 'forever')),
  duration_in_months INT DEFAULT 3,

  -- Usage
  used_by_email TEXT,
  used_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT false,

  -- Expiration
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '120 days'),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRAL LEADERBOARD VIEW
-- For efficient leaderboard queries
-- ============================================

CREATE OR REPLACE VIEW referral_leaderboard AS
SELECT
  rs.user_id,
  rs.email,
  rs.successful_referrals,
  rs.free_months_earned,
  rs.total_value_generated,
  rs.current_tier,
  rs.badges,
  rs.rank,
  rs.first_referral_at,
  rs.last_referral_at,
  -- Calculate month-over-month
  (
    SELECT COUNT(*)
    FROM referrals r
    WHERE r.referrer_user_id = rs.user_id
    AND r.status = 'converted'
    AND r.converted_at >= DATE_TRUNC('month', NOW())
  ) as referrals_this_month
FROM referral_stats rs
WHERE rs.successful_referrals > 0
ORDER BY rs.successful_referrals DESC, rs.total_value_generated DESC;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_email ON referrals(referee_email);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_user_id ON referrals(referee_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_converted_at ON referrals(converted_at);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);

CREATE INDEX IF NOT EXISTS idx_referral_stats_rank ON referral_stats(rank);
CREATE INDEX IF NOT EXISTS idx_referral_stats_successful_referrals ON referral_stats(successful_referrals DESC);

CREATE INDEX IF NOT EXISTS idx_referral_discount_codes_code ON referral_discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_discount_codes_is_used ON referral_discount_codes(is_used) WHERE is_used = false;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update referral stats
CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Upsert referral stats for referrer
  INSERT INTO referral_stats (
    user_id,
    email,
    total_referrals,
    successful_referrals,
    pending_referrals,
    clicked_referrals,
    first_referral_at,
    last_referral_at,
    updated_at
  )
  SELECT
    NEW.referrer_user_id,
    NEW.referrer_email,
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'converted' OR status = 'rewarded'),
    COUNT(*) FILTER (WHERE status IN ('pending', 'clicked', 'signed_up')),
    COUNT(*) FILTER (WHERE status IN ('clicked', 'signed_up', 'converted', 'rewarded')),
    MIN(created_at),
    MAX(COALESCE(converted_at, signed_up_at, clicked_at, created_at)),
    NOW()
  FROM referrals
  WHERE referrer_user_id = NEW.referrer_user_id
  ON CONFLICT (user_id) DO UPDATE SET
    total_referrals = EXCLUDED.total_referrals,
    successful_referrals = EXCLUDED.successful_referrals,
    pending_referrals = EXCLUDED.pending_referrals,
    clicked_referrals = EXCLUDED.clicked_referrals,
    last_referral_at = EXCLUDED.last_referral_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate leaderboard ranks
CREATE OR REPLACE FUNCTION calculate_referral_ranks()
RETURNS void AS $$
BEGIN
  UPDATE referral_stats
  SET rank = ranked.rank
  FROM (
    SELECT
      user_id,
      ROW_NUMBER() OVER (ORDER BY successful_referrals DESC, total_value_generated DESC) as rank
    FROM referral_stats
    WHERE successful_referrals > 0
  ) ranked
  WHERE referral_stats.user_id = ranked.user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_referral_stats_trigger
AFTER INSERT OR UPDATE ON referrals
FOR EACH ROW
EXECUTE FUNCTION update_referral_stats();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamps
CREATE TRIGGER update_referrals_timestamp
BEFORE UPDATE ON referrals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_rewards_timestamp
BEFORE UPDATE ON referral_rewards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_discount_codes ENABLE ROW LEVEL SECURITY;

-- Users can read their own referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid()::text = referrer_user_id::text);

-- Users can view their own rewards
CREATE POLICY "Users can view own rewards" ON referral_rewards
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can view their own stats
CREATE POLICY "Users can view own stats" ON referral_stats
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Public can view leaderboard (top 100 only)
CREATE POLICY "Public can view leaderboard" ON referral_stats
  FOR SELECT USING (rank <= 100);

-- Service role has full access
CREATE POLICY "Service role full access referrals" ON referrals
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access rewards" ON referral_rewards
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access stats" ON referral_stats
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access codes" ON referral_discount_codes
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- INITIAL DATA
-- ============================================

-- Calculate initial ranks
SELECT calculate_referral_ranks();
