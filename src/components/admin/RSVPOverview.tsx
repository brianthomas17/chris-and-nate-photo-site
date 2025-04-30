
import { useGuests } from "@/context/GuestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RSVPOverview() {
  const { guests } = useGuests();
  
  const totalGuests = guests.length;
  const responded = guests.filter(g => g.rsvp).length;
  const attending = guests.filter(g => g.rsvp?.attending).length;
  const notAttending = guests.filter(g => g.rsvp && !g.rsvp.attending).length;
  const pendingResponses = totalGuests - responded;
  const plusOnes = guests.filter(g => g.rsvp?.plusOne).length;
  
  const attendingFullDay = guests.filter(g => g.invitationType === 'full day' && g.rsvp?.attending).length;
  const attendingEvening = guests.filter(g => g.invitationType === 'evening' && g.rsvp?.attending).length;
  
  const totalExpectedGuests = attending + plusOnes;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total RSVPs</CardTitle>
            <CardDescription>Guest response summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{responded}/{totalGuests}</div>
            <p className="text-sm text-muted-foreground">{pendingResponses} pending responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expected Attendance</CardTitle>
            <CardDescription>Including plus ones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalExpectedGuests}</div>
            <p className="text-sm text-muted-foreground">{attending} guests + {plusOnes} plus ones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance by Event</CardTitle>
            <CardDescription>Daytime vs Evening event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day: {attendingFullDay}</div>
            <div className="text-2xl font-bold">Evening: {attendingFullDay + attendingEvening}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RSVP Details</CardTitle>
          <CardDescription>Complete list of guest responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>All guest RSVP information.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Invitation Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead>Dietary Restrictions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.firstName}</TableCell>
                  <TableCell className="font-mono text-xs">{guest.email}</TableCell>
                  <TableCell className="capitalize">{guest.invitationType}</TableCell>
                  <TableCell>
                    {guest.rsvp ? (
                      guest.rsvp.attending ? (
                        <Badge className="bg-green-500">Attending</Badge>
                      ) : (
                        <Badge variant="destructive">Not Attending</Badge>
                      )
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.rsvp?.plusOne ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {guest.rsvp?.dietaryRestrictions || "None"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
