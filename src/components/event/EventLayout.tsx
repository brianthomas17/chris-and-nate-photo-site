
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import ContentSections from './ContentSections';
import PartyView from './PartyView';
import SectionSeparator from './SectionSeparator';
import PhotoGallery from './PhotoGallery';
import FridayDinnerSection from './FridayDinnerSection';
import SundayBrunchSection from './SundayBrunchSection';
import ConfirmedAttendees from './ConfirmedAttendees';

const EventLayout = () => {
  const { currentGuest, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("EventLayout - Current Guest:", currentGuest, "Is Loading:", isLoading);
    
    // Redirect to home if not authenticated
    if (!isLoading && !currentGuest) {
      console.log("No current guest, redirecting to home");
      navigate('/', { replace: true });
      return;
    }
    
    // Redirect admins to admin page if they try to access /event directly
    if (currentGuest?.invitation_type === 'admin' && window.location.pathname === '/event') {
      console.log("Admin trying to access event page directly, redirecting to admin");
      navigate('/admin', { replace: true });
      return;
    }
  }, [currentGuest, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-anniversary-gold rounded-full animate-spin"></div>
    </div>;
  }

  if (!currentGuest) {
    return null;
  }

  // Extract guest information for display
  const guestInfo = {
    id: currentGuest?.id || '',
    name: currentGuest?.first_name || '',
    friday_dinner: currentGuest?.friday_dinner || false,
    sunday_brunch: currentGuest?.sunday_brunch || false,
  };

  // Determine which special sections to show based on RSVP status
  const showFridayDinner = currentGuest?.invitation_type === 'main event';
  const showSundayBrunch = currentGuest?.invitation_type === 'main event';
  
  useEffect(() => {
    console.log("Guest data in EventLayout:", {
      id: guestInfo.id,
      name: guestInfo.name,
      friday_dinner: guestInfo.friday_dinner,
      sunday_brunch: guestInfo.sunday_brunch,
      showFridayDinner,
      showSundayBrunch,
      invitationType: currentGuest.invitation_type
    });
  }, [currentGuest]);

  return (
    <div className="flex flex-col items-center">
      {/* Main content sections based on invitation type */}
      <ContentSections 
        invitationType={currentGuest.invitation_type} 
        fridayDinner={Boolean(currentGuest.friday_dinner)}
        sundayBrunch={Boolean(currentGuest.sunday_brunch)}
      />
      
      <SectionSeparator />
      
      {/* Party members section, if the guest is in a party */}
      {currentGuest.party_id && (
        <>
          <PartyView partyId={currentGuest.party_id} guestId={currentGuest.id} />
          <SectionSeparator />
        </>
      )}
      
      {/* Special event sections */}
      {showFridayDinner && (
        <>
          <FridayDinnerSection />
          <SectionSeparator />
        </>
      )}
      
      {showSundayBrunch && (
        <>
          <SundayBrunchSection />
          <SectionSeparator />
        </>
      )}
      
      {/* Photo gallery */}
      <PhotoGallery />
      
      {/* Show list of confirmed attendees */}
      <SectionSeparator />
      <ConfirmedAttendees />
    </div>
  );
};

export default EventLayout;
