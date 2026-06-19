const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyRewards() {
  console.log('🔍 Verifying Referral System Data\n');

  // Check referrals
  const { data: referrals, error: refError } = await supabase
    .from('referrals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('📊 Recent Referrals:');
  if (referrals && referrals.length > 0) {
    referrals.forEach(ref => {
      console.log(`  - Code: ${ref.referral_code}`);
      console.log(`    Status: ${ref.status}`);
      console.log(`    Referee: ${ref.referee_email}`);
      console.log(`    Tier: ${ref.conversion_tier || 'N/A'}`);
      console.log(`    Value: $${ref.conversion_value || 0}`);
      console.log('');
    });
  } else {
    console.log('  No referrals found\n');
  }

  // Check rewards
  const { data: rewards, error: rewError } = await supabase
    .from('referral_rewards')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('🎁 Recent Rewards:');
  if (rewards && rewards.length > 0) {
    rewards.forEach(reward => {
      console.log(`  - Type: ${reward.reward_type}`);
      console.log(`    Amount: $${reward.reward_amount}`);
      console.log(`    Tier: ${reward.reward_tier}`);
      console.log(`    Status: ${reward.status}`);
      console.log('');
    });
  } else {
    console.log('  No rewards found\n');
  }

  // Check stats
  const { data: stats, error: statsError } = await supabase
    .from('referral_stats')
    .select('*')
    .order('successful_referrals', { ascending: false })
    .limit(5);

  console.log('📈 Top Referrer Stats:');
  if (stats && stats.length > 0) {
    stats.forEach(stat => {
      console.log(`  - Email: ${stat.email}`);
      console.log(`    Total: ${stat.total_referrals}`);
      console.log(`    Successful: ${stat.successful_referrals}`);
      console.log(`    Free Months Earned: ${stat.free_months_earned}`);
      console.log(`    Free Months Pending: ${stat.free_months_pending}`);
      console.log('');
    });
  } else {
    console.log('  No stats found\n');
  }

  console.log('✅ Verification complete!\n');
}

verifyRewards();
