import React from 'react';
import { Badge } from './Badge';

export interface TopCardData {
  id?: string;
  title: string;
  meta?: string;
  badgeText?: string;
  badgeColor?: 'orange' | 'green';
  imageUrl: string;
}

interface TopCardProps {
  card: TopCardData;
  onClick?: () => void;
}

export const TopCard: React.FC<TopCardProps> = ({ card, onClick }) => {
  return (
    <div className="top-card" onClick={onClick} data-testid="top-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.imageUrl} alt={card.title} />
      <div className="top-card-overlay">
        {card.badgeText && (
          <Badge text={card.badgeText} color={card.badgeColor || 'orange'} />
        )}
        {!card.badgeText && card.meta && (
          <div className="card-meta">{card.meta}</div>
        )}
        <div className="card-title">{card.title}</div>
        {card.badgeText && card.meta && (
          <div className="card-meta">{card.meta}</div>
        )}
      </div>
    </div>
  );
};
