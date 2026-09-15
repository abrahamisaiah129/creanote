'use client';

import React, { useState } from 'react';
import { PostRow, PostData } from './PostRow';
import { Pagination } from './Pagination';

interface PostsSectionProps {
  posts: PostData[];
  title?: string;
  itemsPerPage?: number;
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

  return (
    <div className="posts-section" data-testid="posts-section">
      <div className="section-label">{title}</div>
      <div>
        {currentPosts.map((post, idx) => (
          <PostRow
            key={post.id || idx}
            post={post}
            onClick={() => onPostClick?.(post)}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
