'use client';

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Define the type for a single order item, matching our API response
type OrderItem = {
  id: number;
  quantity_committed: number;
  status: 'COMMITTED' | 'DEPOSIT_PAID' | 'DELIVERED' | 'CANCELLED';
  pooledOrder: {
    id: number;
    status: 'PREPARING' | 'AUCTION_OPEN' | 'AUCTION_CLOSED' | 'AWARDED' | 'COMPLETED' | 'CANCELLED';
    final_price_per_unit: number | null;
    product: {
      name: string;
      unit: string;
    };
  };
};

// Helper to determine the display status and color for an order item
const getDisplayStatus = (order: OrderItem) => {
  if (order.pooledOrder.status === 'CANCELLED' || order.status === 'CANCELLED') {
    return { text: 'Cancelled', style: 'bg-red-100 text-red-800' };
  }
  if (order.status === 'DELIVERED') {
    return { text: 'Delivered', style: 'bg-purple-100 text-purple-800' };
  }
  if (order.pooledOrder.status === 'AWARDED' || order.pooledOrder.status === 'COMPLETED') {
    return { text: 'Won', style: 'bg-green-100 text-green-800' };
  }
  return { text: 'Pooling', style: 'bg-blue-100 text-blue-800' };
};

export function MyOrdersClientPage({ initialOrders }: { initialOrders: OrderItem[] }) {

  const { activeOrders, orderHistory } = useMemo(() => {
    const active = initialOrders.filter(o => getDisplayStatus(o).text === 'Pooling' || getDisplayStatus(o).text === 'Won');
    const history = initialOrders.filter(o => getDisplayStatus(o).text === 'Delivered' || getDisplayStatus(o).text === 'Cancelled');
    return { activeOrders: active, orderHistory: history };
  }, [initialOrders]);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Orders</h1>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="history">Order History ({orderHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>My Qty</TableHead><TableHead>Status</TableHead><TableHead>Final Price</TableHead><TableHead>My Total Cost</TableHead></TableRow></TableHeader>
                <TableBody>
                  {activeOrders.map((order) => {
                    const status = getDisplayStatus(order);
                    const finalPrice = order.pooledOrder.final_price_per_unit;
                    const totalCost = finalPrice ? (finalPrice * Number(order.quantity_committed)).toFixed(2) : 'TBD';
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.pooledOrder.product.name}</TableCell>
                        <TableCell>{String(order.quantity_committed)}{order.pooledOrder.product.unit}</TableCell>
                        <TableCell><Badge className={cn("font-medium", status.style)}>{status.text}</Badge></TableCell>
                        <TableCell>{finalPrice ? `₹${finalPrice}/${order.pooledOrder.product.unit}` : 'Bidding...'}</TableCell>
                        <TableCell className="font-medium">{finalPrice ? `₹${totalCost}` : 'TBD'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>My Qty</TableHead><TableHead>Status</TableHead><TableHead>Final Price</TableHead><TableHead>My Total Cost</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orderHistory.map((order) => {
                    const status = getDisplayStatus(order);
                    const finalPrice = order.pooledOrder.final_price_per_unit;
                    const totalCost = finalPrice ? (finalPrice * Number(order.quantity_committed)).toFixed(2) : 'N/A';
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.pooledOrder.product.name}</TableCell>
                        <TableCell>{String(order.quantity_committed)}{order.pooledOrder.product.unit}</TableCell>
                        <TableCell><Badge className={cn("font-medium", status.style)}>{status.text}</Badge></TableCell>
                        <TableCell>{finalPrice ? `₹${finalPrice}/${order.pooledOrder.product.unit}` : 'N/A'}</TableCell>
                        <TableCell className="font-medium">{finalPrice ? `₹${totalCost}` : 'N/A'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}