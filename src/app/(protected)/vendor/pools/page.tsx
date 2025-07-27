import { Suspense } from 'react';
import { cookies } from "next/headers";
import { JoinPoolClientPage } from "./_components/JoinPoolClientPage";
import { PoolsLoadingSkeleton } from "./_components/PoolIsLoadingSkeleton";

// This is the data-fetching function that runs on the server.
async function getAvailablePools() {
  // FIXME: The fetch call currently works without passing cookies because the API
  // uses a hardcoded userId. Once Clerk is live, the real user's session cookie
  // MUST be forwarded for the backend to identify them.
   const cookieHeader = cookies().toString();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vendor/pools`, {
     headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error("Failed to fetch available pools:", response.statusText);
    return []; // Return an empty array on error
  }
  
  return response.json();
}

// This is a new async component that contains the data-dependent part of the UI.
async function AvailablePools() {
  const pools = await getAvailablePools();
  return <JoinPoolClientPage initialPools={pools} />;
}

// This is the main page component.
export default function PoolsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Join a Pool</h1>
        {/* The filter can be part of the client component if it needs state */}
      </div>
      <Suspense fallback={<PoolsLoadingSkeleton />}>
        <AvailablePools />
      </Suspense>
    </>
  );
}