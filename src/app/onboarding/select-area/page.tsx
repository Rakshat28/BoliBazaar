"use client"
import dynamic from 'next/dynamic';
import React from 'react';

export default function SelectAreaPage() {
  const MapSelectorWithNoSSR = dynamic(
    () => import('@/components/MapSelector'),
    { ssr: false }
  );

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Boli-Lagao Vendor Onboarding</h1>
      <p>Please select your city and area group to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <MapSelectorWithNoSSR />
      </div>
    </main>
  );
} 