
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGuests } from "@/context/GuestContext";
import { Navigate, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const Admin = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { currentGuest, isLoading } = useAuth();
  const { fetchGuests } = useGuests();
  const navigate = useNavigate();

  // Use useEffect for navigation to prevent issues with multiple renders
  useEffect(() => {
    // Make sure auth is loaded before checking
    if (!isLoading) {
      // Redirect if not logged in
      if (!currentGuest) {
        navigate('/', {
          replace: true
        });
        return;
      }

      // Redirect if not admin
      if (currentGuest.invitation_type !== 'admin') {
        navigate('/', {
          replace: true
        });
        return;
      }
    }
  }, [currentGuest, isLoading, navigate]);

  // If still loading auth, show nothing
  if (isLoading) {
    return null;
  }

  // If not admin or not logged in (before redirect happens), don't render
  if (!currentGuest || currentGuest.invitation_type !== 'admin') {
    return null;
  }
  
  const handleSeedTestAccounts = async () => {
    setIsSeeding(true);
    try {
      await seedTestAccounts();
      toast({
        title: "Success",
        description: "Test accounts have been seeded successfully."
      });
    } catch (error) {
      console.error("Error seeding test accounts:", error);
      toast({
        title: "Error",
        description: "Failed to seed test accounts.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchGuests();
      toast({
        title: "Data Refreshed",
        description: "Guest and RSVP data has been refreshed."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <>
      <AdminLayout />
      <div className="fixed bottom-4 right-4 space-x-2">
        <Button
          variant="secondary"
          onClick={handleRefreshData}
          disabled={isRefreshing}
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
    </>
  );
};

export default Admin;
