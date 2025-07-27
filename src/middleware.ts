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
  '/onboarding/set-role(.*)'
]);

const isVendorRoute = createRouteMatcher(['/vendor(.*)']);
const isSupplierRoute = createRouteMatcher(['/supplier(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const currentPath = request.nextUrl.pathname;

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;

  if (!userRole && !currentPath.startsWith('/onboarding/set-role')) {
    return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  }
  
  if (userRole && currentPath.startsWith('/onboarding/set-role')) {
      const redirectUrl = userRole === 'vendor' ? '/vendor/dashboard' : '/supplier/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (userRole === 'vendor') {
    if (isSupplierRoute(request)) {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
    
    // FIXME: The following database check is temporarily disabled to allow frontend development.
    // This MUST be re-enabled after the Clerk webhook for user creation is fully implemented and tested.
    /*
    const isOnboardingPage = currentPath.startsWith('/vendor/onboarding');
    const vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    if (vendor && !vendor.area_group_id && !isOnboardingPage) {
      const onboardingUrl = new URL('/vendor/onboarding/select-area', request.url);
      return NextResponse.redirect(onboardingUrl);
    }
    if (vendor && vendor.area_group_id && isOnboardingPage) {
      const dashboardUrl = new URL('/vendor/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    */
  }

  if (userRole === 'supplier') {
    if (isVendorRoute(request)) {
        return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};