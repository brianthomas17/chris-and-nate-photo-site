
import { useMemo } from "react";
import { Guest } from "@/types";

type SortField = 'first_name' | 'last_name' | 'email';
type SortDirection = 'asc' | 'desc';

interface EventFilters {
  mainEvent: boolean | null;
  afterparty: boolean | null;
  fridayDinner: boolean | null;
  sundayBrunch: boolean | null;
}

interface UseGuestFilteringProps {
  guests: Guest[];
  searchTerm: string;
  eventFilters: EventFilters;
  sortField: SortField;
  sortDirection: SortDirection;
}

export function useGuestFiltering({
  guests,
  searchTerm,
  eventFilters,
  sortField,
  sortDirection
}: UseGuestFilteringProps) {
  return useMemo(() => {
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
  }, [guests, searchTerm, eventFilters, sortField, sortDirection]);
}
