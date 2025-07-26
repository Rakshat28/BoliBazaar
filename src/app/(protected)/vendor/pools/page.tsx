'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Users, Plus } from "lucide-react";

// Mock Data - In a real app, this would be fetched from an API
const poolData = [
  { id: 1, item: "Fresh Potatoes", category: "Vegetables", currentQuantity: 180, targetQuantity: 200, vendorsJoined: 12, deadline: "2h 15m", priceRange: "₹15-18/kg", escrowDeposit: "₹150" },
  { id: 2, item: "Organic Tomatoes", category: "Vegetables", currentQuantity: 95, targetQuantity: 150, vendorsJoined: 8, deadline: "4h 30m", priceRange: "₹25-30/kg", escrowDeposit: "₹200" },
  { id: 3, item: "Fresh Milk", category: "Dairy", currentQuantity: 240, targetQuantity: 300, vendorsJoined: 15, deadline: "1h 45m", priceRange: "₹45-50/L", escrowDeposit: "₹300" },
  { id: 4, item: "Bananas", category: "Fruits", currentQuantity: 120, targetQuantity: 200, vendorsJoined: 9, deadline: "6h 20m", priceRange: "₹40-45/kg", escrowDeposit: "₹180" }
];

export default function JoinPoolPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPool, setSelectedPool] = useState<(typeof poolData)[0] | null>(null);
  const [quantity, setQuantity] = useState("");

  const filteredPools = selectedCategory === "All" 
    ? poolData 
    : poolData.filter(pool => pool.category === selectedCategory);

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Join a Pool</h1>
      <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="category">Category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <Card key={pool.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{pool.item}</CardTitle>
                <Badge variant="secondary">{pool.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center"><Users className="h-4 w-4 mr-2" /> {pool.vendorsJoined} vendors have joined</div>
              <div>
                <div className="flex justify-between text-sm mb-1"><p>Group Goal:</p> <p className="font-medium">{pool.currentQuantity}kg / {pool.targetQuantity}kg</p></div>
                <Progress value={(pool.currentQuantity / pool.targetQuantity) * 100} />
              </div>
              <div className="text-sm text-muted-foreground flex items-center"><Clock className="h-4 w-4 mr-2" /> Bidding closes in: {pool.deadline}</div>
              <Dialog onOpenChange={(open) => { if (open) setSelectedPool(pool)}}>
                <DialogTrigger asChild>
                  <Button className="w-full"><Plus className="h-4 w-4 mr-2" /> Join Pool</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Join the {selectedPool?.item} Pool</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Your Quantity (in kg)</Label>
                      <Input id="quantity" placeholder="e.g. 25" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="bg-secondary p-3 rounded-lg text-sm space-y-1">
                      <div className="flex justify-between"><span>Required Deposit:</span> <span className="font-medium">{selectedPool?.escrowDeposit}</span></div>
                    </div>
                    <Button className="w-full">Confirm & Pay Deposit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
} 