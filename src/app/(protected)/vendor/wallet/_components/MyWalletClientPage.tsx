'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Wallet } from "lucide-react";

// Define the type for a single transaction, matching our API response
type Transaction = {
  id: number;
  created_at: string;
  txn_type: 'DEPOSIT_ESCROW' | 'FINAL_PAYMENT' | 'REFUND' | 'PAYOUT_TO_SUPPLIER';
  amount: number;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  relatedOrderItem: {
    pooledOrder: {
      product: {
        name: string;
      };
    };
  } | null;
};

type WalletData = {
  balance: string;
  history: Transaction[];
};

const statusStyles: { [key: string]: string } = {
  "SUCCESSFUL": "bg-green-100 text-green-800",
  "PENDING": "bg-yellow-100 text-yellow-800",
  "FAILED": "bg-red-100 text-red-800",
};

const getAmountColor = (type: Transaction['txn_type']) => {
  return type === 'REFUND' ? 'text-green-600' : 'text-red-600';
};

const formatTransactionType = (type: Transaction['txn_type']) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function MyWalletClientPage({ walletData }: { walletData: WalletData }) {
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
                <div className="text-4xl font-bold text-primary">₹{walletData.balance}</div>
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
                {walletData.history.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{formatTransactionType(t.txn_type)}</TableCell>
                    <TableCell className={cn("font-medium", getAmountColor(t.txn_type))}>
                      {t.txn_type === 'REFUND' ? '+' : '-'}₹{Math.abs(Number(t.amount))}
                    </TableCell>
                    <TableCell>{t.relatedOrderItem?.pooledOrder.product.name || 'N/A'}</TableCell>
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