'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [progressPercentage, setProgressPercentage] = useState(33.3);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleCardClick = (item: TopCardData) => {
    if (hasDraggedRef.current) return;
    if (onCardClick) {
      onCardClick(item);
    } else {
      router.push('/stories');
    }
  };

  const updateProgress = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setProgressPercentage(100);
      return;
    }
    const ratio = Math.max(0, Math.min(1, el.scrollLeft / maxScroll));
    const minPercentage = items.length > 0 ? Math.max(20, (1 / items.length) * 100) : 33.3;
    const current = minPercentage + ratio * (100 - minPercentage);
    setProgressPercentage(Math.min(100, Math.max(minPercentage, current)));
  }, [items.length]);

  const handleScroll = () => {
    updateProgress();
  };

  useEffect(() => {
    updateProgress();
    window.addEventListener('resize', updateProgress);
    return () => window.removeEventListener('resize', updateProgress);
  }, [updateProgress, items]);

  // Mouse Drag-to-Scroll interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
    updateProgress();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = rect.width > 0 ? Math.max(0, Math.min(1, clickX / rect.width)) : 0;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
    } else {
      el.scrollLeft = ratio * maxScroll;
    }
  };

  return (
    <section
      className="mx-auto max-w-[1280px] px-6 py-10 md:px-10 md:py-14"
      data-testid="top-list-section"
    >
      <div className="mb-6 font-['Ubuntu'] text-xl font-bold text-[var(--text)] md:text-2xl">
        {title}
      </div>

      {/* Horizontally scrollable container with bigger card images and touch/drag interactive */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex gap-6 overflow-x-auto scroll-smooth py-2 touch-pan-x select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-testid="top-list-scroll-container"
      >
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className="w-[320px] sm:w-[380px] md:w-[440px] shrink-0"
            data-testid={`top-card-item-${idx}`}
          >
            <TopCard card={item} onClick={() => handleCardClick(item)} />
          </div>
        ))}
      </div>

      {/* Progress Bar in Orange Following Scroll */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progressPercentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Top on the list scroll progress"
        onClick={handleProgressClick}
        className="mx-auto mt-8 flex h-1.5 w-[10%] min-w-[80px] max-w-[140px] cursor-pointer overflow-hidden rounded-full bg-white/20 transition-all hover:h-2"
        title="Click to scroll through top list"
        data-testid="top-list-progress-bar"
      >
        <div
          className="h-full rounded-full bg-[var(--orange)] transition-all duration-150 ease-out"
          style={{ width: `${progressPercentage}%` }}
          data-testid="top-list-progress-fill"
        />
      </div>
    </section>
  );
};