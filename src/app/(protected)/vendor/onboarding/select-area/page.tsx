import { OnboardingMapLoader } from './_components/OnboardingMapLoader';

// This line explicitly tells Next.js that this page must be rendered dynamically at request time.
export const dynamic = 'force-dynamic';

// This is a server-side function to fetch the initial city data.
async function getCities() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/onboarding/cities`);
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// The main page is now a clean async Server Component.
export default async function SelectAreaPage() {
  // 1. Fetch the data on the server first.
  const cities = await getCities();

  // 2. Render the client component responsible for loading the map,
  //    passing the initial data as props.
  return <OnboardingMapLoader cities={cities} />;
}