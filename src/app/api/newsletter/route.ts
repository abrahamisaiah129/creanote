import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
      return NextResponse.json(subscribers);
    }
    return NextResponse.json([
      { _id: '1', email: 'officialcreanote@gmail.com', createdAt: new Date() },
    ]);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { message: 'Subscribed successfully (offline mode)', subscriber: { email, _id: 'sub-' + Date.now() } },
        { status: 201 }
      );
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { message: 'You are already subscribed to Creanote!' },
        { status: 200 }
      );
    }

    const newSub = await Subscriber.create({
      email: email.toLowerCase().trim(),
    });

    return NextResponse.json(newSub, { status: 201 });
  } catch (error: unknown) {
    console.error('Error subscribing to newsletter:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
