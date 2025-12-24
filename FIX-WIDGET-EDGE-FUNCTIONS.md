# Fix Widget Not Working - Edge Functions Issue

## Problem
- Widget is active ✅
- Widget doesn't work on live website (same tab or incognito)
- Analytics URL works in same browser but not incognito

## Root Cause

The Edge Functions (`get-widget`, `embed-script`, `track-analytics`) are **missing the `SUPABASE_SERVICE_ROLE_KEY` environment variable** in Coolify.

Without this key, the Edge Functions cannot access the database to fetch widget data, causing the widget to fail silently or show "Widget not found".

## Fix Steps

### Step 1: Get Your Service Role Key

1. Go to **Coolify** → **Supabase Resource** → **Environment Variables**
2. Find the `SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_ROLE_KEY` variable
3. Copy the entire value (it's a long JWT token starting with `eyJ...`)

**Note:** This is different from `ANON_KEY`. The service role key has full database access and bypasses RLS.

### Step 2: Set Environment Variables for Edge Functions

Edge Functions need these environment variables. In Coolify, there are two ways:

#### Option A: If Edge Functions Are Part of Supabase Resource

The Edge Functions should automatically inherit environment variables from the Supabase resource. Verify:

1. Go to **Coolify** → **Supabase Resource** → **Environment Variables**
2. Make sure these exist:
   - `SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - `ANON_KEY` = (your anon key - needed for embed-script)

3. **Restart the Supabase resource** after verifying:
   - Go to Supabase Resource → Actions → Restart
   - Wait 2-3 minutes for services to restart

#### Option B: If Edge Functions Are Separate Resources

If you have separate resources for each Edge Function:

1. For each Edge Function resource (`get-widget`, `embed-script`, `track-analytics`):
   - Go to **Environment Variables**
   - Add:
     - `SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com`
     - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - **Restart the function**

### Step 3: Verify Environment Variables Are Set

Run this SQL in Supabase SQL Editor to check if Edge Functions can access the database:

```sql
-- This will only work if Edge Functions have the service role key
SELECT id, name, status 
FROM widgets 
WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980';
```

If this query works (returns the widget), the database is accessible. The issue is specifically with Edge Functions not having the key.

### Step 4: Test the get-widget Endpoint Directly

Open your browser console (on the live website or test page) and run:

```javascript
fetch('https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980')
  .then(res => res.json())
  .then(data => {
    console.log('Result:', data);
    if (data.error) {
      console.error('❌ Error:', data.error);
      if (data.error.includes('Database error') || data.error.includes('Internal server error')) {
        console.error('🔧 This means Edge Functions are missing SUPABASE_SERVICE_ROLE_KEY!');
      }
    } else {
      console.log('✅ Widget found:', data);
    }
  })
  .catch(err => console.error('❌ Fetch error:', err));
```

**Expected results:**
- ✅ **Success:** Returns widget JSON → Edge Functions are working correctly
- ❌ **"Widget not found or inactive":** Widget status issue (but Edge Functions are working)
- ❌ **"Database error" or "Internal server error":** Edge Functions missing `SUPABASE_SERVICE_ROLE_KEY`
- ❌ **CORS error:** CORS configuration issue (but less likely with Edge Functions)

### Step 5: Check Edge Function Logs

1. Go to **Coolify** → **Supabase Resource** → **Logs** or **Edge Functions** → **Logs**
2. Look for errors like:
   - `SUPABASE_SERVICE_ROLE_KEY is not set`
   - `Database error`
   - `Cannot read property of undefined`

If you see these errors, it confirms the environment variable is missing.

## Quick Diagnostic Test Page

I've created `test-widget-embed.html` for you. 

1. Download it or copy its contents
2. Open it in your browser (you can host it on your website or open locally)
3. It will automatically test:
   - get-widget endpoint
   - embed-script endpoint
   - Full widget loading
4. Check the console for detailed error messages

## Why Analytics Works in Same Browser But Not Incognito

The analytics URL you're accessing is likely the **Public Analytics** page which requires:
- Authentication (session cookie) → Works in same browser because you're logged in
- Not authenticated → Fails in incognito because no session

This is separate from the widget embed issue. The widget should work in both, but if Edge Functions don't have the service role key, it won't work in either.

## Most Likely Fix

**99% chance this is the issue:** Edge Functions missing `SUPABASE_SERVICE_ROLE_KEY`.

**Solution:**
1. Add `SUPABASE_SERVICE_ROLE_KEY` to Supabase Resource environment variables (if Edge Functions inherit from there)
2. OR add it to each Edge Function resource's environment variables
3. Restart the services
4. Test again

## After Fixing

Once you've set the environment variable and restarted:

1. ✅ `get-widget` endpoint should return widget data
2. ✅ Widget should appear on any website with the embed script
3. ✅ Widget should work in incognito mode
4. ✅ Analytics tracking should work

## Still Not Working?

If it still doesn't work after setting the environment variable:

1. **Check the exact variable name:** Some setups use `SERVICE_ROLE_KEY`, others use `SUPABASE_SERVICE_ROLE_KEY`. Check what your Edge Functions are looking for (see `get-widget/index.ts` line 30).

2. **Verify the key value:** Make sure you copied the entire key (200+ characters, starts with `eyJ`).

3. **Check for trailing slashes:** Make sure `SUPABASE_URL` doesn't have a trailing slash, or if it does, the code handles it correctly.

4. **Check Edge Function deployment:** Make sure the Edge Functions are actually deployed and running in Coolify.

