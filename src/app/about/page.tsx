"use client";

import { Users, TrendingDown, Zap, Shield, Award, Truck, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900">
     

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            A digital platform connecting <span className="text-[#3e6c6c]">vendors and suppliers</span>
          </h1>
          <p className="text-xl text-[#3e6c6c] max-w-3xl mx-auto">
            Collective Power, Individual Benefits — bolibazaar transforms the traditional supply chain through transparent bidding, better pricing, and reliable logistics.
          </p>
        </div>
      </section>

      {/* How It Works */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-12 text-center">How bolibazaar Works</h2>

    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left Side: Image */}
      <div className="flex justify-center">
        <img
          src="/phone.png" // 🔁 Replace with your image path
          alt="How bolibazaar works"
          className="max-w-full h-auto rounded-xl shadow-md"
        />
      </div>

      {/* Right Side: Vertical Steps */}
      <div className="space-y-8">
        {[
          {
            step: "Step 1",
            title: "Form Local Collectives",
            desc: "Vendors in the same area connect and group together to increase purchasing power.",
          },
          {
            step: "Step 2",
            title: "Create Bulk Orders",
            desc: "Pool raw material needs to form larger, more attractive orders.",
          },
          {
            step: "Step 3",
            title: "Suppliers Compete",
            desc: "Verified suppliers bid competitively for the collective orders.",
          },
          {
            step: "Step 4",
            title: "Secure Best Deal",
            desc: "Lowest bidder with acceptable terms wins and delivers.",
          },
        ].map(({ step, title, desc }, i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#3e6c6c] text-white flex items-center justify-center font-semibold">
                {i + 1}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="text-green-600 w-6 h-6" />,
                title: "Verified Suppliers",
                desc: "All suppliers undergo thorough vetting for quality and reliability.",
              },
              {
                icon: <Zap className="text-yellow-500 w-6 h-6" />,
                title: "Transparent Bidding",
                desc: "Open competition ensures fair pricing and best terms for vendors.",
              },
              {
                icon: <Truck className="text-blue-500 w-6 h-6" />,
                title: "Local Focus",
                desc: "Geographic grouping optimizes logistics and delivery efficiency.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="mb-4">{icon}</div>
                <h4 className="font-semibold text-lg mb-2 text-[#3e6c6c]">{title}</h4>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 text-center bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Transforming the Local Food Ecosystem</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-10">
            Our platform creates a win-win situation for all stakeholders—vendors, suppliers, and consumers—by building a stronger, transparent, and efficient supply chain.
          </p>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#3e6c6c]">Empower Your Business</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Lower prices through bulk buying</li>
                <li>Consistent quality assurance</li>
                <li>Improved profit margins</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#3e6c6c]">Streamline Your Sales</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Verified, aggregated bulk orders in nearby regions</li>
                <li>Optimized delivery routes</li>
                <li>Reduced marketing costs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Build Trust & Transparency</h2>
          <p className="text-gray-700 max-w-xl mx-auto">
            Foster a transparent and trustworthy local street food supply chain with verified supplier networks, open pricing, and quality guarantees.
          </p>
        </div>
      </section>
    </div>
  );
}
