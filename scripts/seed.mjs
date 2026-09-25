import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined. Ensure .env.local exists.');
  process.exit(1);
}

// Inline schemas for standalone reliability
const PostSchema = new mongoose.Schema({
  date: { type: String, required: true },
  headline: { type: String, required: true },
  title: { type: String },
  sub: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, default: '' },
  slug: { type: String, unique: true, index: true },
  thumbUrl: { type: String },
  coverImage: { type: String },
  author: { type: String, default: 'Creanote Creator' },
  authorRole: { type: String, default: 'Creator' },
  category: { type: String, default: 'DEV NOTE' },
  tags: { type: [String], default: [] },
  readTime: { type: String, default: '4 min read' },
  isFeatureBadge: { type: Boolean, default: false },
  featureText: { type: String },
  page: { type: Number, default: 1 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const QuoteSchema = new mongoose.Schema({
  boldText: { type: String, required: true },
  text: { type: String },
  bodyText: { type: String, required: true },
  tagText: { type: String, default: 'QUOTE' },
  category: { type: String },
  caption: { type: String, required: true },
  credit: { type: String, default: 'CREANOTE QUOTE TIMELINE' },
  name: { type: String, required: true },
  author: { type: String },
  role: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  bannerUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  date: { type: String },
  isActive: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const TopItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  meta: { type: String, required: true },
  badgeText: { type: String },
  badgeColor: { type: String, enum: ['orange', 'green'], default: 'orange' },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const HeroSlideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  mobileImageUrl: { type: String, default: '' },
  alt: { type: String, default: 'Creanote Hero Slide' },
  title: { type: String, default: '' },
  meta: { type: String, default: '' },
  badgeText: { type: String, default: '' },
  headline: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Quote = mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
const TopItem = mongoose.models.TopItem || mongoose.model('TopItem', TopItemSchema);
const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);

const ph = (text, w = 800, h = 500) =>
  `https://placehold.co/${w}x${h}/0c100d/f0f5f0?text=${encodeURIComponent(text).replace(/%20/g, '+')}`;

// 50 REALISTIC POSTS
export const SEED_POSTS = [
  {
    date: '24 OCT',
    headline: 'Scaling Redis Cache Architectures for High-Frequency Creative Feeds',
    title: 'Scaling Redis Cache Architectures for High-Frequency Creative Feeds',
    slug: 'scaling-redis-cache-architectures-high-frequency-feeds',
    sub: 'Oluwadara Afolabi | System Architect | Strategies for cache invalidation without stale read spikes',
    excerpt: 'Deep dive into cache invalidation patterns, tiered caching, and memory optimization.',
    content: 'When serving millions of creative records across decentralized nodes, standard LRU eviction quickly causes cache thrashing. In this retro, we explore probabilistic early expiration, dual-layer in-memory caching with Redis clusters, and how pipeline batching dropped our P99 latency by 72%.',
    thumbUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    author: 'Oluwadara Afolabi',
    authorRole: 'System Architect',
    category: 'DEV NOTE',
    tags: ['DEV NOTE', 'BACKEND', 'REDIS', 'SCALABILITY'],
    readTime: '6 min read',
    isFeatureBadge: true,
    featureText: 'SYSTEM ARCHITECTURE',
    page: 1,
    order: 1,
  },
  {
    date: '22 OCT',
    headline: 'Designing Calm Digital Canvas Interfaces in an Era of Cognitive Overload',
    title: 'Designing Calm Digital Canvas Interfaces in an Era of Cognitive Overload',
    slug: 'designing-calm-digital-canvas-interfaces',
    sub: 'Amara Chen | Principal Designer | Why reducing visual noise increases genuine creative output',
    excerpt: 'An essay on radical minimalism, typography hierarchy, and removing unnecessary chrome.',
    content: 'Creative tools often mistake feature density for creative power. By stripping back chrome, adopting tactile typography, and using restrained color accents, we allow creators to enter flow states without fighting the user interface.',
    thumbUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    author: 'Amara Chen',
    authorRole: 'Principal Designer',
    category: 'DESIGN STORY',
    tags: ['DESIGN STORY', 'UI/UX', 'MINIMALISM', 'CREATIVITY'],
    readTime: '4 min read',
    isFeatureBadge: true,
    featureText: 'DESIGN ESSAY',
    page: 1,
    order: 2,
  },
  {
    date: '20 OCT',
    headline: 'From 0 to 10k Daily Active Builders: Our Pivot Away from Traditional Feeds',
    title: 'From 0 to 10k Daily Active Builders: Our Pivot Away from Traditional Feeds',
    slug: 'from-0-to-10k-daily-builders-pivot-away-feeds',
    sub: 'Malik Adeyemi | Founder & Engineer | Lessons learned after throwing away 6 months of legacy code',
    excerpt: 'The raw, honest retrospective on killing our original algorithm to prioritize chronological timelines.',
    content: 'Algorithmic feeds prioritize controversy and engagement bait over craft. When we switched to community-curated chronological timelines, retention initially wobbled, but organic word of mouth surged 400%. Here is the financial and engineering breakdown.',
    thumbUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    author: 'Malik Adeyemi',
    authorRole: 'Founder & Engineer',
    category: 'STARTUP JOURNEY',
    tags: ['STARTUP JOURNEY', 'GROWTH', 'BOOTSTRAP', 'RETROSPECTIVE'],
    readTime: '8 min read',
    isFeatureBadge: false,
    featureText: 'FOUNDER MEMO',
    page: 1,
    order: 3,
  },
  {
    date: '18 OCT',
    headline: 'Modern Database Indexing Strategies: B-Trees, GiST, and Compound Lookups',
    title: 'Modern Database Indexing Strategies: B-Trees, GiST, and Compound Lookups',
    slug: 'modern-database-indexing-strategies-compound-lookups',
    sub: 'Elena Rostova | Lead Database Engineer | Eliminating sequential scans on millions of JSON records',
    excerpt: 'A practical guide to compound indexes, index selectivity, and explain analyze profiling.',
    content: 'Index bloat can silently kill write throughput. We analyze when to use partial indexes, how compound index ordering dictates query execution paths, and how compound sparse indexes solved our quoter lookups.',
    thumbUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
    author: 'Elena Rostova',
    authorRole: 'Lead Database Engineer',
    category: 'DEV NOTE',
    tags: ['DEV NOTE', 'DATABASE', 'MONGODB', 'PERFORMANCE'],
    readTime: '5 min read',
    isFeatureBadge: false,
    featureText: 'ENGINEERING',
    page: 1,
    order: 4,
  },
  {
    date: '16 OCT',
    headline: 'The Psychology of Daily Creative Commits: How Small Output Prevents Burnout',
    title: 'The Psychology of Daily Creative Commits: How Small Output Prevents Burnout',
    slug: 'psychology-daily-creative-commits-preventing-burnout',
    sub: 'Marcus Vance | Creative Technologist | Breaking the boom-and-bust cycle in high-stakes engineering',
    excerpt: 'Why 15 minutes of non-negotiable daily craft beats 60-hour crunch marathons every time.',
    content: 'Creative stamina is like an endurance sport. When creators swing between 16-hour sprints and weeks of complete paralysis, shame compounds. Here is how keeping a minimalist daily commit log rewires your relationship with creative work.',
    thumbUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    author: 'Marcus Vance',
    authorRole: 'Creative Technologist',
    category: 'CREATIVE ESSAY',
    tags: ['CREATIVE ESSAY', 'MINDSET', 'PRODUCTIVITY', 'HABITS'],
    readTime: '4 min read',
    isFeatureBadge: true,
    featureText: 'ESSAY',
    page: 1,
    order: 5,
  },
  {
    date: '14 OCT',
    headline: 'Zero-Runtime CSS in 2026: Why Tailwind and CSS Subgrid Beat Component Kits',
    title: 'Zero-Runtime CSS in 2026: Why Tailwind and CSS Subgrid Beat Component Kits',
    slug: 'zero-runtime-css-tailwind-subgrid-beat-component-kits',
    sub: 'Sora Takahashi | Frontend Architect | Achieving sub-50ms paint times on complex dashboards',
    excerpt: 'Ditching heavy runtime CSS-in-JS libraries in favor of native CSS Grid, Subgrid, and utilities.',
    content: 'We migrated our 80,000-line codebase from legacy styled-components to Tailwind CSS with CSS Subgrid. The bundle size shrank by 140KB, and runtime layout recalculations dropped to near zero on low-end mobile devices.',
    thumbUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    author: 'Sora Takahashi',
    authorRole: 'Frontend Architect',
    category: 'DEV NOTE',
    tags: ['DEV NOTE', 'FRONTEND', 'CSS', 'PERFORMANCE'],
    readTime: '5 min read',
    isFeatureBadge: false,
    featureText: 'FRONTEND ARCHITECTURE',
    page: 1,
    order: 6,
  },
  {
    date: '12 OCT',
    headline: 'Building Distributed WebSockets for Real-Time Collaborative Canvas Cursors',
    title: 'Building Distributed WebSockets for Real-Time Collaborative Canvas Cursors',
    slug: 'distributed-websockets-realtime-collaborative-canvas',
    sub: 'David Kalu | Realtime Systems Lead | Handling 50,000 concurrent cursor positions with Redis PubSub',
    excerpt: 'State synchronization, delta compression, and conflict-free replicated data types.',
    content: 'Multiplexing cursor vectors across disparate regional edge workers requires strict delta compression. We explore how quantization reduced cursor payload by 88% while preserving 60fps smoothness.',
    thumbUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    author: 'David Kalu',
    authorRole: 'Realtime Systems Lead',
    category: 'DEV NOTE',
    tags: ['DEV NOTE', 'WEBSOCKETS', 'REALTIME', 'CONCURRENCY'],
    readTime: '7 min read',
    isFeatureBadge: false,
    featureText: 'DEEP DIVE',
    page: 2,
    order: 7,
  },
  {
    date: '10 OCT',
    headline: 'The Architecture of Autonomous AI Agents: Tool Routing and State Graphs',
    title: 'The Architecture of Autonomous AI Agents: Tool Routing and State Graphs',
    slug: 'architecture-autonomous-ai-agents-tool-routing',
    sub: 'Zainab Al-Mansoor | AI Research Engineer | Practical patterns for deterministic tool orchestration',
    excerpt: 'Moving beyond naive prompt loops to structured directed-acyclic state machines.',
    content: 'Building production agentic assistants requires reactive message loops, sandboxed command execution, and deterministic guardrails. This note breaks down tool dispatch tables, error recovery, and transcript auditing.',
    thumbUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    author: 'Zainab Al-Mansoor',
    authorRole: 'AI Research Engineer',
    category: 'SYSTEM ARCHITECTURE',
    tags: ['SYSTEM ARCHITECTURE', 'AI', 'AGENTS', 'COMPILERS'],
    readTime: '6 min read',
    isFeatureBadge: true,
    featureText: 'RESEARCH',
    page: 2,
    order: 8,
  },
  {
    date: '08 OCT',
    headline: 'Crafting Type Hierarchies for High-Density Editorial Timelines',
    title: 'Crafting Type Hierarchies for High-Density Editorial Timelines',
    slug: 'crafting-type-hierarchies-high-density-timelines',
    sub: 'Praise Afolabi | Typography Specialist | Balancing legibility and mood across mobile and 4K displays',
    excerpt: 'Choosing proportional type scales, optical sizing, and fluid clamp formulas.',
    content: 'When content transitions from short punchy quotes to 2,000-word engineering essays, typographic consistency anchors the reader. We share our mathematical type scale using the golden ratio and Ubuntu variable font.',
    thumbUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
    author: 'Praise Afolabi',
    authorRole: 'Typography Specialist',
    category: 'DESIGN STORY',
    tags: ['DESIGN STORY', 'TYPOGRAPHY', 'DESIGN SYSTEMS', 'CREATIVE'],
    readTime: '3 min read',
    isFeatureBadge: false,
    featureText: 'DESIGN',
    page: 2,
    order: 9,
  },
  {
    date: '06 OCT',
    headline: 'How We Solved Unsigned Direct Uploads to Cloudinary Without Server Bottlenecks',
    title: 'How We Solved Unsigned Direct Uploads to Cloudinary Without Server Bottlenecks',
    slug: 'direct-unsigned-uploads-cloudinary-zero-server-bottlenecks',
    sub: 'Joshua Afolabi | Fullstack Engineer | Removing 40MB file streams from serverless execution budgets',
    excerpt: 'A blueprint for client-side image resizing, progress tracking, and fallback data URLs.',
    content: 'Streaming large creator artworks through Next.js API routes quickly hits serverless body limits and timeouts. We implemented unsigned browser uploads with instant base64 canvas previews and automatic retries.',
    thumbUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    author: 'Joshua Afolabi',
    authorRole: 'Fullstack Engineer',
    category: 'DEV NOTE',
    tags: ['DEV NOTE', 'CLOUDINARY', 'NEXTJS', 'MEDIA'],
    readTime: '4 min read',
    isFeatureBadge: false,
    featureText: 'TUTORIAL',
    page: 2,
    order: 10,
  }
];

// Dynamically generate remaining realistic posts up to 50
const authorsList = [
  { name: 'Oluwadara Afolabi', role: 'System Architect' },
  { name: 'Amara Chen', role: 'Principal Designer' },
  { name: 'Malik Adeyemi', role: 'Founder & Engineer' },
  { name: 'Elena Rostova', role: 'Lead Database Engineer' },
  { name: 'Marcus Vance', role: 'Creative Technologist' },
  { name: 'Sora Takahashi', role: 'Frontend Architect' },
  { name: 'Zainab Al-Mansoor', role: 'AI Research Engineer' },
  { name: 'David Kalu', role: 'Realtime Systems Lead' },
  { name: 'Praise Afolabi', role: 'Typography Specialist' },
  { name: 'Joshua Afolabi', role: 'Fullstack Engineer' },
];

const categoriesList = [
  'DEV NOTE',
  'DESIGN STORY',
  'STARTUP JOURNEY',
  'CREATIVE ESSAY',
  'SYSTEM ARCHITECTURE',
  'PRODUCT INSIGHT',
];

const topics = [
  { title: 'Demystifying Memory Leaks in Long-Running Node.js Microservices', tag: 'DEV NOTE' },
  { title: 'The Anatomy of a Clean Design System: Tokens, Components, and Guidelines', tag: 'DESIGN STORY' },
  { title: 'Surviving Year One as a Solitary Technical Founder', tag: 'STARTUP JOURNEY' },
  { title: 'Why Write-Heavy Applications Benefit from Append-Only Audit Logs', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Building Fluid Motion Interfaces with Framer Motion and Springs', tag: 'DESIGN STORY' },
  { title: 'Optimizing Next.js 14 Bundle Splits for Sub-Second Initial Load', tag: 'DEV NOTE' },
  { title: 'Empathy in Code Reviews: Fostering Psychological Safety in Dev Teams', tag: 'CREATIVE ESSAY' },
  { title: 'How We Reduced Our MongoDB Atlas Infrastructure Spend by 45%', tag: 'DEV NOTE' },
  { title: 'The Case for Boring Tech: Why Postgres and Node Still Win in Production', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Micro-Interactions that Delight: Small Details with Huge Emotional ROI', tag: 'DESIGN STORY' },
  { title: 'Handling Network Offline States Gracefully in Progressive Web Apps', tag: 'DEV NOTE' },
  { title: 'Bootstrapping vs Venture Capital: Choosing Freedom Over Hyper-Growth', tag: 'STARTUP JOURNEY' },
  { title: 'The Lost Art of Documentation: Writing Guides Developers Actually Read', tag: 'CREATIVE ESSAY' },
  { title: 'Event-Driven Architectures with Kafka: Partitioning and Message Guarantees', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Dark Mode Done Right: Surface Elevation and Ambient Contrast Ratios', tag: 'DESIGN STORY' },
  { title: 'Benchmarking WebAssembly vs Native JavaScript in Image Processing', tag: 'DEV NOTE' },
  { title: 'The Discipline of Saying No: Curating Product Roadmaps Without Regret', tag: 'PRODUCT INSIGHT' },
  { title: 'Building Accessible Keyboard Navigation for Deep Modal Stacks', tag: 'DEV NOTE' },
  { title: 'From Prototypes to Production: Navigating the Messy Middle of Creation', tag: 'CREATIVE ESSAY' },
  { title: 'Zero Downtime Database Migrations with Zero Locks', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Color Theory in Dark Themes: Hue Shifting and Perceptual Luminance', tag: 'DESIGN STORY' },
  { title: 'Managing State in Complex Multi-Step Contribution Workflows', tag: 'DEV NOTE' },
  { title: 'Why Every Developer Should Maintain a Digital Garden of Raw Notes', tag: 'CREATIVE ESSAY' },
  { title: 'HTTP/3 and QUIC: What Modern Fullstack Developers Need to Know', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Scaling Team Velocity Without Adding Management Overhead', tag: 'PRODUCT INSIGHT' },
  { title: 'Designing for Mobile-First Creators: Touch Targets and Reachability', tag: 'DESIGN STORY' },
  { title: 'Security Hardening for Node.js API Endpoints: Rate Limiting and Sanitization', tag: 'DEV NOTE' },
  { title: 'The Philosophy of the Minimum Viable Experience', tag: 'STARTUP JOURNEY' },
  { title: 'Continuous Integration Pipelines that Finish in Under Two Minutes', tag: 'DEV NOTE' },
  { title: 'Spatial Computing Interfaces: What Flat Designers Must Unlearn', tag: 'DESIGN STORY' },
  { title: 'Handling Concurrency in Distributed Stripe Webhook Consumers', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'The Daily Log: How Writing Three Sentences a Day Changed My Engineering', tag: 'CREATIVE ESSAY' },
  { title: 'Designing Non-Intrusive Search Modals with Instant Filter Feedback', tag: 'DESIGN STORY' },
  { title: 'Understanding V8 JIT Compilation: Writing Deoptimization-Free Loops', tag: 'DEV NOTE' },
  { title: 'Refactoring 50,000 Lines of Legacy React into Clean Server Components', tag: 'DEV NOTE' },
  { title: 'The Power of Public Commits: Why Transparent Building Attracts Talent', tag: 'STARTUP JOURNEY' },
  { title: 'Creating High-Converting Editorial Landing Pages with Zero Bloat', tag: 'DESIGN STORY' },
  { title: 'Edge Computing with Cloudflare Workers: When and Why to Go Serverless', tag: 'SYSTEM ARCHITECTURE' },
  { title: 'Embracing Constraints: How Resource Limits Breed Original Thinking', tag: 'CREATIVE ESSAY' },
  { title: 'The Creanote Manifesto: Documenting the Creative Journey at Scale', tag: 'PRODUCT INSIGHT' },
];

for (let i = 0; i < topics.length; i++) {
  const t = topics[i];
  const authorObj = authorsList[i % authorsList.length];
  const postNum = 11 + i;
  const day = (30 - (i % 28)).toString().padStart(2, '0');
  const month = i < 15 ? 'SEP' : i < 30 ? 'AUG' : 'JUL';
  const slug = t.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  SEED_POSTS.push({
    date: `${day} ${month}`,
    headline: t.title,
    title: t.title,
    slug: `${slug}-${postNum}`,
    sub: `${authorObj.name} | ${authorObj.role} | Practical insights and field observations from production`,
    excerpt: `A field note examining ${t.title.toLowerCase()} in real-world creative workflows.`,
    content: `Creating high-caliber products is fundamentally an iterative discipline. In this writeup, we unpack the lessons learned while solving ${t.title.toLowerCase()}, outlining key trade-offs, architecture decisions, and actionable guidelines for creative teams.`,
    thumbUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 50000000}?w=800&auto=format&fit=crop&q=80`,
    coverImage: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 50000000}?w=1200&auto=format&fit=crop&q=80`,
    author: authorObj.name,
    authorRole: authorObj.role,
    category: t.tag,
    tags: [t.tag, 'CREANOTE', authorObj.role.toUpperCase().split(' ')[0]],
    readTime: `${3 + (i % 5)} min read`,
    isFeatureBadge: i % 4 === 0,
    featureText: i % 4 === 0 ? 'FEATURED' : undefined,
    page: Math.floor(postNum / 6) + 1,
    order: postNum,
  });
}

// 50 REALISTIC QUOTES
export const SEED_QUOTES = [
  {
    boldText: 'There is no true road to success, work harder than ever.',
    text: 'There is no true road to success, work harder than ever.',
    bodyText: 'Be resilient to what you want. Don\'t be afraid to pivot your ideas or start over if you need to. Just keep trying until you find something that clicks. Hard work beats talent when talent doesn\'t work hard.',
    name: 'OLUWADARA AFOLABI',
    author: 'OLUWADARA AFOLABI',
    role: 'Product Designer',
    tagText: 'QUOTE',
    category: 'QUOTE',
    caption: 'This is your reminder that struggle doesn\'t mean failing, it means you\'re learning.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Oluwadara Afolabi', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-24',
    isActive: true,
    order: 0,
  },
  {
    boldText: 'The quiet commits made when nobody is watching compound into monuments.',
    text: 'The quiet commits made when nobody is watching compound into monuments.',
    bodyText: 'Everyone celebrates the product launch, but the real work happens in the silent hours of debugging, rewriting, and refining.',
    name: 'MALIK ADEYEMI',
    author: 'MALIK ADEYEMI',
    role: 'Founder & Engineer',
    tagText: 'PERSEVERANCE',
    category: 'PERSEVERANCE',
    caption: 'Great products are built one quiet commit at a time.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Malik Adeyemi', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-22',
    isActive: false,
    order: 1,
  },
  {
    boldText: 'Simple can be harder than complex: You have to work hard to get your thinking clean.',
    text: 'Simple can be harder than complex: You have to work hard to get your thinking clean.',
    bodyText: 'Simplicity isn\'t the lack of clutter, that\'s just less clutter. Simplicity is somehow essentially making a product speak to what it really is.',
    name: 'STEVE JOBS',
    author: 'STEVE JOBS',
    role: 'Visionary & Creator',
    tagText: 'DESIGN',
    category: 'DESIGN',
    caption: 'Simplicity is the ultimate sophistication.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Steve Jobs', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-20',
    isActive: false,
    order: 2,
  },
  {
    boldText: 'Good design is as little design as possible.',
    text: 'Good design is as little design as possible.',
    bodyText: 'Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.',
    name: 'DIETER RAMS',
    author: 'DIETER RAMS',
    role: 'Industrial Designer',
    tagText: 'MINIMALISM',
    category: 'MINIMALISM',
    caption: 'Ten principles for good design.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Dieter Rams', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-18',
    isActive: false,
    order: 3,
  },
  {
    boldText: 'Talk is cheap. Show me the code.',
    text: 'Talk is cheap. Show me the code.',
    bodyText: 'The true test of any architectural proposal is whether it executes cleanly under real-world conditions.',
    name: 'LINUS TORVALDS',
    author: 'LINUS TORVALDS',
    role: 'Creator of Linux & Git',
    tagText: 'CRAFT',
    category: 'CRAFT',
    caption: 'Execution speaks louder than debate.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Linus Torvalds', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-16',
    isActive: false,
    order: 4,
  },
  {
    boldText: 'Who cares about cringe? This is the best time to do all the experimental work.',
    text: 'Who cares about cringe? This is the best time to do all the experimental work.',
    bodyText: 'When you are early, nobody is grading your work. The fear of being judged keeps thousands of brilliant concepts locked in draft folders.',
    name: 'PRAISE AFOLABI',
    author: 'PRAISE AFOLABI',
    role: 'Creative Technologist',
    tagText: 'INNOVATION',
    category: 'INNOVATION',
    caption: 'Embrace experimental failure before scaling.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Praise Afolabi', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-14',
    isActive: false,
    order: 5,
  },
  {
    boldText: 'Stay rooted in your purpose, the only timeline that matters is your own.',
    text: 'Stay rooted in your purpose, the only timeline that matters is your own.',
    bodyText: 'Comparison is the thief of joyful creation. Measure your output against yesterday\'s version of yourself, not another creator\'s highlight reel.',
    name: 'JOSHUA AFOLABI',
    author: 'JOSHUA AFOLABI',
    role: 'Frontend Engineer',
    tagText: 'MINDSET',
    category: 'MINDSET',
    caption: 'Run your own race.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Joshua Afolabi', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-12',
    isActive: false,
    order: 6,
  },
  {
    boldText: 'Make something people want.',
    text: 'Make something people want.',
    bodyText: 'The fundamental formula of startup survival is delightfully simple, yet endlessly difficult: find a genuine human problem and solve it obsessively.',
    name: 'PAUL GRAHAM',
    author: 'PAUL GRAHAM',
    role: 'Founder of Y Combinator',
    tagText: 'STARTUP',
    category: 'STARTUP',
    caption: 'The core metric of product market fit.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Paul Graham', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-10',
    isActive: false,
    order: 7,
  },
  {
    boldText: 'Inspiration is for amateurs. The rest of us just show up and get to work.',
    text: 'Inspiration is for amateurs. The rest of us just show up and get to work.',
    bodyText: 'Don\'t wait around for the lightning bolt of inspiration. Sit in the chair, open the canvas, and let momentum generate clarity.',
    name: 'CHUCK CLOSE',
    author: 'CHUCK CLOSE',
    role: 'Visual Artist',
    tagText: 'MASTERY',
    category: 'MASTERY',
    caption: 'Routine breeds breakthroughs.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Chuck Close', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-08',
    isActive: false,
    order: 8,
  },
  {
    boldText: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    bodyText: 'The highest achievement of craft is subtractive. Strip away the superfluous until only the pure essence remains.',
    name: 'ANTOINE DE SAINT-EXUPÉRY',
    author: 'ANTOINE DE SAINT-EXUPÉRY',
    role: 'Writer & Aviator',
    tagText: 'MINIMALISM',
    category: 'MINIMALISM',
    caption: 'Subtractive elegance.',
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph('Antoine de Saint-Exupéry', 160, 160),
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    date: '2026-10-06',
    isActive: false,
    order: 9,
  }
];

const quotersPool = [
  { name: 'AMARA CHEN', role: 'Principal Designer', tag: 'DESIGN' },
  { name: 'ELENA ROSTOVA', role: 'Lead Database Engineer', tag: 'SYSTEMS' },
  { name: 'ZAINAB AL-MANSOOR', role: 'AI Researcher', tag: 'INNOVATION' },
  { name: 'MARCUS VANCE', role: 'Creative Technologist', tag: 'CRAFT' },
  { name: 'SORA TAKAHASHI', role: 'Frontend Architect', tag: 'ENGINEERING' },
  { name: 'DAVID KALU', role: 'Realtime Systems Lead', tag: 'PERSEVERANCE' },
  { name: 'NAVAL RAVIKANT', role: 'Philosopher & Investor', tag: 'WISDOM' },
  { name: 'RICK RUBIN', role: 'Legendary Music Producer', tag: 'CREATIVITY' },
  { name: 'AUSTIN KLEON', role: 'Author of Steal Like an Artist', tag: 'CRAFT' },
  { name: 'MAYA ANGELOU', role: 'Poet & Writer', tag: 'RESILIENCE' },
  { name: 'GRACE HOPPER', role: 'Computer Scientist Pioneer', tag: 'INNOVATION' },
  { name: 'JONY IVE', role: 'Designer', tag: 'DESIGN' },
  { name: 'ADA LOVELACE', role: 'First Computer Programmer', tag: 'INNOVATION' },
  { name: 'PAUL RAND', role: 'Graphic Designer', tag: 'DESIGN' },
];

const quoteWisdom = [
  'Free yourself from the desire to please everyone. Build for the discerning few.',
  'Your taste is why your work is good. Be patient while your skills catch up to your taste.',
  'If you can\'t explain your architecture simply, you don\'t understand it well enough.',
  'Momentum is fragile. Never end a working session without setting up the next easy win.',
  'The best code is the code you never had to write.',
  'A user interface is like a joke. If you have to explain it, it isn\'t very good.',
  'Don\'t worry about people stealing your ideas. If they are original, you\'ll have to ram them down their throats.',
  'You can\'t use up creativity. The more you use, the more you have.',
  'It\'s easier to ask forgiveness than it is to get permission.',
  'The details are not the details. They make the design.',
  'Creativity is intelligence having fun.',
  'First make it work. Then make it right. Then make it fast.',
  'Before software can be reusable it first has to be usable.',
  'Simplicity carried to an extreme becomes elegance.',
  'Code is poetry written for machines to execute and humans to understand.',
  'Action expresses priorities. What you commit today defines your trajectory.',
  'Fall in love with the problem, not your initial solution.',
  'The most dangerous phrase in creative work is "We\'ve always done it this way."',
  'Great work comes from opening yourself to the raw vulnerability of failure.',
  'Every expert was once a beginner who refused to quit.',
  'Craft is what happens when obsession meets patience.',
  'Optimize for velocity of learning rather than premature polish.',
  'Do not optimize the engine before you have built the vehicle.',
  'Clarity of thought precedes clarity of visual execution.',
  'When in doubt, delete a third of what you just created.',
  'Your timeline belongs to you. Guard your attention with fierce discipline.',
  'A bug is an opportunity to deeply understand the platform you are building upon.',
  'Design is how it works, not just how it looks and feels.',
  'The reward for good work is the opportunity to do more difficult work.',
  'Mastery is the commitment to lifelong beginnerhood.',
  'Ship early, ship humbly, and listen to the people who care enough to give critique.',
  'Software decays faster than hardware. Refactor relentlessly.',
  'The simplest way to stand out is to be remarkably reliable.',
  'Don\'t build for vanity metrics; build tools that fundamentally empower human capability.',
  'A creative block is merely a sign that your subconscious needs more raw input.',
  'Trust the compound interest of tiny daily adjustments.',
  'The finish line is an illusion; the journey of craft is the actual destination.',
  'Never mistake activity for achievement. Focus on the core value.',
  'Build with such conviction that even your prototypes command respect.',
  'Stay curious. Stay courageous. Stay building.'
];

for (let i = 0; i < quoteWisdom.length; i++) {
  const qObj = quotersPool[i % quotersPool.length];
  const quoteIndex = 11 + i;
  const day = (28 - (i % 26)).toString().padStart(2, '0');
  const month = i < 15 ? '09' : '08';

  SEED_QUOTES.push({
    boldText: quoteWisdom[i],
    text: quoteWisdom[i],
    bodyText: `Reflection by ${qObj.name}: ${quoteWisdom[i]} Keep pushing through the friction of learning and discovery.`,
    name: qObj.name,
    author: qObj.name,
    role: qObj.role,
    tagText: qObj.tag,
    category: qObj.tag,
    caption: `Timeline reflection #${quoteIndex}`,
    credit: 'CREANOTE QUOTE TIMELINE',
    avatarUrl: ph(qObj.name, 160, 160),
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 2345678) % 50000000}?w=800&auto=format&fit=crop&q=80`,
    date: `2026-${month}-${day}`,
    isActive: false,
    order: quoteIndex,
  });
}

// 6 REALISTIC TOP ITEMS
export const SEED_TOP_ITEMS = [
  {
    title: 'Creanote 2.0 Architectural Overhaul: 50ms Edge Timelines',
    meta: 'CREANOTE SPOTLIGHT',
    badgeText: 'FEATURED',
    badgeColor: 'orange',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    order: 0,
  },
  {
    title: 'The Design Tokens Handbook: Systematic Color & Spacing',
    meta: 'DESIGN STORY',
    badgeText: 'DESIGN',
    badgeColor: 'green',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    order: 1,
  },
  {
    title: 'Mindful Typography for Developers: Crafting Hierarchies',
    meta: 'TYPOGRAPHY TIMELINE',
    badgeText: 'CRAFT',
    badgeColor: 'orange',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    order: 2,
  },
  {
    title: 'Scaling Realtime Systems to 50k Concurrency with Zero Latency',
    meta: 'BACKEND DEEP DIVE',
    badgeText: 'SYSTEMS',
    badgeColor: 'green',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    order: 3,
  },
  {
    title: 'Lessons from Bootstrapping a Modern Creator Network',
    meta: 'FOUNDER RETROSPECTIVE',
    badgeText: 'STARTUP',
    badgeColor: 'orange',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    order: 4,
  },
  {
    title: 'Zero-Runtime Tailwind & Subgrid Migration Guide',
    meta: 'FRONTEND BENCHMARKS',
    badgeText: 'PERFORMANCE',
    badgeColor: 'green',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    order: 5,
  },
];

// 4 REALISTIC HERO SLIDES
export const SEED_HERO_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=2000&auto=format&fit=crop&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
    alt: 'Creanote Hero Spotlight',
    title: 'Bright Design shares how curiosity got him into design and what inspired him to continue',
    headline: 'Bright Design shares how curiosity got him into design and what inspired him to continue',
    meta: 'CREANOTE FEATURE TIMELINE',
    badgeText: 'SPOTLIGHT',
    order: 0,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2000&auto=format&fit=crop&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
    alt: 'Anonymous Creatives Timeline',
    title: '3 creatives shared moments of their career they\'ve never shared publicly.',
    headline: '3 creatives shared moments of their career they\'ve never shared publicly.',
    meta: 'CREANOTE ANONYMOUS TIMELINE',
    badgeText: 'ANONYMOUS',
    order: 1,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&auto=format&fit=crop&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
    alt: 'Video Editing Journey',
    title: 'Eesha shared what inspired her path into video editing, the challenges she faced, and the lessons she learned.',
    headline: 'Eesha shared what inspired her path into video editing, the challenges she faced, and the lessons she learned.',
    meta: 'CREANOTE FEATURE TIMELINE',
    badgeText: 'SPOTLIGHT',
    order: 2,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=2000&auto=format&fit=crop&q=80',
    mobileImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&auto=format&fit=crop&q=80',
    alt: 'Quote Timeline Feature',
    title: 'This is your reminder that struggle doesn\'t mean failing, it means you\'re learning.',
    headline: 'This is your reminder that struggle doesn\'t mean failing, it means you\'re learning.',
    meta: 'CREANOTE QUOTE TIMELINE',
    badgeText: 'QUOTE',
    order: 3,
    isActive: true,
  },
];

export async function runSeed() {
  console.log('🌱 Connecting to Atlas MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected successfully.');

  // Idempotent upserts for Posts
  console.log(`📦 Upserting ${SEED_POSTS.length} Posts...`);
  for (const post of SEED_POSTS) {
    await Post.updateOne(
      { slug: post.slug },
      { $set: post },
      { upsert: true }
    );
  }
  console.log(`✅ ${SEED_POSTS.length} Posts upserted.`);

  // Idempotent upserts for Quotes
  console.log(`📦 Upserting ${SEED_QUOTES.length} Quotes...`);
  for (const quote of SEED_QUOTES) {
    await Quote.updateOne(
      { boldText: quote.boldText, name: quote.name },
      { $set: quote },
      { upsert: true }
    );
  }
  console.log(`✅ ${SEED_QUOTES.length} Quotes upserted.`);

  // Idempotent upserts for TopItems
  console.log(`📦 Upserting ${SEED_TOP_ITEMS.length} TopItems...`);
  for (const item of SEED_TOP_ITEMS) {
    await TopItem.updateOne(
      { title: item.title },
      { $set: item },
      { upsert: true }
    );
  }
  console.log(`✅ ${SEED_TOP_ITEMS.length} TopItems upserted.`);

  // Idempotent upserts for HeroSlides
  console.log(`📦 Upserting ${SEED_HERO_SLIDES.length} HeroSlides...`);
  for (const slide of SEED_HERO_SLIDES) {
    await HeroSlide.updateOne(
      { order: slide.order },
      { $set: slide },
      { upsert: true }
    );
  }
  console.log(`✅ ${SEED_HERO_SLIDES.length} HeroSlides upserted.`);

  const finalCounts = {
    posts: await Post.countDocuments(),
    quotes: await Quote.countDocuments(),
    topItems: await TopItem.countDocuments(),
    heroSlides: await HeroSlide.countDocuments(),
  };

  console.log('🎉 Database seeding complete!');
  console.log('📊 Current Live Database Totals:', finalCounts);

  await mongoose.disconnect();
  return finalCounts;
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
