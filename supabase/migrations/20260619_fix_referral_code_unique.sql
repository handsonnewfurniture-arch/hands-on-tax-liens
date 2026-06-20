-- Fix Referral Code Unique Constraint
-- Bug: referral_code was UNIQUE, preventing multiple referrals from same code
-- Fix: Remove UNIQUE constraint, add index for performance

-- Drop the existing unique constraint on referral_code
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referral_code_key;

-- Add a non-unique index for performance
CREATE INDEX IF NOT EXISTS idx_referrals_code_non_unique ON referrals(referral_code);

-- Note: referee_email already has UNIQUE constraint (correct behavior)
-- One email can only be referred once, but multiple emails can use same referral code
