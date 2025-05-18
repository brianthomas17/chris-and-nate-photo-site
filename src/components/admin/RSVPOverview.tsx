
import { useGuests } from "@/context/GuestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RSVPOverview() {
  const { guests, updateRSVP, deleteGuest } = useGuests();
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    attending: "No"
  });
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  
  // Calculate statistics
  const totalGuests = guests.length;
  const responded = guests.filter(g => g.attending !== null).length;
  const attending = guests.filter(g => g.attending === 'Yes').length;
  const notAttending = guests.filter(g => g.attending === 'No').length;
  const pendingResponses = totalGuests - responded;
  
  const attendingFullDay = guests.filter(g => g.invitation_type === 'main event' && g.attending === 'Yes').length;
  const attendingEvening = guests.filter(g => g.invitation_type === 'afterparty' && g.attending === 'Yes').length;
  
  const totalExpectedGuests = attending;

  // Log RSVP data for debugging
  useEffect(() => {
    console.log("RSVPOverview - Current guest data:", guests);
    console.log("RSVPOverview - RSVP stats:", {
      totalGuests,
      responded,
      attending,
      notAttending,
      pendingResponses
    });
  }, [guests]);

  const handleEdit = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setFormState({
        attending: guest.attending || "No"
      });
      setEditingGuest(guestId);
    }
  };

  const handleCancel = () => {
    setEditingGuest(null);
  };

  const handleSave = async (guestId: string) => {
    try {
      await updateRSVP(
        guestId,
        formState.attending
      );
      setEditingGuest(null);
      toast({
        title: "RSVP Updated",
        description: "The guest's RSVP status has been updated."
      });
    } catch (error) {
      console.error("Error updating RSVP:", error);
      toast({
        title: "Error",
        description: "Failed to update RSVP status.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (guestId: string) => {
    setGuestToDelete(guestId);
  };

  const handleConfirmDelete = async () => {
    if (guestToDelete) {
      await deleteGuest(guestToDelete);
      setGuestToDelete(null);
      toast({
        title: "Guest Deleted",
        description: "The guest has been removed from the system.",
      });
    }
  };

  const handleCancelDelete = () => {
    setGuestToDelete(null);
  };

  const handleStatusChange = (value: string) => {
    setFormState({
      ...formState,
      attending: value,
    });
  };

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
            <CardDescription>Total confirmed guests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalExpectedGuests}</div>
            <p className="text-sm text-muted-foreground">{attending} attending, {notAttending} not attending</p>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>{guest.first_name}</TableCell>
                  <TableCell className="font-mono text-xs">{guest.email}</TableCell>
                  <TableCell className="capitalize">{guest.invitation_type}</TableCell>
                  
                  {editingGuest === guest.id ? (
                    <>
                      <TableCell>
                        <Select 
                          value={formState.attending} 
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Attending</SelectItem>
                            <SelectItem value="No">Not Attending</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancel}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSave(guest.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {guest.attending === null ? (
                          <Badge variant="outline">Pending</Badge>
                        ) : guest.attending === 'Yes' ? (
                          <Badge className="bg-green-500">Attending</Badge>
                        ) : (
                          <Badge variant="destructive">Not Attending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(guest.id)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(guest.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guest 
              and all associated RSVP information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
