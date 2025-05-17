
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
  
  if (currentGuest) {
    console.log("Redirecting logged-in user to event page");
  }
  
  // Redirect to main page which will handle auth and showing correct content
  return <Navigate to="/" replace />;
};

export default RSVP;
