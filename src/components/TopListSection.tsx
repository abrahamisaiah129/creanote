import React from 'react';
import { TopCard, TopCardData } from './TopCard';

interface TopListSectionProps {
  items: TopCardData[];
  title?: string;
  onCardClick?: (item: TopCardData) => void;
}

export const TopListSection: React.FC<TopListSectionProps> = ({
  items,
  title = 'Top on the List',
  onCardClick,
}) => {
  return (
    <div className="section" data-testid="top-list-section">
      <div className="section-label">{title}</div>
      <div className="top-grid">
        {items.map((item, idx) => (
          <TopCard
            key={item.id || idx}
            card={item}
            onClick={() => onCardClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
};
