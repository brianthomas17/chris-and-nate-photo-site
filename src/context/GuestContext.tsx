import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest, InvitationType, RSVP, Party } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface GuestContextType {
  guests: Guest[];
  parties: Party[];
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (guest: Guest) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  updateRSVP: (guestId: string, attending: boolean, plus_one: boolean, dietary_restrictions: string) => Promise<void>;
  getGuestByEmail: (email: string) => Promise<Guest | undefined>;
  createParty: (name: string) => Promise<string | undefined>;
  updatePartyMembers: (partyId: string, guestIds: string[]) => Promise<void>;
  getPartyById: (partyId: string) => Promise<Party | undefined>;
  getPartyMembers: (partyId: string) => Promise<Guest[]>;
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
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          party_id,
          rsvps(*)
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
        const transformedGuests: Guest[] = data.map((g: any) => {
          const guest: Guest = {
            id: g.id,
            first_name: g.first_name,
            email: g.email,
            invitation_type: g.invitation_type,
            party_id: g.party_id,
          };
          
          if (g.rsvps && Array.isArray(g.rsvps) && g.rsvps.length > 0) {
            guest.rsvp = {
              attending: g.rsvps[0].attending,
              plus_one: g.rsvps[0].plus_one,
              dietary_restrictions: g.rsvps[0].dietary_restrictions
            };
          }
          
          return guest;
        });

        setGuests(transformedGuests);
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
          email: guest.email,
          invitation_type: guest.invitation_type,
          party_id: guest.party_id
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
          email: guest.email,
          invitation_type: guest.invitation_type,
          party_id: guest.party_id
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

  const updateRSVP = async (guestId: string, attending: boolean, plus_one: boolean, dietary_restrictions: string) => {
    try {
      // Check if RSVP already exists
      const { data: existingRsvp, error: checkError } = await supabase
        .from('rsvps')
        .select()
        .eq('guest_id', guestId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      let error;
      if (existingRsvp) {
        // Update existing RSVP
        const { error: updateError } = await supabase
          .from('rsvps')
          .update({
            attending,
            plus_one: plus_one,
            dietary_restrictions: dietary_restrictions,
            updated_at: new Date().toISOString()
          })
          .eq('guest_id', guestId);
        
        error = updateError;
      } else {
        // Insert new RSVP
        const { error: insertError } = await supabase
          .from('rsvps')
          .insert({
            guest_id: guestId,
            attending,
            plus_one: plus_one,
            dietary_restrictions: dietary_restrictions
          });
        
        error = insertError;
      }

      if (error) {
        throw error;
      }

      // Update the local state
      setGuests(prevGuests => 
        prevGuests.map(g => 
          g.id === guestId 
            ? { 
                ...g, 
                rsvp: { 
                  attending, 
                  plus_one: plus_one, 
                  dietary_restrictions: dietary_restrictions 
                } 
              } 
            : g
        )
      );
      
      // Remove the toast notification from here - we'll handle it in the component
    } catch (error) {
      console.error('Error updating RSVP:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  };

  const getGuestByEmail = async (email: string): Promise<Guest | undefined> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          party_id,
          rsvps(*)
        `)
        .ilike('email', normalizedEmail)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching guest by email:', error);
        return undefined;
      }

      // Transform the data to match our Guest interface
      const guest: Guest = {
        id: data.id,
        first_name: data.first_name,
        email: data.email,
        invitation_type: data.invitation_type,
        party_id: data.party_id,
      };
      
      // Add RSVP data if it exists
      if (data.rsvps && Array.isArray(data.rsvps) && data.rsvps.length > 0) {
        guest.rsvp = {
          attending: data.rsvps[0].attending,
          plus_one: data.rsvps[0].plus_one,
          dietary_restrictions: data.rsvps[0].dietary_restrictions
        };
      }
      
      return guest;
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
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          party_id,
          rsvps(*)
        `)
        .eq('party_id', partyId);

      if (error) {
        console.error('Error fetching party members:', error);
        return [];
      }

      if (data && data.length > 0) {
        return data.map((g: any) => {
          const guest: Guest = {
            id: g.id,
            first_name: g.first_name,
            email: g.email,
            invitation_type: g.invitation_type,
            party_id: g.party_id,
          };
          
          if (g.rsvps && Array.isArray(g.rsvps) && g.rsvps.length > 0) {
            guest.rsvp = {
              attending: g.rsvps[0].attending,
              plus_one: g.rsvps[0].plus_one,
              dietary_restrictions: g.rsvps[0].dietary_restrictions
            };
          }
          
          return guest;
        });
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
      getPartyMembers
    }}>
      {children}
    </GuestContext.Provider>
  );
};
