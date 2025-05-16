import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestManagement from "./GuestManagement";
import ContentManagement from "./ContentManagement";
import RSVPOverview from "./RSVPOverview";
import CommunicationsManagement from "./CommunicationsManagement";
import MessagesSent from "./MessagesSent";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
export default function AdminLayout() {
  const {
    currentGuest,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const isAdmin = currentGuest?.invitation_type === 'admin';
  return <div className="min-h-screen">
      <div className="py-2 px-4 border-b border-[#C9A95B]/10">
        <div className="container mx-auto flex justify-end">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-[#C9A95B] hover:text-[#C9A95B]/80 hover:bg-[#C9A95B]/20">
                  {currentGuest?.first_name}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-anniversary-purple border border-[#C9A95B]/30 text-[#C9A95B]">
                {isAdmin && <>
                    <DropdownMenuItem onClick={() => navigate('/rsvp')} className="cursor-pointer hover:bg-[#C9A95B]/20 hover:text-[#C9A95B]/80">
                      Main Event Page
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#C9A95B]/20" />
                  </>}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-[#C9A95B]/20 hover:text-[#C9A95B]/80">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <header className="text-[#C9A95B] p-4 border-b border-[#C9A95B]/30 relative overflow-hidden">
        {/* Top circuit frame - swapped image */}
        
        
        {/* Bottom circuit frame - swapped image */}
        
        
        <div className="container mx-auto relative z-10">
          <h1 className="text-3xl font-din uppercase tracking-wide">Anniversary Admin</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="guests" className="w-full">
          <div className="flex justify-center w-full">
            <TabsList className="mb-8 bg-transparent">
              <TabsTrigger value="guests" className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple">Guests</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple">Details</TabsTrigger>
              <TabsTrigger value="communications" className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple">Message Content</TabsTrigger>
              <TabsTrigger value="messages-sent" className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple">Messages Sent</TabsTrigger>
              <TabsTrigger value="rsvp" className="data-[state=active]:bg-[#C9A95B] data-[state=active]:text-anniversary-purple">Stats</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
          <TabsContent value="communications">
            <CommunicationsManagement />
          </TabsContent>
          <TabsContent value="messages-sent">
            <MessagesSent />
          </TabsContent>
          <TabsContent value="rsvp">
            <RSVPOverview />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}