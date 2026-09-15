import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OverviewManager } from '@/components/admin/OverviewManager';
import { TopListManager } from '@/components/admin/TopListManager';
import { PostsManager } from '@/components/admin/PostsManager';
import { QuotesManager } from '@/components/admin/QuotesManager';
import { SubscribersManager } from '@/components/admin/SubscribersManager';
import { defaultTopItems, defaultPosts, defaultQuotes } from '@/lib/defaultData';

describe('Milestone 5: Admin CMS Dashboard Components', () => {
  test('AdminLayout renders brand, tabs, and triggers onTabChange', () => {
    const onTabChange = jest.fn();
    render(
      <AdminLayout activeTab="overview" onTabChange={onTabChange}>
        <div>Admin Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Creanote CMS')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();

    const topListTab = screen.getByTestId('admin-tab-top-list');
    fireEvent.click(topListTab);
    expect(onTabChange).toHaveBeenCalledWith('top-list');
  });

  test('OverviewManager displays stats counters and seed button', () => {
    const onRefresh = jest.fn();
    render(
      <OverviewManager
        topCount={3}
        postCount={6}
        quoteCount={8}
        heroCount={4}
        subCount={10}
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByText('Top Highlights')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Posts & Stories')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Quotes')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByTestId('seed-database-btn')).toBeInTheDocument();
  });

  test('TopListManager displays current items and handles edit click', () => {
    const onRefresh = jest.fn();
    render(<TopListManager items={defaultTopItems} onRefresh={onRefresh} />);

    expect(
      screen.getByText('Manage “Top on the List” Cards')
    ).toBeInTheDocument();

    const titleInput = screen.getByTestId('top-item-title-input');
    expect(titleInput).toBeInTheDocument();

    // Click Edit on the first item
    const editBtn = screen.getByTestId('edit-top-btn-0');
    fireEvent.click(editBtn);

    expect(titleInput).toHaveValue(defaultTopItems[0].title);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('PostsManager displays stories and toggles edit state', () => {
    const onRefresh = jest.fn();
    render(<PostsManager posts={defaultPosts} onRefresh={onRefresh} />);

    expect(screen.getByText('Manage Stories & Posts')).toBeInTheDocument();
    const headlineInput = screen.getByTestId('post-headline-input');

    const editBtn = screen.getByTestId('edit-post-btn-0');
    fireEvent.click(editBtn);

    expect(headlineInput).toHaveValue(defaultPosts[0].headline);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('QuotesManager displays quotes and populates form on edit', () => {
    const onRefresh = jest.fn();
    render(<QuotesManager quotes={defaultQuotes} onRefresh={onRefresh} />);

    expect(screen.getByText('Manage Quotes Timeline')).toBeInTheDocument();
    const boldInput = screen.getByTestId('quote-bold-input');

    const editBtn = screen.getByTestId('edit-quote-btn-0');
    fireEvent.click(editBtn);

    expect(boldInput).toHaveValue(defaultQuotes[0].boldText);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('SubscribersManager displays email list and copies to clipboard', () => {
    const subscribers = [
      { email: 'member1@test.com', createdAt: new Date() },
      { email: 'member2@test.com', createdAt: new Date() },
    ];

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    render(<SubscribersManager subscribers={subscribers} />);

    expect(screen.getByText('member1@test.com')).toBeInTheDocument();
    expect(screen.getByText('member2@test.com')).toBeInTheDocument();

    const copyBtn = screen.getByTestId('copy-subscribers-btn');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'member1@test.com, member2@test.com'
    );
  });
});
