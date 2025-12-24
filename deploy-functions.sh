#!/bin/bash
# Quick script to deploy Edge Functions to self-hosted Supabase
# Usage: ./deploy-functions.sh

echo "🚀 Deploying Edge Functions to Supabase..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Install it from: https://github.com/supabase/cli/releases"
    exit 1
fi

# Check if linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Not linked to Supabase yet."
    echo "Run: supabase link --project-ref [PROJECT_REF] --db-url [DATABASE_URL]"
    exit 1
fi

# Deploy all functions
echo "📦 Deploying get-widget..."
supabase functions deploy get-widget

echo "📦 Deploying embed-script..."
supabase functions deploy embed-script

echo "📦 Deploying track-analytics..."
supabase functions deploy track-analytics

echo "📦 Deploying send-lead-notification..."
supabase functions deploy send-lead-notification

echo "✅ All functions deployed!"
echo "🧪 Test with: https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980"

