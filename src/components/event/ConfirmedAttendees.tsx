
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConfirmedAttendees() {
  const [attendees, setAttendees] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchConfirmedAttendees() {
      try {
        setIsLoading(true);
        
        // Fetch guests who have RSVP'd yes and have first and last name
        const { data, error } = await supabase
          .from('guests')
          .select('first_name, last_name')
          .eq('attending', 'Yes')
          .not('last_name', 'is', null)
          .not('first_name', 'is', null)
          .order('last_name', { ascending: true });
        
        if (error) {
          console.error("Error fetching confirmed attendees:", error);
          setError("Unable to load confirmed attendees");
          return;
        }
        
        setAttendees(data as Guest[]);
      } catch (err) {
        console.error("Error in fetchConfirmedAttendees:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConfirmedAttendees();
  }, []);
  
  if (error) {
    return <div className="text-center text-white opacity-70">{error}</div>;
  }
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-[600px] mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full bg-anniversary-gold/20" />
          ))}
        </div>
      </div>
    );
  }
  
  if (attendees.length === 0) {
    return <div className="text-center text-white opacity-70">No confirmed attendees yet.</div>;
  }
  
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-x-6 md:gap-y-3 max-w-[600px] mx-auto">
      {attendees.map((guest, index) => (
        <div 
          key={index} 
          className="text-white text-xs md:text-sm font-bicyclette text-center uppercase"
        >
          {guest.first_name} {guest.last_name}
        </div>
      ))}
    </div>
  );
}
