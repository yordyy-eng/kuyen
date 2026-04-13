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

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── US-503: Admin Route Protection ─────────────────────────────────────────
  // Intercept all /admin/* routes EXCEPT /admin/login (to avoid redirect loop)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME);

    if (!session?.value) {
      // Preserve the attempted URL for post-login redirect (future enhancement)
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session cookie present → allow through
    return NextResponse.next();
  }

  // ── US-202: QR Code Redirection ─────────────────────────────────────────────
  if (pathname.startsWith('/q/')) {
    const code = pathname.split('/')[2];

    if (!code) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // 1. Check in-memory cache
    const cached = cache.get(code);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.redirect(new URL(`/memorial/${cached.slug}`, request.url));
    }

    // 2. Query PocketBase
    try {
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/qr_codes/records?filter=(code='${code}')`,
        {
          headers: { 'Content-Type': 'application/json' },
          next: { revalidate: 300 },
        }
      );

      if (!response.ok) {
        throw new Error(`QR lookup failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const redirectSlug = data.items[0].redirect_slug;

        // 3. Store in cache
        cache.set(code, {
          slug: redirectSlug,
          expiry: Date.now() + CACHE_TTL,
        });

        return NextResponse.redirect(new URL(`/memorial/${redirectSlug}`, request.url));
      } else {
        return NextResponse.redirect(new URL('/not-found', request.url));
      }
    } catch (error) {
      console.error('[Proxy] QR lookup error:', error);
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  return NextResponse.next();
}

// Matcher: QR codes + all admin routes (including /admin/login for consistency)
export const config = {
  matcher: ['/q/:code*', '/admin/:path*'],
};
