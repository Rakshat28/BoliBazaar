import ActiveBiddingTable from '../_components/ActiveBiddingTable'
import OrderForBidding from '../_components/OrderForBidding'
import React from 'react'

const page = () => {
  return (
    <div className="container mx-auto p-6 size-sm border shadow-sm rounded-xl mt-8">
      <div className="container border p-4 rounded-2xl ">
        <ActiveBiddingTable />
      </div>
      <div className="container border p-4 rounded-2xl mt-3">
        <OrderForBidding />
      </div>
    </div>
  )
}

export default page
