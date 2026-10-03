"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Menu, X } from "lucide-react";

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const searchParams = useParams();
  const tabs = [
    { id: "overview", label: "Dashboard" },
    { id: "posts", label: "Posts" },
    { id: "quotes", label: "Quotes" },
    { id: "hero", label: "Homepage Banners" },
    { id: "subscribers", label: "Mailing List" },
  ];
  useEffect(() => {
    const getHashlinkFromUrl = () => {
      const getHashLink = window.location.hash;
      const currentHashLink = getHashLink.replace("#", "");
      return currentHashLink;
    };
    if (window.location.hash) {
      handleTabClick(getHashlinkFromUrl());
    } else {
      handleTabClick("overview");
    }
  }, [searchParams]);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    window.location.hash = tabId;
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={`admin-container min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row group ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      data-testid="admin-layout"
    >
      {/* Mobile Header (Visible only on small screens) */}
      <header className="md:hidden border-b border-[var(--border)] bg-[#090e0b] px-4 py-3.5 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg px-2 py-1 transition hover:opacity-90 no-underline shadow-sm"
            aria-label="Creanote Home"
          >
            <Image
              src="/images/creanote-logo-white.png"
              alt="Creanote."
              width={768}
              height={325}
              className="block h-20 w-auto object-contain"
              priority
            />
          </Link>
          <span className="text-[10px] bg-[var(--green)] text-black py-0.5 px-2 rounded-md font-extrabold tracking-wider uppercase">
            Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="cursor-pointer p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[var(--green)] hover:border-[var(--green)] transition"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full ${isCollapsed ? 'md:w-20' : 'md:w-64'} bg-[#090e0b] border-r border-[var(--border)] flex flex-col transition-all duration-300 md:sticky md:top-0 md:h-screen md:flex-shrink-0 z-30 ${
          isMobileMenuOpen ? "block" : "hidden md:flex"
        }`}
      >
        {/* Desktop Logo */}
        <div className={`hidden md:flex items-center px-6 py-6 border-b border-[var(--border)]/50 ${isCollapsed ? 'justify-center px-2' : 'gap-3'}`}>
          <Link
            href="/"
            className={`inline-flex items-center rounded-lg transition hover:opacity-90 no-underline shadow-sm ${isCollapsed ? 'px-0' : 'px-2 py-1'}`}
            aria-label="Creanote Home"
          >
            {isCollapsed ? (
              <div className="w-8 h-8 bg-[var(--green)] rounded-md flex items-center justify-center text-black font-black text-xl">C</div>
            ) : (
              <Image
                src="/images/creanote-logo-white.png"
                alt="Creanote."
                width={768}
                height={325}
                className="block h-20 w-auto object-contain"
                priority
              />
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-y-auto`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`w-full ${isCollapsed ? 'justify-center px-0 text-center font-bold text-lg' : 'text-left px-4 text-sm font-semibold'} py-2.5 rounded-lg font-['Ubuntu'] transition-all ${
                activeTab === tab.id
                  ? "bg-[var(--green)] text-black shadow-[0_2px_10px_rgba(0,208,132,0.2)]"
                  : "text-[var(--muted)] hover:bg-[rgba(0,208,132,0.1)] hover:text-white"
              }`}
              onClick={() => handleTabClick(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
              title={isCollapsed ? tab.label : undefined}
            >
              {isCollapsed ? tab.label[0] : tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className={`p-4 border-t border-[var(--border)]/50 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 mb-2 rounded-lg bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white hover:bg-white/10 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>

          <Link
            href="/"
            className={`w-full block text-center ${isCollapsed ? 'px-2 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-semibold font-['Ubuntu'] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-white no-underline transition-colors`}
            title={isCollapsed ? "View Live Site" : undefined}
          >
            {isCollapsed ? "Live" : "View Live Site"}
          </Link>
          {onLogout && (
            <button
              type="button"
              className={`w-full text-center ${isCollapsed ? 'px-2 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-semibold font-['Ubuntu'] bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.4)] text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors cursor-pointer`}
              onClick={onLogout}
              data-testid="admin-logout-btn"
              title={isCollapsed ? "Sign Out" : undefined}
            >
              {isCollapsed ? "Out" : "Sign Out"}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-10 overflow-y-auto min-h-[calc(100vh-65px)] md:min-h-screen">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
