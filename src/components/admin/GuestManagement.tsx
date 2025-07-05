import { useState } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest, InvitationType, Party } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, User, Users, Search, ArrowUpAZ, ArrowDownAZ, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type SortField = 'first_name' | 'last_name' | 'email';
type SortDirection = 'asc' | 'desc';

interface EventFilters {
  mainEvent: boolean | null;
  afterparty: boolean | null;
  fridayDinner: boolean | null;
  sundayBrunch: boolean | null;
}

export default function GuestManagement() {
  const { guests, parties, addGuest, updateGuest, deleteGuest, createParty, updatePartyMembers, updateRSVP } = useGuests();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPartyDialogOpen, setIsPartyDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [invitationType, setInvitationType] = useState<InvitationType>("main event");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [rsvpAttending, setRsvpAttending] = useState<string | null>(null);
  const [fridayDinner, setFridayDinner] = useState<boolean>(false);
  const [sundayBrunch, setSundayBrunch] = useState<boolean>(false);
  const [mainEvent, setMainEvent] = useState<boolean>(true);
  const [afterparty, setAfterparty] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Add RSVP state variables for the edit modal
  const [mainEventRsvp, setMainEventRsvp] = useState<boolean>(false);
  const [fridayDinnerRsvp, setFridayDinnerRsvp] = useState<boolean>(false);
  const [sundayBrunchRsvp, setSundayBrunchRsvp] = useState<boolean>(false);
  const [afterpartyRsvp, setAfterpartyRsvp] = useState<boolean>(false);

  // Add sorting state
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Add filter state
  const [showFilters, setShowFilters] = useState(false);
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    mainEvent: null,
    afterparty: null,
    fridayDinner: null,
    sundayBrunch: null
  });

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
    setCurrentGuest(null);
    setNewPartyName("");
    setSelectedGuests([]);
    setSelectedParty(null);
    setRsvpAttending(null);
    setFridayDinner(false);
    setSundayBrunch(false);
    setMainEvent(true);
    setAfterparty(false);
    setMainEventRsvp(false);
    setFridayDinnerRsvp(false);
    setSundayBrunchRsvp(false);
    setAfterpartyRsvp(false);
  };

  const handleAddGuest = async () => {
    setIsSubmitting(true);

    // Validate that at least first name is provided
    if (!firstName.trim()) {
      alert("First name is required");
      setIsSubmitting(false);
      return;
    }

    await addGuest({
      first_name: firstName,
      last_name: lastName || null,
      email: email.trim() || null, // Use null if email is empty
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

    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleUpdateGuest = async () => {
    if (!currentGuest) return;

    // Validate that at least first name is provided
    if (!firstName.trim()) {
      alert("First name is required");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    await updateGuest({
      ...currentGuest,
      first_name: firstName,
      last_name: lastName || null,
      email: email.trim() || null, // Use null if email is empty
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
      afterparty: afterparty,
      main_event_rsvp: mainEventRsvp,
      friday_dinner_rsvp: fridayDinnerRsvp,
      sunday_brunch_rsvp: sundayBrunchRsvp,
      afterparty_rsvp: afterpartyRsvp
    });

    setIsSubmitting(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEditClick = (guest: Guest) => {
    console.log("Editing guest with data:", guest);
    setCurrentGuest(guest);
    setFirstName(guest.first_name);
    setLastName(guest.last_name || "");
    setEmail(guest.email || "");
    setPhoneNumber(guest.phone_number || "");
    setAddress(guest.address || "");
    setCity(guest.city || "");
    setState(guest.state || "");
    setZipCode(guest.zip_code || "");
    setInvitationType(guest.invitation_type);
    setPartyId(guest.party_id || null);

    // Set RSVP data if available
    console.log("Setting RSVP status from guest data:", guest.attending);
    setRsvpAttending(guest.attending);

    // Update these lines to properly set the boolean values
    setFridayDinner(guest.friday_dinner === true);
    setSundayBrunch(guest.sunday_brunch === true);
    setMainEvent(guest.main_event === true);
    setAfterparty(guest.afterparty === true);

    // Set RSVP confirmation values
    setMainEventRsvp(guest.main_event_rsvp === true);
    setFridayDinnerRsvp(guest.friday_dinner_rsvp === true);
    setSundayBrunchRsvp(guest.sunday_brunch_rsvp === true);
    setAfterpartyRsvp(guest.afterparty_rsvp === true);

    setIsEditDialogOpen(true);
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm("Are you sure you want to remove this guest?")) {
      await deleteGuest(id);
    }
  };

  const handleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]
    );
  };

  const handleCreateParty = async () => {
    if (!newPartyName.trim()) return;

    setIsSubmitting(true);
    const newPartyId = await createParty(newPartyName);

    if (newPartyId && selectedGuests.length > 0) {
      await updatePartyMembers(newPartyId, selectedGuests);
    }

    setIsSubmitting(false);
    setIsPartyDialogOpen(false);
    resetForm();
  };

  const handleAssignToParty = async () => {
    if (!selectedParty || selectedGuests.length === 0) return;

    setIsSubmitting(true);
    await updatePartyMembers(selectedParty, selectedGuests);
    setIsSubmitting(false);
    setIsPartyDialogOpen(false);
    resetForm();
  };

  const getPartyName = (partyId: string | null | undefined) => {
    if (!partyId) return "None";
    const party = parties.find(p => p.id === partyId);
    return party ? party.name : "Unknown";
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setEventFilters({
      mainEvent: null,
      afterparty: null,
      fridayDinner: null,
      sundayBrunch: null
    });
  };

  // Sort and filter guests with updated logic including event filters
  const getSortedAndFilteredGuests = () => {
    // First filter by search term
    let filtered = guests.filter(guest => {
      const searchLower = searchTerm.toLowerCase().trim();

      if (searchLower !== "") {
        const firstNameMatch = guest.first_name?.toLowerCase().includes(searchLower) || false;
        const lastNameMatch = guest.last_name?.toLowerCase().includes(searchLower) || false;
        const emailMatch = guest.email?.toLowerCase().includes(searchLower) || false;

        if (!(firstNameMatch || lastNameMatch || emailMatch)) {
          return false;
        }
      }

      // Apply event filters
      if (eventFilters.mainEvent !== null && guest.main_event !== eventFilters.mainEvent) {
        return false;
      }
      if (eventFilters.afterparty !== null && guest.afterparty !== eventFilters.afterparty) {
        return false;
      }
      if (eventFilters.fridayDinner !== null && guest.friday_dinner !== eventFilters.fridayDinner) {
        return false;
      }
      if (eventFilters.sundayBrunch !== null && guest.sunday_brunch !== eventFilters.sundayBrunch) {
        return false;
      }

      return true;
    });

    // Then sort
    return filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortField) {
        case 'first_name':
          aValue = a.first_name || '';
          bValue = b.first_name || '';
          break;
        case 'last_name':
          aValue = a.last_name || '';
          bValue = b.last_name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
      }

      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const filteredGuests = getSortedAndFilteredGuests();

  // Helper function to render sortable column header
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    const Icon = sortDirection === 'asc' ? ArrowUpAZ : ArrowDownAZ;

    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive && <Icon className="h-4 w-4" />}
        </div>
      </TableHead>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Guest List</CardTitle>
        <div className="flex gap-2">
          <Dialog open={isPartyDialogOpen} onOpenChange={setIsPartyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Parties
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Parties</DialogTitle>
                <DialogDescription>
                  Create a new party or assign guests to existing parties.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="selectGuests">Select Guests</Label>
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {guests.map(guest => (
                      <div key={guest.id} className="flex items-center space-x-2 p-1">
                        <input 
                          type="checkbox" 
                          id={`guest-${guest.id}`} 
                          checked={selectedGuests.includes(guest.id)} 
                          onChange={() => handleGuestSelection(guest.id)}
                          className="rounded"
                        />
                        <label htmlFor={`guest-${guest.id}`} className="text-sm flex-1">
                          {guest.first_name} ({guest.email})
                        </label>
                        {guest.party_id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {getPartyName(guest.party_id)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Create New Party</h4>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      value={newPartyName} 
                      onChange={(e) => setNewPartyName(e.target.value)} 
                      placeholder="Enter party name"
                    />
                    <Button 
                      onClick={handleCreateParty} 
                      disabled={isSubmitting || !newPartyName.trim() || selectedGuests.length === 0}
                    >
                      Create
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Assign to Existing Party</h4>
                  <div className="flex gap-2">
                    <Select
                      value={selectedParty || undefined}
                      onValueChange={setSelectedParty}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a party" />
                      </SelectTrigger>
                      <SelectContent>
                        {parties.map(party => (
                          <SelectItem key={party.id} value={party.id}>
                            {party.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAssignToParty}
                      disabled={isSubmitting || !selectedParty || selectedGuests.length === 0}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddGuest} disabled={isSubmitting || !firstName.trim()}>
                  {isSubmitting ? "Adding..." : "Add Guest"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter controls */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {(searchTerm || Object.values(eventFilters).some(filter => filter !== null)) && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                Clear All
              </Button>
            )}
          </div>

          {/* Filter panel */}
          {showFilters && (
            <Card className="p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter by Event Access</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-main-event" className="text-sm">Main Event</Label>
                    <Select
                      value={eventFilters.mainEvent === null ? "all" : eventFilters.mainEvent.toString()}
                      onValueChange={(value) => {
                        setEventFilters(prev => ({
                          ...prev,
                          mainEvent: value === "all" ? null : value === "true"
                        }));
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-afterparty" className="text-sm">Afterparty</Label>
                    <Select
                      value={eventFilters.afterparty === null ? "all" : eventFilters.afterparty.toString()}
                      onValueChange={(value) => {
                        setEventFilters(prev => ({
                          ...prev,
                          afterparty: value === "all" ? null : value === "true"
                        }));
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-friday-dinner" className="text-sm">Friday Dinner</Label>
                    <Select
                      value={eventFilters.fridayDinner === null ? "all" : eventFilters.fridayDinner.toString()}
                      onValueChange={(value) => {
                        setEventFilters(prev => ({
                          ...prev,
                          fridayDinner: value === "all" ? null : value === "true"
                        }));
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter-sunday-brunch" className="text-sm">Sunday Brunch</Label>
                    <Select
                      value={eventFilters.sundayBrunch === null ? "all" : eventFilters.sundayBrunch.toString()}
                      onValueChange={(value) => {
                        setEventFilters(prev => ({
                          ...prev,
                          sundayBrunch: value === "all" ? null : value === "true"
                        }));
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Table>
          <TableCaption>
            {searchTerm || Object.values(eventFilters).some(filter => filter !== null) ? `${filteredGuests.length} guests found` : 'List of all invited guests.'}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <SortableHeader field="first_name">First Name</SortableHeader>
              <SortableHeader field="last_name">Last Name</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <TableHead>RSVP Status</TableHead>
              <TableHead>Friday Invite</TableHead>
              <TableHead>Main Attending</TableHead>
              <TableHead>Friday Attending</TableHead>
              <TableHead>Brunch Attending</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.first_name}</TableCell>
                <TableCell>{guest.last_name || "-"}</TableCell>
                <TableCell>{guest.email || "-"}</TableCell>
                <TableCell>
                  {guest.attending !== null ? (
                    guest.attending === "Yes" ? (
                      <Badge className="bg-green-500">Attending</Badge>
                    ) : (
                      <Badge variant="destructive">Not Attending</Badge>
                    )
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {guest.friday_dinner === true ? (
                    <Badge variant="default" className="bg-blue-500">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={guest.main_event_rsvp === true} 
                    disabled 
                    className="pointer-events-none"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={guest.friday_dinner_rsvp === true} 
                    disabled 
                    className="pointer-events-none"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={guest.sunday_brunch_rsvp === true} 
                    disabled 
                    className="pointer-events-none"
                  />
                </TableCell>
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

                  {rsvpAttending === "Yes" && (
                    <div className="space-y-3 pt-3">
                      <h4 className="font-medium">Event Attendance</h4>
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
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGuest} disabled={isSubmitting || !firstName.trim()}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
