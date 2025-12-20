# 🚀 Quick Coolify Deployment Guide (Beginner-Friendly)

This is a simplified guide for deploying to Coolify. For complete instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📝 What You Need First

Before starting, make sure:
- ✅ Supabase is set up and running (see DEPLOYMENT.md Part 1)
- ✅ You have your Supabase URL and keys ready

---

## Step-by-Step: Deploy to Coolify

### Step 1: Open Coolify Dashboard

1. Open your web browser
2. Go to your Coolify dashboard (usually `http://your-server-ip` or your Coolify domain)
3. Log in if needed

---

### Step 2: Create New App

1. Click the **"New Resource"** or **"+"** button (usually in the top right)
2. Select **"Public Repository"**
3. In the **"Repository URL"** field, paste:
   ```
   https://github.com/NahidDesigner/videopop.git
   ```
4. Select **"Static Site"** as the build type
5. Click **"Create"** or **"Next"**

**✅ You should now see your app in the Coolify dashboard**

---

### Step 3: Set Build Settings

Look for a section called **"Build"**, **"Settings"**, or **"Configuration"** and fill in:

| Setting | Value | What It Means |
|---------|-------|---------------|
| **Build Command** | `npm install && npm run build` | How to build your app |
| **Publish Directory** | `dist` | Where the built files are |
| **Node Version** | `18` | Which Node.js version to use |

**💡 Tip:** If you don't see these fields, Coolify might auto-detect them. That's okay!

---

### Step 4: Add Environment Variables (IMPORTANT!)

**⚠️ This is the most important step!** Your app won't work without these.

1. Find the **"Environment Variables"** or **"Env"** section
2. Click **"Add Variable"** or **"+"** button
3. Add these 3 variables one by one:

#### Variable 1: Supabase URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://your-supabase-domain.com`
- **Example:** `https://supabase.myserver.com` or `http://192.168.1.100:8000`

#### Variable 2: Supabase Public Key
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** Your ANON_KEY from Supabase
- **Where to find:** In your Supabase `.env` file, look for `ANON_KEY=...`

#### Variable 3: Project ID
- **Name:** `VITE_SUPABASE_PROJECT_ID`
- **Value:** Your Supabase project ID
- **Where to find:** 
  - In Supabase Studio → Settings → General
  - Look for "Reference ID" or "Project ID"

**💡 Visual Guide:**
```
Environment Variables:
┌─────────────────────────────────────┬──────────────────────────────┐
│ Name                               │ Value                        │
├─────────────────────────────────────┼──────────────────────────────┤
│ VITE_SUPABASE_URL                  │ https://supabase.example.com │
│ VITE_SUPABASE_PUBLISHABLE_KEY      │ eyJhbGciOiJIUzI1NiIsInR5c... │
│ VITE_SUPABASE_PROJECT_ID           │ abcdefghijklmnop             │
└─────────────────────────────────────┴──────────────────────────────┘
```

**✅ Double-check:** All 3 variables should be filled in (no empty values!)

---

### Step 5: Deploy!

1. Scroll down and find the **"Deploy"** or **"Build & Deploy"** button
2. Click it!
3. Watch the build process - you'll see:
   - 📦 Installing packages...
   - 🔨 Building app...
   - 🚀 Deploying...

**⏳ This takes 3-5 minutes. Be patient!**

---

### Step 6: Access Your App

Once deployment is complete:

1. Coolify will show you a URL (like `https://your-app.coolify.io` or your custom domain)
2. Click the URL or copy it to your browser
3. **🎉 Your app should be live!**

---

## ✅ Quick Checklist

Before deploying, make sure:

- [ ] Supabase is running (`docker compose ps` shows all services up)
- [ ] You have your Supabase URL
- [ ] You have your ANON_KEY (from Supabase .env file)
- [ ] You have your Project ID (from Supabase Studio)
- [ ] All 3 environment variables are set in Coolify
- [ ] Build settings are configured

---

## 🐛 Quick Troubleshooting

### "Build Failed"
- Check all environment variables are filled in
- Look at build logs for error messages
- Try clicking "Rebuild"

### "App loads but shows errors"
- Check environment variables are correct
- Make sure Supabase is running
- Check browser console (F12) for errors

### "Can't log in"
- Make sure you created an admin user (see DEPLOYMENT.md Step 6)
- Check redirect URLs in Supabase Studio
- Verify SMTP is configured

---

## 📚 Need More Help?

- **Full guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions
- **Supabase issues:** Check Supabase logs with `docker compose logs`
- **Coolify issues:** Check Coolify logs in the dashboard

---

**That's it! You should now have your app running on Coolify! 🎉**
