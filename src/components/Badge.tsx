import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'orange' | 'green';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'orange', className = '' }) => {
  const colorClass = color === 'green' ? 'badge-green' : 'badge-orange';
  return <span className={`card-badge ${colorClass} ${className}`}>{text}</span>;
};
