import React from 'react';
import MapSelectorClient from './MapSelectorClient';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Boli-Lagao Vendor Onboarding</h1>
      <p>Please select your city and area group to continue.</p>
      <div style={{ marginTop: '2rem' }}>
        <MapSelectorClient />
      </div>
    </main>
  );
}
