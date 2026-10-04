'use client';

import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[#050a07] p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
        data-testid="contribute-modal"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/5 text-[var(--muted)] transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="font-['Ubuntu'] text-xl font-extrabold text-white">
            Contribute to Creanote
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            Select what you would like to share. You will be redirected to a secure Google Form to submit your details.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="https://forms.gle/qnxJqCs9cmHmFfgH7" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121c16] p-4 transition-colors hover:border-[var(--green)] hover:bg-[var(--green)]/10 group"
          >
            <span className="font-['Ubuntu'] text-sm font-bold text-white">Project Feature</span>
            <span className="text-[var(--green)] opacity-0 transition-opacity group-hover:opacity-100">→</span>
          </Link>
          
          <Link 
            href="https://forms.gle/qZNp9KhdbiQjCWNb9" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121c16] p-4 transition-colors hover:border-[var(--green)] hover:bg-[var(--green)]/10 group"
          >
            <span className="font-['Ubuntu'] text-sm font-bold text-white">Share a quote</span>
            <span className="text-[var(--green)] opacity-0 transition-opacity group-hover:opacity-100">→</span>
          </Link>
          
          <Link 
            href="https://forms.gle/g5wLTry5P6AqWz9Z7" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121c16] p-4 transition-colors hover:border-[var(--green)] hover:bg-[var(--green)]/10 group"
          >
            <span className="font-['Ubuntu'] text-sm font-bold text-white">Convo with a creative</span>
            <span className="text-[var(--green)] opacity-0 transition-opacity group-hover:opacity-100">→</span>
          </Link>
          
          <Link 
            href="https://forms.gle/j4pArmLFyH2KDMqHA" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121c16] p-4 transition-colors hover:border-[var(--green)] hover:bg-[var(--green)]/10 group"
          >
            <span className="font-['Ubuntu'] text-sm font-bold text-white">Creanote feature</span>
            <span className="text-[var(--green)] opacity-0 transition-opacity group-hover:opacity-100">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
