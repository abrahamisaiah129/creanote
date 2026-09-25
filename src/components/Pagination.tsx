import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Pagination in sets of 3 for scalable, clean UX
  const SET_SIZE = 3;
  const currentSet = Math.floor((currentPage - 1) / SET_SIZE);
  const startPage = currentSet * SET_SIZE + 1;
  const endPage = Math.min(startPage + SET_SIZE - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2" data-testid="pagination">
      {/* Previous page arrow */}
      {currentPage > 1 && (
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#0d1410] text-sm text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white active:scale-95"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          data-testid="pag-prev-btn"
        >
          &#8249;
        </button>
      )}

      {/* Jump to previous set if not on first set */}
      {startPage > 1 && (
        <button
          type="button"
          className="flex h-9 min-w-9 px-2 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#0d1410] font-['Ubuntu'] text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white active:scale-95"
          onClick={() => onPageChange(startPage - 1)}
          title={`Previous set (${Math.max(1, startPage - SET_SIZE)} - ${startPage - 1})`}
          data-testid="pag-prev-set"
        >
          ...
        </button>
      )}

      {/* Current set of 3 page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg font-['Ubuntu'] text-xs font-bold transition active:scale-95 ${
            p === currentPage
              ? 'bg-white text-black shadow-md'
              : 'border border-white/[0.08] bg-[#0d1410] text-[var(--muted)] hover:border-[var(--green)] hover:text-white'
          }`}
          onClick={() => onPageChange(p)}
          data-testid={`pag-btn-${p}`}
        >
          {p}
        </button>
      ))}

      {/* Jump to next set if not on last set */}
      {endPage < totalPages && (
        <button
          type="button"
          className="flex h-9 min-w-9 px-2 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#0d1410] font-['Ubuntu'] text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white active:scale-95"
          onClick={() => onPageChange(endPage + 1)}
          title={`Next set (${endPage + 1} - ${Math.min(endPage + SET_SIZE, totalPages)})`}
          data-testid="pag-next-set"
        >
          ...
        </button>
      )}

      {/* Next page arrow */}
      {currentPage < totalPages && (
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-[#0d1410] text-sm text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white active:scale-95"
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
