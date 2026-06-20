# Signup Flow - Referral Integration Guide

## Overview

This guide shows how to integrate referral tracking into your signup flow when you implement authentication.

---

## Step 1: Track Referral Signup

After user creates an account, track the signup event:

```typescript
import { trackReferralSignup } from '@/lib/referrals'

async function handleSignup(email: string, password: string) {
  // 1. Create user account
  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  if (!user) throw new Error('Failed to create user')

  // 2. Track referral signup (if came from referral link)
  await trackReferralSignup(email, user.id)

  // 3. Continue with your signup flow
  // (email verification, onboarding, etc.)
}
```

---

## Step 2: Example Signup Page

Here's a complete example integrating referral tracking:

```typescript
// app/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackReferralSignup } from '@/lib/referrals'
import { setReferralCodeCookie } from '@/lib/referrals'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Capture referral code from URL on mount
  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      // Store in cookie for 30 days
      setReferralCodeCookie(refCode, 30)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // 2. Track referral signup
      await trackReferralSignup(email, data.user.id)

      // 3. Redirect to onboarding or pricing
      router.push('/onboarding')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
```

---

## Step 3: Create Signup API Endpoint

```typescript
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Create Supabase user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
```

---

## How It Works

### Referral Flow:
```
1. User clicks referral link: /ref/TIGER-A7B3
   → Click tracked
   → Cookie set (ref_code=TIGER-A7B3, 30 days)

2. User signs up
   → trackReferralSignup() called
   → Reads cookie, creates referral record
   → Status: "signed_up"

3. User subscribes
   → trackReferralConversion() called (in webhook)
   → Status: "converted"
   → Reward created (status: "pending")

4. After 30 days
   → Cron job auto-approves reward
   → Status: "approved"

5. Admin delivers reward
   → Stripe subscription extended by 1 month
   → Status: "delivered"
```

---

## Testing

Test the signup flow with a referral:

```bash
# 1. Get referral code
curl http://localhost:3000/api/referrals?user_id=test-user-123

# 2. Visit referral landing page (click tracked)
open http://localhost:3000/ref/TIGER-A7B3

# 3. Sign up with tracking
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Cookie: ref_code=TIGER-A7B3" \
  -d '{"email":"newuser@example.com","password":"password123"}'

# 4. Verify signup was tracked
curl http://localhost:3000/api/referrals?user_id=test-user-123
# Should show 1 signup
```

---

## Important Notes

1. **Cookie Handling**: The referral code is stored in a cookie for 30 days. Make sure your app doesn't clear cookies during signup.

2. **Error Handling**: `trackReferralSignup()` won't throw errors - it logs them and returns null. Your signup will still succeed even if referral tracking fails.

3. **No Referral Code**: If there's no referral cookie, `trackReferralSignup()` does nothing. Normal signups work fine.

4. **Privacy**: Only store the referral code, not any user data, in the cookie.

5. **Multiple Referrals**: The same referral code can be used by unlimited users.

---

## Next Steps

Once signup integration is complete:
1. Test the full flow (click → signup → subscription → reward)
2. Set up cron jobs for reward approval
3. Monitor referral analytics in database

See `REFERRAL_API_DOCS.md` for complete API documentation.
