# Verify: Which Key to Use

You have these variables in Supabase (all with the same value):
- `SUPABASE_ANON_KEY`
- `ANON_KEY`
- `SERVICE_SUPABASESERVICE_KEY`

## ✅ Which One to Use for Your App?

**Your app needs `VITE_SUPABASE_PUBLISHABLE_KEY`**

This should match **`ANON_KEY`** from your Supabase resource.

---

## 🔍 Step 1: Check What Your App Is Using

In browser console, run:
```javascript
console.log('App Key (first 50):', window.__SUPABASE_DEBUG__.keyFirst50);
```

Copy the first 50 characters.

---

## 🔍 Step 2: Check Supabase Variables

In Coolify → Supabase Resource → Environment Variables:

1. Find `ANON_KEY`
2. Copy the **first 50 characters**

---

## 🔍 Step 3: Compare

**If they match:**
- ✅ Key is correct
- ❌ Problem is elsewhere (GoTrue config, JWT_SECRET mismatch, etc.)

**If they don't match:**
- ❌ **This is the problem!**
- Fix: Update `VITE_SUPABASE_PUBLISHABLE_KEY` in your app to match `ANON_KEY` from Supabase
- Rebuild your app

---

## ✅ Quick Fix

1. **In Coolify → Supabase Resource → Environment Variables**
   - Find `ANON_KEY` (or `SUPABASE_ANON_KEY` if that's what you prefer)
   - Copy the ENTIRE value (200+ characters)

2. **In Coolify → Your Video Pop App → Environment Variables**
   - Find `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Set it to the `ANON_KEY` value
   - Make sure: No quotes, no spaces, full key

3. **Rebuild your app** (Redeploy in Coolify)

4. **Test again**

---

## 💡 About the Three Variables

If all three have the same value:
- That's fine for now
- Use `ANON_KEY` for your frontend app
- `SERVICE_SUPABASESERVICE_KEY` might be for internal Supabase services

The important thing is: **Your app's `VITE_SUPABASE_PUBLISHABLE_KEY` must match `ANON_KEY` from Supabase.**

---

## 🧪 Test After Fixing

```javascript
await window.__SUPABASE_DEBUG__.testConnection();
```

**Expected:**
- ✅ REST API Status: 200 (not 401)
- ✅ Auth Health Status: 200 (not 401)

---

**The key is: Make sure `VITE_SUPABASE_PUBLISHABLE_KEY` in your app matches `ANON_KEY` in Supabase!**

