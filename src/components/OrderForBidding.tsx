'use client'
import React from 'react'
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {Label} from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import { Button

 } from './ui/button';
export default function OrderForBidding(){
      const [regionFilter, setRegionFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Mock data for available orders
  const availableOrders = [
    {
      id: 'ORD001',
      itemName: 'Fresh Tomatoes',
      category: 'Vegetables',
      region: 'North',
      quantity: '500 kg',
      currentLowestBid: 2800,
      yourLastBid: 2900,
      deadline: '2025-07-28 14:00',
      priceHistory: [3200, 3000, 2950, 2850, 2800]
    },
    {
      id: 'ORD002',
      itemName: 'Bananas',
      category: 'Fruits',
      region: 'South',
      quantity: '300 kg',
      currentLowestBid: 1200,
      yourLastBid: null,
      deadline: '2025-07-27 16:30',
      priceHistory: [1500, 1400, 1350, 1250, 1200]
    },
    {
      id: 'ORD003',
      itemName: 'Milk Packets',
      category: 'Dairy',
      region: 'Central',
      quantity: '200 units',
      currentLowestBid: 800,
      yourLastBid: 850,
      deadline: '2025-07-29 10:00',
      priceHistory: [1000, 950, 900, 850, 800]
    }
  ];
  const filteredOrders = availableOrders.filter(order => {
    const regionMatch = regionFilter === 'All' || order.region === regionFilter;
    const categoryMatch = categoryFilter === 'All' || order.category === categoryFilter;
    return regionMatch && categoryMatch;
  });


  return (
    
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
          Available Orders for Bidding
        </h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <Label htmlFor="regionFilter">Region</Label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-40 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="categoryFilter">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Baked Goods">Baked Goods</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Order Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {order.itemName}
                </h3>
                <div className="space-y-1 mb-3">
                  <div className="text-gray-600 text-sm">
                    Category: <span className="font-medium">{order.category}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Region: <span className="font-medium">{order.region}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Quantity: <span className="font-medium">{order.quantity}</span>
                  </div>
                </div>
                
                <div className="text-gray-700 font-bold text-lg mb-3">
                  Current Lowest: ₹{order.currentLowestBid.toLocaleString()}
                </div>
                
                {order.yourLastBid && (
                  <div className="text-gray-600 text-sm mb-3">
                    Your Last Bid: ₹{order.yourLastBid.toLocaleString()}
                  </div>
                )}
                
                <div className="text-gray-600 text-xs mb-3">
                  Deadline: {order.deadline}
                </div>
                
                <p>Price graph</p>
                
                <div className="flex gap-2">
                  <Input
                    placeholder={`Min ₹${order.currentLowestBid + 50}`}
                    className="flex-grow text-sm"
                  />
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 text-sm shadow-md">
                    Bid
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
  )
}