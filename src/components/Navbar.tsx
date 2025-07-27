"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import RoleSelectionModal from "./RoleSelectionModal";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
export default function Navbar() {
  const router = useRouter();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const handleRoleSelected = (role: 'vendor' | 'supplier') => {
    localStorage.setItem('selectedRoleForSignup', role);
    alert(`User selected: ${role.toUpperCase()}!`);
    setIsRoleModalOpen(false); 
    router.push('/sign-up');
  };

    return (
    <nav className="w-full px-6 py-4 bg-white shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
                src="/vendor.png"
                alt="DaamDekho Logo"
                className="h-12 w-12 object-contain" 
            />
            <div className="hidden md:flex">
              <span className="text-xl font-bold text-gray-900">
                BOLI<span className="text-[#457C78]">BAZAAR</span>
            </span>
            </div>
          </Link>
        </div>
        
      {/* CTA Buttons */}
        <SignedOut>
          <div className="flex gap-3">
          <Button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-4 py-2 text-sm rounded-md font-semibold text-white bg-[#3e6c6c] hover:bg-[#457C78] border border-[#457C78] transition-all"
          >
              Sign In
          </Button>
          <Button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-4 py-2 text-sm rounded-md font-semibold text-white bg-[#1f2937] hover:bg-[#374151] transition"
          >
              Get Started
          </Button>
        </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <RoleSelectionModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)} // Function to close the modal
          onSelectRole={handleRoleSelected}        // Function to handle role selection
      />
    </nav>
    );
}
