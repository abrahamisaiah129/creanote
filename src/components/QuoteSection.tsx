'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuoteCardVisual } from './QuoteCardVisual';
import { QuoteLightbox } from './QuoteLightbox';
import { QuoteData } from './QuoteBand';

interface QuoteSectionProps {
  quotes: QuoteData[];
  title?: string;
  itemsPerPage?: number;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({
  quotes,
  title = 'Quote',
  itemsPerPage = 3,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!quotes || quotes.length === 0) return null;

  const totalPages = Math.ceil(quotes.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuotes = quotes.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenLightbox = (indexInSlice: number) => {
    setLightboxIndex(startIndex + indexInSlice);
  };

  const handlePillClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0) {
      const clickX = e.clientX - rect.left;
      const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetPage = Math.min(
        totalPages,
        Math.max(1, Math.ceil(clickRatio * totalPages))
      );
      if (targetPage === currentPage) {
        setCurrentPage((p) => (p < totalPages ? p + 1 : 1));
      } else {
        setCurrentPage(targetPage);
      }
    } else {
      setCurrentPage((p) => (p < totalPages ? p + 1 : 1));
    }
  };

  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentPage / totalPages) * 100)
  );

  return (
    <section
      className="w-full bg-[#060a07] px-6 py-12 md:px-10 md:py-16"
      data-testid="quote-section"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-['Ubuntu'] text-2xl font-bold tracking-tight text-white md:text-3xl">
            {title}
          </h2>
          <Link
            href="/quotes"
            className="group flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[#0c120e] px-4 py-2 text-xs font-bold text-[var(--green)] transition hover:border-[var(--green)] hover:bg-[var(--green)] hover:text-black"
            data-testid="see-more-quotes-btn"
          >
            <span>See more quotes</span>
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* 3-Column Isometric Quote Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentQuotes.map((q, idx) => {
            const author = q.author || q.name || 'Anonymous';
            const headline = q.boldText || q.caption;

            return (
              <div
                key={q.id || idx}
                className="flex flex-col"
                data-testid={`quote-card-item-${idx}`}
              >
                {/* Pure Quote Image Card (Text and artwork are baked into image per Figma) */}
                <QuoteCardVisual
                  boldText={q.boldText}
                  bodyText={q.bodyText}
                  author={author}
                  name={q.name}
                  role={q.role}
                  tagText={q.tagText}
                  avatarUrl={q.avatarUrl}
                  imageUrl={q.imageUrl || q.bannerUrl}
                  onClick={() => handleOpenLightbox(idx)}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Controls (Matching < 1 2 3 > Screenshot) */}
        <div className="mt-12 flex items-center justify-center gap-2">
          {/* Previous page arrow */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[#0d1410] text-sm text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous quotes page"
            data-testid="quote-prev-btn"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Numbered Page Buttons in Sets of 3 */}
          {(() => {
            const SET_SIZE = 3;
            const currentSet = Math.floor((currentPage - 1) / SET_SIZE);
            const startPage = currentSet * SET_SIZE + 1;
            const endPage = Math.min(startPage + SET_SIZE - 1, totalPages);
            const pages = Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            );

            return (
              <>
                {startPage > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(startPage - 1)}
                    className="flex h-9 min-w-9 px-2 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[#0d1410] font-['Ubuntu'] text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white"
                    title="Previous set"
                  >
                    ...
                  </button>
                )}

                {pages.map((pageNumber) => {
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg font-['Ubuntu'] text-xs font-bold transition ${
                        isActive
                          ? 'bg-white text-black shadow-md'
                          : 'border border-[var(--border)] bg-[#0d1410] text-[var(--muted)] hover:border-[var(--green)] hover:text-white'
                      }`}
                      data-testid={`quote-page-btn-${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {endPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage(endPage + 1)}
                    className="flex h-9 min-w-9 px-2 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[#0d1410] font-['Ubuntu'] text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white"
                    title="Next set"
                  >
                    ...
                  </button>
                )}
              </>
            );
          })()}

          {/* Next page arrow */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[#0d1410] text-sm text-[var(--muted)] transition hover:border-[var(--green)] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next quotes page"
            data-testid="quote-next-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Progress Bar in Orange Below Component (Centered, 10% width, thick as before) */}
        <div
          role="progressbar"
          aria-valuenow={currentPage}
          aria-valuemin={1}
          aria-valuemax={totalPages}
          aria-label="Quote slides progress - click for next set"
          onClick={handlePillClick}
          className="group mx-auto mt-8 flex h-1.5 w-[20%] min-w-[120px] max-w-[200px] md:w-[40%] md:max-w-[400px] cursor-pointer overflow-hidden rounded-full bg-white/20 transition-all hover:h-2"
          title="Click to view next quotes"
          data-testid="quote-progress-bar"
        >
          <div
            className="h-full rounded-full bg-[var(--orange)] transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
            data-testid="quote-progress-fill"
          />
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <QuoteLightbox
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          quotes={quotes}
          currentIndex={lightboxIndex}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
    </section>
  );
};
