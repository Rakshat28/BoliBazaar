// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface PublicMetadata {
  role?: 'vendor' | 'supplier' | 'admin' | string;
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks/clerk(.*)', // <--- CORRECTED THIS LINE
  '/forbidden(.*)',
]);

const isVendorRoute = createRouteMatcher(['/vendor(.*)']);
const isSupplierRoute = createRouteMatcher(['/supplier(.*)']);
const isProtectedRoute = createRouteMatcher(['/vendor(.*)', '/supplier(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const currentPath = new URL(request.url).pathname;

  // 1. Allow public routes for everyone
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // 2. Redirect unauthenticated users from protected routes to sign-in
  // This applies to /vendor(...) and /supplier(...) paths if userId is missing.
  if (isProtectedRoute(request) && !userId) { // This `isProtectedRoute` check is important here
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Get user role
  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;

  // // 4. Onboarding Redirect: If user is authenticated but has no role, redirect to set-role page.
  // // This is the core of the onboarding flow.
  // if (userId && !userRole) {
  //   return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  // }

  // 5. Vendor Onboarding Specific Logic (Area Group Selection)
  // This logic runs ONLY for authenticated 'vendor' users.
  if (userId && userRole === 'vendor') {
    const isOnboardingPage = currentPath.startsWith('/vendor/onboarding');

    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId }
    });

    if (vendor && !vendor.area_group_id) {
      if (!isOnboardingPage) {
        console.log(`[Middleware] Vendor ${userId} needs to select area. Redirecting to /vendor/onboarding/select-area.`);
        const onboardingUrl = new URL('/vendor/onboarding/select-area', request.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } else if (vendor && vendor.area_group_id) {
      if (isOnboardingPage) {
        console.log(`[Middleware] Vendor ${userId} already onboarded. Redirecting from onboarding to dashboard.`);
        const dashboardUrl = new URL('/vendor/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  // 6. Role-Based Access Control (RBAC) for protected routes
  if (isVendorRoute(request)) {
    if (userRole !== 'vendor') {
      console.warn(`[Middleware] User ${userId} (Role: ${userRole || 'None'}) attempted unauthorized access to vendor route: ${currentPath}`);
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  if (isSupplierRoute(request)) {
    if (userRole !== 'supplier') {
      console.warn(`[Middleware] User ${userId} (Role: ${userRole || 'None'}) attempted unauthorized access to supplier route: ${currentPath}`);
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/clerk).*)',
    '/(api|trpc)(.*)',
  ],
};