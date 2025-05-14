
import { useGuests } from "@/context/GuestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    attending: false,
    plusOne: false,
    dietaryRestrictions: "",
  });
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  
  const totalGuests = guests.length;
  const responded = guests.filter(g => g.rsvp).length;
  const attending = guests.filter(g => g.rsvp?.attending).length;
  const notAttending = guests.filter(g => g.rsvp && !g.rsvp.attending).length;
  const pendingResponses = totalGuests - responded;
  const plusOnes = guests.filter(g => g.rsvp?.plus_one).length;
  
  const attendingFullDay = guests.filter(g => g.invitation_type === 'full day' && g.rsvp?.attending).length;
  const attendingEvening = guests.filter(g => g.invitation_type === 'evening' && g.rsvp?.attending).length;
  
  const totalExpectedGuests = attending + plusOnes;

  const handleEdit = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setFormState({
        attending: guest.rsvp?.attending || false,
        plusOne: guest.rsvp?.plus_one || false,
        dietaryRestrictions: guest.rsvp?.dietary_restrictions || "",
      });
      setEditingGuest(guestId);
    }
  };

  const handleCancel = () => {
    setEditingGuest(null);
  };

  const handleSave = async (guestId: string) => {
    await updateRSVP(
      guestId,
      formState.attending,
      formState.plusOne,
      formState.dietaryRestrictions
    );
    setEditingGuest(null);
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
      attending: value === "attending",
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
                          value={formState.attending ? "attending" : "not-attending"} 
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="attending">Attending</SelectItem>
                            <SelectItem value="not-attending">Not Attending</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Checkbox 
                            id={`plus-one-${guest.id}`} 
                            checked={formState.plusOne}
                            onCheckedChange={(checked) => 
                              setFormState({...formState, plusOne: checked === true})
                            }
                          />
                          <label htmlFor={`plus-one-${guest.id}`} className="ml-2">
                            Plus One
                          </label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Textarea 
                          value={formState.dietaryRestrictions} 
                          onChange={(e) => 
                            setFormState({...formState, dietaryRestrictions: e.target.value})
                          }
                          placeholder="Dietary restrictions"
                          className="h-20 resize-none"
                        />
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
                        {guest.rsvp?.plus_one ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {guest.rsvp?.dietary_restrictions || "None"}
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
