
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestManagement from "./GuestManagement";
import ContentManagement from "./ContentManagement";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminLayout() {
  const {
    currentGuest,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const isAdmin = currentGuest?.invitation_type === 'admin';
  return <div className="min-h-screen">
      <div className="py-1 px-4 border-b border-anniversary-gold/10">
        <div className="container mx-auto flex justify-end">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-anniversary-gold hover:text-anniversary-gold/80 hover:bg-anniversary-gold/20">
                  {currentGuest?.first_name}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-anniversary-purple border border-anniversary-gold/30 text-anniversary-gold">
                {isAdmin && <>
                    <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer hover:bg-anniversary-gold/20 hover:text-anniversary-gold/80">
                      Main Event Page
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-anniversary-gold/20" />
                  </>}
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-anniversary-gold/20 hover:text-anniversary-gold/80">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 md:py-6">
        <header className="text-anniversary-gold p-4 border-b border-anniversary-gold/30 relative overflow-hidden rounded-xl shadow-lg border border-anniversary-gold/20 bg-anniversary-darkPurple/50 backdrop-blur-sm mx-auto max-w-[800px]">
          <div className="container mx-auto relative z-10">
            <h1 className="text-3xl font-din uppercase tracking-wide">Anniversary Admin</h1>
          </div>
        </header>
      </div>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="guests" className="w-full">
          <div className="flex justify-center w-full">
            <TabsList className="mb-8 bg-transparent">
              <TabsTrigger value="guests" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">Guests</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">Details</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>
          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}
