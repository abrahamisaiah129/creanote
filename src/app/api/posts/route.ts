import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Post } from '@/models/Post';
import { defaultPosts } from '@/lib/defaultData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0', 10);

    const conn = await connectToDatabase();
    if (conn) {
      const query = page > 0 ? { page } : {};
      const posts = await Post.find(query).sort({ order: 1, createdAt: -1 });
      if (posts && posts.length > 0) {
        return NextResponse.json(posts);
      }
    }

    if (page > 0) {
      const filtered = defaultPosts.filter((p) => p.page === page);
      return NextResponse.json(filtered);
    }
    return NextResponse.json(defaultPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(defaultPosts);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, headline, sub, thumbUrl, isFeatureBadge, featureText, page, order } = body;

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
      isFeatureBadge: !!isFeatureBadge,
      featureText: featureText || '',
      page: page || 1,
      order: order || 0,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
