#!/usr/bin/env node

/**
 * Test Referral API Endpoints
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const TEST_REFEREE_EMAIL = 'test.referee@example.com';

async function test(name, fn) {
  process.stdout.write(`\n🧪 ${name}... `);
  try {
    await fn();
    console.log('✅');
    return true;
  } catch (error) {
    console.log(`❌\n   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Referral API Endpoints\n');
  console.log('=' .repeat(50));

  let referralCode = '';
  let results = { passed: 0, failed: 0 };

  // Test 1: Get/Create referral code
  const test1 = await test('GET /api/referrals - Get referral code', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals?user_id=${TEST_USER_ID}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    if (!data.referral_code) {
      throw new Error('No referral code returned');
    }

    referralCode = data.referral_code;
    console.log(`\n   📋 Referral Code: ${referralCode}`);
    console.log(`   🔗 Referral URL: ${data.referral_url}`);
  });
  results[test1 ? 'passed' : 'failed']++;

  // Test 2: Track click event
  const test2 = await test('POST /api/referrals/track - Track click', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'click'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    if (data.referral.status !== 'clicked') {
      throw new Error(`Expected status 'clicked', got '${data.referral.status}'`);
    }

    console.log(`\n   ✅ Click tracked - Status: ${data.referral.status}`);
  });
  results[test2 ? 'passed' : 'failed']++;

  // Test 3: Track signup event
  const test3 = await test('POST /api/referrals/track - Track signup', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'signup',
        referee_email: TEST_REFEREE_EMAIL,
        referee_user_id: '00000000-0000-0000-0000-000000000002'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    if (data.referral.status !== 'signed_up') {
      throw new Error(`Expected status 'signed_up', got '${data.referral.status}'`);
    }

    console.log(`\n   ✅ Signup tracked - Status: ${data.referral.status}`);
    console.log(`   📧 Referee: ${data.referral.referee_email}`);
  });
  results[test3 ? 'passed' : 'failed']++;

  // Test 4: Track conversion event
  const test4 = await test('POST /api/referrals/track - Track conversion', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'conversion',
        conversion_details: {
          type: 'subscription',
          tier: 'pro',
          value: 79,
          stripe_subscription_id: 'sub_test_' + Date.now()
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    if (data.referral.status !== 'converted') {
      throw new Error(`Expected status 'converted', got '${data.referral.status}'`);
    }

    console.log(`\n   ✅ Conversion tracked - Status: ${data.referral.status}`);
    console.log(`   💰 Value: $${data.referral.conversion_value}`);
    console.log(`   🎁 Reward: $${data.referral.referrer_reward_amount} free month`);
  });
  results[test4 ? 'passed' : 'failed']++;

  // Test 5: Get leaderboard
  const test5 = await test('GET /api/referrals/leaderboard - Get leaderboard', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/leaderboard?limit=10`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    if (!Array.isArray(data.leaderboard)) {
      throw new Error('Leaderboard should be an array');
    }

    console.log(`\n   📊 Leaderboard: ${data.leaderboard.length} users`);
    if (data.leaderboard.length > 0) {
      console.log(`   🏆 Top referrer: ${data.leaderboard[0].email} (${data.leaderboard[0].successful_referrals} referrals)`);
    }
  });
  results[test5 ? 'passed' : 'failed']++;

  // Test 6: Get user stats after conversion
  const test6 = await test('GET /api/referrals - Verify stats updated', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals?user_id=${TEST_USER_ID}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`);
    }

    console.log(`\n   📈 Stats updated:`);
    console.log(`      Total referrals: ${data.stats?.total_referrals || 0}`);
    console.log(`      Successful: ${data.stats?.successful_referrals || 0}`);
    console.log(`      Free months earned: ${data.stats?.free_months_earned || 0}`);
    console.log(`      Pending: ${data.stats?.free_months_pending || 0}`);
  });
  results[test6 ? 'passed' : 'failed']++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results: ${results.passed} passed, ${results.failed} failed`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Referral system is working correctly.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
    process.exit(1);
  }
}

main();
