import React from 'react'
import {Card} from '@/components/ui/card';
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table'

const SupplierPaymentTable = () => {
      const payments = [
    {
      paymentId: 'PAY001234',
      orderId: 'ORD12346',
      amount: 4500,
      date: '2025-07-25',
      method: 'UPI',
      description: 'Payment for Rice Bags'
    },
    {
      paymentId: 'PAY001235',
      orderId: 'ORD12347',
      amount: 1200,
      date: '2025-07-24',
      method: 'Bank Transfer',
      description: 'Payment for Bananas'
    },
    {
      paymentId: 'PAY001236',
      orderId: 'ORD12349',
      amount: 1750,
      date: '2025-07-23',
      method: 'UPI',
      description: 'Payment for Onions'
    },
    {
      paymentId: 'PAY001237',
      orderId: 'ORD12340',
      amount: 3200,
      date: '2025-07-22',
      method: 'Cash',
      description: 'Payment for Potatoes'
    },
    {
      paymentId: 'PAY001238',
      orderId: 'ORD12341',
      amount: 2100,
      date: '2025-07-21',
      method: 'UPI',
      description: 'Payment for Cabbage'
    },
    {
      paymentId: 'PAY001239',
      orderId: 'ORD12342',
      amount: 1800,
      date: '2025-07-20',
      method: 'Bank Transfer',
      description: 'Payment for Carrots'
    },
    {
      paymentId: 'PAY001240',
      orderId: 'ORD12343',
      amount: 2800,
      date: '2025-07-19',
      method: 'UPI',
      description: 'Payment for Spinach'
    },
    {
      paymentId: 'PAY001241',
      orderId: 'ORD12344',
      amount: 1500,
      date: '2025-07-18',
      method: 'Cash',
      description: 'Payment for Cucumbers'
    }
  ];

  return (
    <div>
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Payment ID</TableHead>
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Order ID</TableHead>
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Amount</TableHead>
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Date</TableHead>
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Method</TableHead>
              <TableHead className="text-gray-600 uppercase text-sm font-medium">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.paymentId} className="border-b border-gray-200 hover:bg-gray-50">
                <TableCell className="font-medium">
                  {payment.paymentId.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {payment.orderId ? `${payment.orderId.substring(0, 8)}...` : 'N/A'}
                </TableCell>
                <TableCell className="font-bold text-accent">
                  ₹{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {payment.method}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">
                  {payment.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default SupplierPaymentTable
