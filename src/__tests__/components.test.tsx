import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/Badge';
import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { TopCard } from '@/components/TopCard';
import { TopListSection } from '@/components/TopListSection';
import { QuoteBand } from '@/components/QuoteBand';
import { PostRow } from '@/components/PostRow';
import { PostsSection } from '@/components/PostsSection';
import { Pagination } from '@/components/Pagination';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { PageLoader } from '@/components/PageLoader';
import { ContributeModal } from '@/components/ContributeModal';
import AboutPage from '@/app/about/page';
import { defaultTopItems, defaultPosts } from '@/lib/defaultData';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn() }),
}));

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
});

describe('Milestone 2: Reusable UI Components', () => {
  test('Badge component renders orange and green correctly', () => {
    const { rerender } = render(<Badge text="ANONYMOUS" color="orange" />);
    const badge = screen.getByText('ANONYMOUS');
    expect(badge).toHaveClass('card-badge');
    expect(badge).toHaveClass('badge-orange');

    rerender(<Badge text="CREANOTE" color="green" />);
    const greenBadge = screen.getByText('CREANOTE');
    expect(greenBadge).toHaveClass('badge-green');
  });

  test('Navbar renders brand logo, nav links and triggers', () => {
    const onSearch = jest.fn();
    const onContribute = jest.fn();

    render(<Navbar onSearchClick={onSearch} onContributeClick={onContribute} />);

    expect(screen.getByAltText('Creanote.')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Stories')).toBeInTheDocument();
    expect(screen.getByText('Quotes')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();

    const contributeBtn = screen.getByRole('button', { name: /contribute/i });
    fireEvent.click(contributeBtn);
    expect(onContribute).toHaveBeenCalledTimes(1);

    const searchTrigger = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchTrigger);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test('Navbar opens its fallback search popup without a page handler', () => {
    render(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(screen.getByTestId('search-modal')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  test('QuoteBand links the active quote to its detail page', () => {
    render(
      <QuoteBand
        quotes={[
          {
            id: 'quote-1',
            boldText: 'A linked quote',
            bodyText: 'Read the full reflection.',
            caption: 'Keep going.',
            name: 'Creator',
            role: '@creator',
            avatarUrl: '/images/quote-avatar.jpg',
          },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: /read quote/i })).toHaveAttribute(
      'href',
      '/quotes/quote-1'
    );
  });

  test('HeroSlider renders slides and navigates via dot buttons', () => {
    const slides = [
      { imageUrl: '/images/hero-0.jpg', alt: 'Hero 0' },
      { imageUrl: '/images/hero-1.jpg', alt: 'Hero 1' },
    ];

    render(<HeroSlider slides={slides} autoplayInterval={10000} />);

    expect(screen.getByTestId('hero-slider')).toBeInTheDocument();
    expect(screen.getByTestId('hero-slide-0')).toHaveClass('active');

    const dot1 = screen.getByTestId('hero-dot-1');
    fireEvent.click(dot1);
    expect(screen.getByTestId('hero-slide-1')).toHaveClass('active');
  });

  test('TopCard renders image, title, meta and badges', () => {
    const cardData = {
      title: '3 creatives shared moments',
      meta: 'ANONYMOUS TIMELINE',
      badgeText: 'ANONYMOUS',
      badgeColor: 'orange' as const,
      imageUrl: '/images/top-card-2.jpg',
    };

    render(<TopCard card={cardData} />);

    expect(screen.getByText('3 creatives shared moments')).toBeInTheDocument();
    expect(screen.getByText('ANONYMOUS TIMELINE')).toBeInTheDocument();
    expect(screen.getByText('ANONYMOUS')).toBeInTheDocument();
  });

  test('TopListSection renders scrollable card container and orange progress bar', () => {
    const onCardClick = jest.fn();
    render(<TopListSection items={defaultTopItems} onCardClick={onCardClick} />);

    expect(screen.getByTestId('top-list-section')).toBeInTheDocument();
    expect(screen.getByText('Top on the List')).toBeInTheDocument();
    expect(screen.getByTestId('top-list-scroll-container')).toBeInTheDocument();

    const progressBar = screen.getByTestId('top-list-progress-bar');
    const progressFill = screen.getByTestId('top-list-progress-fill');
    expect(progressBar).toBeInTheDocument();
    expect(progressFill).toBeInTheDocument();

    // Click on progress bar
    fireEvent.click(progressBar);

    // Click a card
    const card0 = screen.getByTestId('top-card-item-0');
    fireEvent.click(card0.querySelector('[data-testid="top-card"]')!);
    expect(onCardClick).toHaveBeenCalledWith(defaultTopItems[0]);
  });

  test('PostsSection renders post rows and orange progress bar', () => {
    const onPostClick = jest.fn();
    render(<PostsSection posts={defaultPosts} onPostClick={onPostClick} />);

    expect(screen.getByTestId('posts-section')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();

    const progressBar = screen.getByTestId('posts-progress-bar');
    const progressFill = screen.getByTestId('posts-progress-fill');
    expect(progressBar).toBeInTheDocument();
    expect(progressFill).toBeInTheDocument();

    // Click on progress bar to advance
    fireEvent.click(progressBar);
  });

  test('QuoteBand renders quote content and switches active quote on dot click', () => {
    const quotes = [
      {
        boldText: 'Struggle is not failure.',
        bodyText: 'Keep learning from your mistakes.',
        caption: 'Learning is progress.',
        name: 'Developer 1',
        role: '@dev1',
        avatarUrl: '/images/quote-avatar.jpg',
      },
      {
        boldText: 'Consistency is power.',
        bodyText: 'Code everyday without giving up.',
        caption: 'Daily commit rule.',
        name: 'Developer 2',
        role: '@dev2',
        avatarUrl: '/images/quote-avatar.jpg',
      },
    ];

    render(<QuoteBand quotes={quotes} />);

    expect(screen.getByText('Struggle is not failure.')).toBeInTheDocument();
    expect(screen.getByText('Developer 1')).toBeInTheDocument();

    const dot2 = screen.getByTestId('quote-dot-1');
    fireEvent.click(dot2);

    expect(screen.getByText('Consistency is power.')).toBeInTheDocument();
    expect(screen.getByText('Developer 2')).toBeInTheDocument();
  });

  test('PostRow renders date, headline, and subtitle correctly', () => {
    const post = {
      date: 'JAN 21',
      headline: '2 months + dev shared a note that keep her going.',
      sub: 'Faith Borntowin | 2 months + | Developer',
      thumbUrl: '/images/post-1.jpg',
    };

    render(<PostRow post={post} />);

    expect(screen.getByText('JAN 21')).toBeInTheDocument();
    expect(
      screen.getByText('2 months + dev shared a note that keep her going.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Faith Borntowin | 2 months + | Developer')
    ).toBeInTheDocument();
  });

  test('Pagination handles page switching and bounds', () => {
    const onPageChange = jest.fn();

    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );

    const btn2 = screen.getByTestId('pag-btn-2');
    fireEvent.click(btn2);
    expect(onPageChange).toHaveBeenCalledWith(2);

    const nextBtn = screen.getByTestId('pag-next-btn');
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('NewsletterBand accepts input and submits', async () => {
    const onSubscribe = jest.fn();

    render(<NewsletterBand onSubscribe={onSubscribe} />);

    const input = screen.getByTestId('newsletter-input');
    const submitBtn = screen.getByTestId('newsletter-submit');

    fireEvent.change(input, { target: { value: 'creator@example.com' } });
    await React.act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(onSubscribe).toHaveBeenCalledWith('creator@example.com');
  });

  test('Footer displays official email and social links', () => {
    render(<Footer />);

    expect(screen.getByText('officialcreanote@gmail.com')).toBeInTheDocument();
    expect(
      screen.getByText('...notes from the creative journey')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Stories' })).toHaveAttribute('href', '/stories');
    expect(screen.getByRole('link', { name: 'Quotes' })).toHaveAttribute('href', '/quotes');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');

    // Link headers and divider
    expect(screen.getByText('Explore')).toHaveClass('text-[var(--orange)]');
    expect(screen.getByText('Socials')).toHaveClass('text-[var(--orange)]');
    expect(screen.getByTestId('footer-copyright-divider')).toHaveClass('border-t');
    expect(screen.getByTestId('footer-copyright-divider')).toHaveClass('border-[var(--border)]');
  });

  test('BackToTop renders with semi-transparency and scrolls to top on click', () => {
    window.scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    render(<BackToTop />);
    fireEvent.scroll(window);

    const btn = screen.getByTestId('back-to-top-btn');
    expect(btn).toBeInTheDocument();
    // Semi-transparent until hovered or clicked
    expect(btn).toHaveClass('opacity-40');
    expect(btn).toHaveClass('hover:opacity-100');

    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('PageLoader renders with brand logo, small progress bar and loading message', () => {
    render(<PageLoader message="Loading custom inspiration..." />);
    expect(screen.getByTestId('page-loader')).toBeInTheDocument();
    expect(screen.getByText('Loading custom inspiration...')).toBeInTheDocument();
    expect(screen.getByAltText('Creanote.')).toBeInTheDocument();
    expect(screen.getByTestId('page-loader-progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('page-loader-progress-fill')).toBeInTheDocument();
  });

  test('ContributeModal supports Quote submission with image upload and URL input', () => {
    const onSubmitSuccess = jest.fn();
    const onClose = jest.fn();

    render(
      <ContributeModal
        isOpen={true}
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
        defaultTab="quote"
      />
    );

    expect(screen.getByTestId('contribute-modal')).toBeInTheDocument();
    expect(screen.getByText('Submit an Inspiring Quote')).toBeInTheDocument();

    // Inputs for quote submission (image only)
    const uploadZone = screen.getByTestId('quote-image-upload-zone');
    const urlInput = screen.getByTestId('quote-image-url-input');

    expect(uploadZone).toBeInTheDocument();
    expect(urlInput).toBeInTheDocument();

    // Provide desired image URL
    fireEvent.change(urlInput, { target: { value: 'https://images.unsplash.com/photo-1' } });
    expect(screen.getByTestId('quote-image-preview')).toBeInTheDocument();

    // Remove image button
    const removeBtn = screen.getByTestId('quote-image-remove-btn');
    fireEvent.click(removeBtn);
    expect(screen.queryByTestId('quote-image-preview')).not.toBeInTheDocument();

    // Can switch tabs
    const storyTabBtn = screen.getByTestId('tab-story-btn');
    fireEvent.click(storyTabBtn);
    expect(screen.getByText('Share Your Creative Note')).toBeInTheDocument();
  });

  test('AboutPage renders CTA section with background pattern and opens Quote upload modal', () => {
    render(<AboutPage />);

    expect(screen.getByTestId('about-quote-cta')).toBeInTheDocument();
    expect(screen.getByText('Have a Quote That Inspires Creators?')).toBeInTheDocument();
    expect(screen.getByAltText('Creanote pattern')).toBeInTheDocument();

    const uploadQuoteBtn = screen.getByTestId('about-upload-quote-btn');
    expect(uploadQuoteBtn).toBeInTheDocument();

    // Click upload quote opens modal on quote submission tab
    fireEvent.click(uploadQuoteBtn);
    expect(screen.getByTestId('contribute-modal')).toBeInTheDocument();
    expect(screen.getByText('Submit an Inspiring Quote')).toBeInTheDocument();
  });
});

