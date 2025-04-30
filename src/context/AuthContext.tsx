
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
    
    try {
      // Find guest by email (case insensitive)
      const { data: guests, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          rsvps(*)
        `)
        .ilike('email', email);
      
      if (error || !guests || guests.length === 0) {
        console.error('Error finding guest:', error || 'No guest found');
        setIsLoading(false);
        return false;
      }
      
      // Get the first guest match
      const guestData = guests[0];
      
      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: guestData.id,
        first_name: guestData.first_name,
        email: guestData.email,
        invitation_type: guestData.invitation_type,
      };
      
      // Add RSVP data if it exists
      if (guestData.rsvps && guestData.rsvps[0]) {
        guest.rsvp = {
          attending: guestData.rsvps[0].attending,
          plus_one: guestData.rsvps[0].plus_one,
          dietary_restrictions: guestData.rsvps[0].dietary_restrictions
        };
      }
      
      setCurrentGuest(guest);
      localStorage.setItem('currentGuest', JSON.stringify(guest));
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
  };

  return (
    <AuthContext.Provider value={{ currentGuest, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
