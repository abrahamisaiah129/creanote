'use client';

import React, { useState, useEffect } from 'react';

export interface SlideItem {
  id?: string;
  imageUrl: string;
  alt?: string;
}

interface HeroSliderProps {
  slides?: SlideItem[];
  autoplayInterval?: number;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [
    { imageUrl: '/images/hero-0.jpg', alt: 'Hero 1' },
    { imageUrl: '/images/hero-1.jpg', alt: 'Hero 2' },
    { imageUrl: '/images/hero-2.jpg', alt: 'Hero 3' },
    { imageUrl: '/images/hero-3.jpg', alt: 'Hero 4' },
  ],
  autoplayInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="hero-wrapper" id="heroWrapper" data-testid="hero-slider">
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`hero-slide ${idx === current ? 'active' : ''}`}
          id={`slide-${idx}`}
          data-testid={`hero-slide-${idx}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.imageUrl} alt={slide.alt || `Creanote Slide ${idx + 1}`} />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="hero-dots-wrapper" id="heroDots" data-testid="hero-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hdot ${idx === current ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`hero-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
