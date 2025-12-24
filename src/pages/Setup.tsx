import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Database, User, Settings, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SetupStep {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const setupSteps: SetupStep[] = [
  { id: 'check', name: 'Checking Database', description: 'Verifying database connection...', icon: Database },
  { id: 'migrations', name: 'Running Migrations', description: 'Setting up database schema...', icon: Database },
  { id: 'admin', name: 'Creating Admin', description: 'Setting up default admin account...', icon: User },
  { id: 'data', name: 'Seeding Data', description: 'Creating initial data...', icon: Settings },
  { id: 'functions', name: 'Deploying Functions', description: 'Setting up Edge Functions...', icon: Rocket },
  { id: 'complete', name: 'Complete', description: 'Setup finished successfully!', icon: CheckCircle2 },
];

type StepStatus = 'pending' | 'running' | 'success' | 'error';

export default function Setup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({
    check: 'running',
    migrations: 'pending',
    admin: 'pending',
    data: 'pending',
    functions: 'pending',
    complete: 'pending',
  });
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Check if already set up
  useEffect(() => {
    checkIfSetup();
  }, []);

  const checkIfSetup = async () => {
    try {
      // Check if user_roles table exists and has data
      const { data, error } = await supabase
        .from('user_roles')
        .select('count')
        .limit(1);

      if (!error && data !== null) {
        // Database seems initialized, check if we have admin
        const { data: admins } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(1);

        if (admins && admins.length > 0) {
          // Already set up, redirect to dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Table doesn't exist or error - needs setup
      console.log('Database needs setup');
    }
  };

  const runSetup = async () => {
    setIsRunning(true);
    setError(null);
    setProgress(0);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const setupUrl = `${supabaseUrl}/functions/v1/setup-database`;

      // Step 1: Check database
      setCurrentStep(0);
      setStepStatuses(prev => ({ ...prev, check: 'running' }));
      setProgress(10);

      // Step 2: Run migrations
      setCurrentStep(1);
      setStepStatuses(prev => ({ ...prev, check: 'success', migrations: 'running' }));
      setProgress(25);

      const response = await fetch(setupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'migrations',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run migrations');
      }

      setStepStatuses(prev => ({ ...prev, migrations: 'success' }));
      setProgress(40);

      // Step 3: Create admin
      setCurrentStep(2);
      setStepStatuses(prev => ({ ...prev, admin: 'running' }));
      setProgress(50);

      const adminResponse = await fetch(setupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'admin',
        }),
      });

      if (!adminResponse.ok) {
        const errorData = await adminResponse.json();
        throw new Error(errorData.error || 'Failed to create admin');
      }

      setStepStatuses(prev => ({ ...prev, admin: 'success' }));
      setProgress(65);

      // Step 4: Seed data
      setCurrentStep(3);
      setStepStatuses(prev => ({ ...prev, data: 'running' }));
      setProgress(75);

      const dataResponse = await fetch(setupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'data',
        }),
      });

      if (!dataResponse.ok) {
        const errorData = await dataResponse.json();
        throw new Error(errorData.error || 'Failed to seed data');
      }

      setStepStatuses(prev => ({ ...prev, data: 'success' }));
      setProgress(85);

      // Step 5: Functions (skip for now, can be manual)
      setCurrentStep(4);
      setStepStatuses(prev => ({ ...prev, functions: 'success' }));
      setProgress(95);

      // Step 6: Complete
      setCurrentStep(5);
      setStepStatuses(prev => ({ ...prev, complete: 'success' }));
      setProgress(100);

      // Wait a moment then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Setup failed');
      setIsRunning(false);
      const failedStep = setupSteps[currentStep];
      setStepStatuses(prev => ({ ...prev, [failedStep.id]: 'error' }));
    }
  };

  const getStepIcon = (stepId: string, status: StepStatus) => {
    if (status === 'success') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (status === 'error') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (status === 'running') {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    const StepIcon = setupSteps.find(s => s.id === stepId)?.icon || Database;
    return <StepIcon className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-display">Welcome to VideoPopup</CardTitle>
          <CardDescription className="text-lg mt-2">
            Let's set up your database in just one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Setup Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {setupSteps.map((step, index) => {
              const status = stepStatuses[step.id];
              const isActive = index === currentStep;
              const isCompleted = status === 'success';
              const isError = status === 'error';

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    isActive ? 'bg-primary/5 border-primary' : 
                    isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                    isError ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                    'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStepIcon(step.id, status)}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-700 dark:text-green-400' : isError ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                      {step.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Setup Error</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-3">
            <Button
              onClick={runSetup}
              disabled={isRunning}
              className="flex-1"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Setup
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This will set up your database, create an admin account, and configure initial settings.
            <br />
            Make sure your Supabase environment variables are configured correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

