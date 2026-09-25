# Creanote application map

## Runtime flow

- `src/app/layout.tsx` provides global metadata, fonts, styles, and the site-wide back-to-top control.
- Public pages under `src/app/` compose reusable sections from `src/components/`.
- Pages start with local defaults from `src/lib/defaultData.ts`, then hydrate from the matching `/api/*` endpoint.
- API route handlers connect to MongoDB through `src/lib/mongodb.ts`; when MongoDB is unavailable, read endpoints return the curated defaults and writes return an explicit offline response.
- Mongoose schemas in `src/models/` define the mutable content collections: hero slides, top items, posts, quotes, and subscribers.
- The admin page and managers in `src/components/admin/` provide CRUD controls over the same API resources.

## Feature map

| Feature | UI | API / data |
| --- | --- | --- |
| Hero image slider | `HeroSlider.tsx` | `/api/hero-slides`, `HeroSlide.ts` |
| Top cards | `TopListSection.tsx`, `TopCard.tsx` | `/api/top-items`, `TopItem.ts` |
| Quote timeline and detail pages | `QuoteBand.tsx`, `app/quotes/` | `/api/quotes`, `Quote.ts` |
| Posts and pagination | `PostsSection.tsx`, `PostRow.tsx` | `/api/posts`, `Post.ts` |
| Newsletter | `NewsletterBand.tsx` | `/api/newsletter`, `Subscriber.ts` |
| Content administration | `app/admin/`, `components/admin/` | CRUD route handlers |
| Navigation and footer | `Navbar.tsx`, `Footer.tsx` | Next.js links |

## Content ownership

Images are represented by mutable URL/path fields in each content document. This keeps the presentation layer independent from storage and lets administrators replace Figma-exported assets or hosted image URLs without changing React code.
