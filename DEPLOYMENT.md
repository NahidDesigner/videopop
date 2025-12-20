# 🚀 Complete Deployment Guide for Beginners

Welcome! This guide will walk you through deploying Widget Wizard Pro step-by-step. Don't worry if you're new to this - we'll explain everything in simple terms!

## 📋 What You'll Need Before Starting

Before we begin, make sure you have:

- ✅ **Coolify** installed on your server (this is where your app will run)
- ✅ **Docker** installed (this runs Supabase for you)
- ✅ A **domain name** (like `myapp.com`) - optional but recommended
- ✅ An **email account** for sending emails (Gmail, Outlook, etc.)

**Don't have these?** That's okay! We'll explain how to get them as we go.

---

## 🎯 Overview: What We're Going to Do

Think of this like building a house:

1. **Part 1**: Set up Supabase (the database - where your data lives)
2. **Part 2**: Deploy your app to Coolify (the house where your app lives)
3. **Part 3**: Connect everything together (make them talk to each other)

Let's start!

---

# Part 1: Setting Up Supabase (Your Database)

**What is Supabase?** Think of it as a smart filing cabinet that stores all your app's data (users, widgets, analytics, etc.)

## Step 1: Download Supabase

**What we're doing:** We're getting the Supabase software that will run on your server.

1. Open your server's terminal (command line)
2. Type these commands one by one and press Enter after each:

```bash
git clone --depth 1 https://github.com/supabase/supabase
```

**What this does:** Downloads Supabase from GitHub

```bash
cd supabase/docker
```

**What this does:** Moves you into the Supabase folder

```bash
cp .env.example .env
```

**What this does:** Creates a settings file we'll edit next

**✅ Checkpoint:** You should now be in the `supabase/docker` folder and have a file called `.env`

---

## Step 2: Configure Supabase Settings

**What we're doing:** Telling Supabase how to set itself up (like filling out a form)

1. Open the `.env` file in a text editor (you can use Notepad, VS Code, or any editor)
2. You'll see lots of settings. Here's what you need to fill in:

### 🔑 Generate Secret Keys (IMPORTANT!)

**What are these?** These are like passwords that keep your data safe. You need to create 3 unique keys.

**Easy way to generate keys:**

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```
Run this 3 times to get 3 different keys.

**On Mac/Linux:**
```bash
openssl rand -base64 32
```
Run this 3 times to get 3 different keys.

**Or use an online generator:** Visit https://generate-secret.vercel.app/32 (refresh the page 3 times)

### 📝 Fill in Your .env File

Open `.env` and find these lines. Replace the example values with your real values:

```env
# ============================================
# SECRET KEYS (Generate 3 different keys!)
# ============================================
ANON_KEY=paste-your-first-generated-key-here
SERVICE_ROLE_KEY=paste-your-second-generated-key-here
JWT_SECRET=paste-your-third-generated-key-here

# ============================================
# YOUR WEBSITE ADDRESSES
# ============================================
# Replace these with your actual domain names
SITE_URL=https://your-app-domain.com
API_EXTERNAL_URL=https://your-supabase-domain.com

# ============================================
# DATABASE PASSWORD
# ============================================
# Create a strong password (at least 16 characters)
# Example: MySecurePass123!@#
POSTGRES_PASSWORD=your-strong-password-here

# ============================================
# EMAIL SETTINGS (For sending verification emails)
# ============================================
# If using Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
SMTP_SENDER_NAME=VideoPopup

# If using Outlook:
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587
```

**💡 Important Notes:**

- **For Gmail:** You'll need an "App Password" (not your regular password)
  - Go to: Google Account → Security → 2-Step Verification → App Passwords
  - Create an app password and use that in `SMTP_PASS`

- **For Outlook:** Use your regular email password

- **Domain Names:** If you don't have domains yet, you can use:
  - `http://your-server-ip` (temporary, for testing)
  - Or set up domains later

**✅ Checkpoint:** Your `.env` file should now have all the values filled in (no more "your-xxx-here" placeholders)

---

## Step 3: Start Supabase

**What we're doing:** Starting up Supabase so it's ready to use

1. Make sure you're still in the `supabase/docker` folder
2. Type this command:

```bash
docker compose up -d
```

**What this does:** Starts Supabase in the background (the `-d` means "detached" - it runs in the background)

**⏳ Wait Time:** This might take 2-5 minutes the first time. Be patient!

3. Check if everything started correctly:

```bash
docker compose ps
```

**What to look for:** You should see several services (like `supabase-db`, `supabase-auth`, etc.) and they should all say "Up" or "healthy"

**✅ Checkpoint:** All Supabase services should be running

---

## Step 4: Set Up Your Database Tables

**What we're doing:** Creating the tables (like spreadsheets) where your app will store data

### Option A: Easy Way (Using Supabase Studio - Recommended for Beginners)

1. Open your web browser
2. Go to: `http://your-supabase-domain.com` (or `http://your-server-ip:8000`)
3. You should see Supabase Studio (a web interface)
4. Click on **SQL Editor** in the left menu
5. Open each migration file from your project:
   - Go to: `widget-wizard-pro-main/supabase/migrations/`
   - Open each `.sql` file (start with the one that has the earliest date)
   - Copy ALL the text from the file
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl+Enter)
   - Repeat for each migration file in order (oldest to newest)

**💡 Tip:** The files are named with dates, so run them from oldest to newest:
- `20251220191224_...` (oldest)
- `20251220193717_...`
- `20251220195240_...`
- ... and so on

### Option B: Using Command Line (Advanced)

If you prefer command line:

```bash
# Go back to your project folder
cd /path/to/widget-wizard-pro-main

# Run migrations one by one
psql postgresql://postgres:YOUR_PASSWORD@localhost:54322/postgres -f supabase/migrations/20251220191224_43593955-bace-4b41-917e-936d82a23ee6.sql
```

**✅ Checkpoint:** All migration files have been run successfully

---

## Step 5: Configure Authentication Settings

**What we're doing:** Telling Supabase where users should be redirected after logging in

1. In Supabase Studio, click **Authentication** in the left menu
2. Click **URL Configuration**
3. Fill in:

   **Site URL:**
   ```
   https://your-app-domain.com
   ```
   (Or `http://your-server-ip` if you don't have a domain yet)

   **Redirect URLs:** (Click "Add URL" for each)
   ```
   https://your-app-domain.com
   https://your-app-domain.com/auth
   ```

4. Click **Save**

**✅ Checkpoint:** Authentication URLs are configured

---

## Step 6: Create Your First Admin Account

**What we're doing:** Making yourself the administrator so you can access the dashboard

### Step 6a: Sign Up Through the App

1. Once your app is deployed (we'll do that next), go to your app's website
2. Click "Sign Up" or "Register"
3. Create an account with your email and password
4. Verify your email if required

### Step 6b: Make Yourself Admin

1. Go back to Supabase Studio
2. Click **SQL Editor**
3. Copy and paste this SQL code:

```sql
-- Replace 'your-email@example.com' with the email you just signed up with
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-email@example.com';
```

4. **IMPORTANT:** Replace `'your-email@example.com'` with your actual email address
5. Click **Run**
6. You should see a success message

**✅ Checkpoint:** You now have an admin account!

---

# Part 2: Deploying Your App to Coolify

**What is Coolify?** It's like a smart server that automatically builds and runs your app for you.

## Step 1: Create a New App in Coolify

**What we're doing:** Telling Coolify about your app so it can deploy it

1. Open your Coolify dashboard in a web browser
2. Click **"New Resource"** or **"+"** button
3. Select **"Public Repository"**
4. Fill in:

   **Repository URL:**
   ```
   https://github.com/NahidDesigner/videopop.git
   ```

   **Build Type:** Choose **"Static Site"** (this is the easiest option)

5. Click **"Create"** or **"Next"**

**✅ Checkpoint:** Your app is now added to Coolify

---

## Step 2: Configure Build Settings

**What we're doing:** Telling Coolify how to build your app

In Coolify, find the **"Build"** or **"Settings"** section and set:

**Build Command:**
```
npm install && npm run build
```
*(This installs packages and builds your app)*

**Publish Directory:**
```
dist
```
*(This is where the built files are)*

**Node Version:**
```
18
```
*(Or 20 if you prefer - both work fine)*

**Port:** Leave this as default (Coolify will set it automatically)

**✅ Checkpoint:** Build settings are configured

---

## Step 3: Add Environment Variables

**What we're doing:** Giving your app the information it needs to connect to Supabase

**IMPORTANT:** These variables are like secret passwords. They get "baked into" your app when it builds, so you need to set them BEFORE building.

1. In Coolify, find **"Environment Variables"** or **"Env"** section
2. Click **"Add Variable"** for each of these:

### Required Variables (Add These 3):

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://your-supabase-domain.com`
- *(Replace with your actual Supabase URL)*

**Variable 2:**
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `paste-your-ANON_KEY-here`
- *(This is the ANON_KEY from your Supabase .env file)*

**Variable 3:**
- **Name:** `VITE_SUPABASE_PROJECT_ID`
- **Value:** `your-project-id`
- *(You can find this in Supabase Studio under Settings → General)*

**💡 Where to find these values:**
- `VITE_SUPABASE_URL`: The URL where your Supabase is running
- `VITE_SUPABASE_PUBLISHABLE_KEY`: The `ANON_KEY` from your Supabase `.env` file
- `VITE_SUPABASE_PROJECT_ID`: In Supabase Studio → Settings → General → Reference ID

**✅ Checkpoint:** All 3 environment variables are added

---

## Step 4: Deploy Your App!

**What we're doing:** Actually building and launching your app

1. Double-check that all environment variables are set correctly
2. Click the **"Deploy"** or **"Build"** button
3. Watch the build logs - you'll see it:
   - Installing packages
   - Building your app
   - Deploying files

**⏳ Wait Time:** This usually takes 3-5 minutes

**✅ Checkpoint:** Build completed successfully!

---

## Step 5: Access Your App

**What we're doing:** Opening your app in a browser

1. Once deployment is complete, Coolify will show you a URL
2. Click the URL or copy it to your browser
3. You should see your Widget Wizard Pro homepage!

**✅ Checkpoint:** Your app is live and accessible!

---

# Part 3: Final Setup & Testing

## ✅ Post-Deployment Checklist

Go through this checklist to make sure everything works:

- [ ] **Supabase is running**
  - Check: `docker compose ps` shows all services as "Up"
  
- [ ] **Database tables created**
  - Check: In Supabase Studio → Table Editor, you should see tables like `widgets`, `clients`, `user_roles`
  
- [ ] **Environment variables set**
  - Check: In Coolify, all 3 VITE_ variables are filled in
  
- [ ] **App deployed successfully**
  - Check: Your app URL loads without errors
  
- [ ] **Can log in**
  - Check: Go to `/auth` and try logging in with your admin account
  
- [ ] **Can access dashboard**
  - Check: After logging in, you should see the dashboard at `/dashboard`
  
- [ ] **Can create a widget**
  - Check: Try creating a test widget in the dashboard

---

## 🐛 Common Problems & Solutions

### Problem: "Build Failed" in Coolify

**What it means:** Something went wrong while building your app

**Solutions:**
1. Check the build logs - look for red error messages
2. Make sure all environment variables are set (no empty values)
3. Check Node version is 18 or 20
4. Try clicking "Rebuild" in Coolify

---

### Problem: "Can't connect to Supabase"

**What it means:** Your app can't talk to your database

**Solutions:**
1. Check if Supabase is running: `docker compose ps`
2. Verify `VITE_SUPABASE_URL` is correct in Coolify
3. Make sure `VITE_SUPABASE_PUBLISHABLE_KEY` matches your Supabase ANON_KEY
4. Check if your server's firewall allows connections

---

### Problem: "Login doesn't work"

**What it means:** Authentication isn't working

**Solutions:**
1. Check redirect URLs in Supabase Studio → Authentication → URL Configuration
2. Make sure Site URL matches your app's domain
3. Verify SMTP is configured (for email verification)
4. Check browser console for errors (F12 → Console tab)

---

### Problem: "I can't access the dashboard"

**What it means:** You're not recognized as an admin

**Solutions:**
1. Make sure you completed Step 6 (creating admin user)
2. Verify the SQL ran successfully in Supabase Studio
3. Try logging out and logging back in
4. Check in Supabase Studio → Table Editor → `user_roles` table that your email has `admin` role

---

## 🔒 Security Reminders

**Important things to remember:**

1. ✅ **Never share your `.env` file** - it contains secrets
2. ✅ **Use strong passwords** - especially for database
3. ✅ **Keep your keys secret** - don't post them online
4. ✅ **Use HTTPS** - especially for production (real users)
5. ✅ **Update regularly** - keep Docker and Coolify updated

---

## 🎉 You're Done!

Congratulations! Your Widget Wizard Pro platform should now be running.

### What to do next:

1. **Test everything:**
   - Create a widget
   - Copy the embed code
   - Test it on a website
   - Check analytics

2. **Customize:**
   - Update site settings
   - Add your logo
   - Configure branding

3. **Invite users:**
   - Create client accounts
   - Set up agencies

---

## 📞 Need Help?

If you get stuck:

1. **Check the logs:**
   - Coolify: Dashboard → Your App → Logs
   - Supabase: `docker compose logs`

2. **Common issues:**
   - Most problems are missing environment variables
   - Double-check all URLs and keys are correct
   - Make sure Supabase is running

3. **Get support:**
   - Check Supabase docs: https://supabase.com/docs
   - Check Coolify docs: https://coolify.io/docs

---

**Good luck with your deployment! 🚀**
