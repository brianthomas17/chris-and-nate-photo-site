
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RSVP = () => {
  const { currentGuest } = useAuth();
  
  useEffect(() => {
    console.log("RSVP page accessed");
  }, []);

  // Redirect to main page which will handle auth and showing correct content
  return <Navigate to="/" replace />;
};

export default RSVP;
