'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface QuoteData {
  id?: string;
  boldText: string;
  bodyText: string;
  tagText?: string;
  caption: string;
  credit?: string;
  author?: string;
  name: string;
  role: string;
  avatarUrl: string;
  bannerUrl?: string;
  imageUrl?: string;
  date?: string;
  createdAt?: string | Date;
  isActive?: boolean;
  order?: number;
}

interface QuoteBandProps {
  quotes: QuoteData[];
}

export const QuoteBand: React.FC<QuoteBandProps> = ({ quotes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[activeIndex] || quotes[0];
  const currentSafeId = currentQuote.id || (currentQuote as any)._id;
  const quoteHref = currentSafeId ? `/quotes/${currentSafeId}` : '/quotes';
  const dots = quotes.length > 1 ? (
    <div className="flex gap-1.5 quote-banner-dots">
      {quotes.map((_, idx) => (
        <button
          key={idx}
          type="button"
          className={`h-[7px] w-[7px] cursor-pointer rounded-full border-0 bg-[var(--muted)] transition-colors ${idx === activeIndex ? 'active bg-[var(--green)]' : ''}`}
          onClick={() => setActiveIndex(idx)}
          aria-label={`Show quote ${idx + 1}`}
          data-testid={`quote-dot-${idx}`}
        />
      ))}
    </div>
  ) : null;

  return (
    <div className="border-y border-[var(--border)] bg-[var(--bg2)] px-10 py-14 max-md:px-6" data-testid="quote-band">
      {currentQuote.bannerUrl ? (
        <div className="relative mx-auto max-w-[1280px]">
          <Link href={quoteHref} className="quote-link" aria-label={`Read quote: ${currentQuote.boldText}`}>
            <div className="relative aspect-[2000/1031] w-full overflow-hidden rounded-[14px] bg-black border border-white/[0.08] transition-colors duration-300 hover:border-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentQuote.bannerUrl}
                alt={currentQuote.boldText || 'Creanote Quote'}
                className="block h-full w-full object-contain"
              />
            </div>
          </Link>
          {dots}
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_220px] items-center gap-14 max-md:grid-cols-1 max-md:gap-8 max-md:text-center">
          <Link
            href={quoteHref}
            className="quote-link quote-copy-link"
            aria-label={`Read quote: ${currentQuote.boldText}`}
          >
            <div>
              <div className="mb-2.5 font-['Ubuntu'] text-[80px] leading-[.7] text-[#1a3a2a]">&quot;</div>
              <div className="mb-3.5 font-['Ubuntu'] text-[clamp(20px,2.5vw,30px)] font-extrabold leading-[1.25] text-white">{currentQuote.boldText}</div>
              <div className="text-[15px] leading-[1.7] text-[var(--muted)]">{currentQuote.bodyText}</div>
              <div className="mt-[22px]">
                <div className="mb-2.5 inline-block rounded-[3px] px-2.5 py-1 text-[10px] font-extrabold tracking-[1.5px] badge-orange">{currentQuote.tagText || 'QUOTE'}</div>
                <div className="mb-1.5 font-['Ubuntu'] text-base font-bold text-white">{currentQuote.caption}</div>
                <div className="text-[11px] font-bold tracking-[2px] text-[var(--green)]">
                  {currentQuote.credit || 'CREANOTE QUOTE TIMELINE'}
                </div>
              </div>
            </div>
          </Link>
          <div className="flex flex-col items-center gap-3.5">
            <div className="h-[130px] w-[130px] overflow-hidden rounded-full border-[3px] border-[var(--green)] bg-[#1a3a2a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="h-full w-full object-cover" src={currentQuote.avatarUrl} alt={currentQuote.name} />
            </div>
            <div className="text-[13px] font-semibold text-[var(--text)]">{currentQuote.name}</div>
            <div className="text-[11px] text-[var(--muted)]">{currentQuote.role}</div>
            {dots}
          </div>
        </div>
      )}
    </div>
  );
};
