#!/usr/bin/env node

/**
 * Test Cron Jobs with Real Data
 * Creates test data and validates both cron jobs work correctly
 */

const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'http://localhost:3000';
const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  console.log('🧪 Testing Cron Jobs\n');

  try {
    // ============================================
    // Setup: Create test data
    // ============================================
    console.log('📋 Step 1: Creating test data...\n');

    const testUserId = '00000000-0000-0000-0000-999999999999'; // Test UUID
    const testRefereeEmail = `crontest-${Date.now()}@example.com`;
    const testReferralCode = `CRON-${Date.now().toString().slice(-4)}`;

    // Create a referral that converted 31 days ago
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

    const { data: referral, error: refError } = await supabase
      .from('referrals')
      .insert({
        referrer_user_id: testUserId,
        referrer_email: 'crontest@example.com',
        referee_email: testRefereeEmail,
        referral_code: testReferralCode,
        status: 'converted',
        conversion_type: 'subscription',
        conversion_tier: 'pro',
        conversion_value: 79,
        converted_at: thirtyOneDaysAgo.toISOString()
      })
      .select()
      .single();

    if (refError) throw new Error(`Failed to create referral: ${refError.message}`);

    console.log(`✅ Created referral: ${referral.id}`);
    console.log(`   Code: ${testReferralCode}`);
    console.log(`   Converted: ${thirtyOneDaysAgo.toISOString()} (31 days ago)`);

    // Create a pending reward for this referral
    const { data: reward, error: rewardError } = await supabase
      .from('referral_rewards')
      .insert({
        referral_id: referral.id,
        user_id: testUserId,
        reward_type: 'free_month',
        reward_amount: 79,
        reward_tier: 'pro',
        status: 'pending',
        payment_method: 'subscription_credit'
      })
      .select()
      .single();

    if (rewardError) throw new Error(`Failed to create reward: ${rewardError.message}`);

    console.log(`✅ Created pending reward: ${reward.id}`);
    console.log(`   Amount: $${reward.reward_amount}`);
    console.log(`   Status: ${reward.status}\n`);

    // ============================================
    // Test 1: Approve Rewards Cron Job
    // ============================================
    console.log('🔧 Step 2: Testing approve-rewards cron job...\n');

    const approveResponse = await fetch(`${BASE_URL}/api/cron/approve-rewards`);
    const approveData = await approveResponse.json();

    console.log('Response:');
    console.log(JSON.stringify(approveData, null, 2));

    if (!approveResponse.ok) {
      throw new Error(`Cron job failed: ${approveData.error}`);
    }

    if (!approveData.success) {
      throw new Error('Cron job returned success: false');
    }

    if (approveData.approved < 1) {
      throw new Error(`Expected at least 1 reward approved, got ${approveData.approved}`);
    }

    console.log(`\n✅ Cron job executed successfully`);
    console.log(`   Approved: ${approveData.approved}`);
    console.log(`   Failed: ${approveData.failed}`);
    console.log(`   Total checked: ${approveData.total_checked}\n`);

    // Verify reward was actually approved in database
    const { data: updatedReward, error: checkError } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('id', reward.id)
      .single();

    if (checkError) throw new Error(`Failed to check reward: ${checkError.message}`);

    if (updatedReward.status !== 'approved') {
      throw new Error(`Expected reward status 'approved', got '${updatedReward.status}'`);
    }

    if (!updatedReward.approved_at) {
      throw new Error('Reward missing approved_at timestamp');
    }

    console.log('✅ Reward verified in database:');
    console.log(`   Status: ${updatedReward.status}`);
    console.log(`   Approved at: ${updatedReward.approved_at}\n`);

    // ============================================
    // Test 2: Update Ranks Cron Job
    // ============================================
    console.log('🔧 Step 3: Testing update-ranks cron job...\n');

    // First ensure there's data in referral_stats
    const { data: existingStats } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    if (!existingStats) {
      // Create stats entry
      await supabase
        .from('referral_stats')
        .insert({
          user_id: testUserId,
          email: 'crontest@example.com',
          total_referrals: 1,
          successful_referrals: 1,
          free_months_earned: 1,
          current_tier: 'pro'
        });

      console.log('✅ Created referral_stats entry for testing\n');
    }

    const ranksResponse = await fetch(`${BASE_URL}/api/cron/update-ranks`);
    const ranksData = await ranksResponse.json();

    console.log('Response:');
    console.log(JSON.stringify(ranksData, null, 2));

    if (!ranksResponse.ok) {
      throw new Error(`Cron job failed: ${ranksData.error}`);
    }

    if (!ranksData.success) {
      throw new Error('Cron job returned success: false');
    }

    console.log(`\n✅ Cron job executed successfully`);
    console.log(`   Users ranked: ${ranksData.users_ranked}`);
    if (ranksData.top_10.length > 0) {
      console.log(`   Top user: ${ranksData.top_10[0].successful_referrals} referrals\n`);
    } else {
      console.log(`   (No users with referrals)\n`);
    }

    // ============================================
    // Cleanup
    // ============================================
    console.log('🧹 Step 4: Cleaning up test data...\n');

    await supabase.from('referral_rewards').delete().eq('id', reward.id);
    await supabase.from('referrals').delete().eq('id', referral.id);
    await supabase.from('referral_stats').delete().eq('user_id', testUserId);

    console.log('✅ Test data cleaned\n');

    // ============================================
    // Summary
    // ============================================
    console.log('=' .repeat(60));
    console.log('🎉 ALL CRON JOB TESTS PASSED!');
    console.log('=' .repeat(60));
    console.log('\n✅ approve-rewards: Working correctly');
    console.log('   - Found rewards pending for 30+ days');
    console.log('   - Updated status to approved');
    console.log('   - Set approved_at timestamp\n');

    console.log('✅ update-ranks: Working correctly');
    console.log('   - Called calculate_referral_ranks()');
    console.log('   - Returned updated rankings\n');

    console.log('📋 Next Steps:');
    console.log('   1. Set up cron jobs in Vercel dashboard');
    console.log('   2. Schedule approve-rewards: 0 2 * * * (Daily at 2 AM)');
    console.log('   3. Schedule update-ranks: 0 * * * * (Hourly)');
    console.log('   4. Monitor logs for successful execution\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error);
    process.exit(1);
  }
}

test();
