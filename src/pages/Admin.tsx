
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useGuests } from "@/context/GuestContext";
import { RefreshCw } from "lucide-react";

const Admin = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { currentGuest, isLoading } = useAuth();
  const { fetchGuests } = useGuests();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Admin page - Current Guest:", currentGuest, "Is Loading:", isLoading);
    
    // Make sure auth is loaded before checking
    if (!isLoading) {
      // Redirect if not logged in
      if (!currentGuest) {
        console.log("No current guest, redirecting to home");
        navigate('/', { replace: true });
        return;
      }

      // Redirect if not admin
      if (currentGuest.invitation_type !== 'admin') {
        console.log("Not an admin, redirecting to event page");
        navigate('/event', { replace: true });
        return;
      }
    }
  }, [currentGuest, isLoading, navigate]);

  // If still loading auth, show loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin"></div>
    </div>;
  }

  // If not admin or not logged in (before redirect happens), don't render
  if (!currentGuest || currentGuest.invitation_type !== 'admin') {
    return null;
  }
  
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
