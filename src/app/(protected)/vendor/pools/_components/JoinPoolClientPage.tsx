'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Users, Plus, Loader2, PackageSearch } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// Type definitions remain the same
type Pool = {
  id: number;
  total_quantity_committed: number;
  target_quantity: number;
  auction_ends_at: string;
  product: {
    name: string;
    category: string;
    grade: string | null;
    unit: string;
  };
  _count: {
    OrderItem: number;
  };
};

export function JoinPoolClientPage({ initialPools }: { initialPools: Pool[] }) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [quantity, setQuantity] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const allCategories = initialPools.map(p => p.product.category);
    return ["All", ...Array.from(new Set(allCategories))];
  }, [initialPools]);

  const filteredPools = useMemo(() => {
    if (selectedCategory === "All") return initialPools;
    return initialPools.filter(pool => pool.product.category === selectedCategory);
  }, [initialPools, selectedCategory]);

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
      setIsDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsJoining(false);
    }
  };
  
  // --- EMPTY STATE ---
  if (!initialPools || initialPools.length === 0) {
    return (
      <Card className="mt-6 flex flex-col items-center justify-center text-center p-12">
        <PackageSearch className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Active Pools Found</h2>
        <p className="text-muted-foreground">
          There are currently no active order pools in your area. Please check back later.
        </p>
      </Card>
    );
  }

  // --- DEFAULT STATE (with pools) ---
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <Card key={pool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{pool.product.name} ({pool.product.grade})</CardTitle>
                <Badge variant="secondary">{pool.product.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="text-sm text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {pool._count.OrderItem} vendors have joined
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <p>Group Goal:</p> 
                  <p className="font-medium">{String(pool.total_quantity_committed)} / {String(pool.target_quantity)}{pool.product.unit}</p>
                </div>
                <Progress value={(Number(pool.total_quantity_committed) / Number(pool.target_quantity)) * 100} />
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" /> 
                Ends in: {formatDistanceToNow(new Date(pool.auction_ends_at), { addSuffix: true })}
              </div>
              <Dialog open={isDialogOpen && selectedPool?.id === pool.id} onOpenChange={(open) => {
                  if (open) {
                    setSelectedPool(pool);
                    setQuantity("");
                    setError(null);
                  }
                  setIsDialogOpen(open);
                }}>
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