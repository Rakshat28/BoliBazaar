import { NextResponse } from 'next/server';

// No database imports are needed.

export async function GET() {
  // We are now using a hardcoded array instead of fetching from a database.
  const allCities = [
    { id: 1, name: 'Delhi', map_center: [28.6139, 77.2090], default_zoom: 11 },
    { id: 2, name: 'Lucknow', map_center: [26.8467, 80.9462], default_zoom: 12 },
    { id: 3, name: 'Jaipur', map_center: [26.9124, 75.7873], default_zoom: 12 },
    { id: 4, name: 'Bangalore', map_center: [12.9716, 77.5946], default_zoom: 11 },
    { id: 5, name: 'Kolkata', map_center: [22.5726, 88.3639], default_zoom: 11 },
  ];

  return NextResponse.json(allCities);
} 