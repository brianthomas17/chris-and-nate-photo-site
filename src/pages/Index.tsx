
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import EventLayout from "@/components/event/EventLayout";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { currentGuest, isLoading } = useAuth();
  const [seedingStatus, setSeedingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-anniversary-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper function to seed test accounts (only visible in development)
  const handleSeedTestAccounts = async () => {
    setSeedingStatus('loading');
    try {
      await seedTestAccounts();
      setSeedingStatus('success');
      toast({
        title: "Test Accounts Created",
        description: "Test accounts have been seeded! Try logging in with john@example.com, jane@example.com, or admin@example.com",
      });
    } catch (error) {
      console.error("Error seeding test accounts:", error);
      setSeedingStatus('error');
      toast({
        title: "Error",
        description: "Failed to create test accounts. Check console for details.",
        variant: "destructive"
      });
    }
  };

  // Show seed button only in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="relative min-h-screen">
      {/* Background SVG - positioned in the center with max-width 50% */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="/lovable-uploads/background.svg" 
          alt="" 
          className="max-w-[50vw] w-auto h-auto opacity-20"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10">
        {currentGuest ? <EventLayout /> : <AuthForm />}
        
        {!currentGuest && isDevelopment && (
          <div className="fixed bottom-4 right-4">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs bg-white/80 hover:bg-white"
              onClick={handleSeedTestAccounts}
              disabled={seedingStatus === 'loading'}
            >
              {seedingStatus === 'loading' ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Creating Accounts...
                </span>
              ) : seedingStatus === 'success' ? (
                "Accounts Created!"
              ) : (
                "Seed Test Accounts"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
