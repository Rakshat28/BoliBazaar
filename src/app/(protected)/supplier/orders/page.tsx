import React from 'react'
import VendorTable from '../_components/SupplierTable'
import { Card } from '@/components/ui/card';

const page = () => {
  return (
      <div className="flex justify-center w-full overflow-x-hidden">
        <div className=" mx-auto p-6 size-sm overflow-x-hidden">
      <VendorTable />
       <div className="grid grid-cools-1 md:grid-cols-3 gap-6 mt-3 overflow-x-hidden">
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
        <Card className="bg-white p-6 rounded-xl shadow-md ">
          <div className="text-center">
            <h3 className="text-md md:text-lg font-semibold text-gray-700 mb-2">Unpaid Orders</h3>
            <div className="text-xl md:text-3xl font-bold text-red-600">
              2
            </div>
          </div>
        </Card>
      </div>
     
    </div>
      </div>
  )
}

export default page
