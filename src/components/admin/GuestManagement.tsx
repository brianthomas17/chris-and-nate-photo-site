
import { useState } from "react";
import { useGuests } from "@/context/GuestContext";
import { Guest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import GuestTableHeader from "./guest/GuestTableHeader";
import GuestTableRow from "./guest/GuestTableRow";
import SearchAndFilters from "./guest/SearchAndFilters";
import AddGuestDialog from "./guest/AddGuestDialog";
import EditGuestDialog from "./guest/EditGuestDialog";
import PartyManagementDialog from "./guest/PartyManagementDialog";
import GuestStats from "./guest/GuestStats";
import { useGuestFiltering } from "./guest/useGuestFiltering";

type SortField = 'first_name' | 'last_name' | 'email';
type SortDirection = 'asc' | 'desc';

interface EventFilters {
  mainEvent: boolean | null;
  afterparty: boolean | null;
  fridayDinner: boolean | null;
  sundayBrunch: boolean | null;
}

export default function GuestManagement() {
  const { guests, parties, addGuest, updateGuest, deleteGuest, createParty, updatePartyMembers } = useGuests();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Add sorting state
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Add filter state
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    mainEvent: null,
    afterparty: null,
    fridayDinner: null,
    sundayBrunch: null
  });

  const handleAddGuest = async (guestData: any) => {
    setIsSubmitting(true);
    await addGuest(guestData);
    setIsSubmitting(false);
  };

  const handleUpdateGuest = async (guestData: any) => {
    setIsSubmitting(true);
    await updateGuest(guestData);
    setIsSubmitting(false);
    setIsEditDialogOpen(false);
    setCurrentGuest(null);
  };

  const handleEditClick = (guest: Guest) => {
    console.log("Editing guest with data:", guest);
    setCurrentGuest(guest);
    setIsEditDialogOpen(true);
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm("Are you sure you want to remove this guest?")) {
      await deleteGuest(id);
    }
  };

  const handleCreateParty = async (name: string, selectedGuests: string[]) => {
    setIsSubmitting(true);
    const newPartyId = await createParty(name);
    if (newPartyId && selectedGuests.length > 0) {
      await updatePartyMembers(newPartyId, selectedGuests);
    }
    setIsSubmitting(false);
  };

  const handleAssignToParty = async (partyId: string, selectedGuests: string[]) => {
    setIsSubmitting(true);
    await updatePartyMembers(partyId, selectedGuests);
    setIsSubmitting(false);
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

  const filteredGuests = useGuestFiltering({
    guests,
    searchTerm,
    eventFilters,
    sortField,
    sortDirection
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Guest List</CardTitle>
        <div className="flex gap-2">
          <PartyManagementDialog
            guests={guests}
            parties={parties}
            onCreateParty={handleCreateParty}
            onAssignToParty={handleAssignToParty}
            getPartyName={getPartyName}
            isSubmitting={isSubmitting}
          />
          <AddGuestDialog
            parties={parties}
            onAddGuest={handleAddGuest}
            isSubmitting={isSubmitting}
          />
        </div>
      </CardHeader>
      <CardContent>
        <GuestStats guests={guests} />
        
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          eventFilters={eventFilters}
          onFiltersChange={setEventFilters}
          onClearFilters={clearFilters}
        />

        <Table>
          <TableCaption>
            {searchTerm || Object.values(eventFilters).some(filter => filter !== null) ? `${filteredGuests.length} guests found` : 'List of all invited guests.'}
          </TableCaption>
          <GuestTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {filteredGuests.map((guest) => (
              <GuestTableRow
                key={guest.id}
                guest={guest}
                onEdit={handleEditClick}
                onDelete={handleDeleteGuest}
              />
            ))}
          </TableBody>
        </Table>

        <EditGuestDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          guest={currentGuest}
          parties={parties}
          onUpdateGuest={handleUpdateGuest}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}
