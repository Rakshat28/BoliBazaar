import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const isProtectedRoute = createRouteMatcher([
  '/vendor(.*)',
  '/supplier(.*)',
]);

// FIXME: You can change this as you wish later , I am less experienced with middleware so I am not sure if this is the best way to do this
//First, it checks if the user is trying to access a protected route (any URL starting with /vendor or /supplier).
//If they are, it checks if the user is logged in. If they are not logged in, it immediately stops them and redirects them to the /sign-in page.
//For any logged-in user, it securely gets their userId and their custom role (e.g., 'VENDOR') from the Clerk session.

//If the vendor is new (meaning they exist in your database but haven't chosen an area_group_id yet), the middleware will forcefully redirect them to the 
// /vendor/onboarding/select-area page, no matter what other vendor page they try to visit.

//If the vendor is already onboarded (meaning they have an area_group_id), the middleware will allow them to access their dashboard (e.g., /vendor/dashboard)
//without any further redirection.

export default clerkMiddleware(async (auth, req) => {
  // Await the result of auth() and then call protect() on the resolved object
  const authResult = await auth();

  if (isProtectedRoute(req)) {
    if (!authResult.userId) {
      // If not authenticated, redirect to sign-in page
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Destructure userId and sessionClaims from the resolved authResult
  const { userId, sessionClaims } = authResult;

  // After a user logs in, this logic will run
  if (userId) {
    const isOnboardingPage = req.nextUrl.pathname.startsWith('/vendor/onboarding');
    
    // FIX 2: Safely check the type of the metadata object
    const userRole = (sessionClaims?.metadata as { role?: string })?.role;

    if (userRole === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({
        where: { user_id: userId },
      });

      // Redirect to onboarding if the profile is incomplete
      if (vendor && !vendor.area_group_id) {
        if (!isOnboardingPage) {
          const onboardingUrl = new URL('/vendor/onboarding/select-area', req.url);
          return NextResponse.redirect(onboardingUrl);
        }
      } 
      // Redirect away from onboarding if the profile is complete
      else if (vendor && vendor.area_group_id) {
        if (isOnboardingPage) {
          const dashboardUrl = new URL('/vendor/dashboard', req.url);
          return NextResponse.redirect(dashboardUrl);
        }
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
