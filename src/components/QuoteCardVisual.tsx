import React from 'react';
import { placeholderUrl } from '@/lib/defaultData';

export interface QuoteVisualProps {
  id?: string;
  boldText?: string;
  bodyText?: string;
  author?: string;
  name?: string;
  role?: string;
  tagText?: string;
  avatarUrl?: string;
  imageUrl?: string;
  bannerUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const QuoteCardVisual: React.FC<QuoteVisualProps> = ({
  boldText = 'Creanote Quote',
  author,
  name,
  imageUrl,
  bannerUrl,
  onClick,
  className = '',
}) => {
  const displayTitle = boldText.replace(/^["“”]|["“”]$/g, '') || author || name || 'Creanote Quote';
  const displayAuthor = author || name || 'Creanote Creator';
  const imgSrc =
    imageUrl ||
    bannerUrl ||
    placeholderUrl(displayTitle, 800, 800);

  return (
    <div
      onClick={onClick}
      className={`group relative aspect-square w-full cursor-pointer select-none overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#070c09] transition-all duration-300 hover:border-white/25 hover:-translate-y-1 ${className}`}
      data-testid="quote-card-visual"
    >
      {/* Quote Image (Pure visual asset with text baked in, per Figma design) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={displayAuthor ? `Quote by ${displayAuthor}` : displayTitle}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        data-testid="quote-image"
      />

      {/* Subtle Interactive Click Cue Overlay on Hover */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-[var(--green)] px-4 py-1.5 font-['Ubuntu'] text-xs font-bold text-black">
          Expand Quote ↗
        </span>
      </div>
    </div>
  );
};
