"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const MapSelectorWithNoSSR = dynamic(() => import('@/components/MapSelector'), { ssr: false });

export default function MapSelectorClient() {
  return <MapSelectorWithNoSSR />;
} 