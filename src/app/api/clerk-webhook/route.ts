import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface PublicMetadata {
  role?: 'vendor' | 'supplier' | 'admin' | string; 
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook(.*)',
  '/forbidden(.*)',
  '/onboarding/set-role'
]);

const isVendorRoute = createRouteMatcher(['/vendor(.*)']);

const isSupplierRoute = createRouteMatcher(['/supplier(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const currentPath = new URL(request.url).pathname;

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;
  if (!userRole && currentPath !== '/onboarding/set-role') {
    console.log(`User ${userId} has no role. Redirecting to /onboarding/set-role from ${currentPath}`);
    return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  }

  if (isVendorRoute(request)) {
    if (userRole === 'vendor') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  if (isSupplierRoute(request)) {
    if (userRole === 'supplier') {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/clerk).*)',
    '/(api|trpc)(.*)',
  ]}