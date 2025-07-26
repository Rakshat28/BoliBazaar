import { cookies } from "next/headers";
import { MyOrdersClientPage } from "./_components/MyOrdersClientPage";

// This server-side function fetches the vendor's order history.
async function getMyOrders() {
  // FIXME: Forward cookies once Clerk is live.
  // const cookieHeader = cookies().toString();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vendor/orders`, {
    // headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error("Failed to fetch vendor orders:", response.statusText);
    return [];
  }
  
  return response.json();
}

// This is the main server component for the page.
export default async function OrdersPage() {
  const orders = await getMyOrders();

  // We pass the server-fetched data down to a client component
  // to handle the interactive tabs for filtering orders.
  return <MyOrdersClientPage initialOrders={orders} />;
}