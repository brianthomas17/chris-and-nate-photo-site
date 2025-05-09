
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RSVP = () => {
  const { currentGuest, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("RSVP page accessed");
    
    // If auth is loaded and user is not logged in, redirect to home
    if (!isLoading && !currentGuest) {
      navigate('/', { replace: true });
    }
  }, [currentGuest, isLoading, navigate]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }
  
  // Redirect to main page which will handle auth and showing correct content
  return <Navigate to="/" replace />;
};

export default RSVP;
