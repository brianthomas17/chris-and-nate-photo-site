
import { useState } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest, InvitationType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function GuestManagement() {
  const { guests, addGuest, updateGuest, deleteGuest } = useGuests();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [invitationType, setInvitationType] = useState<InvitationType>("evening");
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);

  const resetForm = () => {
    setFirstName("");
    setEmail("");
    setInvitationType("evening");
    setCurrentGuest(null);
  };

  const handleAddGuest = () => {
    addGuest({
      firstName,
      email,
      invitationType,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateGuest = () => {
    if (!currentGuest) return;
    
    updateGuest({
      ...currentGuest,
      firstName,
      email,
      invitationType,
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (guest: Guest) => {
    setCurrentGuest(guest);
    setFirstName(guest.firstName);
    setEmail(guest.email);
    setInvitationType(guest.invitationType);
    setIsEditDialogOpen(true);
  };

  const handleDeleteGuest = (id: string) => {
    if (confirm("Are you sure you want to remove this guest?")) {
      deleteGuest(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Guest List</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>
                Enter the details of the guest you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Guest name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invitationType">Invitation Type</Label>
                <Select
                  value={invitationType}
                  onValueChange={(value) => setInvitationType(value as InvitationType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full day">Full Day</SelectItem>
                    <SelectItem value="evening">Evening Only</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGuest}>Add Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>List of all invited guests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Invitation Type</TableHead>
              <TableHead>RSVP Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.firstName}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell className="capitalize">{guest.invitationType}</TableCell>
                <TableCell>{guest.rsvp ? (guest.rsvp.attending ? "Attending" : "Not Attending") : "Pending"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(guest)}>
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteGuest(guest.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
              <DialogDescription>
                Update the details of this guest.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">Name</Label>
                <Input
                  id="edit-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-invitationType">Invitation Type</Label>
                <Select
                  value={invitationType}
                  onValueChange={(value) => setInvitationType(value as InvitationType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full day">Full Day</SelectItem>
                    <SelectItem value="evening">Evening Only</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGuest}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
