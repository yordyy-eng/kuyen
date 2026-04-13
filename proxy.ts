// proxy.ts — Next.js 16 Proxy (formerly Middleware)
// Handles: QR Redirection (US-202) + Admin Route Protection (US-503)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth-constants';

// ── In-memory cache for QR codes ─────────────────────────────────────────────
interface CacheEntry {
  slug: string;
  expiry: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── US-503: Admin Route Protection ───────────────────────────────────────── (KEEP UNCHANGED)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME);

    if (!session?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Matcher: all admin routes (including /admin/login for consistency)
export const config = {
  matcher: ['/admin/:path*'],
};
