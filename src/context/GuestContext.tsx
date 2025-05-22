import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest, InvitationType, Party } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface GuestContextType {
  guests: Guest[];
  parties: Party[];
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (guest: Guest) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  updateRSVP: (guestId: string, attending: string, fridayDinner?: boolean, sundayBrunch?: boolean) => Promise<any>;
  getGuestByEmail: (email: string) => Promise<Guest | undefined>;
  createParty: (name: string) => Promise<string | undefined>;
  updatePartyMembers: (partyId: string, guestIds: string[]) => Promise<void>;
  getPartyById: (partyId: string) => Promise<Party | undefined>;
  getPartyMembers: (partyId: string) => Promise<Guest[]>;
  fetchGuests: () => Promise<void>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuests = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuests must be used within a GuestProvider');
  }
  return context;
};

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
    fetchParties();
  }, []);

  const fetchGuests = async () => {
    try {
      console.log("Fetching guests from database...");
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name,
          last_name,
          email, 
          phone_number,
          address,
          city,
          state,
          zip_code,
          invitation_type,
          party_id,
          attending,
          friday_dinner,
          sunday_brunch
        `);

      if (error) {
        console.error('Error fetching guests from database:', error);
        toast({
          title: "Error",
          description: "Could not fetch guest list",
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        console.log("Raw guest data from database:", data);
        setGuests(data);
      } else {
        console.log('No guests found in database');
        setGuests([]);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Could not fetch guest list",
        variant: "destructive"
      });
    }
  };

  const fetchParties = async () => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .select('*');

      if (error) {
        console.error('Error fetching parties from database:', error);
        toast({
          title: "Error",
          description: "Could not fetch parties list",
          variant: "destructive"
        });
        return;
      }

      if (data && data.length > 0) {
        setParties(data as Party[]);
      } else {
        console.log('No parties found in database');
        setParties([]);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
      toast({
        title: "Error",
        description: "Could not fetch parties list",
        variant: "destructive"
      });
    }
  };

  const addGuest = async (guest: Omit<Guest, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          first_name: guest.first_name,
          last_name: guest.last_name,
          email: guest.email,
          phone_number: guest.phone_number,
          address: guest.address,
          city: guest.city,
          state: guest.state,
          zip_code: guest.zip_code,
          invitation_type: guest.invitation_type,
          party_id: guest.party_id,
          attending: guest.attending
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data[0]) {
        // Add the new guest to the local state
        setGuests(prevGuests => [...prevGuests, data[0] as Guest]);
      }
      
      toast({
        title: "Guest Added",
        description: `${guest.first_name} has been added to the guest list.`,
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateGuest = async (guest: Guest) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          first_name: guest.first_name,
          last_name: guest.last_name,
          email: guest.email,
          phone_number: guest.phone_number,
          address: guest.address,
          city: guest.city,
          state: guest.state,
          zip_code: guest.zip_code,
          invitation_type: guest.invitation_type,
          party_id: guest.party_id,
          attending: guest.attending,
          friday_dinner: guest.friday_dinner,
          sunday_brunch: guest.sunday_brunch
        })
        .eq('id', guest.id);

      if (error) {
        throw error;
      }

      // Update the local state
      setGuests(prevGuests => 
        prevGuests.map(g => 
          g.id === guest.id ? { ...g, ...guest } : g
        )
      );
      
      toast({
        title: "Guest Updated",
        description: `${guest.first_name}'s information has been updated.`,
      });
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const guestToDelete = guests.find(g => g.id === id);
      
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update the local state
      setGuests(prevGuests => prevGuests.filter(g => g.id !== id));
      
      if (guestToDelete) {
        toast({
          title: "Guest Removed",
          description: `${guestToDelete.first_name} has been removed from the guest list.`,
        });
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateRSVP = async (guestId: string, attending: string, fridayDinner: boolean = false, sundayBrunch: boolean = false) => {
    console.log("updateRSVP called with:", { guestId, attending, fridayDinner, sundayBrunch });
    
    try {
      // Update the attending status directly on the guests table
      const { data, error } = await supabase
        .from('guests')
        .update({
          attending,
          friday_dinner: attending === "Yes" ? fridayDinner : null,
          sunday_brunch: attending === "Yes" ? sundayBrunch : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId)
        .select();
      
      if (error) {
        console.error("Error updating RSVP:", error);
        throw error;
      }

      console.log("RSVP updated successfully:", data);

      // Update the local state
      setGuests(prevGuests => 
        prevGuests.map(g => 
          g.id === guestId 
            ? { 
                ...g, 
                attending,
                friday_dinner: attending === "Yes" ? fridayDinner : null,
                sunday_brunch: attending === "Yes" ? sundayBrunch : null
              } 
            : g
        )
      );
      
      console.log("Local state updated with new RSVP");
      
      // Immediately fetch fresh data from the database to ensure consistency
      await fetchGuests();
      
      return data;
    } catch (error) {
      console.error('Error updating RSVP:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  };

  const getGuestByEmail = async (email: string): Promise<Guest | undefined> => {
    // Skip the check if email is empty or null
    if (!email) {
      return undefined;
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select()
        .eq('email', normalizedEmail)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching guest by email:', error);
        return undefined;
      }
      
      return data as Guest;
    } catch (error) {
      console.error('Error fetching guest by email:', error);
      return undefined;
    }
  };

  const createParty = async (name: string): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .insert({ name })
        .select();

      if (error) {
        console.error('Error creating party:', error);
        toast({
          title: "Error",
          description: "Could not create party",
          variant: "destructive"
        });
        return undefined;
      }

      if (data && data[0]) {
        // Add the new party to local state
        setParties(prev => [...prev, data[0] as Party]);
        toast({
          title: "Party Created",
          description: `${name} party has been created.`,
        });
        return data[0].id;
      }
      return undefined;
    } catch (error) {
      console.error('Error creating party:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return undefined;
    }
  };

  const updatePartyMembers = async (partyId: string, guestIds: string[]) => {
    try {
      // Update all guests with the new party ID
      for (const guestId of guestIds) {
        const { error } = await supabase
          .from('guests')
          .update({ party_id: partyId })
          .eq('id', guestId);

        if (error) {
          throw error;
        }
      }

      // Update local state
      setGuests(prevGuests => 
        prevGuests.map(guest => 
          guestIds.includes(guest.id) 
            ? { ...guest, party_id: partyId } 
            : guest
        )
      );
      
      toast({
        title: "Party Updated",
        description: "Party members have been updated.",
      });
    } catch (error) {
      console.error('Error updating party members:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const getPartyById = async (partyId: string): Promise<Party | undefined> => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .select('*')
        .eq('id', partyId)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching party:', error);
        return undefined;
      }

      return data as Party;
    } catch (error) {
      console.error('Error fetching party:', error);
      return undefined;
    }
  };

  const getPartyMembers = async (partyId: string): Promise<Guest[]> => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select()
        .eq('party_id', partyId);

      if (error) {
        console.error('Error fetching party members:', error);
        return [];
      }

      if (data && data.length > 0) {
        return data as Guest[];
      }
      return [];
    } catch (error) {
      console.error('Error fetching party members:', error);
      return [];
    }
  };

  return (
    <GuestContext.Provider value={{ 
      guests, 
      parties,
      addGuest, 
      updateGuest, 
      deleteGuest,
      updateRSVP,
      getGuestByEmail,
      createParty,
      updatePartyMembers,
      getPartyById,
      getPartyMembers,
      fetchGuests
    }}>
      {children}
    </GuestContext.Provider>
  );
};
