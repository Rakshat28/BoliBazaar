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

  console.log('Middleware: Processing request', { 
    path: currentPath, 
    userId, 
    userRole: (sessionClaims?.publicMetadata as PublicMetadata)?.role 
  });

  // 1. Allow all public routes
  if (isPublicRoute(request)) {
    console.log('Middleware: Allowing public route');
    return NextResponse.next();
  }

  // 2. If the user is not authenticated for a non-public route, redirect to sign-in
  if (!userId) {
    console.log('Middleware: No userId, redirecting to sign-in');
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Handle authenticated users
  const userRole = (sessionClaims?.publicMetadata as PublicMetadata)?.role;
  console.log('Middleware: User role from metadata:', userRole);

  // TEMPORARY: Allow access to vendor dashboard even without role set for testing
  if (currentPath === '/vendor/dashboard' && !userRole) {
    console.log('Middleware: TEMPORARY - Allowing access to vendor dashboard without role');
    return NextResponse.next();
  }

  // 3a. If the user has no role, force them to the role selection page
  if (!userRole && !currentPath.startsWith('/onboarding/set-role')) {
    console.log('Middleware: No role set, redirecting to set-role');
    return NextResponse.redirect(new URL('/onboarding/set-role', request.url));
  }

  // 3b. Handle VENDOR users
  if (userRole === 'vendor') {
    console.log('Middleware: Processing vendor user');
    
    // If a vendor tries to access a supplier route, forbid it
    if (isSupplierRoute(request)) {
      console.log('Middleware: Vendor accessing supplier route, redirecting to forbidden');
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    const isOnboardingPage = currentPath.startsWith('/vendor/onboarding');
    console.log('Middleware: Is onboarding page:', isOnboardingPage);
    
    // Find existing vendor profile
    let vendor = await prisma.vendor.findUnique({
      where: { user_id: userId },
    });

    console.log('Middleware: Existing vendor profile:', vendor);

    // If vendor profile doesn't exist, create it with undefined area_group_id
    if (!vendor) {
      console.log('Middleware: Creating new vendor profile');
      try {
        vendor = await prisma.vendor.create({
          data: {
            user_id: userId,
            area_group_id: undefined as any, // Type assertion to bypass TypeScript
          },
        });
        console.log('Middleware: Vendor profile created:', vendor);
      } catch (error) {
        console.error('Middleware: Error creating vendor profile:', error);
      }
    }

    // If their profile is incomplete (no area_group_id), force them to onboarding
    if (!vendor?.area_group_id && !isOnboardingPage) {
      console.log('Middleware: Vendor profile incomplete, redirecting to onboarding');
      const onboardingUrl = new URL('/vendor/onboarding/select-area', request.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // If their profile is complete but they are on the onboarding page, send them to the dashboard
    if (vendor?.area_group_id && isOnboardingPage) {
      console.log('Middleware: Vendor profile complete, redirecting to dashboard');
      const dashboardUrl = new URL('/vendor/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    console.log('Middleware: Vendor request allowed to proceed');
  }

  // 3c. Handle SUPPLIER users
  if (userRole === 'supplier') {
    console.log('Middleware: Processing supplier user');
    
    // If a supplier tries to access a vendor route, forbid it
    if (isVendorRoute(request)) {
      console.log('Middleware: Supplier accessing vendor route, redirecting to forbidden');
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
    // TODO: Add any specific onboarding logic for suppliers here if needed
  }

  // 4. If none of the above conditions caused a redirect, allow the request to proceed
  console.log('Middleware: Request allowed to proceed');
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
