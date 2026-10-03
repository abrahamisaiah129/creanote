import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Exempt the auth route itself from protection
  if (request.nextUrl.pathname === '/api/admin/auth') {
    return NextResponse.next();
  }

  // Exempt public GET requests (anyone can read posts, quotes, hero slides, etc.)
  if (request.method === 'GET') {
    return NextResponse.next();
  }

  // Exempt public POST requests for user contributions (ContributeModal / Newsletter)
  if (request.method === 'POST') {
    const publicPostRoutes = ['/api/posts', '/api/quotes', '/api/newsletter'];
    if (publicPostRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
  }

  // Everything else (PUT, DELETE, and POST to hero-slides, top-items, etc.) requires admin session
  const session = request.cookies.get('creanote_admin_session');
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json(
      { error: 'Unauthorized: Admin session required' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
