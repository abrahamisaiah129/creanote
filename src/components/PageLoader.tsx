'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PageLoaderProps {
  message?: string;
  isOverlay?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading inspiration & visuals...',
  isOverlay = false,
}) => {
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 20;
        return prev + 12;
      });
    }, 280);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${
        isOverlay ? 'fixed inset-0 z-[999]' : 'min-h-[60vh] w-full'
      } flex flex-col items-center justify-center bg-[#060a07] px-6 text-center select-none animate-in fade-in duration-300`}
      data-testid="page-loader"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing ambient brand glow */}
        <div className="absolute -inset-6 rounded-full bg-[var(--green)]/15 blur-2xl animate-pulse" />

        {/* Navbar Brand Logo in a sleek branded pill */}
        <div className="relative inline-flex items-center justify-center rounded-2xl bg-[rgba(248,252,248,0.97)] px-6 py-3 shadow-[0_0_35px_rgba(0,208,132,0.2)] border border-white/20 transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/creanote_logo.png"
            alt="Creanote."
            width={185}
            height={28}
            priority
            className="block h-7 w-auto sm:h-8"
          />
          <span className="sr-only">CREANOTE</span>
        </div>

        {/* Small 10% Progress Bar (identical to home page style) */}
        <div
          className="mx-auto mt-6 w-[10%] min-w-[80px] max-w-[140px]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          data-testid="page-loader-progress-bar"
        >
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden transition-all duration-300 hover:h-2">
            <div
              className="h-full rounded-full bg-[var(--orange)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              data-testid="page-loader-progress-fill"
            />
          </div>
        </div>

        {/* Contextual message */}
        <p className="mt-4 font-['Ubuntu'] text-xs font-medium text-neutral-400">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
