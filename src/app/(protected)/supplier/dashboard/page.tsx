import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assuming these are correctly imported shadcn/ui components

const Page = () => {
  const dashboardCards = [
    {
      title: 'Active Bids',
      value: '7',
      description: 'Currently bidding on'
    },
    {
      title: 'Orders Grabbed',
      value: '12',
      description: 'Successfully secured'
    },
    {
      title: 'Total Earnings',
      value: '₹45,280',
      description: 'This month'
    }
  ];

  return (
    <div className="bg-white p-2 pb-6 rounded-xl border shadow-sm mt-8 m-2">
      <div className="container mx-auto py-6 px-6 lg:px-4 xl:px-2 flex flex-col justify-center w-full overflow-x-hidden">
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Card key={index} className="bg-white p-6 rounded-xl shadow-md">
              <CardContent className="p-0 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {card.title}
                </h3>
                <div className="text-4xl font-bold text-primary mb-1">
                  {card.value}
                </div>
                <p className="text-sm text-gray-600">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
