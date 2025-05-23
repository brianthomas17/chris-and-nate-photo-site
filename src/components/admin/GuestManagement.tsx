
import { useState, useEffect } from 'react';
import { useGuests } from '@/context/GuestContext';
import { Guest, InvitationType, Party } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { X, ArrowUp, ArrowDown } from 'lucide-react';

export default function GuestManagement() {
  const { guests, parties, addGuest, updateGuest, deleteGuest, createParty, updatePartyMembers } = useGuests();
  
  // Guest form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [invitationType, setInvitationType] = useState<InvitationType>('main event');
  const [attending, setAttending] = useState<string | null>(null);
  const [fridayDinner, setFridayDinner] = useState(false);
  const [sundayBrunch, setSundayBrunch] = useState(false);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  
  // Party management state
  const [isPartyDialogOpen, setIsPartyDialogOpen] = useState(false);
  const [partyName, setPartyName] = useState('');
  const [partyMembers, setPartyMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const resetGuestForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setInvitationType('main event');
    setAttending(null);
    setFridayDinner(false);
    setSundayBrunch(false);
    setPartyId(null);
    setCurrentGuest(null);
  };
  
  const handleAddGuest = async () => {
    await addGuest({
      first_name: firstName,
      last_name: lastName || null,
      email: email || null,
      phone_number: phoneNumber || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      invitation_type: invitationType,
      party_id: partyId,
      attending: attending,
      friday_dinner: fridayDinner,
      sunday_brunch: sundayBrunch
    });
    
    setIsAddDialogOpen(false);
    resetGuestForm();
  };
  
  const handleEditGuest = async () => {
    if (!currentGuest) return;
    
    await updateGuest({
      ...currentGuest,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      address,
      city,
      state,
      zip_code: zipCode,
      invitation_type: invitationType,
      party_id: partyId,
      attending: attending,
      friday_dinner: fridayDinner,
      sunday_brunch: sundayBrunch
    });
    
    setIsEditDialogOpen(false);
    resetGuestForm();
  };
  
  const handleEditClick = (guest: Guest) => {
    setCurrentGuest(guest);
    setFirstName(guest.first_name);
    setLastName(guest.last_name || '');
    setEmail(guest.email || '');
    setPhoneNumber(guest.phone_number || '');
    setAddress(guest.address || '');
    setCity(guest.city || '');
    setState(guest.state || '');
    setZipCode(guest.zip_code || '');
    setInvitationType(guest.invitation_type);
    setAttending(guest.attending || null);
    setFridayDinner(guest.friday_dinner || false);
    setSundayBrunch(guest.sunday_brunch || false);
    setPartyId(guest.party_id || null);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteGuest = async (id: string) => {
    if (confirm("Are you sure you want to delete this guest?")) {
      await deleteGuest(id);
    }
  };
  
  const handleCreateParty = async () => {
    if (!partyName.trim()) return;
    
    const newPartyId = await createParty(partyName);
    if (newPartyId) {
      await updatePartyMembers(newPartyId, partyMembers);
      setIsPartyDialogOpen(false);
      setPartyName('');
      setPartyMembers([]);
    }
  };
  
  const togglePartyMember = (guestId: string) => {
    if (partyMembers.includes(guestId)) {
      setPartyMembers(prev => prev.filter(id => id !== guestId));
    } else {
      setPartyMembers(prev => [...prev, guestId]);
    }
  };
  
  const getPartyName = (id: string | null) => {
    if (!id) return '';
    const party = parties.find(p => p.id === id);
    return party ? party.name : '';
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredGuests = guests.filter(guest => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      guest.first_name.toLowerCase().includes(searchTermLower) ||
      (guest.last_name && guest.last_name.toLowerCase().includes(searchTermLower)) ||
      (guest.email && guest.email.toLowerCase().includes(searchTermLower)) ||
      getPartyName(guest.party_id).toLowerCase().includes(searchTermLower)
    );
  });

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    let fieldA, fieldB;
    
    switch (sortField) {
      case 'first_name':
        fieldA = a.first_name.toLowerCase();
        fieldB = b.first_name.toLowerCase();
        break;
      case 'last_name':
        fieldA = (a.last_name || '').toLowerCase();
        fieldB = (b.last_name || '').toLowerCase();
        break;
      case 'invitation_type':
        fieldA = a.invitation_type;
        fieldB = b.invitation_type;
        break;
      case 'attending':
        fieldA = a.attending || '';
        fieldB = b.attending || '';
        break;
      default:
        fieldA = (a.last_name || '').toLowerCase();
        fieldB = (b.last_name || '').toLowerCase();
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIndicator = ({ field }: { field: string }) => (
    <span className="ml-1">
      {sortField === field ? (
        sortDirection === 'asc' ? <ArrowUp className="inline h-4 w-4" /> : <ArrowDown className="inline h-4 w-4" />
      ) : null}
    </span>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Guest List</CardTitle>
        <div className="flex space-x-2">
          <Dialog open={isPartyDialogOpen} onOpenChange={setIsPartyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Create Party</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Party</DialogTitle>
                <DialogDescription>
                  Create a new party and assign guests to it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="party-name">Party Name</Label>
                  <Input
                    id="party-name"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder="Smith Family"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select Party Members</Label>
                  <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                    {guests.map(guest => (
                      <div key={guest.id} className="flex items-center space-x-2 p-1">
                        <Checkbox
                          id={`party-member-${guest.id}`}
                          checked={partyMembers.includes(guest.id)}
                          onCheckedChange={() => togglePartyMember(guest.id)}
                        />
                        <label
                          htmlFor={`party-member-${guest.id}`}
                          className="text-sm cursor-pointer flex-grow"
                        >
                          {guest.first_name} {guest.last_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPartyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateParty}>Create Party</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-anniversary-gold hover:bg-anniversary-gold/90 text-black">
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Guest</DialogTitle>
                <DialogDescription>
                  Add a new guest to the guest list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name*</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(123) 456-7890"
                    />
                  </div>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      id="zip"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invitation-type">Invitation Type*</Label>
                  <Select 
                    value={invitationType} 
                    onValueChange={(value: InvitationType) => setInvitationType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select invitation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main event">Main Event</SelectItem>
                      <SelectItem value="afterparty">Afterparty Only</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party">Party</Label>
                  <Select 
                    value={partyId || ""} 
                    onValueChange={(value) => setPartyId(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select or leave blank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {parties.map(party => (
                        <SelectItem key={party.id} value={party.id}>{party.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>RSVP Status</Label>
                  <RadioGroup 
                    value={attending || ""} 
                    onValueChange={(value) => setAttending(value === "" ? null : value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="rsvp-yes" />
                      <Label htmlFor="rsvp-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="rsvp-no" />
                      <Label htmlFor="rsvp-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Maybe" id="rsvp-maybe" />
                      <Label htmlFor="rsvp-maybe">Maybe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="rsvp-none" />
                      <Label htmlFor="rsvp-none">Not Responded</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Special events checkboxes */}
                {attending === "Yes" && (
                  <div className="space-y-2 border-t pt-4">
                    <Label>Special Events</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="friday-dinner" 
                          checked={fridayDinner}
                          onCheckedChange={(checked) => setFridayDinner(!!checked)} 
                        />
                        <label htmlFor="friday-dinner" className="text-sm font-medium leading-none cursor-pointer">
                          Attending Friday Dinner
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sunday-brunch" 
                          checked={sundayBrunch}
                          onCheckedChange={(checked) => setSundayBrunch(!!checked)} 
                        />
                        <label htmlFor="sunday-brunch" className="text-sm font-medium leading-none cursor-pointer">
                          Attending Sunday Brunch
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGuest}>Add Guest</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableCaption>Total Guests: {filteredGuests.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('last_name')}>
                Name <SortIndicator field="last_name" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('invitation_type')}>
                Invitation <SortIndicator field="invitation_type" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('attending')}>
                RSVP <SortIndicator field="attending" />
              </TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Special Events</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  {guest.first_name} {guest.last_name}
                </TableCell>
                <TableCell>
                  {guest.invitation_type === 'main event' ? 'Main Event' : 
                   guest.invitation_type === 'afterparty' ? 'Afterparty' : 'Admin'}
                </TableCell>
                <TableCell>
                  {guest.attending || 'Not Responded'}
                </TableCell>
                <TableCell>
                  {getPartyName(guest.party_id)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {guest.friday_dinner && <span className="text-xs">Friday Dinner</span>}
                    {guest.sunday_brunch && <span className="text-xs">Sunday Brunch</span>}
                    {!guest.friday_dinner && !guest.sunday_brunch && <span className="text-xs text-muted-foreground">None</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(guest)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGuest(guest.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredGuests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No guests found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
              <DialogDescription>
                Edit guest information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name*</Label>
                  <Input
                    id="edit-first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input
                    id="edit-last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-zip">Zip Code</Label>
                  <Input
                    id="edit-zip"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-invitation-type">Invitation Type*</Label>
                <Select 
                  value={invitationType} 
                  onValueChange={(value: InvitationType) => setInvitationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select invitation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main event">Main Event</SelectItem>
                    <SelectItem value="afterparty">Afterparty Only</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-party">Party</Label>
                <Select 
                  value={partyId || ""} 
                  onValueChange={(value) => setPartyId(value === "" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select or leave blank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {parties.map(party => (
                      <SelectItem key={party.id} value={party.id}>{party.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>RSVP Status</Label>
                <RadioGroup 
                  value={attending || ""} 
                  onValueChange={(value) => setAttending(value === "" ? null : value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="edit-rsvp-yes" />
                    <Label htmlFor="edit-rsvp-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="edit-rsvp-no" />
                    <Label htmlFor="edit-rsvp-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Maybe" id="edit-rsvp-maybe" />
                    <Label htmlFor="edit-rsvp-maybe">Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="edit-rsvp-none" />
                    <Label htmlFor="edit-rsvp-none">Not Responded</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Special events checkboxes */}
              {attending === "Yes" && (
                <div className="space-y-2 border-t pt-4">
                  <Label>Special Events</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edit-friday-dinner" 
                        checked={fridayDinner}
                        onCheckedChange={(checked) => setFridayDinner(!!checked)} 
                      />
                      <label htmlFor="edit-friday-dinner" className="text-sm font-medium leading-none cursor-pointer">
                        Attending Friday Dinner
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="edit-sunday-brunch" 
                        checked={sundayBrunch}
                        onCheckedChange={(checked) => setSundayBrunch(!!checked)} 
                      />
                      <label htmlFor="edit-sunday-brunch" className="text-sm font-medium leading-none cursor-pointer">
                        Attending Sunday Brunch
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditGuest}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
