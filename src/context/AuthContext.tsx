
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
      try {
        setCurrentGuest(JSON.parse(storedGuest));
      } catch (error) {
        console.error("Error parsing stored guest:", error);
        localStorage.removeItem('currentGuest');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!email) {
        console.error("No email provided for login");
        setIsLoading(false);
        return false;
      }
      
      // Clean and normalize email for searching
      const cleanEmail = email.trim().toLowerCase();
      console.log("Attempting login with normalized email:", cleanEmail);
      
      // First approach: Try direct query
      console.log("Attempting direct email query...");
      let { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type
        `)
        .eq('email', cleanEmail)
        .single();
      
      // If direct query fails, try case-insensitive search
      if (guestError || !guestData) {
        console.log("Direct query failed, trying case-insensitive search...");
        const { data: guests, error } = await supabase
          .from('guests')
          .select(`
            id, 
            first_name, 
            email, 
            invitation_type
          `)
          .ilike('email', cleanEmail);
        
        console.log("Case-insensitive search result:", { guests, error });
        
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
        
        guestData = guests[0];
      }
      
      console.log("Found guest data:", guestData);
      
      // Get RSVP data in a separate query
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .eq('guest_id', guestData.id)
        .maybeSingle();
      
      console.log("RSVP query result:", { rsvpData, rsvpError });
      
      // Construct the guest object
      const guest: Guest = {
        id: guestData.id,
        first_name: guestData.first_name,
        email: guestData.email,
        invitation_type: guestData.invitation_type,
      };
      
      // Add RSVP data if available
      if (rsvpData) {
        guest.rsvp = {
          attending: rsvpData.attending,
          plus_one: rsvpData.plus_one,
          dietary_restrictions: rsvpData.dietary_restrictions
        };
      }
      
      console.log("Successfully constructed guest object:", guest);
      
      setCurrentGuest(guest);
      localStorage.setItem('currentGuest', JSON.stringify(guest));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Unexpected error during login:', error);
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
