
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Admin = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSettingUpSync, setIsSettingUpSync] = useState(false);
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

  const handleSetupAirtableSync = async () => {
    setIsSettingUpSync(true);
    try {
      // Step 1: Test connection to Airtable first
      const testResponse = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/test-airtable-connection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        throw new Error(`Airtable connection test failed: ${testResponse.status} - ${errorText}`);
      }
      
      const testResult = await testResponse.json();
      
      if (!testResult.success) {
        throw new Error(testResult.message || "Could not connect to Airtable");
      }
      
      toast({
        title: "Airtable Connection Successful",
        description: "Successfully connected to Airtable API."
      });
      
      // Step 2: Set up database triggers
      const setupResponse = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/setup-webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!setupResponse.ok) {
        const errorText = await setupResponse.text();
        throw new Error(`Error setting up database triggers: ${setupResponse.status} - ${errorText}`);
      }
      
      const setupResult = await setupResponse.json();
      
      if (!setupResult.success) {
        throw new Error(setupResult.error || "Unknown error occurred setting up database triggers");
      }
      
      // Final success message
      toast({
        title: "Setup Complete",
        description: "Airtable sync system has been set up successfully. All database changes will now sync to Airtable automatically."
      });
    } catch (error) {
      console.error("Error setting up Airtable sync:", error);
      toast({
        title: "Error",
        description: `Failed to set up Airtable sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSettingUpSync(false);
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
        <Button 
          onClick={handleSetupAirtableSync} 
          disabled={isSettingUpSync} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSettingUpSync ? "Setting up..." : "Set Up Airtable Sync"}
        </Button>
      </div>
    </>
  );
};

export default Admin;
