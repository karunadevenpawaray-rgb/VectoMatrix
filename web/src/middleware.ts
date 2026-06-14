import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add Security Headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Rate Limiting framework (Mock logic for illustration)
  // In production, use Upstash Redis for IP-based rate limiting
  const ip = (request as any).ip || '127.0.0.1';
  if (request.nextUrl.pathname.startsWith('/api/leads')) {
    // Check request count per minute
    // response.headers.set('X-RateLimit-Limit', '10');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
