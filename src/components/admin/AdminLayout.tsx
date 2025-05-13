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
      <div className="bg-anniversary-purple py-2 px-4 border-b border-[#C9A95B]/10">
        <div className="container mx-auto flex justify-end">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 text-[#C9A95B] hover:text-[#C9A95B]/80 hover:bg-[#C9A95B]/20"
                >
                  {currentGuest?.first_name}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-anniversary-purple border border-[#C9A95B]/30 text-[#C9A95B]"
              >
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer hover:bg-[#C9A95B]/20 hover:text-[#C9A95B]/80"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <header className="bg-anniversary-purple text-[#C9A95B] p-4 border-b border-[#C9A95B]/30 relative overflow-hidden">
        {/* Top circuit frame - swapped image */}
        <div className="absolute top-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center" 
            style={{ backgroundImage: "url('/lovable-uploads/f1b5eb4b-16d9-413b-9947-8c73368a63d0.png')" }}>
        </div>
        
        {/* Bottom circuit frame - swapped image */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center" 
            style={{ backgroundImage: "url('/lovable-uploads/12cc45f0-9dd0-4cdf-aebd-ad9001c74e51.png')" }}>
        </div>
        
        <div className="container mx-auto relative z-10">
          <h1 className="text-3xl font-din uppercase tracking-wide">Anniversary Admin</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-transparent">
            <TabsTrigger 
              value="guests" 
              className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple"
            >
              Guest Management
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple"
            >
              Content Management
            </TabsTrigger>
            <TabsTrigger 
              value="rsvp" 
              className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple"
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
