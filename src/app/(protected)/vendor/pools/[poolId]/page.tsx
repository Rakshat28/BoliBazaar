import React from 'react';
import { JoinPoolForm } from './JoinPoolForm'; // Import the new client component

// This is the correct type for an async page with dynamic params.
export default async function PoolDetailPage({ params: paramsPromise }: { params: Promise<{ poolId: string }> }) {
  // Await the params promise to get the values
  const params = await paramsPromise;
  const { poolId } = params;

  // --- Server-Side Data Fetching ---
  // In a real app, you would fetch data from your database here.
  // This function simulates that.
  const getPoolDetails = async (id: string) => {
    console.log(`Fetching details for pool ${id}...`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      name: "Grade A Potatoes",
      // You can add more details here to pass to the page
    };
  };

  const poolDetails = await getPoolDetails(poolId);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-2">Pool Details for Order #{poolId}</h1>
      <p className="text-muted-foreground mb-4">
        Product: {poolDetails.name}
      </p>
      {/* Render the interactive client component and pass the server-fetched data down as props. */}
      <JoinPoolForm poolId={poolId} poolName={poolDetails.name} />
    </div>
  );
}