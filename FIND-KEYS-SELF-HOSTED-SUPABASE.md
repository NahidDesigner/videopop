# Find Keys in Self-Hosted Supabase (No Studio UI)

Since Supabase Studio doesn't show the API keys in self-hosted Supabase, here's how to find them:

---

## ✅ Method 1: Check All Environment Variables in Coolify

### Step 1: Check Supabase Resource Environment Variables

1. **In Coolify → Supabase Resource → Environment Variables**
2. **Look for ALL variables** that might contain keys:
   - `ANON_KEY`
   - `SUPABASE_ANON_KEY`
   - `PUBLIC_ANON_KEY`
   - `GOTRUE_JWT_SECRET` (used to generate keys)
   - `JWT_SECRET` (alternative name)
   - `JWT_ANON_KEY` (sometimes used)
   - Any variable with "KEY", "ANON", or "JWT" in the name

3. **For each key variable:**
   - Copy the first 50 characters
   - Compare with your app key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd`

### Step 2: Check Your App's Environment Variables

1. **In Coolify → Your Video Pop App → Environment Variables**
2. **Find `VITE_SUPABASE_PUBLISHABLE_KEY`**
3. **This is what your app is currently using**
4. **Copy the first 50 characters** and compare

---

## ✅ Method 2: Check Supabase Logs

1. **In Coolify → Supabase Resource → Logs**
2. **Look for startup logs** (when Supabase first started)
3. **Sometimes keys are printed in logs** during initialization
4. **Search for:**
   - "anon"
   - "key"
   - "JWT"
   - "eyJ" (JWT token prefix)

**⚠️ Be careful:** Don't share logs publicly if they contain keys!

---

## ✅ Method 3: Generate Key from JWT_SECRET

If you have `JWT_SECRET` or `GOTRUE_JWT_SECRET`, you can verify if the key is generated from it:

1. **Get `JWT_SECRET` from Supabase environment variables**
2. **The ANON_KEY is typically generated as:**
   ```
   JWT with:
   - Header: {"alg":"HS256","typ":"JWT"}
   - Payload: {"iss":"supabase","ref":"your-project-ref","role":"anon"}
   - Signed with: JWT_SECRET
   ```

3. **You can use online JWT tools** (like jwt.io) to verify:
   - If you decode your app's key, check the payload
   - It should have `"role":"anon"` and `"iss":"supabase"`

---

## ✅ Method 4: Check Docker Container Environment

If you have terminal/SSH access:

1. **Find Supabase container:**
   ```bash
   docker ps | grep supabase
   ```

2. **Check environment variables:**
   ```bash
   docker exec <container-name> env | grep -i key
   docker exec <container-name> env | grep -i anon
   docker exec <container-name> env | grep -i jwt
   ```

---

## ✅ Method 5: Test Each Key Directly

Since you have these variables with the same value:
- `SUPABASE_ANON_KEY`
- `ANON_KEY`
- `SERVICE_SUPABASESERVICE_KEY`

**Try using one of them in your app:**

1. **In Coolify → Your Video Pop App → Environment Variables**
2. **Set `VITE_SUPABASE_PUBLISHABLE_KEY`** to the value of `ANON_KEY` from Supabase
3. **Rebuild your app**
4. **Test if it works**

**If it still doesn't work:**
- The key might be wrong/invalid
- Or GoTrue configuration is missing (see FIX-COOLIFY-SELF-HOSTED-SUPABASE.md)

---

## 🔍 Method 6: Decode Your App's Key

Your app key starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd`

**Decode it to see what it contains:**

1. **Go to https://jwt.io**
2. **Paste your full app key** (get it from browser console: `window.__SUPABASE_DEBUG__.key`)
3. **Decode it** - you'll see:
   - **Header:** Algorithm and type
   - **Payload:** Should contain `"role":"anon"` and `"iss":"supabase"`
   - **Signature:** (can't decode without secret)

4. **Check the payload:**
   - `"iss"` (issuer) should be `"supabase"`
   - `"role"` should be `"anon"`
   - `"ref"` might be your project reference

**If the decoded payload doesn't match:**
- The key is from a different Supabase instance
- Or it's not a valid Supabase key

---

## ✅ Method 7: Check Where Your App Key Came From

Since your app key doesn't match Supabase keys, find where it came from:

1. **Check your app's environment variables history** in Coolify
2. **Check if you copied it from:**
   - A different Supabase project
   - Documentation/example
   - Old configuration

3. **The key might be:**
   - From a different Supabase instance
   - A placeholder/example key
   - From a different environment (dev vs prod)

---

## 🎯 Recommended Solution

Since you have `ANON_KEY` in Supabase environment variables:

1. **Copy the `ANON_KEY` value** from Coolify → Supabase Resource → Environment Variables
2. **Update your app:**
   - Coolify → Your Video Pop App → Environment Variables
   - Set `VITE_SUPABASE_PUBLISHABLE_KEY` = `ANON_KEY` value
3. **Rebuild your app**
4. **Test again**

**If it still doesn't work after matching keys:**
- The issue is GoTrue configuration (not the key)
- See FIX-COOLIFY-SELF-HOSTED-SUPABASE.md for GoTrue setup

---

## 💡 Quick Test

After updating the key, test in browser console:

```javascript
// Get full key
const fullKey = window.__SUPABASE_DEBUG__.key;
console.log('Full Key:', fullKey);

// Decode it (copy to jwt.io)
console.log('Decode at: https://jwt.io');

// Test connection
await window.__SUPABASE_DEBUG__.testConnection();
```

**Expected after fix:**
- ✅ REST API Status: 200
- ✅ Auth Health Status: 200
- ✅ Keys match between app and Supabase

---

**For self-hosted Supabase, keys are in environment variables - check Coolify, not Studio UI!**

