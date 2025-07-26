import React from 'react'
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
const ActiveBiddingTable = () => {
    const activeBids = [
    {
      id: 'BID001',
      item: 'Fresh Tomatoes',
      quantity: '500 kg',
      yourBid: 2900,
      currentLowestBid: 2800,
      deadline: '2025-07-28 14:00',
      status: 'outbid'
    },
    {
      id: 'BID002',
      item: 'Rice Bags',
      quantity: '100 bags',
      yourBid: 4500,
      currentLowestBid: 4500,
      deadline: '2025-07-30 12:00',
      status: 'winning'
    },
    {
      id: 'BID003',
      item: 'Onions',
      quantity: '300 kg',
      yourBid: 1800,
      currentLowestBid: 1750,
      deadline: '2025-07-31 15:00',
      status: 'active'
    }
  ];
    const getStatusBadge = (status: string) => {
    switch (status) {
      case 'winning':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Winning</Badge>;
      case 'outbid':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Outbid</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>;
    }
  };
  return (
    <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
          Active Bids
        </h2>
        <Card className="bg-white rounded-xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Item</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Quantity</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Your Bid</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Current Lowest</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Deadline</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Status</TableHead>
                <TableHead className="text-gray-600 uppercase text-sm font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeBids.map((bid) => (
                <TableRow key={bid.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium">{bid.item}</TableCell>
                  <TableCell>{bid.quantity}</TableCell>
                  <TableCell>₹{bid.yourBid.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{bid.currentLowestBid.toLocaleString()}</TableCell>
                  <TableCell>{bid.deadline}</TableCell>
                  <TableCell>{getStatusBadge(bid.status)}</TableCell>
                  <TableCell>
                    {bid.status === 'active' && (
                      <Button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600">
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
  )
}

export default ActiveBiddingTable
