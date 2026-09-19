import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/Badge';
import { Navbar } from '@/components/Navbar';
import { HeroSlider } from '@/components/HeroSlider';
import { TopCard } from '@/components/TopCard';
import { QuoteBand } from '@/components/QuoteBand';
import { PostRow } from '@/components/PostRow';
import { Pagination } from '@/components/Pagination';
import { NewsletterBand } from '@/components/NewsletterBand';
import { Footer } from '@/components/Footer';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

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
  });
});
