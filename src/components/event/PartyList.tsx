
import { useState, useEffect } from 'react';
import { Guest } from '@/types';
import { useGuests } from '@/context/GuestContext';
import PartyMemberCard from './PartyMemberCard';

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
      <div className="max-w-2xl mx-auto">
        <div className="p-8 flex justify-center items-center">
          <div className="w-8 h-8 border-t-4 border-anniversary-gold rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!partyId || partyMembers.length === 0) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mb-24">
      <div className="px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-din text-anniversary-gold text-center mb-6 md:mb-8">
          YOUR PARTY
        </h2>
        <p className="text-center text-gray-300 mb-6">
          {partyMembers.length > 1 
            ? `You have ${partyMembers.length} guests in your party` 
            : "You are the only guest in your party"}
        </p>
        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          {partyMembers.map(guest => (
            <PartyMemberCard
              key={guest.id}
              guest={guest}
              currentUserId={guestId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
