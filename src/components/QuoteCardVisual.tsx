import React, { useState, useEffect, useRef } from 'react';

export interface QuoteVisualProps {
  id?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const QuoteCardVisual: React.FC<QuoteVisualProps> = ({
  imageUrl,
  onClick,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group relative aspect-square w-full cursor-pointer select-none overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0C100D] transition-all duration-300 hover:border-white/25 hover:-translate-y-1 ${className}`}
      data-testid="quote-card-visual"
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}

      {isVisible && imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl}
          alt="Visual Quote"
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          data-testid="quote-image"
        />
      )}

      {/* Subtle Interactive Click Cue Overlay on Hover */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-[var(--green)] px-4 py-1.5 font-['Ubuntu'] text-xs font-bold text-black">
          Expand Quote ↗
        </span>
      </div>
    </div>
  );
};
