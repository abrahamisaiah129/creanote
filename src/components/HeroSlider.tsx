"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export interface SlideItem {
  id?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  alt?: string;
  title?: string;
  meta?: string;
  badgeText?: string;
  headline?: string;
  linkUrl?: string;
}

interface HeroSliderProps {
  slides?: SlideItem[];
  autoplayInterval?: number;
}

const MIN_SWIPE_DISTANCE = 50;

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [],
  autoplayInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const startX = useRef<number | null>(null);
  const dragged = useRef(false);

  const count = slides.length;

  // Keep `current` in range if slides shrink
  useEffect(() => {
    if (count > 0 && current >= count) setCurrent(0);
  }, [count, current]);

  const next = useCallback(() => {
    if (count === 0) return;
    setCurrent((p) => (p + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setCurrent((p) => (p - 1 + count) % count);
  }, [count]);

  // Autoplay: restarts whenever `current` changes (manual nav resets the timer),
  // and pauses while hovering / touching / focused.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setTimeout(next, autoplayInterval);
    return () => clearTimeout(timer);
  }, [count, autoplayInterval, paused, current, next]);

  // ---- Swipe / drag (pointer events cover mouse + touch) ----
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    dragged.current = false;
    if (e.pointerType === "touch") setPaused(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") setPaused(false);
    if (startX.current === null) return;

    const dx = e.clientX - startX.current;
    startX.current = null;

    if (Math.abs(dx) > MIN_SWIPE_DISTANCE) {
      dragged.current = true; // suppress the click that follows a drag
      if (dx < 0) next();
      else prev();
    }
  };

  const resetPointer = () => {
    startX.current = null;
    setPaused(false);
  };

  // Block navigation if the gesture was a drag, not a click
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.preventDefault();
      e.stopPropagation();
      dragged.current = false;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  if (count === 0) return null;

  return (
    <div
      className="relative block aspect-[4/5] w-full max-w-[100vw] touch-pan-y select-none overflow-hidden bg-black sm:aspect-[16/8] lg:aspect-[16/7]"
      id="heroWrapper"
      data-testid="hero-slider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={resetPointer}
      onPointerLeave={resetPointer}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === current;

        const slideContent = (
          <>
            <picture draggable={false} onDragStart={(e) => e.preventDefault()}>
              <source
                media="(max-width: 639px)"
                srcSet={slide.mobileImageUrl || slide.imageUrl}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 block h-full w-full object-cover object-center"
                src={slide.imageUrl}
                alt={slide.alt || `Creanote Slide ${idx + 1}`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                decoding="async"
              />
            </picture>

            {(slide.badgeText ||
              slide.title ||
              slide.headline ||
              slide.meta ||
              slide.linkUrl) && (
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-16 pt-12 sm:px-8 sm:pb-8 sm:pt-16 lg:px-12 lg:pb-10 lg:pt-20">
                <div className="mx-auto max-w-[1280px]">
                  {slide.badgeText && (
                    <span className="mb-2 inline-block bg-[#f59e0b] px-3 py-1.5 font-['Ubuntu'] text-xs font-bold uppercase italic leading-none tracking-wide text-white sm:mb-3 sm:px-4 sm:py-1.5 sm:text-sm lg:text-base">
                      {slide.badgeText}
                    </span>
                  )}

                  {(slide.title || slide.headline) && (
                    <h2 className="line-clamp-3 max-w-4xl font-['Ubuntu'] text-lg font-extrabold leading-tight text-white drop-shadow-md sm:text-2xl lg:text-4xl">
                      {slide.title || slide.headline}
                    </h2>
                  )}

                  {slide.meta && (
                    <div className="mt-2 font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wide text-[var(--green)] sm:mt-3 sm:text-xs">
                      {slide.meta}
                    </div>
                  )}

                  {/* Plain <span>, NOT a <Link>: the whole slide is already a link,
                      and nested <a> tags are invalid HTML (hydration errors). */}
                  {slide.linkUrl && (
                    <div className="mt-4 sm:mt-6">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-['Ubuntu'] text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black sm:px-5 sm:py-2.5 sm:text-sm">
                        Read Story
                        <svg
                          className="h-3 w-3 sm:h-4 sm:w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        );

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
              isActive
                ? "pointer-events-auto z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            id={`slide-${idx}`}
            data-testid={`hero-slide-${idx}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${count}`}
            aria-hidden={!isActive}
          >
            {slide.linkUrl ? (
              <Link
                href={slide.linkUrl}
                draggable={false}
                tabIndex={isActive ? 0 : -1}
                className="group block h-full w-full text-inherit no-underline"
              >
                {slideContent}
              </Link>
            ) : (
              slideContent
            )}
          </div>
        );
      })}

      {/* Dots */}
      {count > 1 && (
        <div
          className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-row items-center gap-2.5 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 lg:right-12"
          id="heroDots"
          data-testid="hero-dots"
          // Keep dot taps from starting a swipe gesture on the wrapper
          onPointerDown={(e) => e.stopPropagation()}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`cursor-pointer rounded-full border-0 transition-all duration-300 ${
                idx === current
                  ? "active h-3.5 w-10 bg-[var(--green)]"
                  : "h-3 w-3 bg-white/30"
              }`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current}
              data-testid={`hero-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
