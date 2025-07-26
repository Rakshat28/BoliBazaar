import PaymentRecievedTable from '@/components/PaymentRecievedTable'
import { Card } from '@/components/ui/card';
import React from 'react'

export default function page(){

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

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const thisWeekAmount = payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return paymentDate >= weekAgo;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="container mx-auto border shadow-sm mt-8 rounded-xl p-6 size-sm">

      <div className="border p-4 rounded-2xl mb-6">
            <h1 className="text-4xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-8">
                Payments Received
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
                <Card className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Received</h3>
                    <div className="text-3xl font-bold text-[#3e6c6c]">
                    ₹{totalAmount.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                </div>
                </Card>
                <Card className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">This Week</h3>
                    <div className="text-3xl font-bold text-primary">
                    ₹{thisWeekAmount.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Last 7 days</p>
                </div>
                </Card>
                <Card className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Payment</h3>
                    <div className="text-3xl font-bold text-blue-600">
                    ₹{Math.round(totalAmount / payments.length).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Per transaction</p>
                </div>
                </Card>
            </div>
        </div>
  
        <PaymentRecievedTable />
        <div className="mt-8 border p-4 rounded-2xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['UPI', 'Bank Transfer', 'Cash'].map(method => {
            const methodPayments = payments.filter(p => p.method === method);
            const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
            return (
              <Card key={method} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-center">
                  <h4 className="font-medium text-gray-700">{method}</h4>
                  <div className="text-2xl font-bold text-primary mt-1">
                    ₹{methodTotal.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    {methodPayments.length} transactions
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  )
}

