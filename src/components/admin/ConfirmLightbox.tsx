import React from 'react';

interface ConfirmLightboxProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmLightbox: React.FC<ConfirmLightboxProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-[#0c120e] border border-[var(--border)] px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in duration-200 w-[90%] max-w-sm">
        <div className="w-12 h-12 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mb-4 border border-[var(--orange)]/30 text-[var(--orange)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
        <h3 className="text-white font-bold text-lg mb-2 text-center">{title}</h3>
        <p className="text-[var(--muted)] text-sm mb-6 text-center leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-[var(--border)] text-white rounded-lg font-bold transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-[var(--orange)] hover:bg-[#d64a2a] text-white rounded-lg font-bold transition text-sm"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
