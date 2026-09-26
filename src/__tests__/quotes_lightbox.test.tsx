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
      imageUrl: 'https://images.unsplash.com/photo-1',
    },
    {
      id: 'quote-2',
      imageUrl: 'https://images.unsplash.com/photo-2',
    },
    {
      id: 'quote-3',
      imageUrl: 'https://images.unsplash.com/photo-3',
    },
  ];

  test('QuoteCardVisual renders pure image quote card', () => {
    const onClick = jest.fn();
    render(
      <QuoteCardVisual
        imageUrl="https://images.unsplash.com/photo-1"
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('quote-card-visual')).toBeInTheDocument();
    expect(screen.getByTestId('quote-image')).toBeInTheDocument();

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
  });

  test('QuoteSection progress bar increases as you click pill or next slide buttons', () => {
    const sixQuotes = [
      ...mockQuotes,
      { ...mockQuotes[0], id: 'quote-4' },
      { ...mockQuotes[1], id: 'quote-5' },
      { ...mockQuotes[2], id: 'quote-6' },
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

  test('QuoteLightbox opens with correct data and supports keyboard/click navigation', () => {
    const onClose = jest.fn();
    const onNavigate = jest.fn();

    const { rerender } = render(
      <QuoteLightbox
        isOpen={true}
        onClose={onClose}
        quotes={mockQuotes}
        currentIndex={0}
        onNavigate={onNavigate}
      />
    );

    expect(screen.getByTestId('quote-lightbox')).toBeInTheDocument();
    expect(screen.getByText('Quote 1 of 3')).toBeInTheDocument();
    
    // Test Navigation
    const nextBtn = screen.getByTestId('lightbox-next');
    const prevBtn = screen.getByTestId('lightbox-prev');
    
    fireEvent.click(nextBtn);
    expect(onNavigate).toHaveBeenCalledWith(1);
    
    fireEvent.click(prevBtn);
    expect(onNavigate).toHaveBeenCalledWith(2);

    // Test Keyboard
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('QuotesPage loads all quotes and shows infinite skeleton loaders', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: mockQuotes,
          total: 3,
          page: 1,
          limit: 8,
          totalPages: 1,
        })
      });
    });

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver as any;

    render(<QuotesPage />);

    expect(screen.getByTestId('quotes-page')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('quotes-grid-item-0')).toBeInTheDocument();
    });
  });
});
