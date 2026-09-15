import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TopItem } from '@/models/TopItem';
import { defaultTopItems } from '@/lib/defaultData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const items = await TopItem.find({}).sort({ order: 1, createdAt: -1 });
      if (items && items.length > 0) {
        return NextResponse.json(items);
      }
    }
    return NextResponse.json(defaultTopItems);
  } catch (error) {
    console.error('Error fetching top items:', error);
    return NextResponse.json(defaultTopItems);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, meta, badgeText, badgeColor, imageUrl, order } = body;

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
      order: order || 0,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating top item:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
