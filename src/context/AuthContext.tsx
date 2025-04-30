
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
        .ilike('email', email)
        .limit(1)
        .single();
      
      if (error || !guests) {
        console.error('Error finding guest:', error);
        setIsLoading(false);
        return false;
      }
      
      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: guests.id,
        first_name: guests.first_name,
        email: guests.email,
        invitation_type: guests.invitation_type,
      };
      
      // Add RSVP data if it exists
      if (guests.rsvps) {
        guest.rsvp = {
          attending: guests.rsvps.attending,
          plus_one: guests.rsvps.plus_one,
          dietary_restrictions: guests.rsvps.dietary_restrictions
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
