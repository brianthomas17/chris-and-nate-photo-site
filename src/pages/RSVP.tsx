
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RSVPForm from "@/components/event/RSVPForm";

const RSVP = () => {
  const { currentGuest, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("RSVP page accessed, currentGuest:", currentGuest, "isLoading:", isLoading);
    
    // If auth is loaded and user is not logged in, redirect to home
    if (!isLoading && !currentGuest) {
      console.log("No current guest, navigating to home page");
      navigate('/', { replace: true });
    }
  }, [currentGuest, isLoading, navigate]);

  // Show nothing while loading
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-white text-lg">Loading...</p>
    </div>;
  }
  
  // If user is authenticated, show the RSVP form
  if (currentGuest) {
    console.log("Rendering RSVP form for guest:", currentGuest);
    return (
      <div className="container mx-auto py-10">
        <RSVPForm guest={currentGuest} />
      </div>
    );
  }
  
  // Redirect to main page which will handle auth and showing correct content
  return <Navigate to="/" replace />;
};

export default RSVP;
