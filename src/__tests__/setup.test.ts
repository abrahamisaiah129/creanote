import fs from 'fs';
import path from 'path';
import { defaultHeroSlides, defaultTopItems, defaultQuotes, defaultPosts } from '@/lib/defaultData';

describe('Milestone 1: Setup & Assets Verification', () => {
  test('content images use title-based placeholders or local images', () => {
    [...defaultHeroSlides, ...defaultTopItems].forEach((item) => {
      expect(item.imageUrl).toMatch(/^(https:\/\/placehold\.co\/|\/images\/)/);
    });
    defaultQuotes.forEach((quote) => {
      expect(quote.avatarUrl).toMatch(/^https:\/\/placehold\.co\//);
    });
    defaultPosts.filter((post) => post.thumbUrl).forEach((post) => {
      expect(post.thumbUrl).toMatch(/^https:\/\/placehold\.co\//);
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
