import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentSections from "./ContentSections";
import RSVPForm from "./RSVPForm";
import PhotoGallery from "./PhotoGallery";
import PartyView from "./PartyView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
export default function EventLayout() {
  const {
    currentGuest,
    logout
  } = useAuth();
  const navigate = useNavigate();
  if (!currentGuest) {
    navigate('/');
    return null;
  }
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const isAdmin = currentGuest.invitation_type === 'admin';
  const hasParty = !!currentGuest.party_id;
  return <div className="min-h-screen bg-anniversary-purple">
      <div className="bg-anniversary-purple py-2 px-4 border-b border-anniversary-gold/10">
        <div className="container mx-auto flex justify-end">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-[#C9A95B] hover:text-[#C9A95B]/80 hover:bg-[#C9A95B]/20">
                  {currentGuest.first_name}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-anniversary-purple border border-[#C9A95B]/30 text-[#C9A95B]">
                {isAdmin && <>
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer hover:bg-[#C9A95B]/20 hover:text-[#C9A95B]/80">
                      Admin Console
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
      
      {/* Hero Section with circuit pattern frames */}
      <header className="bg-anniversary-purple text-[#C9A95B] relative overflow-hidden" style={{
      height: "80vh"
    }}>
        {/* Top circuit frame - with animation */}
        <div className="absolute top-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center animate-[fadeIn_1s_ease-out_forwards]" style={{
        backgroundImage: "url('/lovable-uploads/f1b5eb4b-16d9-413b-9947-8c73368a63d0.png')",
        opacity: 0
      }}>
        </div>
        
        {/* Bottom circuit frame - with animation */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[150px] bg-no-repeat bg-contain bg-center animate-[fadeIn_1s_ease-out_forwards]" style={{
        backgroundImage: "url('/lovable-uploads/12cc45f0-9dd0-4cdf-aebd-ad9001c74e51.png')",
        opacity: 0
      }}>
        </div>
        
        <div className="container mx-auto text-center relative z-10 flex flex-col justify-center items-center h-full px-4">
          <h3 className="text-xl md:text-3xl font-bicyclette mb-10 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_0.8s_forwards]" style={{
          opacity: 0
        }}>
            CHRIS & NATE INVITE YOU TO
          </h3>
          <h1 className="text-4xl md:text-6xl font-din tracking-wide mb-4 uppercase text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1s_forwards]" style={{
          opacity: 0
        }}>
            A Decade of Determination, Disruption & Dinner Dilemmas
          </h1>
          <p className="text-xl text-[#C9A95B] font-bicyclette mb-8 animate-[fadeIn_1.2s_ease-out_1.2s_forwards]" style={{
          opacity: 0
        }}>
            THIS ONE'S DIFFERENT...
          </p>
          <h2 className="text-3xl md:text-5xl font-din mb-6 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.4s_forwards]" style={{
          opacity: 0
        }}>
            8.16.25
          </h2>
          <p className="text-xl md:text-2xl font-bicyclette mb-8 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.6s_forwards]" style={{
          opacity: 0
        }}>
            MORE THAN AN EVENT — IT'S A MOMENT
          </p>
          <div className="text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.8s_forwards]" style={{
          opacity: 0
        }}>
            <p className="font-bicyclette">SAINT JOSEPH'S ARTS SOCIETY</p>
            <p className="font-bicyclette">1401 HOWARD STREET, SAN FRANCISCO</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="details" className="w-full">
          <div className="flex justify-center w-full">
            <TabsList className="mb-8 bg-transparent">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="rsvp">RSVP</TabsTrigger>
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              {hasParty && <TabsTrigger value="party">Your Party</TabsTrigger>}
            </TabsList>
          </div>
          <TabsContent value="details" className="animate-fade-in">
            <ContentSections invitationType={currentGuest.invitation_type} />
          </TabsContent>
          <TabsContent value="rsvp" className="animate-fade-in">
            <RSVPForm guest={currentGuest} />
          </TabsContent>
          <TabsContent value="gallery" className="animate-fade-in">
            <PhotoGallery />
          </TabsContent>
          {hasParty && <TabsContent value="party" className="animate-fade-in">
              <PartyView guestId={currentGuest.id} partyId={currentGuest.party_id} />
            </TabsContent>}
        </Tabs>
      </div>
    </div>;
}