"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SearchModal } from "./SearchModal";


interface NavbarProps {
  onSearchClick?: () => void;
  onContributeClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onContributeClick,
}) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchClick = () => {
    closeMenu(); // Close mobile menu if open
    if (onSearchClick) {
      onSearchClick();
    } else {
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <nav className="relative z-[100] bg-[rgba(248,252,248,0.97)] backdrop-blur-[10px] border-b border-black/10">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-10 py-10 max-md:px-6 max-md:py-5">
          {/* Logo - Far Left */}
          <Link
            href="/"
            className="flex items-center gap-[7px] font-['Ubuntu'] text-[19px] font-extrabold text-[#0a0a0a] no-underline"
            aria-label="Creanote Home"
            onClick={closeMenu}
          >
            <Image
              src="/images/creanote_logo.png"
              alt="Creanote."
              width={185}
              height={28}
              priority
              className="block h-7 w-auto"
            />
          </Link>

          {/* Hamburger Menu Button - Visible on Mobile Only */}
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-2 text-[#0a0a0a] transition-transform duration-200 hover:scale-105 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              xmlns="http://w3.org"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8"></line>
                  <line x1="3" y1="16" x2="21" y2="16"></line>
                </>
              )}
            </svg>
          </button>

          {/* Nav Links Container - Far Right */}
          <div className={`absolute left-0 right-0 top-full flex w-full flex-col items-stretch justify-start gap-0 border-b border-black/10 bg-[rgba(248,252,248,0.98)] px-6 pb-6 pt-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] backdrop-blur-[15px] transition-[opacity,transform,visibility] duration-200 md:static md:flex md:w-[60%] md:flex-row md:items-center md:justify-between md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none ${isMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2.5 opacity-0"} md:visible md:translate-y-0 md:opacity-100`}>
            
            <div className="md:hidden text-xs font-bold uppercase tracking-[1.5px] text-[var(--orange)] mb-2 mt-2">Explore</div>
            
            <Link
              href="/"
              className={`py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black md:py-0 md:text-sm ${pathname === "/" ? "active font-bold text-black underline decoration-2 max-md:text-[var(--green-dark)] max-md:no-underline" : ""}`}
              id="nav-home"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/stories"
              className={`py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black md:py-0 md:text-sm ${pathname === "/stories" ? "active font-bold text-black underline decoration-2 max-md:text-[var(--green-dark)] max-md:no-underline" : ""}`}
              id="nav-stories"
              onClick={closeMenu}
            >
              Stories
            </Link>
            <Link
              href="/quotes"
              className={`py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black md:py-0 md:text-sm ${pathname === "/quotes" ? "active font-bold text-black underline decoration-2 max-md:text-[var(--green-dark)] max-md:no-underline" : ""}`}
              id="nav-quotes"
              onClick={closeMenu}
            >
              Quotes
            </Link>
            <Link
              href="/about"
              className={`py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black md:py-0 md:text-sm ${pathname === "/about" ? "active font-bold text-black underline decoration-2 max-md:text-[var(--green-dark)] max-md:no-underline" : ""}`}
              id="nav-about"
              onClick={closeMenu}
            >
              About
            </Link>

            <div className="md:hidden text-xs font-bold uppercase tracking-[1.5px] text-[var(--orange)] mb-2 mt-4">Legal</div>
            
            <Link
              href="/privacy"
              className={`md:hidden py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black ${pathname === "/privacy" ? "font-bold text-[var(--green-dark)]" : ""}`}
              onClick={closeMenu}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className={`md:hidden py-3 text-base font-semibold tracking-[-0.02em] text-black/60 no-underline transition-colors hover:text-black ${pathname === "/terms" ? "font-bold text-[var(--green-dark)]" : ""}`}
              onClick={closeMenu}
            >
              Terms
            </Link>

            <button
              type="button"
              className="grid h-auto w-full cursor-pointer place-items-start border-0 bg-transparent py-4 mt-2 md:h-6 md:w-6 md:place-items-center md:p-0 md:mt-0"
              onClick={handleSearchClick}
              aria-label="Search"
            >
              {/* Fixed invalid namespace and hyphenated JSX properties */}
              <svg
                xmlns="http://w3.org"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <button
              type="button"
              className="mt-5 w-full cursor-pointer rounded-3xl border-0 bg-[#0a0a0a] px-5 py-3 text-center text-sm font-bold tracking-[-0.02em] text-[var(--text)] transition-all hover:bg-[var(--green)] hover:text-black hover:opacity-85 md:mt-0 md:w-auto md:py-2 md:text-[13px]"
              onClick={() => {
                closeMenu();
                onContributeClick?.(); // Safe optional execution fix
              }}
              aria-label="Contribute to Creanote"
            >
              Contribute
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop Overlay */}
      <div
        className={`fixed inset-0 top-[96px] z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {!onSearchClick && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
};
