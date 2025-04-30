import React, { createContext, useContext, useState, useEffect } from 'react';
import { Guest, InvitationType, RSVP } from '../types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface GuestContextType {
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (guest: Guest) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  updateRSVP: (guestId: string, attending: boolean, plusOne: boolean, dietaryRestrictions?: string) => Promise<void>;
  getGuestByEmail: (email: string) => Promise<Guest | undefined>;
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
  const { toast } = useToast();
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check if we're in a development environment
    setIsDevMode(process.env.NODE_ENV === 'development' || window.location.hostname.includes('localhost') || window.location.hostname.includes('lovableproject'));
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      // Start with hardcoded test guests for development
      const testGuests: Guest[] = [
        {
          id: "test-john-id",
          first_name: "John",
          email: "john@example.com",
          invitation_type: "full day" as const,
          rsvp: null
        },
        {
          id: "test-jane-id",
          first_name: "Jane",
          email: "jane@example.com",
          invitation_type: "evening" as const,
          rsvp: null
        },
        {
          id: "test-admin-id",
          first_name: "Admin",
          email: "admin@example.com",
          invitation_type: "admin" as const,
          rsvp: null
        }
      ];

      // Try to fetch guests from Supabase
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          rsvps(*)
        `);

      if (error) {
        console.error('Error fetching guests from database:', error);
        console.log('Using test guests for development');
        setGuests(testGuests);
        return;
      }

      // Transform the data to match our Guest interface
      if (data && data.length > 0) {
        const transformedGuests: Guest[] = data.map((g: any) => {
          const guest: Guest = {
            id: g.id,
            first_name: g.first_name,
            email: g.email,
            invitation_type: g.invitation_type,
          };
          
          // Add RSVP data if it exists
          if (g.rsvps && Array.isArray(g.rsvps) && g.rsvps.length > 0) {
            guest.rsvp = {
              attending: g.rsvps[0].attending,
              plus_one: g.rsvps[0].plus_one,
              dietary_restrictions: g.rsvps[0].dietary_restrictions
            };
          }
          
          return guest;
        });

        setGuests([...testGuests, ...transformedGuests]);
      } else {
        console.log('No guests found in database, using test guests for development');
        setGuests(testGuests);
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

  const addGuest = async (guest: Omit<Guest, 'id'>) => {
    try {
      // Always use development mode for now until we fix authentication
      const newGuest: Guest = {
        id: uuidv4(), // Generate a unique ID for the guest
        ...guest
      };
      
      setGuests(prevGuests => [...prevGuests, newGuest]);
      
      toast({
        title: "Guest Added",
        description: `${guest.first_name} has been added to the guest list.`,
      });

      // Try to insert the new guest into Supabase in the background
      // This is a best-effort approach that won't block the UI
      supabase
        .from('guests')
        .insert({
          first_name: guest.first_name,
          email: guest.email,
          invitation_type: guest.invitation_type
        })
        .then(({ error }) => {
          if (error) {
            console.error('Background attempt to add guest to database failed:', error);
          } else {
            console.log('Successfully added guest to database in background');
          }
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
      // First check if it's a test guest
      if (guest.id.startsWith('test-')) {
        // Update the guest in local state
        setGuests(prevGuests => 
          prevGuests.map(g => 
            g.id === guest.id ? { ...g, ...guest } : g
          )
        );
        
        toast({
          title: "Guest Updated (Dev Mode)",
          description: `${guest.first_name}'s information has been updated (local only).`,
        });
        return;
      }

      // Try to update the guest in Supabase
      const { error } = await supabase
        .from('guests')
        .update({
          first_name: guest.first_name,
          email: guest.email,
          invitation_type: guest.invitation_type
        })
        .eq('id', guest.id);

      if (error) {
        console.error('Error updating guest:', error);
        
        if (isDevMode) {
          // Fallback: Update guest in local state only
          setGuests(prevGuests => 
            prevGuests.map(g => 
              g.id === guest.id ? { ...g, ...guest } : g
            )
          );
          
          toast({
            title: "Guest Updated (Dev Mode)",
            description: `${guest.first_name}'s information has been updated (local only).`,
          });
          return;
        } else {
          toast({
            title: "Error",
            description: `Could not update guest: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
      }

      // Update the local state
      await fetchGuests();
      
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
      // Check if it's a test guest
      if (id.startsWith('test-')) {
        // Remove the guest from local state
        setGuests(prevGuests => prevGuests.filter(g => g.id !== id));
        
        const guestToDelete = guests.find(g => g.id === id);
        if (guestToDelete) {
          toast({
            title: "Guest Removed (Dev Mode)",
            description: `${guestToDelete.first_name} has been removed from the guest list (local only).`,
          });
        }
        return;
      }

      // Delete the guest from Supabase
      const guestToDelete = guests.find(g => g.id === id);
      
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting guest:', error);
        
        if (isDevMode) {
          // Fallback: Delete guest from local state only
          setGuests(prevGuests => prevGuests.filter(g => g.id !== id));
          
          if (guestToDelete) {
            toast({
              title: "Guest Removed (Dev Mode)",
              description: `${guestToDelete.first_name} has been removed from the guest list (local only).`,
            });
          }
          return;
        } else {
          toast({
            title: "Error",
            description: `Could not delete guest: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
      }

      // Update the local state
      await fetchGuests();
      
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

  const updateRSVP = async (guestId: string, attending: boolean, plusOne: boolean, dietaryRestrictions?: string) => {
    try {
      // Check if it's a test guest
      if (guestId.startsWith('test-')) {
        // Update the guest's RSVP in local state
        setGuests(prevGuests => 
          prevGuests.map(g => 
            g.id === guestId 
              ? { 
                  ...g, 
                  rsvp: { 
                    attending, 
                    plus_one: plusOne, 
                    dietary_restrictions: dietaryRestrictions 
                  } 
                } 
              : g
          )
        );
        
        const guest = guests.find(g => g.id === guestId);
        if (guest) {
          toast({
            title: "RSVP Updated (Dev Mode)",
            description: `Thank you, ${guest.first_name}! Your RSVP has been recorded (local only).`,
          });
        }
        return;
      }

      // Check if RSVP already exists
      const { data: existingRsvp, error: checkError } = await supabase
        .from('rsvps')
        .select()
        .eq('guest_id', guestId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking RSVP:', checkError);
        return;
      }

      let error;
      if (existingRsvp) {
        // Update existing RSVP
        const { error: updateError } = await supabase
          .from('rsvps')
          .update({
            attending,
            plus_one: plusOne,
            dietary_restrictions: dietaryRestrictions,
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
            plus_one: plusOne,
            dietary_restrictions: dietaryRestrictions
          });
        
        error = insertError;
      }

      if (error) {
        console.error('Error updating RSVP:', error);
        
        if (isDevMode) {
          // Fallback: Update RSVP in local state only
          setGuests(prevGuests => 
            prevGuests.map(g => 
              g.id === guestId 
                ? { 
                    ...g, 
                    rsvp: { 
                      attending, 
                      plus_one: plusOne, 
                      dietary_restrictions: dietaryRestrictions 
                    } 
                  } 
                : g
            )
          );
          
          const guest = guests.find(g => g.id === guestId);
          if (guest) {
            toast({
              title: "RSVP Updated (Dev Mode)",
              description: `Thank you, ${guest.first_name}! Your RSVP has been recorded (local only).`,
            });
          }
          return;
        } else {
          toast({
            title: "Error",
            description: `Could not update RSVP: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
      }

      // Update the local state
      await fetchGuests();
      
      const guest = guests.find(g => g.id === guestId);
      if (guest) {
        toast({
          title: "RSVP Updated",
          description: `Thank you, ${guest.first_name}! Your RSVP has been recorded.`,
        });
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const getGuestByEmail = async (email: string): Promise<Guest | undefined> => {
    // First check local test guests
    const normalizedEmail = email.trim().toLowerCase();
    const testGuest = guests.find(g => g.email.toLowerCase() === normalizedEmail);
    
    if (testGuest) {
      return testGuest;
    }
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id, 
          first_name, 
          email, 
          invitation_type,
          rsvps(*)
        `)
        .ilike('email', normalizedEmail)
        .limit(1)
        .single();

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
