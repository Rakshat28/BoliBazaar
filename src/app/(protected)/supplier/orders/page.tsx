import React from 'react'
import VendorTable from '../_components/SupplierTable'
import { Card } from '@/components/ui/card';

const page = () => {
  return (
      <div className="container mx-auto p-6 size-sm">
      <VendorTable />
       <div className="grid grid-cols-3 gap-6 mt-3">
        <Card className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-center">
            <h3 className="text-md md:text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <div className="text-xl md:text-3xl font-bold text-primary">1</div>
          </div>
        </Card>
        <Card className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-center">
            <h3 className="text-md md:text-lg font-semibold text-gray-700 mb-2">Pending Delivery</h3>
            <div className="text-xl md:text-3xl font-bold text-blue-600">
              2
            </div>
          </div>
        </Card>
        <Card className="bg-white p-6 rounded-xl shadow-md">
          <div className="text-center">
            <h3 className="text-md md:text-lg font-semibold text-gray-700 mb-2">Unpaid Orders</h3>
            <div className="text-xl md:text-3xl font-bold text-red-600">
              2
            </div>
          </div>
        </Card>
      </div>
     
    </div>
  )
}

export default page
