# Creanote 📝✨

> **"...notes from the creative journey"**  
> *If you create, then you belong here.*

Creanote is a modern, full-stack community platform and Content Management System (CMS) designed for creators—developers, designers, writers, and entrepreneurs—to document and discover raw lessons, quotes, and milestones from their journeys.

Originally prototyped in Figma and HTML, this repository transforms Creanote into a production-ready **Next.js (App Router)** application backed by **MongoDB Atlas**, featuring modular reusable UI components, complete design parity, and an intuitive **Admin CMS Dashboard** at `/admin`.

---

## 🌟 Key Features

### 🎨 Pixel-Perfect Design Fidelity
- **Strict Figma Parity**: Matches the original design with zero regressions.
- **Brand Typography**: Google Font **Ubuntu** (300, 400, 500, 700, 800).
- **Design Tokens**:
  - Primary Green: `#00D084` (`var(--green)`)
  - Dark Accent Green: `#00A86B` (`var(--green-dark)`)
  - Warning / Badge Orange: `#F59E0B` (`var(--orange)`)
  - Deep Dark Background: `#060A07` (`var(--bg)`)
  - Card & Band Background: `#0C100D` (`var(--bg2)`)
  - Text: `#F0F5F0` & Muted Text: `#7A917A`
  - Subtle Borders: `rgba(0, 208, 132, 0.12)`
- **Responsive Layout**: Full desktop experience and mobile layout (< 900px) with touch-friendly spacing and hidden thumbnails.

### 🚀 Public Experience
- **Dynamic Hero Carousel**: Autoplaying banner (5s intervals) with smooth cross-fade opacity transitions and interactive indicator pills.
- **Top on the List**: 3-column highlight grid with hover elevations (`translateY(-4px)`), gradient overlays, and badges.
- **Quotes Timeline**: Quote band featuring large decorative quotation marks (`"`), scalable typography, author credentials, and interactive pagination dots.
- **Stories Feed**: Article stream with dates, headlines, creator tags, zoom-on-hover thumbnails, and numeric pagination.
- **Interactive Search Modal**: Instant client-side search across all stories, top highlights, and creator notes triggered from the search glyph (`⚲`).
- **Contribute Modal**: Story submission dialog allowing community members to share their struggles and breakthroughs.
- **Newsletter Subscription**: Integrated subscription band with real-time status feedback connected to MongoDB.
- **Dedicated Pages**:
  - `/`: Main landing and curated feeds
  - `/stories`: Extended creator stories and updates
  - `/quotes`: Dedicated quotes timeline and full archive
  - `/about`: Creanote manifesto, mission, and community links

### 🛠️ Content Management System (CMS) at `/admin`
A dedicated, dark-themed admin interface providing complete CRUD operations:
- **Dashboard Overview**: Real-time counter metrics for Top Highlights, Posts, Quotes, Hero Slides, and Subscribers with a one-click database seeding tool.
- **Top on List Manager**: Add, edit, or delete highlight cards with customizable badges, colors, and metadata.
- **Posts & Stories Manager**: Full publishing tools for articles, supporting standard image thumbnails and signature green feature badges.
- **Quotes Manager**: Manage quotes, author names, roles, avatars, and timeline credits.
- **Hero Slider Manager**: Manage hero carousel slides and order.
- **Subscribers Manager**: View all newsletter signups and copy/export subscriber lists with one click.

---

## 🏗️ Architecture & Separation of Concerns

```
creanote/
├── public/
│   └── images/                # Extracted static assets (hero, cards, avatar, posts)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Ubuntu font and global metadata
│   │   ├── page.tsx           # Main Creanote home page
│   │   ├── globals.css        # Global CSS variables, animations, and responsive styles
│   │   ├── about/page.tsx     # About page
│   │   ├── quotes/page.tsx    # Quotes timeline page
│   │   ├── stories/page.tsx   # Stories feed page
│   │   ├── admin/page.tsx     # CMS Admin Dashboard
│   │   └── api/               # RESTful CRUD API endpoints
│   │       ├── hero-slides/   # Hero slides CRUD
│   │       ├── top-items/     # Top highlights CRUD
│   │       ├── posts/         # Posts & Stories CRUD
│   │       ├── quotes/        # Quotes timeline CRUD
│   │       ├── newsletter/    # Subscriber newsletter endpoint
│   │       └── seed/          # One-click DB seed endpoint
│   ├── components/            # Reusable UI components
│   │   ├── Badge.tsx          # Reusable orange/green badges
│   │   ├── Navbar.tsx         # Sticky navigation with blur effect
│   │   ├── HeroSlider.tsx     # Autoplay hero carousel
│   │   ├── TopCard.tsx        # Highlight card with gradient overlay
│   │   ├── TopListSection.tsx # 3-column top grid wrapper
│   │   ├── QuoteBand.tsx      # Quote band with avatar and dots
│   │   ├── PostRow.tsx        # Individual post row
│   │   ├── PostsSection.tsx   # Post feed with pagination
│   │   ├── Pagination.tsx     # Numeric & arrow pagination controls
│   │   ├── NewsletterBand.tsx # Email subscription form
│   │   ├── Footer.tsx         # Footer with SVG socials
│   │   ├── SearchModal.tsx    # Interactive search overlay
│   │   ├── ContributeModal.tsx# Community submission dialog
│   │   └── admin/             # CMS management panels
│   │       ├── AdminLayout.tsx
│   │       ├── OverviewManager.tsx
│   │       ├── TopListManager.tsx
│   │       ├── PostsManager.tsx
│   │       ├── QuotesManager.tsx
│   │       ├── HeroManager.tsx
│   │       └── SubscribersManager.tsx
│   ├── lib/
│   │   ├── mongodb.ts         # Cached MongoDB Atlas connection pooling
│   │   └── defaultData.ts     # Initial seed and offline fallback dataset
│   ├── models/                # Mongoose database models
│   │   ├── HeroSlide.ts
│   │   ├── TopItem.ts
│   │   ├── Post.ts
│   │   ├── Quote.ts
│   │   └── Subscriber.ts
│   └── __tests__/             # Unit and integration test suites
│       ├── setup.test.ts      # Milestone 1: Asset and CSS variables test
│       ├── components.test.tsx# Milestone 2: UI component rendering tests
│       ├── api.test.ts        # Milestone 3: CRUD API validation tests
│       └── admin.test.tsx     # Milestone 5: CMS dashboard interaction tests
├── .env.example               # Environment variables template
├── jest.config.js             # Jest configuration for Next.js & TypeScript
├── next.config.mjs            # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 📦 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Runtime**: [React 18](https://react.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose](https://mongoosejs.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Icons**: Lucide React & Custom Inline SVGs
- **Typography**: Google Fonts (Ubuntu)

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js `v18.17.0` or later (tested on Node `v24.x`)
- npm `v9.x` or later

### 2. Installation
```bash
git clone https://github.com/abrahamisaiah129/creanote.git
cd creanote
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (or copy from `.env.example`):
```env
MONGODB_URI=mongodb+srv://abrahamisaiah129_db_user:GB0cvCtov4jdESip@cluster0.rmkk060.mongodb.net/creanote?retryWrites=true&w=majority&appName=Cluster0
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin CMS Credentials
ADMIN_USERNAME=abrahamisaiah129
ADMIN_PASSWORD=GB0cvCtov4jdESip
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access CMS Admin Dashboard
The Admin link is intentionally omitted from the public navbar for security and privacy. To access the Content Management System:
- Navigate directly to **[http://localhost:3000/admin](http://localhost:3000/admin)**.
- Authenticate using the configured admin credentials (`ADMIN_USERNAME` and `ADMIN_PASSWORD`).
- Sessions are secured via HTTP-only authorization cookies with one-click logout capability.

---

## 🧪 Unit Testing

All milestones are verified with individual unit tests:

```bash
# Run all unit test suites
npm test

# Run specific milestone tests
npx jest src/__tests__/setup.test.ts       # Milestone 1: Environment & Assets
npx jest src/__tests__/components.test.tsx # Milestone 2: UI Components
npx jest src/__tests__/api.test.ts        # Milestone 3: CRUD API Endpoints
npx jest src/__tests__/admin.test.tsx      # Milestone 5: Admin CMS Dashboard
```

### Build Verification
```bash
npm run build
```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/top-items` | `GET` | Retrieve all highlight cards |
| `/api/top-items` | `POST` | Create a new highlight card |
| `/api/top-items/[id]` | `PUT` / `DELETE` | Update or delete a highlight card |
| `/api/posts` | `GET` | Retrieve posts (supports `?page=X`) |
| `/api/posts` | `POST` | Publish a new story |
| `/api/posts/[id]` | `PUT` / `DELETE` | Update or delete a story |
| `/api/quotes` | `GET` | Retrieve quotes timeline |
| `/api/quotes` | `POST` | Add a new creator quote |
| `/api/quotes/[id]` | `PUT` / `DELETE` | Update or delete a quote |
| `/api/hero-slides` | `GET` | Retrieve hero carousel slides |
| `/api/hero-slides` | `POST` | Add a new hero slide |
| `/api/hero-slides/[id]` | `PUT` / `DELETE` | Update or delete a hero slide |
| `/api/newsletter` | `GET` | Retrieve subscriber list (Admin) |
| `/api/newsletter` | `POST` | Subscribe email to newsletter |
| `/api/admin/auth` | `GET` / `POST` / `DELETE` | Admin session status, login verification, and logout |
| `/api/seed` | `POST` | Initialize database with default data |

---

## 👤 Author
- **Abraham Isaiah** ([@abrahamisaiah129](https://github.com/abrahamisaiah129))
- **Email**: officialcreanote@gmail.com
