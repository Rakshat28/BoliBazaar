'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Define the type for the props this component will receive from the server page
type City = { id: number; name: string; map_center: [number, number]; default_zoom: number; };

// Dynamically import the main client component with SSR disabled
const AreaSelectionClientWithNoSSR = dynamic(
  () => import('./AreaSelectionClient').then(mod => mod.AreaSelectionClient),
  { 
    ssr: false,
    // Provide a loading skeleton to show while the component and map are loading.
    loading: () => (
        <div className="flex h-screen">
            <div className="w-full md:w-1/3 p-8 space-y-6 bg-white">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-4 pt-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="hidden md:block w-2/3">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    )
  }
);

// This component receives the cities from the server and passes them to the actual map component
export function OnboardingMapLoader({ cities }: { cities: City[] }) {
  return <AreaSelectionClientWithNoSSR cities={cities} />;
}