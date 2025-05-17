
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Admin = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const { currentGuest, isLoading } = useAuth();
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

  return (
    <>
      <AdminLayout />
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <Button 
          onClick={handleSeedTestAccounts} 
          disabled={isSeeding} 
          variant="outline"
        >
          {isSeeding ? "Seeding..." : "Seed Test Accounts"}
        </Button>
      </div>
    </>
  );
};

export default Admin;
