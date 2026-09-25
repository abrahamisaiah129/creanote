import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight, UserPlus, FileText, Quote, Image as ImageIcon, Star } from 'lucide-react';

interface OverviewProps {
  isLoading?: boolean;
  topCount: number;
  postCount: number;
  quoteCount: number;
  heroCount: number;
  subCount: number;
  onRefresh?: () => void;
  onNavigateTab?: (tab: string) => void;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const totalDuration = 800; // ms
    const incrementTime = 20; // ms
    const totalSteps = Math.ceil(totalDuration / incrementTime);
    const stepValue = end / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(currentStep * stepValue));
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}</>;
};

import { useActivityLog } from '@/context/ActivityLogContext';

export const OverviewManager: React.FC<OverviewProps> = ({
  isLoading = false,
  topCount,
  postCount,
  quoteCount,
  heroCount,
  subCount,
  onNavigateTab,
}) => {
  const { logs } = useActivityLog();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const contentStats = [
    { label: 'Highlights', count: topCount, icon: Star, tabId: 'top-list', btnText: 'Manage' },
    { label: 'Stories', count: postCount, icon: FileText, tabId: 'posts', btnText: 'Manage' },
    { label: 'Quotes', count: quoteCount, icon: Quote, tabId: 'quotes', btnText: 'Manage' },
    { label: 'Slides', count: heroCount, icon: ImageIcon, tabId: 'hero', btnText: 'Manage' },
  ];

  const communityStats = [
    { label: 'Subscribers', count: subCount, icon: UserPlus, colorClass: 'text-[#ec4899]', tabId: 'subscribers', btnText: 'View' },
  ];

  const totalContent = topCount + postCount + quoteCount + heroCount;

  return (
    <div>
      <div className="section-label mb-2">
        CMS Dashboard Overview
      </div>
      <p className="text-[var(--muted)] text-sm mb-7">
        Manage all content on the Creanote platform, add new stories, adjust top highlights, and track community members.
      </p>

      {/* 50/50 Split Stats Card Layout */}
      <div className="admin-card mb-8 flex flex-col overflow-hidden p-0 md:flex-row shadow-lg">
        
        {/* Hero Metric Half */}
        <div className="flex flex-1 flex-col justify-center border-b border-[var(--border)] bg-[#0a0f0c] p-8 md:border-b-0 md:border-r md:p-12 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--green)]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="font-['Ubuntu'] text-xs font-bold uppercase tracking-widest text-[var(--muted)] relative z-10">
            Total Published Content
          </div>
          
          <div className="mt-4 font-['Ubuntu'] text-6xl font-black tracking-tight text-white lg:text-[80px] leading-none relative z-10">
            {isLoading ? (
               <div className="h-16 lg:h-20 w-32 bg-white/5 rounded animate-pulse" />
            ) : (
               <AnimatedNumber value={totalContent} />
            )}
          </div>
          
          <div className="mt-8 flex items-center gap-2 font-['Ubuntu'] text-[10px] font-extrabold uppercase tracking-widest text-[var(--green)] relative z-10">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--green)]" />
            Live on Platform
          </div>
        </div>

        {/* Supporting Metrics Half */}
        <div className="flex-1 flex flex-col bg-[var(--border)] gap-px">
          
          {/* Content Metrics Group */}
          <div className="bg-[var(--bg2)] p-6 md:p-8 flex-1">
            <div className="font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-5 flex items-center gap-2 opacity-80">
              <span className="w-2 h-px bg-[var(--muted)]" /> Content Metrics
            </div>
            <div className="grid grid-cols-2 gap-4 gap-y-6">
              {contentStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col group">
                  <div className="flex items-center gap-2 mb-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                    <stat.icon size={13} className="text-[var(--muted)]" />
                    <div className="font-['Ubuntu'] text-[11px] font-semibold text-[var(--muted)]">
                      {stat.label}
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="h-6 w-12 bg-white/5 rounded animate-pulse mb-2" />
                  ) : (
                    <div className="font-['Ubuntu'] text-2xl font-extrabold text-white mb-2">
                      <AnimatedNumber value={stat.count} />
                    </div>
                  )}
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(stat.tabId)}
                      className="flex w-fit items-center gap-1 font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wider text-[var(--green)] transition hover:opacity-80"
                      data-testid={`overview-goto-${stat.tabId}`}
                    >
                      {stat.btnText} <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Community Metrics Group */}
          <div className="bg-[var(--bg2)] p-6 md:p-8">
            <div className="font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-5 flex items-center gap-2 opacity-80">
              <span className="w-2 h-px bg-[var(--muted)]" /> Community Metrics
            </div>
            <div className="grid grid-cols-2 gap-4">
              {communityStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col group">
                  <div className="flex items-center gap-2 mb-1.5 opacity-70 transition-opacity group-hover:opacity-100">
                    <stat.icon size={13} className={stat.colorClass || 'text-[var(--muted)]'} />
                    <div className="font-['Ubuntu'] text-[11px] font-semibold text-[var(--muted)]">
                      {stat.label}
                    </div>
                  </div>
                  {isLoading ? (
                    <div className="h-6 w-12 bg-white/5 rounded animate-pulse mb-2" />
                  ) : (
                    <div className={`font-['Ubuntu'] text-2xl font-extrabold mb-2 ${stat.colorClass || 'text-white'}`}>
                      <AnimatedNumber value={stat.count} />
                    </div>
                  )}
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(stat.tabId)}
                      className="flex w-fit items-center gap-1 font-['Ubuntu'] text-[10px] font-bold uppercase tracking-wider text-[var(--green)] transition hover:opacity-80"
                    >
                      {stat.btnText} <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Notifications Section */}
      <div className="admin-card mt-8 p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-['Ubuntu'] text-base font-bold text-white flex items-center gap-2">
            <Bell size={16} className="text-[var(--orange)]" /> Session Activity
          </h3>
          {logs.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                &larr;
              </button>
              <span className="text-xs text-[var(--muted)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col gap-3">
             <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
             <div className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--muted)]">
            No activity logged in this session yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="group border border-[var(--border)] bg-[#0d1410] p-4 rounded-xl flex gap-4 transition-colors hover:border-[var(--green)]/30">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  log.type === 'create' ? 'bg-[var(--green)]' : 
                  log.type === 'delete' ? 'bg-red-500' : 'bg-[#38bdf8]'
                }`} />
                <div>
                  <div className="text-sm font-bold text-white font-['Ubuntu']">{log.message}</div>
                  <div className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                    {log.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
