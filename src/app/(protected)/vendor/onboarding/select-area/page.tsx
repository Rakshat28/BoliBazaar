import { AreaSelectionClient } from "./components/AreaSelectionClient";

// This server-side function fetches the initial list of cities.
async function getCities() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/onboarding/cities`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return []; // Return empty array on error
  }
}

// This is the main server component for the page.
export default async function SelectAreaPage() {
  const cities = await getCities();

  // We pass the server-fetched data down to a client component
  // which will handle all state and user interaction.
  return <AreaSelectionClient cities={cities} />;
}