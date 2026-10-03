import React, { useEffect } from 'react';

interface SuccessLightboxProps {
  message: string;
  onClose: () => void;
}

export const SuccessLightbox: React.FC<SuccessLightboxProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  // Don't show the success modal for loading states
  if (message === 'Saving...' || message === 'Deleting...' || message.includes('status')) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-[#0c120e] border border-[var(--border)] px-6 py-4 rounded-xl shadow-2xl flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-bold text-sm tracking-wide">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-[#0c120e] border border-[var(--border)] px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 bg-[var(--green)]/20 rounded-full flex items-center justify-center mb-4 border border-[var(--green)]/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <p className="text-white font-bold text-lg tracking-wide">{message}</p>
      </div>
    </div>
  );
};
