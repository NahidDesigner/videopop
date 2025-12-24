# Deploy Edge Functions to Self-Hosted Supabase (Coolify)

## Problem

You're seeing this error:
```
InvalidWorkerCreation: worker boot error: failed to read path: No such file or directory (os error 2)
```

This means **Edge Functions are not deployed** to your Supabase instance.

## Solution: Deploy Edge Functions

Edge Functions need to be deployed separately. Here are the methods:

---

## Method 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

On your local machine (or the server where Coolify is running):

```bash
# Windows (PowerShell)
winget install --id=Supabase.CLI

# Or download from: https://github.com/supabase/cli/releases
```

### Step 2: Link to Your Supabase Instance

```bash
# Navigate to your project directory
cd "C:\Users\LENOVO\Documents\Cursor apps\Video pop"

# Link to your self-hosted Supabase
supabase link --project-ref echcjurluxsgcvdeatpm --db-url "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
```

**Replace:**
- `[PASSWORD]` = Your Supabase database password (from Coolify → Supabase → Environment Variables → `POSTGRES_PASSWORD`)
- `[HOST]` = Your Supabase database host (usually the Supabase URL without `https://`)
- `[PORT]` = Database port (usually `5432`)

**Or use the connection string from Coolify:**
1. Go to **Coolify** → **Supabase Resource** → **Environment Variables**
2. Find `DATABASE_URL` or `POSTGRES_CONNECTION_STRING`
3. Copy the full connection string

### Step 3: Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific functions
supabase functions deploy get-widget
supabase functions deploy embed-script
supabase functions deploy track-analytics
supabase functions deploy send-lead-notification
```

**✅ Done!** Your Edge Functions are now deployed.

---

## Method 2: Manual Deployment via Coolify (If CLI doesn't work)

### Step 1: Access Supabase Container

1. Go to **Coolify** → **Supabase Resource**
2. Find the **Edge Functions** service or container
3. Click **"Terminal"** or **"Exec"** to open a shell

### Step 2: Upload Function Files

You need to copy the function files into the Supabase container. The functions should be in:
```
/var/lib/supabase/functions/
```

**For each function** (`get-widget`, `embed-script`, `track-analytics`, `send-lead-notification`):

1. Create the function directory:
   ```bash
   mkdir -p /var/lib/supabase/functions/get-widget
   mkdir -p /var/lib/supabase/functions/embed-script
   mkdir -p /var/lib/supabase/functions/track-analytics
   mkdir -p /var/lib/supabase/functions/send-lead-notification
   ```

2. Copy the `index.ts` file for each function

**Note:** This method is complex. Method 1 (CLI) is much easier.

---

## Method 3: Using Supabase Studio (If Available)

If your self-hosted Supabase has Studio UI:

1. Open **Supabase Studio** (from Coolify → Supabase → "Open")
2. Go to **Edge Functions** section
3. Click **"Deploy Function"** or **"New Function"**
4. For each function:
   - Name: `get-widget` (or `embed-script`, etc.)
   - Copy the contents of `supabase/functions/[function-name]/index.ts`
   - Paste into the editor
   - Click **"Deploy"**

---

## Method 4: Using Docker Exec (Advanced)

If you have direct access to the server:

```bash
# Find the Supabase container
docker ps | grep supabase

# Copy function files into the container
docker cp supabase/functions/get-widget/index.ts [CONTAINER_ID]:/var/lib/supabase/functions/get-widget/index.ts
docker cp supabase/functions/embed-script/index.ts [CONTAINER_ID]:/var/lib/supabase/functions/embed-script/index.ts
docker cp supabase/functions/track-analytics/index.ts [CONTAINER_ID]:/var/lib/supabase/functions/track-analytics/index.ts
docker cp supabase/functions/send-lead-notification/index.ts [CONTAINER_ID]:/var/lib/supabase/functions/send-lead-notification/index.ts

# Restart Supabase
docker restart [CONTAINER_ID]
```

---

## After Deployment: Verify

### Test 1: Check if Functions Are Deployed

Run this in your browser console:

```javascript
fetch('https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980')
  .then(res => res.json())
  .then(data => {
    if (data.error && data.error.includes('No such file')) {
      console.error('❌ Functions still not deployed');
    } else if (data.error) {
      console.log('✅ Function is deployed (but has an error):', data.error);
    } else {
      console.log('✅ Function is deployed and working!', data);
    }
  });
```

### Test 2: Check Function List

If you have Supabase Studio access:
- Go to **Edge Functions** section
- You should see: `get-widget`, `embed-script`, `track-analytics`, `send-lead-notification`

---

## Set Environment Variables (After Deployment)

After deploying, make sure Edge Functions have access to environment variables:

1. Go to **Coolify** → **Supabase Resource** → **Environment Variables**
2. Ensure these are set:
   - `SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - `ANON_KEY` or `SUPABASE_ANON_KEY` = (your anon key)

3. **Restart Supabase** after setting variables:
   - Coolify → Supabase Resource → Actions → Restart

---

## Troubleshooting

### "Command not found: supabase"

Install Supabase CLI first (see Method 1, Step 1).

### "Connection refused" or "Cannot connect"

- Check your database connection string
- Verify Supabase is running in Coolify
- Check firewall/network settings

### "Function deployed but still getting 500 error"

- Check Edge Function logs in Coolify
- Verify environment variables are set
- Check function code for syntax errors

### "Functions deployed but widget still not working"

- Test the `get-widget` endpoint directly (see "After Deployment: Verify")
- Check browser console for specific error messages
- Verify widget is active in database

---

## Quick Reference: Function Files Location

Your function files are in:
```
supabase/functions/
├── get-widget/
│   └── index.ts
├── embed-script/
│   └── index.ts
├── track-analytics/
│   └── index.ts
└── send-lead-notification/
    └── index.ts
```

These need to be deployed to:
```
/var/lib/supabase/functions/[function-name]/index.ts
```

---

## Recommended Approach

**Use Method 1 (Supabase CLI)** - it's the easiest and most reliable way to deploy Edge Functions.

If CLI doesn't work, try Method 3 (Supabase Studio) if available, or Method 4 (Docker) as a last resort.

