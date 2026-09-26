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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  const handlePillClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0) {
      const clickX = e.clientX - rect.left;
      const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetPage = Math.min(
        totalPages,
        Math.max(1, Math.ceil(clickRatio * totalPages))
      );
      if (targetPage === currentPage) {
        setCurrentPage((p) => (p < totalPages ? p + 1 : 1));
      } else {
        setCurrentPage(targetPage);
      }
    } else {
      setCurrentPage((p) => (p < totalPages ? p + 1 : 1));
    }
  };

  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentPage / totalPages) * 100)
  );

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

        {/* Pagination underneath (< 1 2 3 >) */}
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Progress Bar in Orange Below Component (Centered, 10% width, thick as before) */}
        <div
          role="progressbar"
          aria-valuenow={currentPage}
          aria-valuemin={1}
          aria-valuemax={totalPages}
          aria-label="Posts pagination progress - click for next set"
          onClick={handlePillClick}
          className="group mx-auto mt-8 flex h-1.5 w-[20%] min-w-[120px] max-w-[200px] md:w-[40%] md:max-w-[400px] cursor-pointer overflow-hidden rounded-full bg-white/20 transition-all hover:h-2"
          title="Click to view next posts"
          data-testid="posts-progress-bar"
        >
          <div
            className="h-full rounded-full bg-[var(--orange)] transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
            data-testid="posts-progress-fill"
          />
        </div>
      </div>
    </section>
  );
};
