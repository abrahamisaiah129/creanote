"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { PostData } from "./PostRow";
import { TopCardData } from "./TopCard";
import { QuoteData } from "./QuoteBand";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts?: PostData[];
  topItems?: TopCardData[];
  quotes?: QuoteData[];
}

const EMPTY_POSTS: PostData[] = [];
const EMPTY_TOP_ITEMS: TopCardData[] = [];
const EMPTY_QUOTES: QuoteData[] = [];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  posts = EMPTY_POSTS,
  topItems = EMPTY_TOP_ITEMS,
  quotes = EMPTY_QUOTES,
}) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'ALL' | 'STORIES' | 'QUOTES' | 'HIGHLIGHTS'>('ALL');
  const [livePosts, setLivePosts] = useState<PostData[]>(posts);
  const [liveTopItems, setLiveTopItems] = useState<TopCardData[]>(topItems);
  const [liveQuotes, setLiveQuotes] = useState<QuoteData[]>(quotes);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLivePosts(posts);
  }, [posts]);

  useEffect(() => {
    setLiveTopItems(topItems);
  }, [topItems]);

  useEffect(() => {
    setLiveQuotes(quotes);
  }, [quotes]);

  // Sync with live database endpoints whenever modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setLivePosts(data);
        })
        .catch(() => {});

      fetch('/api/top-items')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setLiveTopItems(data);
        })
        .catch(() => {});

      fetch('/api/quotes')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setLiveQuotes(data);
        })
        .catch(() => {});

      // Focus search input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle closing with Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Universal Filter: Stories
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    return livePosts.filter((p) => {
      const headline = (p.headline || "").toLowerCase();
      const sub = (p.sub || "").toLowerCase();
      const author = (p.author || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const content = (p.content || "").toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
      return (
        headline.includes(lowerQuery) ||
        sub.includes(lowerQuery) ||
        author.includes(lowerQuery) ||
        category.includes(lowerQuery) ||
        content.includes(lowerQuery) ||
        tags.includes(lowerQuery)
      );
    });
  }, [query, livePosts]);

  // Universal Filter: Highlights
  const filteredCards = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    return liveTopItems.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const meta = (c.meta || "").toLowerCase();
      const badge = (c.badgeText || "").toLowerCase();
      return (
        title.includes(lowerQuery) ||
        meta.includes(lowerQuery) ||
        badge.includes(lowerQuery)
      );
    });
  }, [query, liveTopItems]);

  // Universal Filter: Quotes (removed per user request)
  const filteredQuotes = useMemo(() => {
    return [];
  }, [query, liveQuotes]);


  if (!isOpen) return null;

  const totalResults = filteredPosts.length + filteredQuotes.length + filteredCards.length;
  const hasPosts = filteredPosts.length > 0;
  const hasCards = filteredCards.length > 0;
  const hasQuotes = filteredQuotes.length > 0;

  const showStories = (activeTab === 'ALL' || activeTab === 'STORIES') && hasPosts;
  const showQuotes = (activeTab === 'ALL' || activeTab === 'QUOTES') && hasQuotes;
  const showCards = (activeTab === 'ALL' || activeTab === 'HIGHLIGHTS') && hasCards;

  const quickPillSearches = ['Developer', 'Faith', 'Oluwadara', 'Creative', 'Note', 'Build'];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/80 px-4 pb-6 pt-16 md:pt-24 backdrop-blur-[10px]"
      onClick={onClose}
      data-testid="search-modal"
      role="presentation"
    >
      <div
        className="relative max-h-[85vh] w-full max-w-[680px] overflow-hidden flex flex-col rounded-3xl border border-[var(--border)] bg-[#0a110c] text-[var(--text)] shadow-[0_24px_70px_rgba(0,0,0,.8)] [animation:search-modal-in_.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Header bar */}
        <div className="p-6 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--green)]/20 text-[var(--green)]">
                <Search size={14} />
              </span>
              <h3
                className="font-sans text-lg font-bold text-white tracking-tight"
                id="search-modal-title"
              >
                Universal Search
              </h3>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/5 text-[var(--muted)] hover:bg-white/15 hover:text-white transition"
              onClick={onClose}
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-4 text-[var(--muted)] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#111a14] pl-11 pr-10 text-sm font-medium text-white outline-none placeholder:text-[var(--muted)] transition focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20"
              placeholder="Search stories, creator quotes, highlights, authors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="search-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] hover:text-white"
                title="Clear query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills Tab Bar (Only when query is present and results exist) */}
          {query && totalResults > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`cursor-pointer rounded-full px-3 py-1 font-bold transition whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-[var(--green)] text-black'
                    : 'bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10'
                }`}
              >
                All Results ({totalResults})
              </button>
              {hasPosts && (
                <button
                  type="button"
                  onClick={() => setActiveTab('STORIES')}
                  className={`cursor-pointer rounded-full px-3 py-1 font-bold transition whitespace-nowrap ${
                    activeTab === 'STORIES'
                      ? 'bg-[var(--green)] text-black'
                      : 'bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10'
                  }`}
                >
                  Stories ({filteredPosts.length})
                </button>
              )}
              {hasQuotes && (
                <button
                  type="button"
                  onClick={() => setActiveTab('QUOTES')}
                  className={`cursor-pointer rounded-full px-3 py-1 font-bold transition whitespace-nowrap ${
                    activeTab === 'QUOTES'
                      ? 'bg-[var(--green)] text-black'
                      : 'bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10'
                  }`}
                >
                  Quotes ({filteredQuotes.length})
                </button>
              )}
              {hasCards && (
                <button
                  type="button"
                  onClick={() => setActiveTab('HIGHLIGHTS')}
                  className={`cursor-pointer rounded-full px-3 py-1 font-bold transition whitespace-nowrap ${
                    activeTab === 'HIGHLIGHTS'
                      ? 'bg-[var(--green)] text-black'
                      : 'bg-white/5 text-[var(--muted)] hover:text-white hover:bg-white/10'
                  }`}
                >
                  Highlights ({filteredCards.length})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-6 font-sans">
          {query ? (
            <>
              {/* STORIES SECTION */}
              {showStories && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                      Stories & Notes ({filteredPosts.length})
                    </span>
                    <Link
                      href="/stories"
                      onClick={onClose}
                      className="text-xs font-bold text-[var(--green)] hover:underline inline-flex items-center gap-0.5"
                    >
                      View all in Stories &rarr;
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {filteredPosts.map((p, idx) => {
                      const targetId = p.slug || p.id || (p as any)._id || '';
                      return (
                      <Link
                        key={targetId || p.headline || idx}
                        href={`/stories/${targetId}`}
                        onClick={onClose}
                        className="group flex items-start gap-3 rounded-xl border border-white/5 bg-[#0f1712] p-3.5 transition hover:border-[var(--green)]/40 hover:bg-[#131f18] no-underline text-inherit"
                      >
                        {p.thumbUrl && !p.isFeatureBadge ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.thumbUrl}
                            alt={p.headline}
                            className="h-14 w-20 shrink-0 rounded-lg object-cover border border-white/10"
                          />
                        ) : (
                          <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--green)]/15 text-[var(--green)] font-black text-xs">
                            NOTE
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--orange)]/15 text-[var(--orange)]">
                              {p.date}
                            </span>
                            {p.category && (
                              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--green)]/15 text-[var(--green)]">
                                {p.category}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-white transition group-hover:text-[var(--green)] line-clamp-1">
                            {p.headline}
                          </div>
                          <div className="text-xs text-[var(--muted)] line-clamp-1 mt-0.5">
                            {p.sub}
                          </div>
                        </div>
                        <span className="text-neutral-500 group-hover:text-[var(--green)] transition shrink-0 pt-1">
                          <ArrowUpRight size={15} />
                        </span>
                      </Link>
                    )})}
                  </div>
                </div>
              )}


              {/* HIGHLIGHTS SECTION */}
              {showCards && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--green)]">
                      Top Highlights ({filteredCards.length})
                    </span>
                    <Link
                      href="/#top-list"
                      onClick={onClose}
                      className="text-xs font-bold text-[var(--green)] hover:underline inline-flex items-center gap-0.5"
                    >
                      View on homepage &rarr;
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {filteredCards.map((c, idx) => (
                      <Link
                        key={c.id || c.title || idx}
                        href={c.linkUrl || "/#top-list"}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-xl border border-white/5 bg-[#0f1712] p-3 transition hover:border-[var(--green)]/40 hover:bg-[#131f18] no-underline text-inherit"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.imageUrl}
                          alt={c.title}
                          className="h-12 w-16 shrink-0 rounded-lg object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white transition group-hover:text-[var(--green)] line-clamp-1">
                            {c.title}
                          </div>
                          {c.meta && (
                            <div className="text-xs text-[#25c687] mt-0.5">
                              {c.meta}
                            </div>
                          )}
                        </div>
                        {c.badgeText && (
                          <span className="shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--orange)]/20 text-[var(--orange)] border border-[var(--orange)]/30">
                            {c.badgeText}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results state */}
              {totalResults === 0 && (
                <div className="py-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[var(--muted)] mb-3">
                    <Search size={20} />
                  </div>
                  <p className="text-base font-bold text-white">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] max-w-sm mx-auto">
                    We couldn&apos;t find any stories, quoter names, or highlights matching that term. Try another creator or keyword.
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Empty state / Suggested searches */
            <div className="py-8">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
                Quick Search Suggestions
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {quickPillSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="cursor-pointer rounded-full border border-white/10 bg-[#121c16] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-[var(--green)] hover:text-[var(--green)]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[var(--border)]">
                <Link
                  href="/stories"
                  onClick={onClose}
                  className="rounded-2xl border border-white/5 bg-[#0e1611] p-4 transition hover:border-[var(--green)]/40 hover:bg-[#121d17] no-underline"
                >
                  <div className="text-xs font-bold text-[var(--orange)] uppercase mb-1">
                    Stories & Notes
                  </div>
                  <div className="text-sm font-bold text-white">
                    Browse all creator reflections &rarr;
                  </div>
                </Link>
                <Link
                  href="/quotes"
                  onClick={onClose}
                  className="rounded-2xl border border-white/5 bg-[#0e1611] p-4 transition hover:border-[var(--green)]/40 hover:bg-[#121d17] no-underline"
                >
                  <div className="text-xs font-bold text-[#38bdf8] uppercase mb-1">
                    Quotes
                  </div>
                  <div className="text-sm font-bold text-white">
                    Explore quotes by creator name &rarr;
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
