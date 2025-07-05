
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
import { InvitationType, Party } from "@/types";

interface AddGuestDialogProps {
  parties: Party[];
  onAddGuest: (guestData: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddGuestDialog({ parties, onAddGuest, isSubmitting }: AddGuestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [invitationType, setInvitationType] = useState<InvitationType>("main event");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [rsvpAttending, setRsvpAttending] = useState<string | null>(null);
  const [fridayDinner, setFridayDinner] = useState(false);
  const [sundayBrunch, setSundayBrunch] = useState(false);
  const [mainEvent, setMainEvent] = useState(true);
  const [afterparty, setAfterparty] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setInvitationType("main event");
    setPartyId(null);
    setRsvpAttending(null);
    setFridayDinner(false);
    setSundayBrunch(false);
    setMainEvent(true);
    setAfterparty(false);
  };

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      alert("First name is required");
      return;
    }

    await onAddGuest({
      first_name: firstName,
      last_name: lastName || null,
      email: email.trim() || null,
      phone_number: phoneNumber || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      invitation_type: invitationType,
      party_id: partyId,
      attending: rsvpAttending,
      friday_dinner: fridayDinner,
      sunday_brunch: sundayBrunch,
      main_event: mainEvent,
      afterparty: afterparty
    });

    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>
            Enter the details of the guest you want to add. Only first name is required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
              />
            </div>
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
                <SelectItem value="main event">Main Event</SelectItem>
                <SelectItem value="afterparty">Afterparty</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="party">Party (Optional)</Label>
            <Select
              value={partyId || undefined}
              onValueChange={setPartyId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {parties.map(party => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 border-t pt-3">
            <h4 className="font-medium">Event Access</h4>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="add-main-event" 
                checked={mainEvent} 
                onCheckedChange={(checked) => setMainEvent(checked === true)}
              />
              <Label htmlFor="add-main-event">Main Event</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="add-afterparty" 
                checked={afterparty}
                onCheckedChange={(checked) => setAfterparty(checked === true)}
              />
              <Label htmlFor="add-afterparty">Afterparty</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="add-friday-dinner" 
                checked={fridayDinner} 
                onCheckedChange={(checked) => setFridayDinner(checked === true)}
              />
              <Label htmlFor="add-friday-dinner">Friday Family Dinner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="add-sunday-brunch" 
                checked={sundayBrunch}
                onCheckedChange={(checked) => setSundayBrunch(checked === true)}
              />
              <Label htmlFor="add-sunday-brunch">Sunday Brunch</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvpStatus">RSVP Status (Optional)</Label>
            <Select
              value={rsvpAttending || undefined}
              onValueChange={(value) => {
                if (value === "Yes" || value === "No") {
                  setRsvpAttending(value);
                } else {
                  setRsvpAttending(null);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select RSVP status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Attending</SelectItem>
                <SelectItem value="No">Not Attending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rsvpAttending === "Yes" && (
            <div className="space-y-3 border-t pt-3">
              <h4 className="font-medium">Additional Events</h4>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="add-friday-dinner-rsvp" 
                  checked={fridayDinner} 
                  onCheckedChange={(checked) => setFridayDinner(checked === true)}
                />
                <Label htmlFor="add-friday-dinner-rsvp">Friday Family Dinner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="add-sunday-brunch-rsvp" 
                  checked={sundayBrunch}
                  onCheckedChange={(checked) => setSundayBrunch(checked === true)}
                />
                <Label htmlFor="add-sunday-brunch-rsvp">Sunday Brunch</Label>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !firstName.trim()}>
            {isSubmitting ? "Adding..." : "Add Guest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
