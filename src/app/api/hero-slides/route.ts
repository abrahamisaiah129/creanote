import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { defaultHeroSlides } from '@/lib/defaultData';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: 1 });
      if (slides && slides.length > 0) {
        return NextResponse.json(slides);
      }
    }
    return NextResponse.json(defaultHeroSlides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(defaultHeroSlides);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, alt, order, isActive } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { message: 'Slide created (offline mode)', slide: { ...body, _id: 'temp-' + Date.now() } },
        { status: 201 }
      );
    }

    const newSlide = await HeroSlide.create({
      imageUrl,
      alt: alt || 'Creanote Hero Slide',
      order: order || 0,
      isActive: isActive !== undefined ? !!isActive : true,
    });

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating hero slide:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
