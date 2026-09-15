import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pag" data-testid="pagination">
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`pag-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          data-testid={`pag-btn-${p}`}
        >
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button
          type="button"
          className="pag-arr"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          data-testid="pag-next-btn"
        >
          &#8250;
        </button>
      )}
    </div>
  );
};
