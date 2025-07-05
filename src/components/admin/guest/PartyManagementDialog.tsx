
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { Guest, Party } from "@/types";

interface PartyManagementDialogProps {
  guests: Guest[];
  parties: Party[];
  onCreateParty: (name: string, selectedGuests: string[]) => Promise<void>;
  onAssignToParty: (partyId: string, selectedGuests: string[]) => Promise<void>;
  getPartyName: (partyId: string | null | undefined) => string;
  isSubmitting: boolean;
}

export default function PartyManagementDialog({
  guests,
  parties,
  onCreateParty,
  onAssignToParty,
  getPartyName,
  isSubmitting
}: PartyManagementDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  const resetForm = () => {
    setNewPartyName("");
    setSelectedGuests([]);
    setSelectedParty(null);
  };

  const handleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]
    );
  };

  const handleCreateParty = async () => {
    if (!newPartyName.trim() || selectedGuests.length === 0) return;
    await onCreateParty(newPartyName, selectedGuests);
    setIsOpen(false);
    resetForm();
  };

  const handleAssignToParty = async () => {
    if (!selectedParty || selectedGuests.length === 0) return;
    await onAssignToParty(selectedParty, selectedGuests);
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
}
