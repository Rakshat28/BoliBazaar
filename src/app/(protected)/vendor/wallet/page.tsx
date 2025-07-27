import { cookies } from "next/headers";
import { MyWalletClientPage } from "./_components/MyWalletClientPage";

// This server-side function fetches the vendor's wallet data.
async function getWalletData() {
  // FIXME: Forward cookies once Clerk is live.
  // const cookieHeader = cookies().toString();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vendor/wallet`, {
    // headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error("Failed to fetch vendor wallet data:", response.statusText);
    return { balance: "0.00", history: [] }; // Return default state on error
  }
  
  return response.json();
}

// This is the main server component for the page.
export default async function WalletPage() {
  const walletData = await getWalletData();

  // We pass the server-fetched data down to a client component.
  return <MyWalletClientPage walletData={walletData} />;
}