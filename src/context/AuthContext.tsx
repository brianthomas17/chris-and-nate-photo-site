
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest } from '../types';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  currentGuest: Guest | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedGuest = localStorage.getItem('currentGuest');
    if (storedGuest) {
      setCurrentGuest(JSON.parse(storedGuest));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    console.log("Attempting to login with email:", email);
    
    try {
      // Find guest by email (case insensitive and trim whitespace)
      const cleanEmail = email.trim().toLowerCase();
      const { data: guests, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          rsvps(*)
        `)
        .ilike('email', cleanEmail);
      
      console.log("Login query result:", { guests, error });
      
      if (error) {
        console.error('Error finding guest:', error);
        setIsLoading(false);
        return false;
      }
      
      if (!guests || guests.length === 0) {
        console.error('No guest found with email:', cleanEmail);
        setIsLoading(false);
        return false;
      }
      
      // Get the first guest match
      const guestData = guests[0];
      console.log("Found guest:", guestData);
      
      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: guestData.id,
        first_name: guestData.first_name,
        email: guestData.email,
        invitation_type: guestData.invitation_type,
      };
      
      // Add RSVP data if it exists
      // Fix: Check if rsvps is an array and has items before accessing by index
      if (guestData.rsvps && Array.isArray(guestData.rsvps) && guestData.rsvps.length > 0) {
        guest.rsvp = {
          attending: guestData.rsvps[0].attending,
          plus_one: guestData.rsvps[0].plus_one,
          dietary_restrictions: guestData.rsvps[0].dietary_restrictions
        };
      }
      
      setCurrentGuest(guest);
      localStorage.setItem('currentGuest', JSON.stringify(guest));
      console.log("Successfully logged in as:", guest.first_name);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentGuest(null);
    localStorage.removeItem('currentGuest');
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ currentGuest, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
