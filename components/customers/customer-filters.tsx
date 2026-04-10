"use client";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalCount?: number;
}

export function CustomerFilters({
  search,
  onSearchChange,
  totalCount,
}: CustomerFiltersProps): JSX.Element {
  return (
    <div className="customer-filters">
      <div className="search-section">
        <label htmlFor="customer-search" className="sr-only">
          Search customers
        </label>
        <input
          id="customer-search"
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {totalCount !== undefined && (
          <span className="result-count">
            {totalCount} customer{totalCount !== 1 ? "s" : ""} found
          </span>
        )}
      </div>
    </div>
  );
}
