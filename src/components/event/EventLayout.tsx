
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentSections from "./ContentSections";
import RSVPForm from "./RSVPForm";
import PhotoGallery from "./PhotoGallery";
import PartyView from "./PartyView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="min-h-screen bg-anniversary-cream">
      <header className="bg-anniversary-navy text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-playfair mb-2">10-Year Anniversary Celebration</h1>
          <p className="text-xl opacity-90">We're delighted to have you join us!</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-playfair">Welcome, {currentGuest.first_name}!</h2>
            <p className="text-muted-foreground">
              You're invited to our {' '}
              {currentGuest.invitation_type === 'full day' ? 'full day celebration' : 'evening gala'}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {isAdmin && (
              <Button onClick={() => navigate('/admin')} className="bg-anniversary-burgundy hover:bg-anniversary-burgundy/90">
                Admin Console
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="rsvp">RSVP</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
            {hasParty && <TabsTrigger value="party">Your Party</TabsTrigger>}
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
