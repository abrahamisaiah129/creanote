'use client';

import React, { useState } from 'react';

export interface QuoteData {
  id?: string;
  boldText: string;
  bodyText: string;
  tagText?: string;
  caption: string;
  credit?: string;
  name: string;
  role: string;
  avatarUrl: string;
}

interface QuoteBandProps {
  quotes: QuoteData[];
}

export const QuoteBand: React.FC<QuoteBandProps> = ({ quotes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[activeIndex] || quotes[0];

  return (
    <div className="quote-band" data-testid="quote-band">
      <div className="quote-inner">
        <div>
          <div className="quote-mark">&quot;</div>
          <div className="quote-bold">{currentQuote.boldText}</div>
          <div className="quote-body">{currentQuote.bodyText}</div>
          <div style={{ marginTop: '22px' }}>
            <div className="quote-tag badge-orange">
              {currentQuote.tagText || 'QUOTE'}
            </div>
            <div className="quote-caption">{currentQuote.caption}</div>
            <div className="quote-credit">
              {currentQuote.credit || 'CREANOTE QUOTE TIMELINE'}
            </div>
          </div>
        </div>
        <div className="qperson">
          <div className="qavatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentQuote.avatarUrl} alt={currentQuote.name} />
          </div>
          <div className="qname">{currentQuote.name}</div>
          <div className="qrole">{currentQuote.role}</div>
          {quotes.length > 1 && (
            <div className="qdots">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`qdot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show quote ${idx + 1}`}
                  data-testid={`quote-dot-${idx}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
