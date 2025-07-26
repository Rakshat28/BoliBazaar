'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';

// This component only receives the data it needs to function.
// All data fetching is done in the parent Server Component.
interface JoinPoolFormProps {
  poolId: string;
  poolName: string;
}

export function JoinPoolForm({ poolId, poolName }: JoinPoolFormProps) {
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError("Please enter a valid quantity.");
      setIsLoading(false);
      return;
    }

    // TODO: Implement the API call to join the pool
    console.log(`Submitting ${numQuantity}kg for pool ID ${poolId}`);
    // Example:
    // await joinPool({ poolId, quantity: numQuantity });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    // On success, you might want to redirect or show a success message
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Join the {poolName} Pool</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Your Quantity (in kg)</Label>
            <Input 
              id="quantity" 
              type="number"
              placeholder="e.g. 25" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="bg-secondary p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
                <span>Required Deposit (Est.):</span> 
                <span className="font-medium">₹150</span>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Joining...' : 'Confirm & Join Pool'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 