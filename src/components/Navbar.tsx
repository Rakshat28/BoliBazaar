"use client";

import Link from "next/link";

export default function Navbar() {
    return (
    <nav className="w-full px-6 py-4 bg-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
                src="/vendor.png"
                alt="DaamDekho Logo"
                className="h-12 w-12 object-contain" 
            />
            <span className="text-xl font-bold text-gray-900">
                BOLI<span className="text-[#457C78]">BAZAAR</span>
            </span>
          </Link>
        </div>
        
      {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link
              href="/login"
              className="px-4 py-2 text-sm rounded-md font-semibold text-[#457C78] hover:bg-[#457C78] hover:text-white border border-[#457C78] transition-all"
          >
              Sign In
          </Link>
          <Link
              href="/get-started"
              className="px-4 py-2 text-sm rounded-md font-semibold text-white bg-[#1f2937] hover:bg-[#374151] transition"
          >
              Get Started
          </Link>
        </div>
    </nav>
    );
}
