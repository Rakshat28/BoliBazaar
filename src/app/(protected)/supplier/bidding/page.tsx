import ActiveBiddingTable from '../_components/ActiveBiddingTable'
import OrderForBidding from '../_components/OrderForBidding'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen py-10 px-4 flex justify-center items-start w-full overflow-x-hidden">
      <div className="w-full max-w-5xl space-y-6">
        <div className="border p-6 rounded-2xl shadow bg-white overflow-x-auto">
          <ActiveBiddingTable />
        </div>
        <div className="border p-6 rounded-2xl shadow bg-white overflow-x-auto">
          <OrderForBidding />
        </div>
      </div>
    </div>
  )
}

export default page
