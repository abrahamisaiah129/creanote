import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { defaultPosts } from '@/lib/defaultData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || searchParams.get('pageSize') || '0', 10);
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category')?.trim();
    const author = searchParams.get('author')?.trim();
    const sort = searchParams.get('sort')?.trim(); // 'OLDEST' or 'NEWEST'
    const readingTime = searchParams.get('readingTime')?.trim(); // 'SHORT' or 'LONG'
    const paginated = searchParams.get('paginated') === 'true';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const isTopOnTheList = searchParams.get('isTopOnTheList') === 'true';

    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, any> = {};
      if (isFeatured) query.isFeatured = true;
      if (isTopOnTheList) query.isTopOnTheList = true;
      if (category && category.toUpperCase() !== 'ALL') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (author && author.toUpperCase() !== 'ALL') {
        query.$or = [
          { author: { $regex: new RegExp(`^${author}$`, 'i') } },
          { sub: { $regex: new RegExp(`^${author}\\|`, 'i') } }
        ];
      }
      if (search) {
        const sRegex = { $regex: search, $options: 'i' };
        query.$or = [
          { headline: sRegex },
          { sub: sRegex },
          { title: sRegex },
          { content: sRegex },
          { author: sRegex },
          { tags: sRegex },
        ];
      }

      // Reading time filter is tricky since it's stored as text e.g., "4 min read"
      // We can do a regex check if possible, or leave it client-side. For server-side, 
      // short means < 4, so "1 min", "2 min", "3 min". Long means >= 4.
      if (readingTime === 'SHORT') {
        query.readTime = { $regex: /^[1-3]\s*min/i };
      } else if (readingTime === 'LONG') {
        query.readTime = { $not: { $regex: /^[1-3]\s*min/i } };
      }

      const sortOption: Record<string, 1 | -1> =
        sort === 'OLDEST' ? { createdAt: 1 } : { createdAt: -1 };

      let mongoQuery = Post.find(query).sort(sortOption);
      const total = await Post.countDocuments(query);
      
      if (limit > 0) {
        const skip = page > 1 ? (page - 1) * limit : 0;
        mongoQuery = mongoQuery.skip(skip).limit(limit);
      }
      
      const posts = await mongoQuery.lean();
      
      if (paginated) {
        // Simple aggregation for categories and authors for filter dropdowns
        const allPosts = await Post.find({}, 'category author sub');
        const catSet = new Set<string>();
        const authSet = new Set<string>();
        
        allPosts.forEach(p => {
          const cat = (p.category || (p.sub?.includes('Developer') ? 'DEV NOTE' : 'CREATOR NOTE')).toUpperCase().trim();
          if (cat && cat !== 'ALL') catSet.add(cat);
          
          const auth = (p.author || p.sub?.split('|')[0]?.trim() || '').trim();
          if (auth && auth.toUpperCase() !== 'ALL') authSet.add(auth);
        });

        return NextResponse.json({
          data: posts,
          total,
          page,
          limit: limit > 0 ? limit : total,
          totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
          categories: Array.from(catSet).sort(),
          authors: Array.from(authSet).sort((a, b) => a.localeCompare(b))
        });
      }
      
      return NextResponse.json(posts);
    }

    // Offline / unit-test fallback when MONGODB_URI is not set
    let filtered = [...defaultPosts];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.headline.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s)
      );
    }
    
    if (paginated) {
      return NextResponse.json({
        data: filtered,
        total: filtered.length,
        page: 1,
        limit: filtered.length,
        totalPages: 1
      });
    }
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, headline, sub, thumbUrl, isFeatureBadge, featureText, authorAvatar } = body;

    if (!headline || !date || !sub) {
      return NextResponse.json(
        { error: 'Date, headline, and subtitle are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { message: 'Post created (offline mode)', post: { ...body, _id: 'temp-' + Date.now() } },
        { status: 201 }
      );
    }

    const newPost = await Post.create({
      date,
      headline,
      sub,
      thumbUrl: thumbUrl || '',
      authorAvatar: authorAvatar || '',
      isFeatureBadge: !!isFeatureBadge,
      featureText: featureText || '',
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
