
import { useState, useEffect } from 'react';
import { Guest } from '@/types';
import { useGuests } from '@/context/GuestContext';
import PartyMemberCard from './PartyMemberCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PartyListProps {
  guestId: string;
  partyId: string | null;
}

export default function PartyList({ guestId, partyId }: PartyListProps) {
  const [partyMembers, setPartyMembers] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getPartyMembers } = useGuests();

  useEffect(() => {
    async function fetchPartyMembers() {
      if (!partyId) {
        setPartyMembers([]);
        setIsLoading(false);
        return;
      }

      try {
        const members = await getPartyMembers(partyId);
        console.log("Fetched party members:", members);
        setPartyMembers(members);
      } catch (error) {
        console.error("Error fetching party members:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPartyMembers();
  }, [partyId, getPartyMembers]);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-white/10 border border-anniversary-gold/30 shadow-lg">
        <CardContent className="p-8 flex justify-center items-center">
          <div className="w-8 h-8 border-t-4 border-anniversary-gold rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (!partyId || partyMembers.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-sm bg-white/10 border border-anniversary-gold/30 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center text-anniversary-gold font-din">
          YOUR PARTY
        </CardTitle>
        <CardDescription className="text-center text-gray-300">
          {partyMembers.length > 1 
            ? `You have ${partyMembers.length} guests in your party` 
            : "You are the only guest in your party"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {partyMembers.map(guest => (
            <PartyMemberCard
              key={guest.id}
              guest={guest}
              currentUserId={guestId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
