import React from 'react';
import Link from 'next/link';
import { Badge } from './Badge';

export interface TopCardData {
  id?: string;
  title: string;
  meta?: string;
  badgeText?: string;
  badgeColor?: 'orange' | 'green';
  imageUrl: string;
  linkUrl?: string;
}

interface TopCardProps {
  card: TopCardData;
  onClick?: () => void;
}

export const TopCard: React.FC<TopCardProps> = ({ card, onClick }) => {
  const CardContent = (
    <div
      className="group flex flex-col cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1"
      onClick={onClick}
      data-testid="top-card"
    >
      {/* Big Card Image Container with Sleek Thin Soft Transition Border */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-[var(--bg2)] transition-colors duration-300 group-hover:border-white/25">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
          src={card.imageUrl}
          alt={card.title}
          draggable={false}
        />
        {card.badgeText && (
          <div className="absolute top-3 left-3">
            <Badge text={card.badgeText} color={card.badgeColor || 'orange'} />
          </div>
        )}
      </div>

      {/* Card Info Beneath Image (Matching media_1790191158768.png) */}
      <div className="mt-3.5 flex flex-col">
        <h3 className="font-['Ubuntu'] text-base md:text-[17px] font-bold leading-snug text-white transition-colors group-hover:text-[var(--green)] line-clamp-2">
          {card.title}
        </h3>
        <div className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
          {card.meta || card.badgeText}
        </div>
      </div>
    </div>
  );

  if (card.linkUrl) {
    return (
      <Link href={card.linkUrl} className="no-underline text-inherit block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};
