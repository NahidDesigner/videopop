# Fix: Same Key in All Variables

You mentioned you have the **same key** in:
- `SUPABASE_ANON_KEY`
- `ANON_KEY`
- `SERVICE_SUPABASESERVICE_KEY` (or `SERVICE_ROLE_KEY`)

## ⚠️ Important: This Shouldn't Happen!

**ANON_KEY** and **SERVICE_ROLE_KEY** should be **DIFFERENT**:
- `ANON_KEY` = Public key for frontend (respects RLS)
- `SERVICE_ROLE_KEY` = Secret key for server-side (bypasses RLS)

If they're the same, it's a security issue and might cause problems.

---

## ✅ Step 1: Verify Which Key You're Using

### In Your App (Coolify → Video Pop App → Environment Variables):

Check `VITE_SUPABASE_PUBLISHABLE_KEY`:
- What's the first 50 characters?
- Copy it

### In Supabase (Coolify → Supabase Resource → Environment Variables):

Check `ANON_KEY`:
- What's the first 50 characters?
- Copy it

**Compare them:**
- ✅ If they match = Key is correct, problem is elsewhere
- ❌ If they don't match = This is the problem!

---

## ✅ Step 2: Use the Correct Key

**For your frontend app, you need `ANON_KEY`:**

1. **In Coolify → Supabase Resource → Environment Variables**
2. **Find `ANON_KEY`** (or `SUPABASE_ANON_KEY` if that's what you have)
3. **Copy the ENTIRE value** (200+ characters)

4. **In Coolify → Your Video Pop App → Environment Variables**
5. **Set `VITE_SUPABASE_PUBLISHABLE_KEY`** to the `ANON_KEY` value
6. **Make sure:**
   - No quotes
   - No spaces
   - Full key (all 200+ characters)

---

## ✅ Step 3: If ANON_KEY and SERVICE_ROLE_KEY Are the Same

If `ANON_KEY` and `SERVICE_ROLE_KEY` have the same value, you need to fix this:

### Option 1: Regenerate Keys (Recommended)

For self-hosted Supabase, you may need to regenerate keys:

1. **Check Supabase logs** for key generation
2. **Or regenerate using Supabase CLI:**
   ```bash
   supabase gen keys
   ```

3. **Update environment variables:**
   - Set `ANON_KEY` to the new anon key
   - Set `SERVICE_ROLE_KEY` to the new service role key
   - They should be DIFFERENT!

4. **Restart Supabase** in Coolify

### Option 2: Get Keys from Supabase Studio

1. **Open Supabase Studio** (Coolify → Supabase → Open)
2. **Go to Settings → API**
3. **You'll see:**
   - **anon public key** = This is your `ANON_KEY`
   - **service_role key** = This is your `SERVICE_ROLE_KEY`
   - They should be DIFFERENT!

4. **Update environment variables** in Coolify:
   - `ANON_KEY` = anon public key
   - `SERVICE_ROLE_KEY` = service_role key

---

## ✅ Step 4: Verify the Key Works

After updating, test in browser console:

```javascript
// Check what key your app is using
console.log('App Key (first 50):', window.__SUPABASE_DEBUG__.keyFirst50);

// Test connection
await window.__SUPABASE_DEBUG__.testConnection();
```

**Expected:**
- ✅ REST API Status: 200 (not 401)
- ✅ Auth Health Status: 200 (not 401)

---

## 🔍 Quick Checklist

- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` in your app matches `ANON_KEY` in Supabase
- [ ] `ANON_KEY` and `SERVICE_ROLE_KEY` are DIFFERENT (if they're the same, fix it!)
- [ ] Key is 200+ characters long
- [ ] Key starts with `eyJ...`
- [ ] No quotes or spaces in the key
- [ ] App has been rebuilt after changing the key

---

## 💡 Most Likely Issue

If all three variables have the same value, you probably:
1. Copied the same key to all variables by mistake
2. Or your Supabase instance generated them incorrectly

**Solution:**
- Get the correct `ANON_KEY` from Supabase Studio → Settings → API
- Use that for `VITE_SUPABASE_PUBLISHABLE_KEY` in your app
- Make sure `SERVICE_ROLE_KEY` is different (get it from Supabase Studio too)

---

## 🚨 Security Note

If `ANON_KEY` and `SERVICE_ROLE_KEY` are the same:
- ⚠️ This is a security risk
- ⚠️ Your frontend has admin-level access
- ⚠️ Fix this immediately!

The `SERVICE_ROLE_KEY` should be kept secret and only used server-side.

---

**After fixing the keys and rebuilding, your auth should work!** 🎉

