import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Quote } from '@/models/Quote';
import { defaultQuotes } from '@/lib/defaultData';

export async function GET(req: Request) {
  try {
    let page = 1;
    let limit = 0;
    let paginated = false;

    if (req && req.url) {
      const url = new URL(req.url, 'http://localhost');
      page = parseInt(url.searchParams.get('page') || '1', 10);
      limit = parseInt(url.searchParams.get('limit') || url.searchParams.get('pageSize') || '0', 10);
      paginated = url.searchParams.get('paginated') === 'true';
    }

    const conn = await connectToDatabase();
    if (conn) {
      const query = {};
      const sortOption = { createdAt: -1 as const };

      let mongoQuery = Quote.find(query).sort(sortOption);
      const total = await Quote.countDocuments(query);
      
      if (limit > 0) {
        const skip = page > 1 ? (page - 1) * limit : 0;
        mongoQuery = mongoQuery.skip(skip).limit(limit);
      }
      const quotes = await mongoQuery;
      
      if (paginated) {
        return NextResponse.json({
          data: quotes,
          total,
          page,
          limit: limit > 0 ? limit : total,
          totalPages: limit > 0 ? Math.ceil(total / limit) : 1
        });
      }
      return NextResponse.json(quotes);
    }

    // Offline / unit-test fallback
    let result = [...defaultQuotes];
    
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
    const imageUrl = body.imageUrl || '';
    const isActive = body.isActive !== undefined ? !!body.isActive : false;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
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
      imageUrl,
      isActive
    });

    return NextResponse.json({ quote: newQuote }, { status: 201 });
  } catch (error) {
    console.error('Error saving quote:', error);
    return NextResponse.json({ error: 'Failed to save quote' }, { status: 500 });
  }
}
