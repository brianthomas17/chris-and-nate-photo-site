
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface EventFilters {
  mainEvent: boolean | null;
  afterparty: boolean | null;
  fridayDinner: boolean | null;
  sundayBrunch: boolean | null;
}

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  eventFilters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  eventFilters,
  onFiltersChange,
  onClearFilters
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchTerm || Object.values(eventFilters).some(filter => filter !== null);

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} size="sm">
            Clear All
          </Button>
        )}
      </div>

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
                    onFiltersChange({
                      ...eventFilters,
                      mainEvent: value === "all" ? null : value === "true"
                    });
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
                    onFiltersChange({
                      ...eventFilters,
                      afterparty: value === "all" ? null : value === "true"
                    });
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
                    onFiltersChange({
                      ...eventFilters,
                      fridayDinner: value === "all" ? null : value === "true"
                    });
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
                    onFiltersChange({
                      ...eventFilters,
                      sundayBrunch: value === "all" ? null : value === "true"
                    });
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
  );
}
