/**
 * @jest-environment node
 */
import { GET as getTopItems, POST as postTopItem } from '@/app/api/top-items/route';
import { GET as getPosts, POST as postPost } from '@/app/api/posts/route';
import { GET as getQuotes, POST as postQuote } from '@/app/api/quotes/route';
import { GET as getHeroSlides, POST as postHeroSlide } from '@/app/api/hero-slides/route';
import { POST as postNewsletter, GET as getSubscribers } from '@/app/api/newsletter/route';

describe('Milestone 3: CRUD API Endpoints', () => {
  describe('Top Items API', () => {
    test('GET /api/top-items returns default or DB items', async () => {
      const response = await getTopItems();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('imageUrl');
    });

    test('POST /api/top-items rejects missing required fields', async () => {
      const req = new Request('http://localhost:3000/api/top-items', {
        method: 'POST',
        body: JSON.stringify({ title: 'Incomplete' }),
      });
      const response = await postTopItem(req);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    test('POST /api/top-items accepts valid item', async () => {
      const req = new Request('http://localhost:3000/api/top-items', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Creative Story',
          meta: 'WRITER · 12 MONTHS',
          imageUrl: '/images/top-card-1.jpg',
          badgeText: 'FEATURED',
          badgeColor: 'orange',
        }),
      });
      const response = await postTopItem(req);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.title || data.item?.title).toBe('Test Creative Story');
    });
  });

  describe('Posts API', () => {
    test('GET /api/posts returns list of posts', async () => {
      const req = new Request('http://localhost:3000/api/posts');
      const response = await getPosts(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('headline');
      expect(data[0]).toHaveProperty('date');
    });

    test('POST /api/posts validates required fields', async () => {
      const req = new Request('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ date: 'JAN 01' }),
      });
      const response = await postPost(req);
      expect(response.status).toBe(400);
    });

    test('POST /api/posts creates new article', async () => {
      const req = new Request('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          date: 'FEB 10',
          headline: 'A note on perseverance in coding',
          sub: 'John Doe | Developer',
          thumbUrl: '/images/post-1.jpg',
        }),
      });
      const response = await postPost(req);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.headline || data.post?.headline).toBe(
        'A note on perseverance in coding'
      );
    });
  });

  describe('Quotes API', () => {
    test('GET /api/quotes returns quotes list', async () => {
      const response = await getQuotes();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('boldText');
      expect(data[0]).toHaveProperty('name');
    });

    test('POST /api/quotes validates fields and creates quote', async () => {
      const req = new Request('http://localhost:3000/api/quotes', {
        method: 'POST',
        body: JSON.stringify({
          boldText: 'Create with passion.',
          bodyText: 'Do not let doubt stop your progress.',
          name: 'Jane Smith',
          role: '@designer',
          caption: 'Keep designing.',
        }),
      });
      const response = await postQuote(req);
      expect(response.status).toBe(201);
    });
  });

  describe('Hero Slides API', () => {
    test('GET /api/hero-slides returns hero slides', async () => {
      const response = await getHeroSlides();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test('POST /api/hero-slides validates imageUrl', async () => {
      const req = new Request('http://localhost:3000/api/hero-slides', {
        method: 'POST',
        body: JSON.stringify({ alt: 'No image' }),
      });
      const response = await postHeroSlide(req);
      expect(response.status).toBe(400);
    });
  });

  describe('Newsletter API', () => {
    test('POST /api/newsletter validates email format', async () => {
      const invalidReq = new Request('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid-email' }),
      });
      const response = await postNewsletter(invalidReq);
      expect(response.status).toBe(400);
    });

    test('POST /api/newsletter registers valid subscriber', async () => {
      const validReq = new Request('http://localhost:3000/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: 'creator.test@creanote.io' }),
      });
      const response = await postNewsletter(validReq);
      expect([200, 201]).toContain(response.status);
    });

    test('GET /api/newsletter returns subscriber list', async () => {
      const response = await getSubscribers();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
