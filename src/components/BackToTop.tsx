'use client';

import React, { useEffect, useState } from 'react';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const distanceFromBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      setVisible(window.scrollY > 120 && distanceFromBottom > 120);
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-[300] grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-[var(--green)]/30 bg-black/40 text-[var(--green)] opacity-40 shadow-lg backdrop-blur-md transition-all duration-300 hover:opacity-100 hover:scale-110 hover:bg-[var(--green)] hover:text-black hover:border-[var(--green)] active:scale-95 active:opacity-100 focus:opacity-100 max-md:bottom-4 max-md:right-4"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      data-testid="back-to-top-btn"
    >
      <svg className="h-[22px] w-[22px] stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
};
