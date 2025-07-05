
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest } from "@/types";

interface GuestTableRowProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

export default function GuestTableRow({ guest, onEdit, onDelete }: GuestTableRowProps) {
  return (
    <TableRow>
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
          <Button variant="outline" size="sm" onClick={() => onEdit(guest)}>
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(guest.id)}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
