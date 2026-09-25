import React from 'react';

interface BadgeProps {
  text: string;
  color?: 'orange' | 'green';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'orange', className = '' }) => {
  const colorClass = color === 'green' ? 'badge-green' : 'badge-orange';
  return <span className={`card-badge ${colorClass} mb-[7px] rounded-[3px] px-2 py-[3px] text-[10px] font-extrabold uppercase tracking-[1.2px] ${className}`}>{text}</span>;
};
