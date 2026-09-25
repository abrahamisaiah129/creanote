import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Quote } from '@/models/Quote';
import { defaultQuotes } from '@/lib/defaultData';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const conn = await connectToDatabase();
    if (conn) {
      let quote = null;
      try {
        quote = await Quote.findById(id);
      } catch {
        // If not a valid ObjectId, search by id string
        quote = await Quote.findOne({ id });
      }
      if (quote) return NextResponse.json(quote);
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Offline mode when MONGODB_URI is not set
    const fallback = defaultQuotes.find((q) => q.id === id);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: 'Updated (offline mode)', quote: body });
    }

    const updated = await Quote.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ message: 'Deleted (offline mode)', id });
    }

    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully', id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
