import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Wallet } from "lucide-react";

// Mock Data
const walletBalance = "₹2,450";
const transactions = [
  { id: 1, date: "2024-01-20", type: "Escrow Deposit", amount: "-₹300", relatedOrder: "Fresh Milk Pool", status: "Pending" },
  { id: 2, date: "2024-01-18", type: "Final Payment", amount: "-₹1,120", relatedOrder: "Bananas Pool", status: "Completed" },
  { id: 3, date: "2024-01-15", type: "Refund", amount: "+₹200", relatedOrder: "Onions Pool", status: "Completed" },
];

const statusStyles: { [key: string]: string } = {
  "Completed": "bg-green-100 text-green-800",
  "Pending": "bg-yellow-100 text-yellow-800",
  "Failed": "bg-red-100 text-red-800",
};

const getAmountColor = (amount: string) => amount.startsWith('+') ? 'text-green-600' : 'text-red-600';

export default function MyWalletPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Escrow Balance</CardTitle>
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-primary">{walletBalance}</div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Funds</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Available for pool deposits and payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Related Order</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell className="font-medium">{t.type}</TableCell>
                    <TableCell className={cn("font-medium", getAmountColor(t.amount))}>{t.amount}</TableCell>
                    <TableCell>{t.relatedOrder}</TableCell>
                    <TableCell><Badge className={cn("font-medium", statusStyles[t.status])}>{t.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 