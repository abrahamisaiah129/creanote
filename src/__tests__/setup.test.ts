import fs from 'fs';
import path from 'path';
import { defaultHeroSlides, defaultTopItems, defaultQuotes, defaultPosts } from '@/lib/defaultData';

describe('Milestone 1: Setup & Assets Verification', () => {
  test('extracted images exist in public/images', () => {
    const requiredImages = [
      'hero-0.jpg',
      'hero-1.jpg',
      'hero-2.jpg',
      'hero-3.jpg',
      'top-card-1.jpg',
      'top-card-2.jpg',
      'top-card-3.jpg',
      'quote-avatar.jpg',
      'post-1.jpg',
      'post-2.jpg',
    ];

    requiredImages.forEach((img) => {
      const fullPath = path.join(process.cwd(), 'public/images', img);
      expect(fs.existsSync(fullPath)).toBe(true);
      const stat = fs.statSync(fullPath);
      expect(stat.size).toBeGreaterThan(1000);
    });
  });

  test('globals.css contains required design system CSS variables', () => {
    const cssPath = path.join(process.cwd(), 'src/app/globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('--green: #00D084');
    expect(cssContent).toContain('--orange: #F59E0B');
    expect(cssContent).toContain('--bg: #060A07');
    expect(cssContent).toContain('--bg2: #0C100D');
    expect(cssContent).toContain('Ubuntu');
  });

  test('defaultData is properly populated with initial content', () => {
    expect(defaultHeroSlides.length).toBe(4);
    expect(defaultTopItems.length).toBe(3);
    expect(defaultQuotes.length).toBeGreaterThanOrEqual(1);
    expect(defaultPosts.length).toBeGreaterThanOrEqual(3);
  });
});
