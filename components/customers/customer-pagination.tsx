"use client";

interface CustomerPaginationProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isFetching: boolean;
  currentPage?: number;
  totalPages?: number;
}

export function CustomerPagination({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  isFetching,
  currentPage,
  totalPages,
}: CustomerPaginationProps): JSX.Element {
  return (
    <div className="customer-pagination">
      <div className="pagination-controls">
        <button
          className="btn-secondary"
          disabled={!hasPrevious || isFetching}
          onClick={onPrevious}
        >
          Previous
        </button>

        {currentPage && totalPages && (
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
        )}

        <button
          className="btn-secondary"
          disabled={!hasNext || isFetching}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
