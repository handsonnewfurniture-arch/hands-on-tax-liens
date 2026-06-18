/**
 * Apply county_auctions_2026 table migration
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Applying county_auctions_2026 migration...\n')

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260618_county_auctions_calendar.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('📄 Migration SQL:')
  console.log('─'.repeat(80))
  console.log(sql)
  console.log('─'.repeat(80))
  console.log('\n⚠️  Note: Supabase JS client cannot execute raw SQL directly.')
  console.log('\n📋 To apply this migration:')
  console.log('1. Go to: https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new')
  console.log('2. Copy the SQL above')
  console.log('3. Paste and run it')
  console.log('\n✅ Once complete, run: node scripts/import-county-auctions.js')
}

main()
