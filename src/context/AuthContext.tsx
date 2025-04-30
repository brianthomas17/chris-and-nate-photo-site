
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest } from '../types';

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

// Mock guest list - in a real app, this would come from a database
const MOCK_GUESTS: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    email: 'john@example.com',
    invitationType: 'full day',
  },
  {
    id: '2',
    firstName: 'Jane',
    email: 'jane@example.com',
    invitationType: 'evening',
  },
  {
    id: '3',
    firstName: 'Admin',
    email: 'admin@example.com',
    invitationType: 'admin',
  },
];

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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find guest by email (case insensitive)
    const guest = MOCK_GUESTS.find(g => g.email.toLowerCase() === email.toLowerCase());
    
    if (guest) {
      setCurrentGuest(guest);
      localStorage.setItem('currentGuest', JSON.stringify(guest));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
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
