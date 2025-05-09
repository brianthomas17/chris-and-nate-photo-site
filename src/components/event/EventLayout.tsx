
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentSections from "./ContentSections";
import RSVPForm from "./RSVPForm";
import PhotoGallery from "./PhotoGallery";
import PartyView from "./PartyView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function EventLayout() {
  const { currentGuest, logout } = useAuth();
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
  const isAttending = currentGuest.rsvp?.attending === true;
  const hasResponded = currentGuest.rsvp !== undefined;

  return (
    <div className="min-h-screen bg-anniversary-purple">
      <div className="bg-anniversary-purple py-2 px-4 border-b border-anniversary-gold/10">
        <div className="container mx-auto flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-anniversary-gold hover:text-anniversary-lightgold hover:bg-anniversary-gold/20">
                {currentGuest.first_name}
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
      
      {/* Dynamic Hero Section based on RSVP status */}
      <header className="bg-anniversary-purple text-anniversary-lightgold relative overflow-hidden circuit-pattern" style={{ height: "80vh" }}>
        <div className="container mx-auto text-center relative z-10 flex flex-col justify-center items-center h-full px-4">
          {isAttending ? (
            <>
              <h3 className="text-xl md:text-2xl font-bicyclette mb-2 text-anniversary-gold">
                {currentGuest.first_name}, Chris & Nate are so excited you are joining them for
              </h3>
              <h1 className="text-4xl md:text-6xl font-din tracking-wide mb-4 uppercase">
                A Decade of Determination, Disruption & Dinner Dilemmas
              </h1>
              <p className="text-xl text-anniversary-lightgold font-bicyclette mb-8">
                THIS ONE'S DIFFERENT...
              </p>
              <h2 className="text-3xl md:text-5xl font-din mb-6">
                8.16.25
              </h2>
              <p className="text-xl md:text-2xl font-bicyclette mb-8">
                MORE THAN AN EVENT — IT'S A MOMENT
              </p>
              <div className="text-anniversary-gold">
                <p className="font-bicyclette">SAINT JOSEPH'S ARTS SOCIETY</p>
                <p className="font-bicyclette">1401 HOWARD STREET, SAN FRANCISCO</p>
              </div>
            </>
          ) : hasResponded && !isAttending ? (
            <>
              <h3 className="text-xl md:text-2xl font-bicyclette mb-2 text-anniversary-gold">
                {currentGuest.first_name}, Have your plans changed? Chris & Nate would still love you to join them for
              </h3>
              <h1 className="text-4xl md:text-6xl font-din tracking-wide mb-4 uppercase">
                A Decade of Determination, Disruption & Dinner Dilemmas
              </h1>
              <p className="text-xl text-anniversary-lightgold font-bicyclette mb-8">
                THIS ONE'S DIFFERENT...
              </p>
              <h2 className="text-3xl md:text-5xl font-din mb-6">
                8.16.25 • 4 PM
              </h2>
              <p className="text-xl md:text-2xl font-bicyclette mb-8">
                MORE THAN AN EVENT — IT'S A MOMENT
              </p>
              <div className="text-anniversary-gold">
                <p className="font-bicyclette">SAINT JOSEPH'S ARTS SOCIETY</p>
                <p className="font-bicyclette">1401 HOWARD STREET, SAN FRANCISCO</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-din tracking-wide mb-4 uppercase">
                A Decade of Celebration
              </h1>
              <p className="text-xl text-anniversary-lightgold font-bicyclette mb-8">
                THIS ONE'S DIFFERENT...
              </p>
              <h2 className="text-3xl md:text-5xl font-din mb-6">
                8.16.25
              </h2>
              <p className="text-xl md:text-2xl font-bicyclette mb-8">
                PLEASE RSVP BELOW
              </p>
            </>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-anniversary-purple/90 p-6 rounded-lg backdrop-blur-sm border border-anniversary-gold/20">
          <div>
            <h2 className="text-2xl font-din text-anniversary-gold uppercase">Welcome, {currentGuest.first_name}!</h2>
            <p className="text-anniversary-lightgold">
              You're invited to our {' '}
              {currentGuest.invitation_type === 'full day' ? 'full day celebration' : 'evening gala'}
            </p>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-anniversary-purple border border-anniversary-gold/30">
            <TabsTrigger value="details" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">Event Details</TabsTrigger>
            <TabsTrigger value="rsvp" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">RSVP</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">Photo Gallery</TabsTrigger>
            {hasParty && <TabsTrigger value="party" className="data-[state=active]:bg-anniversary-gold data-[state=active]:text-anniversary-purple">Your Party</TabsTrigger>}
          </TabsList>
          <TabsContent value="details" className="animate-fade-in">
            <ContentSections invitationType={currentGuest.invitation_type} />
          </TabsContent>
          <TabsContent value="rsvp" className="animate-fade-in">
            <RSVPForm guest={currentGuest} />
          </TabsContent>
          <TabsContent value="gallery" className="animate-fade-in">
            <PhotoGallery />
          </TabsContent>
          {hasParty && (
            <TabsContent value="party" className="animate-fade-in">
              <PartyView guestId={currentGuest.id} partyId={currentGuest.party_id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
