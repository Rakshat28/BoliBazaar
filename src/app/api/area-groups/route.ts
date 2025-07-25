import { NextResponse } from 'next/server';

// No database or Drizzle imports.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('cityId');

  if (!cityId) {
    return new NextResponse('City ID is required', { status: 400 });
  }

  // This is our mock database of area groups.
  // The keys ('1', '2', etc.) correspond to the city IDs.
  const mockGroups = {
    '1': [ // Delhi
      { id: 1, area_name: 'Lajpat Nagar', location_center: [28.5678, 77.2423] },
      { id: 2, area_name: 'Karol Bagh', location_center: [28.6469, 77.1902] },
      { id: 3, area_name: 'Chandni Chowk', location_center: [28.6562, 77.2410] },
      { id: 4, area_name: 'Sarojini Nagar', location_center: [28.5777, 77.1932] },
    ],
    '2': [ // Lucknow
      { id: 5, area_name: 'Hazratganj', location_center: [26.8525, 80.9417] },
      { id: 6, area_name: 'Gomti Nagar', location_center: [26.85, 80.99] },
    ],
    // Add more mock data for other cities here if you want.
  };
  
  // Find the groups for the requested cityId.
  const groups = mockGroups[cityId as keyof typeof mockGroups] || [];

  return NextResponse.json(groups);
} 