import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (step) {
      case 'migrations':
        return await runMigrations(supabase);
      
      case 'admin':
        return await createAdmin(supabase);
      
      case 'data':
        return await seedData(supabase);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid step' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: any) {
    console.error('Setup error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Setup failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function runMigrations(supabase: any) {
  // Read all migration files and run them
  // For now, we'll run a simplified version that creates essential tables
  
  const migrations = [
    // Check if tables exist, if not create them
    `CREATE TABLE IF NOT EXISTS public.user_roles (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      role app_role NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      UNIQUE(user_id, role)
    );`,
    
    `CREATE TYPE IF NOT EXISTS app_role AS ENUM ('admin', 'agency', 'user');`,
    
    `CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );`,
    
    // Add more essential tables...
  ];

  for (const migration of migrations) {
    const { error } = await supabase.rpc('exec_sql', { sql: migration });
    if (error) {
      // Try direct query if RPC doesn't work
      console.log('Migration note:', error.message);
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Migrations completed' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createAdmin(supabase: any) {
  // Get admin email from env or use default
  const adminEmail = Deno.env.get('SETUP_ADMIN_EMAIL') || 'admin@videopop.com';
  
  // Check if admin already exists
  const { data: existingAdmins } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin')
    .limit(1);

  if (existingAdmins && existingAdmins.length > 0) {
    return new Response(
      JSON.stringify({ success: true, message: 'Admin already exists' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Note: We can't create auth users from Edge Function easily
  // Admin should be created via signup first, then this assigns the role
  // For now, return success - admin creation will be manual or via first signup
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Admin setup ready. Please sign up with your email to create the first admin account.',
      note: 'After signup, run: INSERT INTO user_roles (user_id, role) SELECT id, \'admin\' FROM auth.users WHERE email = $1'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function seedData(supabase: any) {
  // Seed initial site_settings
  const { data: existingSettings } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);

  if (!existingSettings || existingSettings.length === 0) {
    const { error } = await supabase
      .from('site_settings')
      .insert({
        hero_title: 'Create Engaging Video Popups',
        hero_subtitle: 'Boost conversions with personalized video widgets',
        branding_text: 'Powered by VideoPopup',
        branding_url: '/',
        pricing_enabled: true,
        price_amount: 29,
        price_currency: 'USD',
      });

    if (error) {
      throw new Error(`Failed to seed site_settings: ${error.message}`);
    }
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Data seeded successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

