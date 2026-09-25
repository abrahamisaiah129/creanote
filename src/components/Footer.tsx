"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchModal } from "@/components/SearchModal";
import { defaultPosts, defaultTopItems } from "@/lib/defaultData";

interface FooterProps {
  onSearchClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSearchClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <footer
      className="mt-auto border-t border-[var(--border)] bg-[var(--bg2)] px-6 pb-12 pt-16 md:px-12 md:pb-10 md:pt-16"
      data-testid="footer"
    >
      {/* Core wrapper: centered stack on mobile, wide 3-column layout on desktop */}
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-14 text-center md:max-w-6xl md:items-stretch md:gap-12 md:text-left">
        {/* Top grid: Brand | Explore | Socials & Search */}
        <div className="grid w-full grid-cols-1 gap-14 md:grid-cols-[1.2fr_1fr_1.2fr] md:gap-10">
          {/* Brand column */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link
              href="/"
              className="flex no-underline items-center justify-center transition hover:opacity-80 md:justify-start"
              aria-label="Creanote Home"
            >
              <div className="inline-flex items-center rounded-lg px-2 py-1">
                <Image
                  src="/images/creanote-logo-white.png"
                  alt="Creanote."
                  width={768}
                  height={325}
                  className="block h-20 w-auto object-contain"
                />
              </div>
            </Link>
            <a
              href="mailto:officialcreanote@gmail.com"
              className="font-['Ubuntu'] text-base md:text-lg font-bold text-[var(--orange)] transition hover:opacity-80"
            >
              officialcreanote@gmail.com
            </a>
            <p className="text-xs italic text-[var(--muted)]">
              ...notes from the creative journey
            </p>
          </div>

          {/* Explore column */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <span className="text-xs font-bold uppercase tracking-[1.5px] text-[var(--orange)]">
              Explore
            </span>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-4 justify-items-center md:grid-cols-1 md:justify-items-start md:gap-y-3">
              <Link
                className="text-sm font-semibold text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-sm font-semibold text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
                href="/stories"
              >
                Stories
              </Link>
              <Link
                className="text-sm font-semibold text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
                href="/quotes"
              >
                Quotes
              </Link>
              <Link
                className="text-sm font-semibold text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
                href="/about"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Socials & Search column */}
          <div className="flex flex-col items-center gap-6 md:items-start">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <span className="text-xs font-bold uppercase tracking-[1.5px] text-[var(--orange)]">
                Socials
              </span>
              <div className="flex justify-center gap-4 md:justify-start">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--green)] text-black transition hover:-translate-y-0.5 hover:opacity-80"
                  aria-label="Follow Creanote on Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--green)] text-black transition hover:-translate-y-0.5 hover:opacity-80"
                  aria-label="Follow Creanote on X (Twitter)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[var(--green)] text-black transition hover:-translate-y-0.5 hover:opacity-80"
                  aria-label="Follow Creanote on Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-[42px] w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)] md:w-auto md:max-w-none md:justify-start md:px-5"
              onClick={handleSearchClick}
              aria-label="Search Site"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Bottom bar with subtle hairline separator */}
        <div
          className="w-full border-t border-[var(--border)] pt-6 md:flex md:items-center md:justify-between"
          data-testid="footer-copyright-divider"
        >
          <p className="text-[11px] font-medium tracking-wide text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Creanote. All rights reserved.
          </p>
          <div className="mt-3 flex items-center justify-center gap-6 md:mt-0 md:justify-end">
            <Link
              className="text-[11px] font-medium text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-[11px] font-medium text-[var(--muted)] no-underline transition hover:text-[var(--green)]"
              href="/terms"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Conditionally rendered Search Modal Overlay */}
      {!onSearchClick && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          posts={defaultPosts}
          topItems={defaultTopItems}
        />
      )}
    </footer>
  );
};
