"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { NewsletterBand } from "@/components/NewsletterBand";
import { Footer } from "@/components/Footer";
import { SearchModal } from "@/components/SearchModal";
import { ContributeModal } from "@/components/ContributeModal";
import { PostData } from "@/components/PostRow";
import { normalizeStoryCategory, placeholderUrl } from "@/lib/defaultData";
import { normalizePostData } from "@/lib/postData";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  ArrowUpRight,
  X,
} from "lucide-react";
import { DotsLoader } from "@/components/DotsLoader";
import { formatDate } from "@/utils/formatDate";

// Render the story detail page and its supporting overlays.
export default function StoryDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isAuthorLightboxOpen, setIsAuthorLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load the current story and the list used for search and related posts.
  useEffect(() => {
    setIsLoading(true);

    // 1. Fetch exact story by id or slug
    fetch(`/api/posts/${encodeURIComponent(idOrSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setPost(
          data && !data.error
            ? normalizePostData(data as Record<string, unknown>)
            : null,
        );
      })
      .catch(() => setPost(null))
      .finally(() => setIsLoading(false));

    // 2. Fetch all posts for related stories and search
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPosts(
            data.map((item) =>
              normalizePostData(item as Record<string, unknown>),
            ),
          );
        }
      })
      .catch((e) => console.warn("Using default posts list:", e));
  }, [idOrSlug]);

  // Show a loading state while the story request is pending.
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060a07] text-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="font-['Ubuntu'] text-sm font-bold text-copy-muted tracking-widest uppercase">
            Loading Story
          </div>
          <DotsLoader />
        </div>
      </main>
    );
  }

  // Show a fallback when the requested story cannot be found.
  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060a07] text-white">
        <div className="text-center">
          <div className="font-['Ubuntu'] text-xl font-bold">
            Story not found.
          </div>
          <Link
            href="/stories"
            className="mt-4 inline-block text-sm text-brand-green underline"
          >
            Back to Stories
          </Link>
        </div>
      </main>
    );
  }

  // Normalize display values and select related content.
  const authorName = post.authorName || post.author || "Creanote Creator";
  const authorRole = post.authorRole || "Creator";
  const authorAvatar = post.authorAvatar || null;
  const authorInitial = authorName.charAt(0).toUpperCase() || "C";
  const postURL = post.postURL?.trim();
  const canOpenPostURL = Boolean(
    postURL && /^https?:\/\//i.test(postURL),
  );

  const cover =
    post.coverImage ||
    post.thumbUrl ||
    placeholderUrl(post.headline || "Creanote Story Cover", 1200, 675);

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.slug !== post.slug)
    .slice(0, 3);

  const paragraphs =
    post.content || post.excerpt || post.sub
      ? (post.content || post.excerpt || post.sub).split(/\n{2,}/)
      : [
          "Every creative journey is punctuated by moments of uncertainty and breakthroughs. Documenting the process helps not only the author synthesize their learnings, but also provides a blueprint for the next creator who walks this path.",
          "When building something new, feedback loops matter. By embracing transparency, creators discover a community of collaborators, early supporters, and peers who value the craft.",
        ];

  // Render the page content, navigation, related stories, and modals.
  return (
    <main className="min-h-screen bg-[#060a07] text-copy">
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onContributeClick={() => setIsContributeOpen(true)}
      />

      <article className="mx-auto max-w-230 px-6 py-10 md:px-8 md:py-16">
        {/* Story header and metadata. */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted transition hover:text-brand-green"
          >
            <ArrowLeft size={14} />
            Back to All Stories
          </Link>

          <span className="rounded bg-(--green)/15 px-3 py-1 font-['Ubuntu'] text-[11px] font-black uppercase tracking-wider text-brand-green">
            {normalizeStoryCategory(post.category)}
          </span>
        </div>

        <h1 className="font-['Ubuntu'] text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
          {post.headline}
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-brand-border py-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-brand-green bg-[#0c1611]">
              {authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-lg font-bold text-white">
                  {authorInitial}
                </span>
              )}
            </div>
            <div>
              <div className="font-['Ubuntu'] text-sm font-bold text-white">
                {authorName}
              </div>
              <div className="text-xs text-copy-muted">{authorRole}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-copy-muted">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brand-orange">
              <Calendar size={13} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime || "4 min read"}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Story link copied to clipboard!");
              }}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-brand-border px-2.5 py-1 text-white transition hover:border-brand-green hover:text-brand-green"
              aria-label="Share story"
            >
              <Share2 size={13} />
              Share
            </button>
            {canOpenPostURL && (
              <a
                href={postURL}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-1 rounded-md border border-brand-green/50 px-2.5 py-1 font-bold text-brand-green transition hover:bg-brand-green hover:text-black"
              >
                Go to original post
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>

        <div className="relative my-8 aspect-video w-full overflow-hidden rounded-[20px] border border-white/8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={post.headline}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Story body and highlighted quotation. */}
        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed text-neutral-300">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-base leading-relaxed md:text-lg">
              {p}
            </p>
          ))}

          <div className="my-8 rounded-2xl border border-l-4 border-white/8 border-l-brand-green bg-[#0d1611] p-6">
            <p className="font-['Ubuntu'] text-lg font-bold italic text-white md:text-xl">
              &ldquo;{post.headline}&rdquo;
            </p>
            <div className="mt-3 text-xs font-bold uppercase tracking-wider text-brand-orange">
              — {authorName}
            </div>

            {canOpenPostURL && (
              <a
                href={postURL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-green/40 px-5 py-3 font-['Ubuntu'] text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-black sm:w-auto"
              >
                Go to original post
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Author summary opens the author lightbox. */}
        <button
          type="button"
          onClick={() => setIsAuthorLightboxOpen(true)}
          className="group relative mt-14 block w-full cursor-pointer rounded-[20px] border border-brand-border bg-page-elevated p-6 text-left transition-colors hover:border-(--green)/30 md:p-8"
        >
          <div className="absolute right-6 top-6 text-neutral-500 transition-colors group-hover:text-brand-green">
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand-green bg-[#0c1611]">
              {authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-2xl font-bold text-white">
                  {authorInitial}
                </span>
              )}
            </div>
            <div className="pr-8">
              <h4 className="font-['Ubuntu'] text-base font-bold text-white">
                About {authorName}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-copy-muted">
                {authorRole}
                {/* . An active contributor to Creanote, sharing weekly
                milestones, development notes, and creative reflections. */}
              </p>
            </div>
          </div>
        </button>

        {post.gallery && post.gallery.length > 0 && (
          /* Project image gallery. */
          <div className="mt-14 w-full">
            <h3 className="mb-6 font-['Ubuntu'] text-2xl font-bold text-white">
              Project Gallery
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {post.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c1510]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${post.headline} gallery image ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {relatedPosts.length > 0 && (
        /* Related stories section. */
        <section className="border-t border-brand-border bg-[#090f0b] px-6 py-14 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-['Ubuntu'] text-2xl font-bold text-white">
                More Stories & Notes
              </h2>
              <Link
                href="/stories"
                className="text-xs font-bold text-brand-green hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rel, idx) => (
                <Link
                  key={rel.id || idx}
                  href={`/stories/${rel.slug || rel.id}`}
                  className="group flex flex-col no-underline text-inherit"
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded-[14px] border border-white/8 bg-black transition-colors duration-300 group-hover:border-white/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        rel.coverImage ||
                        rel.thumbUrl ||
                        placeholderUrl(rel.headline, 640, 400)
                      }
                      alt={rel.headline}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-black opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                  <div className="mt-3 line-clamp-2 font-['Ubuntu'] text-sm font-bold text-white transition group-hover:text-brand-green">
                    {rel.headline}
                  </div>
                  <div className="mt-1 text-xs font-bold text-brand-orange">
                    {formatDate(rel.date)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterBand />
      <Footer />

      {/* Search and contribution dialogs. */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={allPosts}
      />

      <ContributeModal
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
      />

      {/* Expanded author profile dialog. */}
      {isAuthorLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsAuthorLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-brand-border bg-[#090f0b] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAuthorLightboxOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="mx-auto mb-6 flex h-35 w-35 items-center justify-center overflow-hidden rounded-full border-[3px] border-brand-green bg-[#0c1611]">
              {authorAvatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-['Ubuntu'] text-5xl font-bold text-white">
                  {authorInitial}
                </span>
              )}
            </div>

            <h3 className="font-['Ubuntu'] text-2xl font-bold text-white">
              {authorName}
            </h3>
            <p className="mt-2 text-md leading-relaxed text-copy-muted">
              {authorRole}.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-copy-muted">
              {post.sub}.
            </p>
            {canOpenPostURL && (
              <a
                href={postURL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 font-['Ubuntu'] text-sm font-bold text-black transition hover:bg-[#20e365]"
              >
                Go to original post
                <ArrowUpRight size={16} />
              </a>
            )}
            <Link
              href={`/stories?author=${encodeURIComponent(authorName)}`}
              onClick={() => setIsAuthorLightboxOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 font-['Ubuntu'] text-[13px] font-bold uppercase tracking-wider text-black shadow-[0_4px_14px_rgba(0,208,132,0.35)] transition-transform hover:scale-[1.02]"
            >
              View all stories
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
