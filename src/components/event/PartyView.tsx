
import React, { useEffect, useState } from 'react';
import { useGuests } from '@/context/GuestContext';
import { Guest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PartyViewProps {
  guestId: string;
  partyId: string | null | undefined;
}

export default function PartyView({ guestId, partyId }: PartyViewProps) {
  const { getPartyMembers, getPartyById } = useGuests();
  const [partyMembers, setPartyMembers] = useState<Guest[]>([]);
  const [partyName, setPartyName] = useState<string>('Your Party');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartyData = async () => {
      if (!partyId) {
        setLoading(false);
        return;
      }

      try {
        const [members, party] = await Promise.all([
          getPartyMembers(partyId),
          getPartyById(partyId)
        ]);

        setPartyMembers(members.filter(member => member.id !== guestId));
        
        if (party) {
          setPartyName(party.name);
        }
      } catch (error) {
        console.error('Error fetching party data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyData();
  }, [partyId, guestId, getPartyMembers, getPartyById]);

  if (!partyId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You're not in a party</CardTitle>
          <CardDescription>
            You're not currently assigned to a party. If you're attending with others,
            please contact the host to be added to a party.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getRsvpStatusBadge = (guest: Guest) => {
    if (guest.attending === null) {
      return <Badge variant="outline">Pending</Badge>;
    }
    
    return guest.attending ? 
      <Badge className="bg-green-500">Attending</Badge> : 
      <Badge variant="destructive">Not Attending</Badge>;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{partyName}</CardTitle>
        <CardDescription>
          Party members and their RSVP status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : partyMembers.length === 0 ? (
          <p className="text-muted-foreground">You're the only one in this party.</p>
        ) : (
          <ul className="space-y-3">
            {partyMembers.map((member) => (
              <li key={member.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{member.first_name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                {getRsvpStatusBadge(member)}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
