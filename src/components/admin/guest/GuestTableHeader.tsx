
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";

type SortField = 'first_name' | 'last_name' | 'email';
type SortDirection = 'asc' | 'desc';

interface GuestTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export default function GuestTableHeader({ sortField, sortDirection, onSort }: GuestTableHeaderProps) {
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    const Icon = sortDirection === 'asc' ? ArrowUpAZ : ArrowDownAZ;

    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive && <Icon className="h-4 w-4" />}
        </div>
      </TableHead>
    );
  };

  return (
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
  );
}
