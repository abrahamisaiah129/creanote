import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuoteSection } from '@/components/QuoteSection';
import { QuoteLightbox } from '@/components/QuoteLightbox';
import { QuoteCardVisual } from '@/components/QuoteCardVisual';
import QuotesPage from '@/app/quotes/page';
import { defaultQuotes, placeholderUrl } from '@/lib/defaultData';

jest.mock('next/navigation', () => ({
  usePathname: () => '/quotes',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Quote Showcase & Lightbox System', () => {
  const mockQuotes = [
    {
      id: 'quote-1',
      boldText: '"Commit is doing what you are supposed to do..."',
      bodyText: 'Be resilient to what you want.',
      author: 'OLUWADARA AFOLABI',
      name: 'Oluwadara Afolabi',
      role: 'Product Designer',
      caption: 'Commit is doing what you are supposed to do...',
      avatarUrl: placeholderUrl('Oluwadara Afolabi', 160, 160),
      imageUrl: placeholderUrl('Commit is doing what you are supposed to do', 800, 800),
    },
    {
      id: 'quote-2',
      boldText: '"Stay rooted in your purpose..."',
      bodyText: 'The only timeline that matters is your own.',
      author: 'JOSHUA AFOLABI',
      name: 'Joshua Afolabi',
      role: 'Frontend Engineer',
      caption: 'Stay rooted in your purpose...',
      avatarUrl: placeholderUrl('Joshua Afolabi', 160, 160),
      imageUrl: placeholderUrl('Stay rooted in purpose', 800, 800),
    },
    {
      id: 'quote-3',
      boldText: '"Who cares about cringe?..."',
      bodyText: 'This is the best time to do all the experimental work.',
      author: 'PRAISE AFOLABI',
      name: 'Praise Afolabi',
      role: 'Creative Technologist',
      caption: 'Who cares about cringe?...',
      avatarUrl: placeholderUrl('Praise Afolabi', 160, 160),
      imageUrl: placeholderUrl('Who cares about cringe', 800, 800),
    },
  ];

  test('QuoteCardVisual renders pure image quote card using placeholderUrl and handles click', () => {
    const onClick = jest.fn();
    render(
      <QuoteCardVisual
        boldText='"Commit is doing what you are supposed to do..."'
        author="OLUWADARA AFOLABI"
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('quote-card-visual')).toBeInTheDocument();
    expect(screen.getByTestId('quote-image')).toBeInTheDocument();
    expect(screen.getByAltText('Quote by OLUWADARA AFOLABI')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('quote-card-visual'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('QuoteSection renders 3 quote cards in a row with image visual', () => {
    render(<QuoteSection quotes={mockQuotes} />);

    expect(screen.getByTestId('quote-section')).toBeInTheDocument();
    expect(screen.getByText('Quote')).toBeInTheDocument();
    expect(screen.getByTestId('see-more-quotes-btn')).toHaveAttribute('href', '/quotes');

    // 3 cards present
    expect(screen.getByTestId('quote-card-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('quote-card-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('quote-card-item-2')).toBeInTheDocument();

    // Check author alt in visual
    expect(screen.getByAltText('Quote by OLUWADARA AFOLABI')).toBeInTheDocument();
    expect(screen.getByAltText('Quote by JOSHUA AFOLABI')).toBeInTheDocument();
    expect(screen.getByAltText('Quote by PRAISE AFOLABI')).toBeInTheDocument();
  });

  test('QuoteSection progress bar increases as you click pill or next slide buttons', () => {
    const sixQuotes = [
      ...mockQuotes,
      { ...mockQuotes[0], id: 'quote-4', boldText: 'Quote 4' },
      { ...mockQuotes[1], id: 'quote-5', boldText: 'Quote 5' },
      { ...mockQuotes[2], id: 'quote-6', boldText: 'Quote 6' },
    ];

    render(<QuoteSection quotes={sixQuotes} itemsPerPage={3} />);

    const progressBar = screen.getByTestId('quote-progress-bar');
    const progressFill = screen.getByTestId('quote-progress-fill');
    expect(progressBar).toBeInTheDocument();
    expect(progressFill).toHaveStyle({ width: '50%' });

    // Click the top pill to advance to next set of slides
    fireEvent.click(progressBar);
    expect(progressFill).toHaveStyle({ width: '100%' });

    // Click previous button
    const prevBtn = screen.getByTestId('quote-prev-btn');
    fireEvent.click(prevBtn);
    expect(progressFill).toHaveStyle({ width: '50%' });

    // Click next button
    const nextBtn = screen.getByTestId('quote-next-btn');
    fireEvent.click(nextBtn);
    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  test('QuoteSection clicking a card opens the Lightbox popup', () => {
    render(<QuoteSection quotes={mockQuotes} />);

    // Initially lightbox is not open
    expect(screen.queryByTestId('quote-lightbox')).not.toBeInTheDocument();

    // Click first quote card visual
    const card0 = screen.getAllByTestId('quote-card-visual')[0];
    fireEvent.click(card0);

    // Lightbox should now be visible with image
    expect(screen.getByTestId('quote-lightbox')).toBeInTheDocument();
    expect(screen.getByTestId('lightbox-image')).toBeInTheDocument();

    // Close button works
    const closeBtn = screen.getByTestId('lightbox-close');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('quote-lightbox')).not.toBeInTheDocument();
  });

  test('QuoteLightbox navigates previous and next quotes', () => {
    const onNavigate = jest.fn();
    const onClose = jest.fn();

    render(
      <QuoteLightbox
        isOpen={true}
        onClose={onClose}
        quotes={mockQuotes}
        currentIndex={0}
        onNavigate={onNavigate}
      />
    );

    expect(screen.getByTestId('quote-lightbox')).toBeInTheDocument();
    expect(screen.getByTestId('lightbox-image')).toBeInTheDocument();

    const nextBtn = screen.getByTestId('lightbox-next');
    fireEvent.click(nextBtn);
    expect(onNavigate).toHaveBeenCalledWith(1);

    const prevBtn = screen.getByTestId('lightbox-prev');
    fireEvent.click(prevBtn);
    expect(onNavigate).toHaveBeenCalledWith(2); // wraps around
  });

  test('QuotesPage renders dynamic hero quote, search button beside submit, and search input', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('search=PRAISE')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [defaultQuotes[2]],
            total: 1,
            totalPages: 1,
            quoters: ['OLUWADARA AFOLABI', 'JOSHUA AFOLABI', 'PRAISE AFOLABI']
          }),
        });
      } else if (url.includes('search=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [],
            total: 0,
            totalPages: 1,
            quoters: ['OLUWADARA AFOLABI', 'JOSHUA AFOLABI', 'PRAISE AFOLABI']
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: defaultQuotes,
          total: defaultQuotes.length,
          totalPages: 1,
          quoters: ['OLUWADARA AFOLABI', 'JOSHUA AFOLABI', 'PRAISE AFOLABI']
        }),
      });
    }) as jest.Mock;

    await React.act(async () => {
      render(<QuotesPage />);
    });

    expect(screen.getByTestId('quotes-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('quotes-hero-headline')).toBeInTheDocument();
    const heroAuthor = screen.getByTestId('quotes-hero-author');
    expect(heroAuthor).toBeInTheDocument();
    expect(heroAuthor.textContent).toBe('OLUWADARA AFOLABI');
    expect(heroAuthor.textContent).not.toContain('—');
    expect(screen.getByTestId('submit-quote-btn')).toBeInTheDocument();
    expect(screen.getByTestId('quotes-search-btn')).toBeInTheDocument();

    // Toggle search button beside submit a quote
    fireEvent.click(screen.getByTestId('quotes-search-btn'));
    expect(screen.getByTestId('quotes-filter-bar')).toHaveClass('opacity-100');
    const searchInput = screen.getByTestId('quotes-search-input');
    expect(searchInput).toBeInTheDocument();

    // Type quoter name to filter
    fireEvent.change(searchInput, { target: { value: 'PRAISE' } });
    await waitFor(() => {
      expect(screen.getByTestId('quotes-grid-item-0')).toBeInTheDocument();
      expect(screen.getByAltText(/Quote by PRAISE AFOLABI/)).toBeInTheDocument();
    });

    // Searching a text that is not a quoter name does not match quoter name
    fireEvent.change(searchInput, { target: { value: 'NonExistentQuoterXYZ' } });
    await waitFor(() => {
      expect(screen.queryByTestId('quotes-grid-item-0')).not.toBeInTheDocument();
      expect(screen.getByText(/No quotes found/i)).toBeInTheDocument();
    });
  });

  test('QuotesPage filters by Quoter Name and sorts by Date', async () => {
    await React.act(async () => {
      render(<QuotesPage />);
    });

    const quoterSelect = screen.getByTestId('quotes-quoter-select');
    const dateSelect = screen.getByTestId('quotes-date-select');
    expect(quoterSelect).toBeInTheDocument();
    expect(dateSelect).toBeInTheDocument();

    // Filter by specific Quoter Name
    fireEvent.change(quoterSelect, { target: { value: 'JOSHUA AFOLABI' } });
    await waitFor(() => {
      expect(screen.getByAltText(/Quote by JOSHUA AFOLABI/)).toBeInTheDocument();
    });

    // Sort by Oldest First
    fireEvent.change(dateSelect, { target: { value: 'OLDEST' } });
    expect(dateSelect).toHaveValue('OLDEST');

    // Reset filters
    const resetBtn = screen.getByTestId('quotes-reset-filters-btn');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(quoterSelect).toHaveValue('ALL');
  });

  test('QuotesPage handles pagination with more than 4 quotes', async () => {
    const eightQuotes = [
      ...defaultQuotes,
      ...defaultQuotes.map((q, i) => ({
        ...q,
        id: `quote-extra-${i}`,
        boldText: `Extra Quote ${i}`,
      })),
    ];

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: eightQuotes,
          total: eightQuotes.length,
          totalPages: 2,
          quoters: ['OLUWADARA AFOLABI', 'JOSHUA AFOLABI', 'PRAISE AFOLABI']
        }),
      })
    ) as jest.Mock;

    await React.act(async () => {
      render(<QuotesPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('quotes-pagination')).toBeInTheDocument();
    });

    const page2Btn = screen.getByTestId('quotes-page-2');
    expect(page2Btn).toBeInTheDocument();
    fireEvent.click(page2Btn);
  });
});
