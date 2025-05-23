import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ContentSections from "./ContentSections";
import RSVPForm from "./RSVPForm";
import PartyList from "./PartyList";
import ConfirmedAttendees from "./ConfirmedAttendees";
import SectionSeparator from "./SectionSeparator";
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
  
  // Ensure boolean values are properly handled with strict equality
  const showFridayDinner = currentGuest.friday_dinner === true;
  const showSundayBrunch = currentGuest.sunday_brunch === true;
  // Explicitly check if the user has main_event access
  const hasMainEventAccess = currentGuest.main_event === true || isAdmin;
  
  console.log("Guest data in EventLayout:", {
    id: currentGuest.id,
    name: currentGuest.first_name,
    invitation_type: currentGuest.invitation_type,
    friday_dinner: currentGuest.friday_dinner,
    sunday_brunch: currentGuest.sunday_brunch,
    main_event: currentGuest.main_event,
    afterparty: currentGuest.afterparty,
    rawMainEvent: JSON.stringify(currentGuest.main_event),
    // Log raw value
    rawAfterparty: JSON.stringify(currentGuest.afterparty) // Log raw value
  });

  return <div className="min-h-screen relative">
      {/* Background SVG - positioned in the center with max-width 50% */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src="/lovable-uploads/background.svg" alt="" className="max-w-[50vw] w-auto h-auto" aria-hidden="true" />
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

      <SectionSeparator />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        {/* RSVP Section */}
        <section className="mb-16 md:mb-20 animate-fade-in">
          <RSVPForm guest={currentGuest} />
        </section>

        {/* Party List Section (If user has a party) */}
        {hasParty && (
          <section className="mb-16 md:mb-20 animate-fade-in">
            <PartyList guestId={currentGuest.id} partyId={currentGuest.party_id} />
          </section>
        )}

        <SectionSeparator />

        {/* Event Details Header Section */}
        <section className="mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">EVENT DETAILS</h2>
        </section>

        <SectionSeparator />

        {/* Content Sections */}
        <section className="mb-16 md:mb-20 animate-fade-in">
          <div className="max-w-[450px] mx-auto">
            <ContentSections invitationType={currentGuest.invitation_type} />
          </div>
        </section>
        
        {/* Confirmed Attendees Section - Only shown to guests with main_event access */}
        {hasMainEventAccess && (
          <>
            <SectionSeparator />
            <section className="animate-fade-in mb-16 md:mb-20">
              <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8 pb-4">CONFIRMED ATTENDEES</h2>
              <div className="max-w-[800px] mx-auto">
                <ConfirmedAttendees />
              </div>
            </section>
          </>
        )}

        <SectionSeparator />
        
        {/* Questions Section - Now visible to all users */}
        <section className="animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">QUESTIONS</h2>
          <div className="max-w-[450px] mx-auto text-center">
            <p className="text-anniversary-gold text-base md:text-lg font-bicyclette leading-relaxed">
              Please contact our planner Hunter at{" "}
              <a 
                href="mailto:hunter@shiftalt.events" 
                className="text-anniversary-gold hover:text-anniversary-lightgold underline transition-colors"
              >
                hunter@shiftalt.events
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>;
}
