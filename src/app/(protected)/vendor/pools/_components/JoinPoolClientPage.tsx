'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Users, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// Define the type for a single pool object, matching our API response
type Pool = {
  id: number;
  total_quantity_committed: number;
  auction_ends_at: string;
  product: {
    name: string;
    grade: string | null;
    unit: string;
  };
  _count: {
    OrderItem: number;
  };
};

export function JoinPoolClientPage({ initialPools }: { initialPools: Pool[] }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [quantity, setQuantity] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Add a 'category' field to the 'Product' model in schema.prisma to enable filtering.
  const filteredPools = initialPools;

  const handleJoinPool = async () => {
    if (!selectedPool || !quantity) return;

    setIsJoining(true);
    setError(null);

    try {
      const response = await fetch('/api/vendor/pools/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: selectedPool.id,
          quantity: parseFloat(quantity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join the pool.");
      }
      
      // Success! Close the dialog and refresh the page to show updated data.
      // A more advanced solution would use state management (e.g., SWR, TanStack Query)
      // to update the UI without a full refresh.
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Join a Pool</h1>
        {/* ... filter component ... */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <Card key={pool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{pool.product.name} ({pool.product.grade})</CardTitle>
                <Badge variant="secondary">Vegetables</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="text-sm text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {pool._count.OrderItem} vendors have joined
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <p>Current Pool:</p> 
                  <p className="font-medium">{String(pool.total_quantity_committed)}{pool.product.unit}</p>
                </div>
                {/* FIXME: The 'PooledOrder' model needs a 'target_quantity' field
                    for this progress bar to be accurate. Using a placeholder for now. */}
                <Progress value={(Number(pool.total_quantity_committed) / 200) * 100} />
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" /> 
                Ends in: {formatDistanceToNow(new Date(pool.auction_ends_at), { addSuffix: true })}
              </div>
              
              <Dialog onOpenChange={(open) => { if (open) setSelectedPool(pool)}}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-auto"><Plus className="h-4 w-4 mr-2" /> Join Pool</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join the {selectedPool?.product.name} Pool</DialogTitle>
                    <DialogDescription>
                      Enter the quantity you wish to purchase as part of this group order.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Your Quantity (in {selectedPool?.product.unit})</Label>
                      <Input id="quantity" type="number" placeholder="e.g. 25" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleJoinPool} disabled={isJoining}>
                      {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isJoining ? "Confirming..." : "Confirm & Join"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}