
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { seedTestAccounts } from "@/utils/seedTestAccounts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedTestAccounts = async () => {
    setIsSeeding(true);
    try {
      await seedTestAccounts();
      toast({
        title: "Success",
        description: "Test accounts have been seeded successfully.",
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
      <div className="fixed bottom-4 right-4">
        <Button 
          onClick={handleSeedTestAccounts}
          disabled={isSeeding}
          variant="outline"
          className="bg-white/80 hover:bg-white"
        >
          {isSeeding ? "Seeding..." : "Seed Test Accounts"}
        </Button>
      </div>
    </>
  );
};

export default Admin;
