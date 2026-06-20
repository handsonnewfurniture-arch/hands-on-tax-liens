#!/usr/bin/env node

/**
 * Comprehensive Referral System Test Suite
 * Tests all endpoints, edge cases, and error handling
 */

const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'http://localhost:3000';
const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function header(message) {
  console.log('\n' + '='.repeat(70));
  log(message, 'bright');
  console.log('='.repeat(70));
}

async function test(name, fn, category = 'General') {
  process.stdout.write(`\n🧪 ${name}... `);

  try {
    const result = await fn();

    if (result === 'warning') {
      log('⚠️  WARNING', 'yellow');
      results.warnings++;
      results.tests.push({ name, status: 'warning', category });
    } else {
      log('✅ PASS', 'green');
      results.passed++;
      results.tests.push({ name, status: 'pass', category });
    }

    return true;
  } catch (error) {
    log(`❌ FAIL`, 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.details) {
      log(`   Details: ${error.details}`, 'yellow');
    }
    results.failed++;
    results.tests.push({ name, status: 'fail', category, error: error.message });
    return false;
  }
}

// Clean up test data
async function cleanup() {
  log('\n🧹 Cleaning up test data...', 'cyan');

  try {
    // Delete test referrals
    await supabase.from('referrals').delete().like('referee_email', '%@test.example.com%');
    await supabase.from('referrals').delete().like('referee_email', '%@example.com%');
    await supabase.from('referrals').delete().eq('referrer_user_id', '00000000-0000-0000-0000-000000000001');

    // Delete test rewards
    await supabase.from('referral_rewards').delete().eq('user_id', '00000000-0000-0000-0000-000000000001');

    // Delete test stats
    await supabase.from('referral_stats').delete().eq('user_id', '00000000-0000-0000-0000-000000000001');

    log('   ✅ Test data cleaned', 'green');
  } catch (error) {
    log(`   ⚠️  Cleanup warning: ${error.message}`, 'yellow');
  }
}

async function main() {
  log('\n🚀 COMPREHENSIVE REFERRAL SYSTEM TEST SUITE', 'bright');
  log('Testing all endpoints, edge cases, and error handling\n', 'cyan');

  await cleanup();

  // ============================================
  // DATABASE INTEGRITY TESTS
  // ============================================
  header('📊 DATABASE INTEGRITY TESTS');

  const tables = ['referrals', 'referral_rewards', 'referral_stats', 'referral_discount_codes'];

  for (const table of tables) {
    await test(`Table "${table}" exists and is accessible`, async () => {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) throw new Error(error.message);
      log(`   📋 ${count} rows`, 'cyan');
    }, 'Database');
  }

  // ============================================
  // API ENDPOINT TESTS - HAPPY PATH
  // ============================================
  header('✨ API ENDPOINT TESTS - HAPPY PATH');

  let referralCode = '';
  let referralUrl = '';
  const testUserId = '00000000-0000-0000-0000-000000000001';
  const testRefereeEmail = `referee.${Date.now()}@test.example.com`;

  // Test 1: Generate referral code
  await test('GET /api/referrals - Generate referral code', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals?user_id=${testUserId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.referral_code) throw new Error('No referral code returned');
    if (!data.referral_url) throw new Error('No referral URL returned');
    if (!data.stats) throw new Error('No stats returned');

    referralCode = data.referral_code;
    referralUrl = data.referral_url;

    log(`   📋 Code: ${referralCode}`, 'cyan');
    log(`   🔗 URL: ${referralUrl}`, 'cyan');
  }, 'API - Happy Path');

  // Test 2: Track click event
  await test('POST /api/referrals/track - Track click event', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'click'
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.success) throw new Error('Response not successful');
    if (data.referral.status !== 'clicked') {
      throw new Error(`Expected status 'clicked', got '${data.referral.status}'`);
    }

    log(`   ✅ Status: ${data.referral.status}`, 'cyan');
  }, 'API - Happy Path');

  // Test 3: Track signup event
  await test('POST /api/referrals/track - Track signup event', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'signup',
        referee_email: testRefereeEmail,
        referee_user_id: '00000000-0000-0000-0000-000000000002'
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.success) throw new Error('Response not successful');
    if (data.referral.status !== 'signed_up') {
      throw new Error(`Expected status 'signed_up', got '${data.referral.status}'`);
    }
    if (data.referral.referee_email !== testRefereeEmail) {
      throw new Error('Referee email not saved correctly');
    }

    log(`   📧 Referee: ${data.referral.referee_email}`, 'cyan');
    log(`   ✅ Status: ${data.referral.status}`, 'cyan');
  }, 'API - Happy Path');

  // Test 4: Track conversion event
  let rewardId = '';
  await test('POST /api/referrals/track - Track conversion event', async () => {
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
          stripe_subscription_id: `sub_test_${Date.now()}`
        }
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.success) throw new Error('Response not successful');
    if (data.referral.status !== 'converted') {
      throw new Error(`Expected status 'converted', got '${data.referral.status}'`);
    }
    if (!data.referral.conversion_value) throw new Error('No conversion value recorded');

    log(`   💰 Value: $${data.referral.conversion_value}`, 'cyan');
    log(`   🎁 Reward: $${data.referral.referrer_reward_amount}`, 'cyan');
    log(`   ✅ Status: ${data.referral.status}`, 'cyan');
  }, 'API - Happy Path');

  // Test 5: Verify reward was created
  await test('Verify reward created in database', async () => {
    const { data: rewards, error } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);
    if (!rewards || rewards.length === 0) {
      throw new Error('No reward created after conversion');
    }

    const reward = rewards[0];
    rewardId = reward.id;

    if (reward.status !== 'pending') {
      throw new Error(`Expected reward status 'pending', got '${reward.status}'`);
    }
    if (reward.reward_type !== 'free_month') {
      throw new Error(`Expected reward type 'free_month', got '${reward.reward_type}'`);
    }

    log(`   🎁 Reward ID: ${reward.id}`, 'cyan');
    log(`   💵 Amount: $${reward.reward_amount}`, 'cyan');
    log(`   📊 Status: ${reward.status}`, 'cyan');
  }, 'API - Happy Path');

  // Test 6: Get leaderboard
  await test('GET /api/referrals/leaderboard - Get leaderboard', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/leaderboard?limit=10`);
    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.success) throw new Error('Response not successful');
    if (!Array.isArray(data.leaderboard)) throw new Error('Leaderboard should be an array');

    log(`   📊 Total users: ${data.leaderboard.length}`, 'cyan');
    if (data.leaderboard.length > 0) {
      log(`   🏆 Top: ${data.leaderboard[0].successful_referrals} referrals`, 'cyan');
    }
  }, 'API - Happy Path');

  // Test 7: Get rewards
  await test('GET /api/referrals/rewards - Get user rewards', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/rewards?user_id=${testUserId}`);
    const data = await response.json();

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${data.error}`);
    if (!data.success) throw new Error('Response not successful');
    if (!Array.isArray(data.rewards)) throw new Error('Rewards should be an array');
    if (data.rewards.length === 0) throw new Error('No rewards returned');

    log(`   🎁 Total rewards: ${data.rewards.length}`, 'cyan');
    log(`   💰 Pending value: $${data.totals.pending_value}`, 'cyan');
  }, 'API - Happy Path');

  // Test 8: Verify stats updated
  await test('Verify referral stats updated correctly', async () => {
    const { data: stats, error } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    if (error) throw new Error(error.message);
    if (!stats) throw new Error('No stats found for user');

    if (stats.total_referrals < 1) {
      throw new Error(`Expected at least 1 total referral, got ${stats.total_referrals}`);
    }
    if (stats.successful_referrals < 1) {
      throw new Error(`Expected at least 1 successful referral, got ${stats.successful_referrals}`);
    }

    log(`   📊 Total: ${stats.total_referrals}`, 'cyan');
    log(`   ✅ Successful: ${stats.successful_referrals}`, 'cyan');
    log(`   🎁 Free months earned: ${stats.free_months_earned}`, 'cyan');
  }, 'API - Happy Path');

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  header('❌ ERROR HANDLING TESTS');

  // Test 9: Missing user_id
  await test('GET /api/referrals - Missing user_id', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals`);
    const data = await response.json();

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }
    if (!data.error) throw new Error('Error message not returned');

    log(`   ✅ Correct error: ${data.error}`, 'cyan');
  }, 'Error Handling');

  // Test 10: Invalid referral code
  await test('POST /api/referrals/track - Invalid referral code', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: 'INVALID-9999',
        event_type: 'click'
      })
    });

    const data = await response.json();

    if (response.status !== 404) {
      throw new Error(`Expected 404, got ${response.status}`);
    }
    if (!data.error) throw new Error('Error message not returned');

    log(`   ✅ Correct error: ${data.error}`, 'cyan');
  }, 'Error Handling');

  // Test 11: Duplicate signup
  await test('POST /api/referrals/track - Duplicate signup prevention', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'signup',
        referee_email: testRefereeEmail // Same email as before
      })
    });

    const data = await response.json();

    if (response.status !== 409) {
      throw new Error(`Expected 409 conflict, got ${response.status}`);
    }
    if (!data.error) throw new Error('Error message not returned');

    log(`   ✅ Duplicate prevented: ${data.error}`, 'cyan');
  }, 'Error Handling');

  // Test 12: Missing conversion details
  await test('POST /api/referrals/track - Missing conversion details', async () => {
    const response = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'conversion'
        // Missing conversion_details
      })
    });

    const data = await response.json();

    if (response.status !== 400) {
      throw new Error(`Expected 400, got ${response.status}`);
    }
    if (!data.error) throw new Error('Error message not returned');

    log(`   ✅ Validation working: ${data.error}`, 'cyan');
  }, 'Error Handling');

  // ============================================
  // EDGE CASES
  // ============================================
  header('🔍 EDGE CASE TESTS');

  // Test 13: Multiple referrals from same referrer
  const testRefereeEmail2 = `referee2.${Date.now()}@test.example.com`;

  await test('Multiple referrals from same referrer', async () => {
    // Track signup for second referee
    const signupResponse = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'signup',
        referee_email: testRefereeEmail2
      })
    });

    const signupData = await signupResponse.json();
    if (!signupResponse.ok) throw new Error(`Signup failed: ${signupData.error}`);

    // Track conversion for the second referee
    const conversionResponse = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: referralCode,
        event_type: 'conversion',
        referee_email: testRefereeEmail2, // Specify which referee is converting
        conversion_details: {
          type: 'subscription',
          tier: 'elite',
          value: 199,
          stripe_subscription_id: `sub_test_${Date.now()}`
        }
      })
    });

    const conversionData = await conversionResponse.json();
    if (!conversionResponse.ok) throw new Error(`Conversion failed: ${conversionData.error}`);

    // Wait for trigger to update stats (async operation)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify stats updated
    const { data: stats } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    if (stats.successful_referrals < 2) {
      throw new Error(`Expected at least 2 successful referrals, got ${stats.successful_referrals}`);
    }

    log(`   ✅ Total successful referrals: ${stats.successful_referrals}`, 'cyan');
  }, 'Edge Cases');

  // Test 14: Leaderboard period filters
  await test('GET /api/referrals/leaderboard - Period filters', async () => {
    const periods = ['all_time', 'this_month', 'this_week'];

    for (const period of periods) {
      const response = await fetch(`${BASE_URL}/api/referrals/leaderboard?period=${period}&limit=5`);
      const data = await response.json();

      if (!response.ok) throw new Error(`Period ${period} failed: ${data.error}`);
      if (data.period !== period) {
        throw new Error(`Expected period '${period}', got '${data.period}'`);
      }
    }

    log(`   ✅ All periods working: ${periods.join(', ')}`, 'cyan');
  }, 'Edge Cases');

  // Test 15: Reward filtering
  await test('GET /api/referrals/rewards - Status filtering', async () => {
    const statuses = ['pending', 'approved', 'delivered'];

    for (const status of statuses) {
      const response = await fetch(`${BASE_URL}/api/referrals/rewards?user_id=${testUserId}&status=${status}`);
      const data = await response.json();

      if (!response.ok) throw new Error(`Status filter ${status} failed: ${data.error}`);

      // Verify all returned rewards have the correct status
      const wrongStatus = data.rewards.find(r => r.status !== status);
      if (wrongStatus) {
        throw new Error(`Found reward with status '${wrongStatus.status}' when filtering for '${status}'`);
      }
    }

    log(`   ✅ Status filters working`, 'cyan');
  }, 'Edge Cases');

  // ============================================
  // INTEGRATION TESTS
  // ============================================
  header('🔗 INTEGRATION TESTS');

  // Test 16: Full referral flow (new user)
  await test('Complete referral flow - New user', async () => {
    const newUserId = '00000000-0000-0000-0000-000000000999';
    const newRefereeEmail = `newuser.${Date.now()}@test.example.com`;

    // Step 1: Generate code
    const codeResponse = await fetch(`${BASE_URL}/api/referrals?user_id=${newUserId}`);
    const codeData = await codeResponse.json();
    if (!codeResponse.ok) throw new Error('Failed to generate code');
    const newCode = codeData.referral_code;

    // Step 2: Click
    const clickResponse = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referral_code: newCode, event_type: 'click' })
    });
    if (!clickResponse.ok) throw new Error('Click tracking failed');

    // Step 3: Signup
    const signupResponse = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: newCode,
        event_type: 'signup',
        referee_email: newRefereeEmail
      })
    });
    if (!signupResponse.ok) throw new Error('Signup tracking failed');

    // Step 4: Conversion
    const conversionResponse = await fetch(`${BASE_URL}/api/referrals/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referral_code: newCode,
        event_type: 'conversion',
        conversion_details: {
          type: 'subscription',
          tier: 'starter',
          value: 29,
          stripe_subscription_id: `sub_test_${Date.now()}`
        }
      })
    });
    if (!conversionResponse.ok) throw new Error('Conversion tracking failed');

    // Verify final state
    const { data: finalReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', newCode)
      .eq('referee_email', newRefereeEmail)
      .single();

    if (!finalReferral) throw new Error('Referral not found in database');
    if (finalReferral.status !== 'converted') {
      throw new Error(`Expected final status 'converted', got '${finalReferral.status}'`);
    }

    log(`   ✅ Complete flow: ${newCode} → ${finalReferral.status}`, 'cyan');

    // Cleanup
    await supabase.from('referrals').delete().eq('referrer_user_id', newUserId);
    await supabase.from('referral_stats').delete().eq('user_id', newUserId);
  }, 'Integration');

  // ============================================
  // SUMMARY
  // ============================================
  header('📊 TEST SUMMARY');

  console.log('');
  log(`Total Tests: ${results.passed + results.failed + results.warnings}`, 'bright');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`⚠️  Warnings: ${results.warnings}`, 'yellow');

  // Group by category
  const categories = {};
  results.tests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = { pass: 0, fail: 0, warning: 0 };
    }
    categories[test.category][test.status]++;
  });

  console.log('\n📋 By Category:');
  Object.entries(categories).forEach(([category, counts]) => {
    console.log(`   ${category}: ${counts.pass} pass, ${counts.fail} fail, ${counts.warning} warnings`);
  });

  // List failures
  if (results.failed > 0) {
    console.log('');
    log('❌ FAILED TESTS:', 'red');
    results.tests
      .filter(t => t.status === 'fail')
      .forEach(t => {
        log(`   • ${t.name}`, 'red');
        log(`     ${t.error}`, 'yellow');
      });
  }

  console.log('\n' + '='.repeat(70));

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED! REFERRAL SYSTEM IS PRODUCTION READY!', 'green');
  } else {
    log(`⚠️  ${results.failed} TEST(S) FAILED - REVIEW ERRORS ABOVE`, 'red');
    process.exit(1);
  }

  console.log('='.repeat(70) + '\n');

  // Cleanup
  await cleanup();
}

main().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});
