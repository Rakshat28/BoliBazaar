import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define a type for our custom public metadata
interface PublicMetadata {
  role?: 'vendor' | 'supplier' | 'admin' | string;
}

// Routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook(.*)', // Made more robust
  '/forbidden',
  '/onboarding/set-role(.*)' // Made more robust
]);

// Routes specific to each role
const isVendorRoute = createRouteMatcher(['/vendor(.*)']);
const isSupplierRoute = createRouteMatcher(['/supplier(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const currentPath = request.nextUrl.pathname;

  // 1. Allow all public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // 2. If the user is not authenticated for a non-public route, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Handle authenticated users
  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;

  // 3a. If the user has no role, force them to the role selection page
  if (!userRole && !currentPath.startsWith('/onboarding/set-role')) {
    return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  }

  // 3b. Handle VENDOR users
  if (userRole === 'vendor') {
    // If a vendor tries to access a supplier route, forbid it
    if (isSupplierRoute(request)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    const isOnboardingPage = currentPath.startsWith('/vendor/onboarding');
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    // If their profile is incomplete, force them to the onboarding page
    if (vendor && !vendor.area_group_id && !isOnboardingPage) {
      const onboardingUrl = new URL('/vendor/onboarding/select-area', request.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If their profile is complete but they are on the onboarding page, send them to the dashboard
    if (vendor && vendor.area_group_id && isOnboardingPage) {
      const dashboardUrl = new URL('/vendor/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3c. Handle SUPPLIER users
  if (userRole === 'supplier') {
    // If a supplier tries to access a vendor route, forbid it
    if (isVendorRoute(request)) {
        return NextResponse.redirect(new URL('/forbidden', request.url));
    }
    // TODO: Add any specific onboarding logic for suppliers here if needed
  }

  // 4. If none of the above conditions caused a redirect, allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect all pages except internal static assets and the Clerk webhook
    '/((?!_next/static|_next/image|favicon.ico|api/webhook/clerk).*)',
    // Protect all API and tRPC routes
    '/api/:path*',
    '/trpc/:path*',
  ],
};
