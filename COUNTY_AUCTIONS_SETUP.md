# County Auctions 2026 Calendar - Setup Guide

This guide walks you through adding 150+ county auction schedules to your site.

## Overview

Your dataset includes:
- 🏛️ **150+ counties** across 20 states
- 📅 **2026 auction dates** (confirmed and estimated)
- 🔗 **Registration platforms** (GovEase, Bid4Assets, Zeus Auction, LienHub, etc.)
- 📋 **Sale types** (Tax lien certificates, Tax deeds, etc.)

## Step 1: Apply Database Migration

1. Go to Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new
   ```

2. Copy the SQL from:
   ```
   supabase/migrations/20260618_county_auctions_calendar.sql
   ```

3. Paste and click **Run**

4. Verify the table was created:
   ```sql
   SELECT * FROM county_auctions_2026 LIMIT 1;
   ```

## Step 2: Prepare Your Full CSV Data

Save your complete 150+ county CSV data to:
```
data/county-auctions-2026-full.csv
```

**Format:**
```csv
County,State,Sale Type,Platform,Auction Registration URL,2026 Sale Date / Window,Format,Notes,Source URL,Auction Date
St. Johns,FL,Tax lien certificate,Zeus Auction,https://www.zeusauction.com,"May 29, 2026",Online,4535 properties listed,https://sjctax.us/,2026-05-29
```

## Step 3: Import County Data

Run the import script:
```bash
cd /Users/tigermcbride/Desktop/Projects/wealthflow-ai
node scripts/import-county-auctions.js
```

The script will:
- ✅ Load your CSV file
- ✅ Parse all 150+ counties
- ✅ Import to `county_auctions_2026` table
- ✅ Show summary by state
- ✅ List upcoming auctions

## Step 4: Verify Import

Check the data in Supabase:
```sql
-- Total counties
SELECT COUNT(*) FROM county_auctions_2026;

-- Counties by state
SELECT state, COUNT(*) as count
FROM county_auctions_2026
GROUP BY state
ORDER BY state;

-- Upcoming auctions
SELECT county, state, auction_date, platform
FROM county_auctions_2026
WHERE auction_date IS NOT NULL
ORDER BY auction_date
LIMIT 10;
```

## Step 5: Test the API

Once imported, test the API:

```bash
# All counties
curl http://localhost:3000/api/counties/auctions

# Filter by state
curl http://localhost:3000/api/counties/auctions?state=FL

# Search
curl http://localhost:3000/api/counties/auctions?search=johns
```

## Step 6: Update Counties Page

The `/counties` page will automatically fetch from the new database table via:
```
/api/counties/auctions
```

## Step 7: Deploy

Once everything works locally:

```bash
# Commit changes
git add .
git commit -m "Add 150+ county auction schedules for 2026"
git push origin main

# Deploy to Vercel
vercel --prod
```

## Data Structure

### Fields in `county_auctions_2026` table:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `county` | TEXT | County name |
| `state` | TEXT | State abbreviation (FL, AL, etc.) |
| `sale_type` | TEXT | "Tax lien certificate", "Tax deed", etc. |
| `platform` | TEXT | "GovEase", "Bid4Assets", etc. |
| `registration_url` | TEXT | Where to register |
| `auction_date` | DATE | Confirmed date (if available) |
| `sale_date_window` | TEXT | Description of sale window |
| `format` | TEXT | "Online", "In-person", "Mixed" |
| `notes` | TEXT | Additional info |
| `source_url` | TEXT | County tax collector site |

## API Endpoints

### GET `/api/counties/auctions`

**Query Parameters:**
- `state` - Filter by state (e.g., `FL`, `AL`)
- `platform` - Filter by platform (e.g., `GovEase`)
- `search` - Search county, state, or platform

**Response:**
```json
{
  "counties": [...],
  "total": 150,
  "states": ["AL", "AZ", "CA", ...],
  "success": true
}
```

## Maintenance

### Adding New Counties

1. Add row to CSV:
   ```csv
   NewCounty,XX,Tax lien certificate,Platform,URL,Date Window,Format,Notes,Source,2026-XX-XX
   ```

2. Re-run import:
   ```bash
   node scripts/import-county-auctions.js
   ```

### Updating Auction Dates

Update directly in Supabase:
```sql
UPDATE county_auctions_2026
SET auction_date = '2026-06-15'
WHERE county = 'Example' AND state = 'FL';
```

## Troubleshooting

### "Table does not exist"
- Run Step 1 (Apply Migration) first

### "CSV file not found"
- Ensure your full CSV is saved to `data/county-auctions-2026-full.csv`

### "Duplicate key error"
- County already exists. The script uses `upsert` to update existing records.

## Next Steps

1. ✅ Apply migration in Supabase
2. ✅ Save your full 150+ county CSV
3. ✅ Run import script
4. ✅ Test API locally
5. ✅ Deploy to Vercel
6. 🎉 Share with friends!

---

**Questions?** Check the scripts in `/scripts/` or API routes in `/app/api/counties/`
