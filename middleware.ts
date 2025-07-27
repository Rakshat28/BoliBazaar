import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
const isProtectedRoute = createRouteMatcher(['/vendor(.*)', '/supplier(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const authResult = await auth();
  const { userId, sessionClaims } = authResult;
  const currentPath = new URL(request.url).pathname;

  // Public routes are allowed without auth
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users on protected routes
  if (isProtectedRoute(request) && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Role check
  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;

  if (!userRole && currentPath !== '/onboarding/set-role') {
    console.log(`User ${userId} has no role. Redirecting to /onboarding/set-role from ${currentPath}`);
    return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  }

  // Vendor onboarding logic
  if (userId && userRole === 'vendor') {
    const isOnboardingPage = currentPath.startsWith('/vendor/onboarding');

    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId }
    });

    if (vendor && !vendor.area_group_id) {
      if (!isOnboardingPage) {
        const onboardingUrl = new URL('/vendor/onboarding/select-area', request.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } else if (vendor && vendor.area_group_id) {
      if (isOnboardingPage) {
        const dashboardUrl = new URL('/vendor/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  // Vendor route access control
  if (isVendorRoute(request)) {
    if (userRole !== 'vendor') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  // Supplier route access control
  if (isSupplierRoute(request)) {
    if (userRole !== 'supplier') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip static assets and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/clerk).*)',
    // Include API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
