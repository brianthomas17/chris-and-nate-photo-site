
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestManagement from "./GuestManagement";
import ContentManagement from "./ContentManagement";
import RSVPOverview from "./RSVPOverview";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const { currentGuest, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!currentGuest || currentGuest.invitationType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-anniversary-cream">
      <header className="bg-anniversary-navy text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-playfair">Anniversary Admin Console</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {currentGuest.firstName}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-white border-white hover:bg-anniversary-navy/90 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="guests">Guest Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="rsvp">RSVP Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          <TabsContent value="rsvp">
            <RSVPOverview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
