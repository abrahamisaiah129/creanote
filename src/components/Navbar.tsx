'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
interface NavbarProps {
  onSearchClick?: () => void;
  onContributeClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick, onContributeClick }) => {
  const pathname = usePathname();
  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="logo" aria-label="Creanote Home">
          <Image
            src="/images/creanote_logo.png"
            alt="Creanote."
            width={185}
            height={28}
            priority
            style={{ height: '28px', width: 'auto', display: 'block' }}
          />
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
