import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StoriesPage from '@/app/stories/page';
import StoryDetailPage from '@/app/stories/[id]/page';
import { defaultPosts } from '@/lib/defaultData';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/stories',
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: 'post-1' }),
}));

describe('Stories Page & Story Reader Detail Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockImplementation((url: string) => {
      console.log('Fetching URL:', url);
      if (url.includes('/api/posts/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(defaultPosts[0]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: defaultPosts,
          total: defaultPosts.length,
          totalPages: 1,
          categories: ['DEV NOTE', 'UX/UI', 'CAREER'],
          authors: ['Joshua Afolabi', 'Praise Afolabi', 'Oluwadara Afolabi']
        }),
      });
    }) as jest.Mock;
  });

  test('StoriesPage renders grid with covers and text/metadata beneath each card', async () => {
    await React.act(async () => {
      render(<StoriesPage />);
    });

    expect(screen.getByText('Creator Stories & Notes')).toBeInTheDocument();

    // Check that story card elements exist
    const storyCard0 = screen.getByTestId('story-card-0');
    expect(storyCard0).toBeInTheDocument();

    // Verify headline is rendered
    expect(
      screen.getByText('A creator shared a note that keeps her going.')
    ).toBeInTheDocument();

    // Verify date is rendered
    expect(screen.getByText('JAN 21')).toBeInTheDocument();

    // Verify metadata below card (Author)
    expect(screen.getAllByText('Faith Borntowin')[0]).toBeInTheDocument();
  });

  test('StoriesPage filters by category pills', async () => {
    await React.act(async () => {
      render(<StoriesPage />);
    });

    let devNotePill: HTMLElement;
    await waitFor(() => {
      devNotePill = screen.getByRole('button', { name: 'DEV NOTE' });
      expect(devNotePill).toBeInTheDocument();
    });
    fireEvent.click(devNotePill!);

    // After filtering by DEV NOTE, post-1 is present
    await waitFor(() => {
      expect(
        screen.getByText('A creator shared a note that keeps her going.')
      ).toBeInTheDocument();
    });
  });

  test('StoriesPage handles real-life filters: search, read time, and reset', async () => {
    await React.act(async () => {
      render(<StoriesPage />);
    });

    // Toggle search & filter button opens hidden filter panel
    const searchBtn = screen.getByTestId('stories-search-btn');
    expect(searchBtn).toBeInTheDocument();
    fireEvent.click(searchBtn);

    const filterPanel = screen.getByTestId('stories-filter-panel');
    expect(filterPanel).toHaveClass('opacity-100');

    // Search filter
    const searchInput = screen.getByTestId('stories-search-input');
    fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
    await waitFor(() => {
      expect(
        screen.getByText('A creator shared a note that keeps her going.')
      ).toBeInTheDocument();
    });

    // Read time filter
    const timeFilter = screen.getByTestId('stories-time-filter');
    fireEvent.change(timeFilter, { target: { value: 'SHORT' } });

    // Reset filters
    const resetBtn = screen.getByTestId('stories-reset-filters-btn');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    expect(searchInput).toHaveValue('');
  });

  test('StoriesPage handles pagination correctly with more than 6 posts', async () => {
    const twelvePosts = [
      ...defaultPosts,
      ...defaultPosts.map((p, i) => ({
        ...p,
        id: `post-extra-${i}`,
        slug: `post-extra-${i}`,
        headline: `Extra Post Title ${i}`,
      })),
    ];

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: twelvePosts,
          total: twelvePosts.length,
          totalPages: 2,
          categories: ['UX/UI', 'CAREER'],
          authors: ['Joshua Afolabi', 'Praise Afolabi', 'Oluwadara Afolabi']
        }),
      })
    ) as jest.Mock;

    await React.act(async () => {
      render(<StoriesPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    const page2Btn = screen.getByTestId('pag-btn-2');
    fireEvent.click(page2Btn);
    expect(page2Btn).toHaveClass('bg-white');
  });

  test('StoryDetailPage renders story article headline, author info, and content', async () => {
    await React.act(async () => {
      render(<StoryDetailPage />);
    });

    expect(
      await screen.findByText('A creator shared a note that keeps her going.')
    ).toBeInTheDocument();

    expect(screen.getByText('Back to All Stories')).toBeInTheDocument();
    expect(screen.getByText('About Faith Borntowin')).toBeInTheDocument();
    expect(screen.getByText(/When I started my creative journey/)).toBeInTheDocument();
  });
});
