
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
        <img src="/masks.svg" alt="" className="max-w-[50vw] w-auto h-auto" aria-hidden="true" />
      </div>
      
      <div className="py-1 px-4 border-b border-anniversary-gold/10 relative z-10 animate-[fadeIn_0.8s_ease-out_forwards]" style={{ opacity: 0 }}>
        <div className="container mx-auto flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-anniversary-gold hover:text-anniversary-gold/80 hover:bg-anniversary-gold/20 h-8 px-2">
                {currentGuest.first_name}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-anniversary-purple border border-anniversary-gold/30 text-anniversary-gold">
              {isAdmin && <>
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer hover:bg-anniversary-gold/20 hover:text-anniversary-gold/80">
                    Admin Console
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
      
      <div className="px-4 py-6 md:py-12 relative z-10 flex justify-center animate-[fadeIn_1s_ease-out_forwards]" style={{ opacity: 0 }}>
        <header className="relative rounded-xl shadow-lg border border-anniversary-gold/20 bg-anniversary-darkPurple/50 backdrop-blur-sm overflow-hidden w-fit">
          <div className="w-full max-w-[700px] aspect-square">
            <img 
              src="/lovable-uploads/55aeeccb-f695-402f-bdbd-a0dc52edc692.png" 
              alt="Chris & Nate Anniversary Celebration"
              className="w-full h-full object-cover animate-[fadeIn_1s_ease-out_forwards]"
              style={{ opacity: 0 }}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        </header>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10 animate-[fadeIn_1.2s_ease-out_forwards]" style={{ opacity: 0 }}>
        <div className="max-w-[500px] mx-auto text-left">
          <h2 className="text-anniversary-gold text-2xl md:text-3xl font-light leading-relaxed">
            There are parties, and then there are nights that define a decade…
          </h2>
      
          <p className="text-white text-base md:text-lg font-light leading-relaxed mt-6">
            Join us for an evening you'll never forget as we celebrate ten years of Chris and Nate.
          </p>
      
          <p className="text-white text-base md:text-lg font-light leading-relaxed mt-6">
            Ten years ago Chris and Nate married at San Francisco City Hall with only family in attendance. At the time, Nate was busy building Lever and Chris was re-entering the tech world. They didn't have the time or money to throw the wedding they wanted, so they decided if they made it to ten years of marriage, they would throw the most epic party.
          </p>
      
          <p className="text-white text-base md:text-lg font-light leading-relaxed mt-6">
            This is that party. You are invited. It will be like nothing anyone has ever seen.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 animate-[fadeIn_1.4s_ease-out_forwards]" style={{ opacity: 0 }}>
        <SectionSeparator />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        {/* RSVP Section */}
        <section className="mb-16 md:mb-20 animate-[fadeIn_1.6s_ease-out_forwards]" style={{ opacity: 0 }}>
          <RSVPForm guest={currentGuest} />
        </section>

        {/* Party List Section (If user has a party) */}
        {hasParty && (
          <section className="mb-16 md:mb-20 animate-[fadeIn_1.8s_ease-out_forwards]" style={{ opacity: 0 }}>
            <PartyList guestId={currentGuest.id} partyId={currentGuest.party_id} />
          </section>
        )}

        {/* Content Sections */}
        <section className="mb-16 md:mb-20 animate-[fadeIn_2.6s_ease-out_forwards]" style={{ opacity: 0 }}>
          <div className="max-w-[450px] mx-auto">
            <ContentSections invitationType={currentGuest.invitation_type} />
          </div>
        </section>
        
        {/* Confirmed Attendees Section - Only shown to guests with main_event access */}
        {hasMainEventAccess && (
          <>
            <div className="mt-16 mb-16 animate-[fadeIn_2.8s_ease-out_forwards]" style={{ opacity: 0 }}>
              <SectionSeparator />
            </div>
            <section className="mb-16 md:mb-20 animate-[fadeIn_3s_ease-out_forwards]" style={{ opacity: 0 }}>
              <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8 pb-4">CONFIRMED ATTENDEES</h2>
              <div className="max-w-[800px] mx-auto">
                <ConfirmedAttendees />
              </div>
            </section>
          </>
        )}

        {/* Questions Section - Now visible to all users */}
        <div className="mt-16 mb-16 animate-[fadeIn_3.2s_ease-out_forwards]" style={{ opacity: 0 }}>
          <SectionSeparator />
        </div>
        <section className="animate-[fadeIn_3.4s_ease-out_forwards]" style={{ opacity: 0 }}>
          <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">QUESTIONS</h2>
          <div className="max-w-[450px] mx-auto text-center">
            <p className="text-anniversary-gold text-base md:text-lg font-bicyclette leading-relaxed">
              Please contact our planner Hunter Rae at{" "}
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
