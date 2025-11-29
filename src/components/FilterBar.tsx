import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const petTypes = [
  { value: "all", label: "All Types" },
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
];

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  showSearch?: boolean;
  showSort?: boolean;
  showPetType?: boolean;
}

export interface FilterState {
  search: string;
  petType: string;
  sortBy: string;
}

export default function FilterBar({ 
  onFilterChange, 
  showSearch = true, 
  showSort = true, 
  showPetType = true 
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    petType: "all",
    sortBy: "newest",
  });
  const [expanded, setExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = { search: "", petType: "all", sortBy: "newest" };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.search || filters.petType !== "all" || filters.sortBy !== "newest";

  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-6 animate-fade-in">
      {/* Mobile Toggle */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className={`flex flex-col md:flex-row gap-4 ${expanded ? 'block' : 'hidden md:flex'}`}>
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, breed..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {showPetType && (
          <Select value={filters.petType} onValueChange={(v) => updateFilter("petType", v)}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Pet Type" />
            </SelectTrigger>
            <SelectContent>
              {petTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showSort && (
          <Select value={filters.sortBy} onValueChange={(v) => updateFilter("sortBy", v)}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearFilters}
            className="hidden md:flex"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
