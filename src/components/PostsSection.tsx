'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PostRow, PostData } from './PostRow';
import { Pagination } from './Pagination';

interface PostsSectionProps {
  posts: PostData[];
  title?: string;
  itemsPerPage?: number;
  showSidebar?: boolean;
  onPostClick?: (post: PostData) => void;
}

export const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  title = 'Posts',
  itemsPerPage = 3,
  onPostClick,
}) => {
  const currentPosts = posts.slice(0, itemsPerPage);

  return (
    <section
      className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 md:py-16"
      data-testid="posts-section"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Ubuntu'] text-2xl font-bold text-[var(--text)] md:text-3xl">
          {title}
        </h2>
        <Link
          href="/stories"
          className="text-xs font-bold text-[var(--green)] hover:underline"
        >
          View all stories &rarr;
        </Link>
      </div>

      {/* Single Column Post Feed matching media_1790238912174.png */}
      <div className="flex flex-col">
        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {currentPosts.map((post, idx) => (
            <PostRow
              key={post.id || idx}
              post={post}
              onClick={onPostClick ? () => onPostClick(post) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
