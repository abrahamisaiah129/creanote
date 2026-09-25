import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TopItem } from '@/models/TopItem';
import { defaultTopItems } from '@/lib/defaultData';

export async function GET(req: Request) {
  try {
    let search = '';
    if (req && req.url) {
      const url = new URL(req.url, 'http://localhost');
      search = url.searchParams.get('search')?.trim() || '';
    }

    const conn = await connectToDatabase();
    if (conn) {
      const query: Record<string, any> = {};
      if (search) {
        const sRegex = { $regex: search, $options: 'i' };
        query.$or = [{ title: sRegex }, { meta: sRegex }, { badgeText: sRegex }];
      }
      const items = await TopItem.find(query).sort({ order: 1, createdAt: -1 });
      return NextResponse.json(items);
    }

    // Offline mode when MONGODB_URI is not set
    let filtered = [...defaultTopItems];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(s) || (item.meta && item.meta.toLowerCase().includes(s))
      );
    }
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching top items:', error);
    return NextResponse.json({ error: 'Failed to fetch top items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, meta, badgeText, badgeColor, imageUrl, linkUrl, order } = body;

    if (!title || !meta || !imageUrl) {
      return NextResponse.json(
        { error: 'Title, meta, and imageUrl are required' },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { message: 'Item created (offline mode)', item: { ...body, _id: 'temp-' + Date.now() } },
        { status: 201 }
      );
    }

    const newItem = await TopItem.create({
      title,
      meta,
      badgeText,
      badgeColor: badgeColor || 'orange',
      imageUrl,
      linkUrl: linkUrl || '',
      order: order || 0,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating top item:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
