import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

/**
 * SetupGuard: Checks if database is initialized
 * Redirects to /setup if not initialized
 * Allows access if already set up
 */
export default function SetupGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  const checkDatabaseSetup = async () => {
    try {
      // Check if user_roles table exists by trying to query it
      const { data, error } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);

      if (error) {
        // Table doesn't exist or database not set up
        setNeedsSetup(true);
        setChecking(false);
        return;
      }

      // Check if we have at least one admin
      const { data: admins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1);

      if (!admins || admins.length === 0) {
        // Database exists but no admin - needs setup
        setNeedsSetup(true);
      }

      setChecking(false);
    } catch (err) {
      // Error means database likely not set up
      setNeedsSetup(true);
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!checking && needsSetup) {
      navigate('/setup', { replace: true });
    }
  }, [checking, needsSetup, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (needsSetup) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

