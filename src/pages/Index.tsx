
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import EventLayout from "@/components/event/EventLayout";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { currentGuest, isLoading } = useAuth();

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
    await seedTestAccounts();
    alert("Test accounts have been seeded! Try logging in with john@example.com, jane@example.com, or admin@example.com");
  };

  // Show seed button only in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      {currentGuest ? <EventLayout /> : <AuthForm />}
      
      {!currentGuest && isDevelopment && (
        <div className="fixed bottom-4 right-4">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs opacity-50 hover:opacity-100"
            onClick={handleSeedTestAccounts}
          >
            Seed Test Accounts
          </Button>
        </div>
      )}
    </>
  );
};

export default Index;
