'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { placeholderUrl } from '@/lib/defaultData';

export interface PostData {
  id?: string;
  slug?: string;
  date: string;
  headline: string;
  sub: string;
  thumbUrl?: string;
  coverImage?: string;
  isFeatureBadge?: boolean;
  featureText?: string;
  category?: string;
  author?: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime?: string;
  content?: string;
  tags?: string[];
  page?: number;
  order?: number;
}

interface PostRowProps {
  post: PostData;
  onClick?: () => void;
}

export const PostRow: React.FC<PostRowProps> = ({ post, onClick }) => {
  const storyUrl = `/stories/${post.slug || post.id || (post as any)._id || 'note'}`;
  const thumbnail =
    post.thumbUrl ||
    post.coverImage ||
    placeholderUrl(post.headline, 640, 360);

  const rowContent = (
    <div
      className="group flex cursor-pointer flex-col md:flex-row-reverse md:items-center justify-between gap-4 py-6 border-b border-[var(--border)] transition-colors hover:border-[var(--green)]/30 sm:gap-8 md:py-8"
      onClick={onClick}
      data-testid="post-row"
    >
      {/* Thumbnail Banner with Bigger Height matching Figma design (now at the top on mobile) */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-[16px] border border-white/[0.08] transition-colors duration-300 group-hover:border-white/25 md:h-[145px] md:w-[310px] lg:h-[160px] lg:w-[350px] sm:rounded-[20px] md:rounded-[22px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={post.headline}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Top-right corner circular arrow icon */}
        <div className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-[var(--green)] backdrop-blur-sm border border-[var(--green)]/30 transition-colors group-hover:bg-[var(--green)] group-hover:text-black sm:right-3 sm:top-3">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row md:items-center gap-2 md:gap-4 lg:gap-8 min-w-0">
        {/* Date */}
        <div className="font-['Ubuntu'] text-xs font-bold uppercase tracking-wider text-[var(--orange)] md:w-[80px] shrink-0">
          {post.date}
        </div>

        {/* Headline & Subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-['Ubuntu'] text-sm font-bold leading-snug text-white transition-colors group-hover:text-[var(--green)] sm:text-base md:text-lg line-clamp-2">
            {post.headline}
          </h3>
          <p className="mt-1.5 text-xs text-[var(--muted)] sm:text-sm line-clamp-2">
            {post.sub}
          </p>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return rowContent;
  }

  return (
    <Link href={storyUrl} className="block no-underline text-inherit">
      {rowContent}
    </Link>
  );
};
