import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Quote } from '@/models/Quote';
import { defaultQuotes } from '@/lib/defaultData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const quotes = await Quote.find({}).sort({ order: 1, createdAt: -1 });
      if (quotes && quotes.length > 0) {
        return NextResponse.json(quotes);
      }
    }
    return NextResponse.json(defaultQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(defaultQuotes);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { boldText, bodyText, tagText, caption, credit, name, role, avatarUrl, isActive, order } = body;

    if (!boldText || !bodyText || !name || !role) {
      return NextResponse.json(
        { error: 'Bold text, body text, name, and role are required' },
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
      role,
      avatarUrl: avatarUrl || '/images/quote-avatar.jpg',
      isActive: !!isActive,
      order: order || 0,
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating quote:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
