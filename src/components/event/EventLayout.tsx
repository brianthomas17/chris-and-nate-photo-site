import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentSections from "./ContentSections";
import RSVPForm from "./RSVPForm";
import PartyList from "./PartyList";
import ConfirmedAttendees from "./ConfirmedAttendees";
import SectionSeparator from "./SectionSeparator";
import FridayDinnerSection from "./FridayDinnerSection";
import SundayBrunchSection from "./SundayBrunchSection";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EventLayout() {
  const {
    currentGuest,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
  
  // Convert all values to proper booleans using Boolean()
  const showFridayDinner = Boolean(currentGuest.friday_dinner); 
  const showSundayBrunch = Boolean(currentGuest.sunday_brunch);
  const hasMainEvent = Boolean(currentGuest.main_event); // Changed to explicitly require true
  const hasAfterparty = Boolean(currentGuest.afterparty);
  
  console.log("Guest data in EventLayout:", {
    id: currentGuest.id,
    name: currentGuest.first_name,
    friday_dinner: currentGuest.friday_dinner,
    sunday_brunch: currentGuest.sunday_brunch,
    main_event: currentGuest.main_event,
    afterparty: currentGuest.afterparty,
    showFridayDinner,
    showSundayBrunch,
    hasMainEvent,
    hasAfterparty
  });
  
  return (
    <div className="min-h-screen relative">
      {/* Background SVG - positioned in the center with max-width 50% */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="/lovable-uploads/background.svg" 
          alt="" 
          className="max-w-[50vw] w-auto h-auto"
          aria-hidden="true"
        />
      </div>
      
      <div className="py-1 px-4 border-b border-anniversary-gold/10 relative z-10">
        <div className="container mx-auto flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-[#C9A95B] hover:text-[#C9A95B]/80 hover:bg-[#C9A95B]/20 h-8 px-2">
                {currentGuest.first_name}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-anniversary-purple border border-[#C9A95B]/30 text-[#C9A95B]">
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
      
      {/* Hero Section with circuit pattern frames - z-index to display above background SVG */}
      <div className="px-4 py-3 md:py-6 relative z-10">
        <header className="text-[#C9A95B] relative rounded-xl shadow-lg border border-[#C9A95B]/20 bg-anniversary-darkPurple/50 backdrop-blur-sm mx-auto max-w-[800px]" style={{
          minHeight: isMobile ? "450px" : "768px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          {/* Top circuit frame - adjusted to properly align at top */}
          <div className="absolute top-0 left-0 right-0 w-full h-[100px] md:h-[150px] bg-no-repeat bg-contain bg-top animate-[fadeIn_1s_ease-out_forwards] z-10" style={{
            backgroundImage: "url('/lovable-uploads/top.svg')",
            opacity: 0
          }}>
          </div>
          
          {/* Bottom circuit frame - adjusted to properly align at bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-full h-[100px] md:h-[150px] bg-no-repeat bg-contain bg-bottom animate-[fadeIn_1s_ease-out_forwards] z-10" style={{
            backgroundImage: "url('/lovable-uploads/bottom.svg')",
            opacity: 0
          }}>
          </div>
          
          <div className="container mx-auto text-center relative z-0 px-4 py-[80px] md:py-[100px]">
            <div className="max-w-[800px] mx-auto">
              <h3 className="text-xl md:text-3xl font-bicyclette mb-6 md:mb-10 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_0.8s_forwards]" style={{
                opacity: 0
              }}>
                CHRIS & NATE INVITE YOU TO
              </h3>
              <h1 className="text-3xl md:text-6xl font-din tracking-wide mb-4 uppercase text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1s_forwards]" style={{
                opacity: 0
              }}>
                A Decade of Determination, Disruption & Dinner Dilemmas
              </h1>
              <p className="text-lg md:text-xl text-[#C9A95B] font-bicyclette mb-6 md:mb-8 animate-[fadeIn_1.2s_ease-out_1.2s_forwards]" style={{
                opacity: 0
              }}>
                THIS ONE'S DIFFERENT...
              </p>
              <h2 className="text-2xl md:text-5xl font-din mb-4 md:mb-6 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.4s_forwards]" style={{
                opacity: 0
              }}>
                8.16.25
              </h2>
              <p className="text-lg md:text-2xl font-bicyclette mb-6 md:mb-8 text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.6s_forwards]" style={{
                opacity: 0
              }}>
                MORE THAN AN EVENT — IT'S A MOMENT
              </p>
              <div className="text-[#C9A95B] animate-[fadeIn_1.2s_ease-out_1.8s_forwards]" style={{
                opacity: 0
              }}>
                <p className="font-bicyclette text-sm md:text-base">SAINT JOSEPH'S ARTS SOCIETY</p>
                <p className="font-bicyclette text-sm md:text-base">1401 HOWARD STREET, SAN FRANCISCO</p>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* NEW SECTION: Large gold italic text between hero and RSVP */}
      <div className="container mx-auto px-4 pt-48 pb-12 md:py-16 relative z-10">
        <div className="max-w-[600px] mx-auto text-center">
          <p className="text-anniversary-gold text-lg md:text-2xl italic font-bicyclette leading-relaxed animate-[fadeIn_1.2s_ease-out_forwards] uppercase">
            THERE ARE PARTIES, AND THEN THERE ARE NIGHTS THAT DEFINE A DECADE…<br/>
            JOIN US FOR AN EVENING YOU'LL NEVER FORGET AS WE CELEBRATE TEN YEARS OF CHRIS AND NATE.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-[60px] md:py-[80px] relative z-10">
        {/* RSVP Section - First */}
        <section className="mb-12 md:mb-16 animate-fade-in">
          <RSVPForm guest={currentGuest} />
        </section>

        {/* Party List Section - Second (If user has a party) */}
        {hasParty && (
          <section className="animate-fade-in">
            <PartyList 
              guestId={currentGuest.id} 
              partyId={currentGuest.party_id} 
            />
            <SectionSeparator />
          </section>
        )}

        {/* Friday Dinner Section - Shown conditionally */}
        {showFridayDinner && (
          <section className="animate-fade-in pt-16">
            <FridayDinnerSection />
          </section>
        )}

        {/* Event Details Section - Added heading with updated margins */}
        <section className="animate-fade-in pt-10">
          <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-8">EVENT DETAILS</h2>
          <div className="max-w-[450px] mx-auto">
            <ContentSections 
              invitationType={currentGuest.invitation_type} 
              fridayDinner={showFridayDinner}
              sundayBrunch={showSundayBrunch}
              mainEvent={hasMainEvent}
              afterparty={hasAfterparty}
            />
          </div>
          <div className="pt-20">
            <SectionSeparator />
          </div>
        </section>
        
        {/* Sunday Brunch Section - Shown conditionally */}
        {showSundayBrunch && (
          <section className="animate-fade-in">
            <SundayBrunchSection />
          </section>
        )}
        
        {/* Confirmed Attendees Section */}
        <section className="animate-fade-in pt-20">
          <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8 pb-4">CONFIRMED ATTENDEES</h2>
          <div className="max-w-[800px] mx-auto">
            <ConfirmedAttendees />
          </div>
        </section>
      </div>
    </div>
  );
}
