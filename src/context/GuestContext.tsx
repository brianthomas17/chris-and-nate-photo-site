
import React, { createContext, useContext, useState } from 'react';
import { Guest, InvitationType } from '../types';
import { useToast } from '@/hooks/use-toast';

interface GuestContextType {
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (guest: Guest) => void;
  deleteGuest: (id: string) => void;
  updateRSVP: (guestId: string, attending: boolean, plusOne: boolean, dietaryRestrictions?: string) => void;
  getGuestByEmail: (email: string) => Guest | undefined;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuests = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider');
  }
  return context;
};

// Mock guest data - in a real app, this would come from a database
const INITIAL_GUESTS: Guest[] = [
  {
    id: '1',
    firstName: 'John',
    email: 'john@example.com',
    invitationType: 'full day',
    rsvp: {
      attending: true,
      plusOne: false,
      dietaryRestrictions: 'None'
    }
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

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const { toast } = useToast();

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    const newGuest = {
      ...guest,
      id: Date.now().toString()
    };
    setGuests(prev => [...prev, newGuest]);
    toast({
      title: "Guest Added",
      description: `${guest.firstName} has been added to the guest list.`,
    });
  };

  const updateGuest = (guest: Guest) => {
    setGuests(prev => 
      prev.map(g => g.id === guest.id ? guest : g)
    );
    toast({
      title: "Guest Updated",
      description: `${guest.firstName}'s information has been updated.`,
    });
  };

  const deleteGuest = (id: string) => {
    const guestToDelete = guests.find(g => g.id === id);
    setGuests(prev => prev.filter(g => g.id !== id));
    if (guestToDelete) {
      toast({
        title: "Guest Removed",
        description: `${guestToDelete.firstName} has been removed from the guest list.`,
      });
    }
  };

  const updateRSVP = (guestId: string, attending: boolean, plusOne: boolean, dietaryRestrictions?: string) => {
    setGuests(prev => 
      prev.map(g => g.id === guestId ? {
        ...g,
        rsvp: {
          attending,
          plusOne,
          dietaryRestrictions
        }
      } : g)
    );
    
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      toast({
        title: "RSVP Updated",
        description: `Thank you, ${guest.firstName}! Your RSVP has been recorded.`,
      });
    }
  };

  const getGuestByEmail = (email: string) => {
    return guests.find(g => g.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <GuestContext.Provider value={{ 
      guests, 
      addGuest, 
      updateGuest, 
      deleteGuest,
      updateRSVP,
      getGuestByEmail
    }}>
      {children}
    </GuestContext.Provider>
  );
};
