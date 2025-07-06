
import { Guest } from "@/types";
import StatsCard from "./StatsCard";

interface GuestStatsProps {
  guests: Guest[];
}

export default function GuestStats({ guests }: GuestStatsProps) {
  // Calculate RSVP statistics
  const totalInvites = guests.length;
  const attendingGuests = guests.filter(guest => guest.attending === "Yes").length;
  const pendingGuests = guests.filter(guest => guest.attending === null).length;
  const notAttendingGuests = guests.filter(guest => guest.attending === "No").length;
  
  // Calculate Friday invites (guests who were invited to Friday dinner)
  const fridayInvites = guests.filter(guest => guest.friday_dinner === true).length;

  // Calculate event attendance statistics
  const mainEventAttending = guests.filter(guest => guest.main_event_rsvp === true).length;
  const fridayDinnerAttending = guests.filter(guest => guest.friday_dinner_rsvp === true).length;
  const brunchAttending = guests.filter(guest => guest.sunday_brunch_rsvp === true).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <StatsCard 
        title="Total Invites" 
        value={totalInvites} 
        className="bg-blue-50 border-blue-200"
      />
      <StatsCard 
        title="Attending" 
        value={attendingGuests} 
        className="bg-green-50 border-green-200"
      />
      <StatsCard 
        title="Pending" 
        value={pendingGuests} 
        className="bg-yellow-50 border-yellow-200"
      />
      <StatsCard 
        title="Not Attending" 
        value={notAttendingGuests} 
        className="bg-red-50 border-red-200"
      />
      <StatsCard 
        title="Friday Invites" 
        value={fridayInvites} 
        className="bg-orange-50 border-orange-200"
      />
      <StatsCard 
        title="Main Event" 
        value={mainEventAttending} 
        className="bg-purple-50 border-purple-200"
      />
      <StatsCard 
        title="Friday Dinner" 
        value={fridayDinnerAttending} 
        className="bg-indigo-50 border-indigo-200"
      />
      <StatsCard 
        title="Sunday Brunch" 
        value={brunchAttending} 
        className="bg-pink-50 border-pink-200"
      />
    </div>
  );
}
