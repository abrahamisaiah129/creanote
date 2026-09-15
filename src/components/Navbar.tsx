'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onSearchClick?: () => void;
  onContributeClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick, onContributeClick }) => {
  const pathname = usePathname();

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-box">
            <svg viewBox="0 0 14 14">
              <rect x="1" y="1" width="5" height="5" rx="1" />
              <rect x="8" y="1" width="5" height="5" rx="1" />
              <rect x="1" y="8" width="5" height="5" rx="1" />
              <rect x="8" y="8" width="5" height="5" rx="1" />
            </svg>
          </div>
          Creanote.
        </Link>
        <div className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''} id="nav-home">
            Home
          </Link>
          <Link href="/stories" className={pathname === '/stories' ? 'active' : ''} id="nav-stories">
            Stories
          </Link>
          <Link href="/quotes" className={pathname === '/quotes' ? 'active' : ''} id="nav-quotes">
            Quotes
          </Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''} id="nav-about">
            About
          </Link>
          <span className="nav-search" onClick={onSearchClick} role="button" aria-label="Search" tabIndex={0}>
            &#9906;
          </span>
        </div>
        <button
          type="button"
          className="nav-pill"
          onClick={onContributeClick}
          aria-label="Contribute to Creanote"
        >
          Contribute
        </button>
      </div>
    </nav>
  );
};
