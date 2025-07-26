'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock Data
const activeOrders = [
  { id: 1, item: "Fresh Potatoes", quantity: "25kg", status: "Pooling", finalPrice: "TBD", totalCost: "TBD", deadline: "2h 15m" },
  { id: 2, item: "Organic Tomatoes", quantity: "15kg", status: "Won", finalPrice: "₹28/kg", totalCost: "₹420", deadline: "Awaiting Delivery" },
  { id: 3, item: "Fresh Milk", quantity: "20L", status: "Pooling", finalPrice: "TBD", totalCost: "TBD", deadline: "1h 45m" }
];
const orderHistory = [
  { id: 4, item: "Bananas", quantity: "30kg", status: "Delivered", finalPrice: "₹42/kg", totalCost: "₹1,260", date: "2024-01-15" },
  { id: 5, item: "Onions", quantity: "50kg", status: "Lost", finalPrice: "-", totalCost: "₹0", date: "2024-01-10" },
  { id: 6, item: "Carrots", quantity: "20kg", status: "Delivered", finalPrice: "₹35/kg", totalCost: "₹700", date: "2024-01-08" }
];

const statusStyles: { [key: string]: string } = {
  "Pooling": "bg-blue-100 text-blue-800",
  "Won": "bg-green-100 text-green-800",
  "Delivered": "bg-purple-100 text-purple-800",
  "Lost": "bg-red-100 text-red-800",
};

export default function MyOrdersPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Orders</h1>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>My Qty</TableHead><TableHead>Status</TableHead><TableHead>Final Price</TableHead><TableHead>My Total</TableHead><TableHead>Deadline/Info</TableHead></TableRow></TableHeader>
                <TableBody>
                  {activeOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.item}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell><Badge className={cn("font-medium", statusStyles[order.status])}>{order.status}</Badge></TableCell>
                      <TableCell>{order.finalPrice}</TableCell>
                      <TableCell className="font-medium">{order.totalCost}</TableCell>
                      <TableCell>{order.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>My Qty</TableHead><TableHead>Status</TableHead><TableHead>Final Price</TableHead><TableHead>My Total</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.item}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell><Badge className={cn("font-medium", statusStyles[order.status])}>{order.status}</Badge></TableCell>
                      <TableCell>{order.finalPrice}</TableCell>
                      <TableCell className="font-medium">{order.totalCost}</TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
} 