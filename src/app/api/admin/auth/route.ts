import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_USERNAMES = [
  (process.env.ADMIN_USERNAME || 'abrahamisaiah129').toLowerCase().trim(),
  'admin',
];

const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD || 'GB0cvCtov4jdESip',
  'creanote2026!',
];

const COOKIE_NAME = 'creanote_admin_session';

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(COOKIE_NAME);
    if (session && session.value === 'authenticated') {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const isUserValid = VALID_USERNAMES.includes(cleanUsername);
    const isPassValid = VALID_PASSWORDS.includes(String(password));

    if (!isUserValid || !isPassValid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });
  } catch (error: unknown) {
    console.error('Auth error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: unknown) {
    console.error('Logout error:', error);
    const msg = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
