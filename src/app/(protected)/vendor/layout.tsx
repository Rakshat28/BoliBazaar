'use client';
import React from 'react';
import { VendorSidebar } from './_components/VendorSidebar';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <VendorSidebar />
      <main className="ml-64 p-4 md:p-6">
        {/*TODO: The content of each vendor page will be rendered here */}
        {children}
      </main>
    </div>
  );
} 