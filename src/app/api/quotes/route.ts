import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Quote } from '@/models/Quote';
import { defaultQuotes, placeholderUrl } from '@/lib/defaultData';

export async function GET(req: Request) {
  try {
    let quoterName: string | null = null;
    let sort: string | null = null;
    let page = 1;
    let limit = 0;
    let category: string | null = null;
    let paginated = false;

    if (req && req.url) {
      const url = new URL(req.url, 'http://localhost');
      quoterName = url.searchParams.get('name') || url.searchParams.get('author') || url.searchParams.get('search');
      sort = url.searchParams.get('sort');
      page = parseInt(url.searchParams.get('page') || '1', 10);
      limit = parseInt(url.searchParams.get('limit') || url.searchParams.get('pageSize') || '0', 10);
      category = url.searchParams.get('category');
      paginated = url.searchParams.get('paginated') === 'true';
    }

    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, any> = {};
      if (quoterName && quoterName.toUpperCase() !== 'ALL') {
        const regex = new RegExp(quoterName.trim(), 'i');
        query.$or = [{ name: regex }, { author: regex }, { boldText: regex }, { bodyText: regex }];
      }
      if (category && category.toUpperCase() !== 'ALL') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      const sortOption: Record<string, 1 | -1> =
        sort === 'OLDEST' || sort === 'oldest'
          ? { createdAt: 1 }
          : { createdAt: -1 };

      let mongoQuery = Quote.find(query).sort(sortOption);
      const total = await Quote.countDocuments(query);
      
      if (limit > 0) {
        const skip = page > 1 ? (page - 1) * limit : 0;
        mongoQuery = mongoQuery.skip(skip).limit(limit);
      }
      const quotes = await mongoQuery;
      
      if (paginated) {
        const allQuotes = await Quote.find({}, 'name author');
        const quoterSet = new Set<string>();
        allQuotes.forEach(q => {
          const raw = (q.author || q.name || '').trim();
          if (raw && raw.toUpperCase() !== 'ALL') {
             quoterSet.add(raw);
          }
        });

        return NextResponse.json({
          data: quotes,
          total,
          page,
          limit: limit > 0 ? limit : total,
          totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
          quoters: Array.from(quoterSet).sort((a, b) => a.localeCompare(b))
        });
      }
      
      return NextResponse.json(quotes);
    }

    // Offline / unit-test fallback when MONGODB_URI is not set
    let result = [...defaultQuotes];
    if (quoterName && quoterName.toUpperCase() !== 'ALL') {
      const term = quoterName.toLowerCase().trim();
      result = result.filter(
        (q) =>
          (q.name && q.name.toLowerCase().includes(term)) ||
          (q.author && q.author.toLowerCase().includes(term))
      );
    }
    if (sort === 'OLDEST' || sort === 'oldest') {
      result.reverse();
    }
    
    if (paginated) {
      return NextResponse.json({
        data: result,
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const boldText = body.boldText || body.text || '';
    const author = body.author || body.name || '';
    const name = body.name || author || '';
    const role = body.role || 'Creator';
    const bodyText = body.bodyText || boldText;
    const caption = body.caption || boldText;
    const credit = body.credit || 'CREANOTE QUOTE TIMELINE';
    const tagText = body.tagText || 'QUOTE';
    const avatarUrl = body.avatarUrl || placeholderUrl(name || 'Creator', 160, 160);
    const imageUrl = body.imageUrl || '';
    const bannerUrl = body.bannerUrl || '';
    const date = body.date || new Date().toISOString().split('T')[0];
    const isActive = body.isActive !== undefined ? !!body.isActive : false;
    const order = body.order || 0;

    if (!boldText || !name) {
      return NextResponse.json(
        { error: 'Quote text and author/name are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { message: 'Quote created (offline mode)', quote: { ...body, _id: 'temp-' + Date.now() } },
        { status: 201 }
      );
    }

    const newQuote = await Quote.create({
      boldText,
      bodyText,
      tagText: tagText || 'QUOTE',
      caption: caption || '',
      credit: credit || 'CREANOTE QUOTE TIMELINE',
      name,
      author: author || name,
      role,
      avatarUrl: avatarUrl || placeholderUrl(name, 160, 160),
      bannerUrl: bannerUrl || '',
      imageUrl: imageUrl || '',
      date: date || new Date().toISOString().split('T')[0],
      isActive: !!isActive,
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating quote:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
