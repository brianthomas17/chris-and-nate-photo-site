
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest, Party } from "@/types";

interface EditGuestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  parties: Party[];
  onUpdateGuest: (guestData: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function EditGuestDialog({
  isOpen,
  onOpenChange,
  guest,
  parties,
  onUpdateGuest,
  isSubmitting
}: EditGuestDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [rsvpAttending, setRsvpAttending] = useState<string | null>(null);
  const [fridayDinner, setFridayDinner] = useState(false);
  const [sundayBrunch, setSundayBrunch] = useState(false);
  const [mainEvent, setMainEvent] = useState(true);
  const [afterparty, setAfterparty] = useState(false);
  const [mainEventRsvp, setMainEventRsvp] = useState(false);
  const [fridayDinnerRsvp, setFridayDinnerRsvp] = useState(false);
  const [sundayBrunchRsvp, setSundayBrunchRsvp] = useState(false);
  const [afterpartyRsvp, setAfterpartyRsvp] = useState(false);

  useEffect(() => {
    if (guest) {
      setFirstName(guest.first_name);
      setLastName(guest.last_name || "");
      setEmail(guest.email || "");
      setPhoneNumber(guest.phone_number || "");
      setAddress(guest.address || "");
      setCity(guest.city || "");
      setState(guest.state || "");
      setZipCode(guest.zip_code || "");
      setPartyId(guest.party_id || null);
      setRsvpAttending(guest.attending);
      setFridayDinner(guest.friday_dinner === true);
      setSundayBrunch(guest.sunday_brunch === true);
      setMainEvent(guest.main_event === true);
      setAfterparty(guest.afterparty === true);
      setMainEventRsvp(guest.main_event_rsvp === true);
      setFridayDinnerRsvp(guest.friday_dinner_rsvp === true);
      setSundayBrunchRsvp(guest.sunday_brunch_rsvp === true);
      setAfterpartyRsvp(guest.afterparty_rsvp === true);
    }
  }, [guest]);

  const handleSubmit = async () => {
    if (!guest || !firstName.trim()) {
      alert("First name is required");
      return;
    }

    await onUpdateGuest({
      ...guest,
      first_name: firstName,
      last_name: lastName || null,
      email: email.trim() || null,
      phone_number: phoneNumber || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      party_id: partyId,
      attending: rsvpAttending,
      friday_dinner: fridayDinner,
      sunday_brunch: sundayBrunch,
      main_event: mainEvent,
      afterparty: afterparty,
      main_event_rsvp: mainEventRsvp,
      friday_dinner_rsvp: fridayDinnerRsvp,
      sunday_brunch_rsvp: sundayBrunchRsvp,
      afterparty_rsvp: afterpartyRsvp
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
          <DialogDescription>
            Update the details of this guest. Only first name is required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">First Name *</Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Last Name</Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email (Optional)</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phoneNumber">Phone Number</Label>
            <Input
              id="edit-phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Input
              id="edit-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-state">State</Label>
              <Input
                id="edit-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-zipCode">ZIP Code</Label>
              <Input
                id="edit-zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-party">Party</Label>
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

          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-3">RSVP Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rsvp-status">RSVP Status</Label>
                <Select
                  value={rsvpAttending || 'pending'}
                  onValueChange={(value) => {
                    if (value === 'pending') {
                      setRsvpAttending(null);
                    } else {
                      setRsvpAttending(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="Yes">Attending</SelectItem>
                    <SelectItem value="No">Not Attending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-3">Event Invitations</h3>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Events this guest is invited to:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={mainEvent} 
                    onCheckedChange={(checked) => setMainEvent(checked === true)}
                  />
                  <Label className="text-sm">Main Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={afterparty} 
                    onCheckedChange={(checked) => setAfterparty(checked === true)}
                  />
                  <Label className="text-sm">Afterparty</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={fridayDinner} 
                    onCheckedChange={(checked) => setFridayDinner(checked === true)}
                  />
                  <Label className="text-sm">Friday Family Dinner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={sundayBrunch} 
                    onCheckedChange={(checked) => setSundayBrunch(checked === true)}
                  />
                  <Label className="text-sm">Sunday Brunch</Label>
                </div>
              </div>
            </div>
          </div>

          {rsvpAttending === "Yes" && (
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-3">Event Attendance</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-main-event-rsvp" 
                    checked={mainEventRsvp} 
                    onCheckedChange={(checked) => setMainEventRsvp(checked === true)}
                  />
                  <Label htmlFor="edit-main-event-rsvp">Main Event</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-friday-dinner-rsvp" 
                    checked={fridayDinnerRsvp} 
                    onCheckedChange={(checked) => setFridayDinnerRsvp(checked === true)}
                  />
                  <Label htmlFor="edit-friday-dinner-rsvp">Friday Family Dinner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-sunday-brunch-rsvp" 
                    checked={sundayBrunchRsvp}
                    onCheckedChange={(checked) => setSundayBrunchRsvp(checked === true)}
                  />
                  <Label htmlFor="edit-sunday-brunch-rsvp">Sunday Brunch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-afterparty-rsvp" 
                    checked={afterpartyRsvp}
                    onCheckedChange={(checked) => setAfterpartyRsvp(checked === true)}
                  />
                  <Label htmlFor="edit-afterparty-rsvp">Afterparty</Label>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !firstName.trim()}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
