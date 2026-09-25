import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { OverviewManager } from '@/components/admin/OverviewManager';
import { TopListManager } from '@/components/admin/TopListManager';
import { PostsManager } from '@/components/admin/PostsManager';
import { QuotesManager } from '@/components/admin/QuotesManager';
import { SubscribersManager } from '@/components/admin/SubscribersManager';
import { defaultTopItems, defaultPosts, defaultQuotes } from '@/lib/defaultData';

jest.mock('@/context/ActivityLogContext', () => ({
  useActivityLog: () => ({
    addLog: jest.fn(),
    logs: [],
    clearLogs: jest.fn(),
  }),
}));

describe('Milestone 5: Admin CMS Dashboard Components', () => {
  test('AdminLogin renders authorization form and handles input', () => {
    const onLoginSuccess = jest.fn();
    render(<AdminLogin onLoginSuccess={onLoginSuccess} />);

    expect(screen.getByTestId('admin-login-screen')).toBeInTheDocument();
    expect(screen.getByText('Creanote CMS')).toBeInTheDocument();
    expect(
      screen.getByText('Authorization required to access the admin console')
    ).toBeInTheDocument();

    const usernameInput = screen.getByTestId('admin-username-input');
    const passwordInput = screen.getByTestId('admin-password-input');
    const submitBtn = screen.getByTestId('admin-login-btn');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'abrahamisaiah129' } });
    fireEvent.change(passwordInput, { target: { value: 'GB0cvCtov4jdESip' } });

    expect(usernameInput).toHaveValue('abrahamisaiah129');
    expect(passwordInput).toHaveValue('GB0cvCtov4jdESip');
  });

  test('AdminLayout renders brand, tabs, logout button, and triggers onTabChange and onLogout', () => {
    const onTabChange = jest.fn();
    const onLogout = jest.fn();
    render(
      <AdminLayout
        activeTab="overview"
        onTabChange={onTabChange}
        onLogout={onLogout}
      >
        <div>Admin Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();

    const topListTab = screen.getByTestId('admin-tab-top-list');
    fireEvent.click(topListTab);
    expect(onTabChange).toHaveBeenCalledWith('top-list');

    const logoutBtn = screen.getByTestId('admin-logout-btn');
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test('OverviewManager displays stats counters', async () => {
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

    expect(screen.getByText('Highlights')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Quotes')).toBeInTheDocument();
    expect(screen.getByText('Subscribers')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    }, { timeout: 3000 });
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
    const heroCheckbox = screen.getByTestId('quote-hero-checkbox');
    expect(heroCheckbox).toBeInTheDocument();

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
