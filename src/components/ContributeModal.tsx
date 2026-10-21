'use client';

import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void | Promise<void>;
  defaultTab?: string;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const contributionOptions = [
    {
      title: 'Drop a quote',
      description: 'Share a thought, reflection or piece of advice',
      href: 'https://forms.gle/qZNp9KhdbiQjCWNb9',
    },
    {
      title: 'Project Feature',
      description: 'Share the story behind a creative project',
      href: 'https://forms.gle/qnxJqCs9cmHmFfgH7',
    },
    {
      title: 'Convo with a Creative',
      description: 'Share your creative journey, experiences and lessons.',
      href: 'https://forms.gle/g5wLTry5P6AqWz9Z7',
    },
    {
      title: 'Creanote Feature',
      description: 'Share your creative journey, experiences and lessons.',
      href: 'https://forms.gle/j4pArmLFyH2KDMqHA',
    },
    {
      title: 'Join the team',
      description: 'Share your creative journey, experiences and lessons.',
      href: 'https://forms.gle/JZ1Xgp3PiAfzyijg8',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-lg border border-[var(--border)] bg-[#07100c] p-3 shadow-2xl animate-in fade-in zoom-in duration-200 sm:p-4"
        data-testid="contribute-modal"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[var(--muted)] transition hover:bg-white/15 hover:text-white"
          aria-label="Close contribute options"
        >
          <X size={14} />
        </button>

        <div className="mb-3 pr-8">
          <h2 className="font-['Ubuntu'] text-sm font-extrabold text-[var(--green)] sm:text-base">
            Contribute to Creanote
          </h2>
          <p className="mt-1 text-[9px] leading-tight text-[var(--muted)] sm:text-[10px]">
            There are a few ways you can be part of the Creanote community.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {contributionOptions.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group flex min-h-11 items-center justify-between rounded-md border border-white/10 bg-[#121c16] px-3 py-2 transition-colors hover:border-[var(--green)] hover:bg-[var(--green)]/10"
            >
              <span className="min-w-0 pr-3">
                <span className="block truncate font-['Ubuntu'] text-[11px] font-bold text-white sm:text-xs">
                  {option.title}
                </span>
                <span className="mt-0.5 block truncate text-[8px] leading-tight text-[var(--muted)] sm:text-[9px]">
                  {option.description}
                </span>
              </span>
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--green)] text-[var(--green)] transition-colors group-hover:bg-[var(--green)] group-hover:text-[#07100c]">
                <ArrowUpRight size={10} strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
