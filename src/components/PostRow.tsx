import React from 'react';

export interface PostData {
  id?: string;
  date: string;
  headline: string;
  sub: string;
  thumbUrl?: string;
  isFeatureBadge?: boolean;
  featureText?: string;
  page?: number;
}

interface PostRowProps {
  post: PostData;
  onClick?: () => void;
}

export const PostRow: React.FC<PostRowProps> = ({ post, onClick }) => {
  return (
    <div className="post-row" onClick={onClick} data-testid="post-row">
      <div className="post-date">{post.date}</div>
      <div>
        <div className="post-headline">{post.headline}</div>
        <div className="post-sub">{post.sub}</div>
      </div>
      {post.isFeatureBadge ? (
        <div
          className="post-thumb"
          style={{
            background: '#0d1a0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 900,
              fontSize: '13px',
              color: 'var(--green)',
              textAlign: 'center',
              padding: '8px',
              whiteSpace: 'pre-line',
            }}
          >
            {post.featureText || 'Creanote\nFeature'}
          </span>
        </div>
      ) : post.thumbUrl ? (
        <div className="post-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbUrl} alt={post.headline} />
        </div>
      ) : null}
    </div>
  );
};
