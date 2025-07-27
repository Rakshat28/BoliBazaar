'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Plus, Wallet, Loader2 } from "lucide-react";

// TODO: Move these types to a shared types file (e.g., types/globals.ts)
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

// This is a new hidden form component that will handle the redirect to PayU
const PayURedirectForm = ({ formData }: { formData: any }) => {
    useEffect(() => {
        // Automatically submit the form as soon as it's rendered
        const form = document.getElementById('payu-form');
        if (form) (form as HTMLFormElement).submit();
    }, [formData]);

    return (
        <form action="https://test.payu.in/_payment" method="post" id="payu-form" className="hidden">
            <input type="hidden" name="key" value={formData.merchantKey} />
            <input type="hidden" name="txnid" value={formData.txnid} />
            <input type="hidden" name="amount" value={formData.amount} />
            <input type="hidden" name="productinfo" value={formData.productinfo} />
            <input type="hidden" name="firstname" value={formData.firstname} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value={formData.phone} />
            <input type="hidden" name="surl" value={formData.surl} />
            <input type="hidden" name="furl" value={formData.furl} />
            <input type="hidden" name="hash" value={formData.hash} />
            <input type="hidden" name="udf1" value={formData.udf1} />
        </form>
    );
};

export function MyWalletClientPage({ walletData }: { walletData: WalletData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payUFormData, setPayUFormData] = useState(null);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      alert('Payment successful! Your balance will be updated shortly.');
      router.replace('/vendor/wallet'); // Clean the URL
    } else if (searchParams.get('payment') === 'failure') {
      alert('Payment failed. Please try again.');
      router.replace('/vendor/wallet'); // Clean the URL
    }
  }, [searchParams, router]);

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amountToAdd) }),
      });

      if (!response.ok) throw new Error("Failed to prepare your transaction.");
      
      const data = await response.json();
      setPayUFormData(data); // This triggers rendering of the redirect form

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setIsProcessing(false);
    }
  };

  const statusStyles: { [key: string]: string } = { "SUCCESSFUL": "bg-green-100 text-green-800", "PENDING": "bg-yellow-100 text-yellow-800", "FAILED": "bg-red-100 text-red-800", };
  const getAmountColor = (type: Transaction['txn_type']) => { return type === 'REFUND' ? 'text-green-600' : 'text-red-600'; };
  const formatTransactionType = (type: Transaction['txn_type']) => { return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()); }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Wallet</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Balance</CardTitle>
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-primary">₹{walletData.balance}</div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="h-4 w-4 mr-2" />Add Funds</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Funds to Wallet</DialogTitle>
                      <DialogDescription>
                        Enter the amount you wish to add. You will be redirected to our secure payment partner, PayU.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <Label htmlFor="amount">Amount (in ₹)</Label>
                      <Input 
                        id="amount" type="number" placeholder="e.g. 500"
                        value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)}
                      />
                      {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button onClick={handleInitiatePayment} disabled={isProcessing}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isProcessing ? "Redirecting..." : "Proceed to PayU"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
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
      
      {payUFormData && <PayURedirectForm formData={payUFormData} />}
    </>
  );
}
