
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestManagement from "./GuestManagement";
import ContentManagement from "./ContentManagement";
import RSVPOverview from "./RSVPOverview";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function AdminLayout() {
  const { currentGuest, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-anniversary-purple">
      <div className="bg-anniversary-purple py-2 px-4 border-b border-anniversary-gold/10">
        <div className="container mx-auto flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 text-anniversary-gold hover:text-anniversary-lightgold hover:bg-anniversary-gold/20"
              >
                {currentGuest?.first_name}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-anniversary-purple border border-anniversary-gold/30 text-anniversary-gold"
            >
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer hover:bg-anniversary-gold/20 hover:text-anniversary-lightgold"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <header className="bg-anniversary-purple text-anniversary-gold p-4 border-b border-anniversary-gold/30 circuit-pattern">
        <div className="container mx-auto">
          <h1 className="text-3xl font-din uppercase tracking-wide">Anniversary Admin</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-anniversary-purple border border-anniversary-gold/30">
            <TabsTrigger 
              value="guests" 
              className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple"
            >
              Guest Management
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple"
            >
              Content Management
            </TabsTrigger>
            <TabsTrigger 
              value="rsvp" 
              className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple"
            >
              RSVP Overview
            </TabsTrigger>
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
