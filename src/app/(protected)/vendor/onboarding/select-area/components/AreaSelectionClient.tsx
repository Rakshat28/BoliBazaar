'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox } from '@/components/ui/combobox'; // Import the new Combobox
import { Loader2 } from 'lucide-react';

// Fix for default Leaflet icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Define the types for our data
type City = { id: number; name: string; map_center: [number, number]; default_zoom: number; };
type AreaGroup = { id: number; area_name: string; location_center: [number, number] | null; };

// Helper component to programmatically change the map's view
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  map.flyTo(center, zoom, { animate: true, duration: 1 });
  return null;
}

export function AreaSelectionClient({ cities }: { cities: City[] }) {
  const router = useRouter();
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>();
  const [areaGroups, setAreaGroups] = useState<AreaGroup[]>([]);
  const [selectedAreaGroupId, setSelectedAreaGroupId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(10);

  const selectedCity = useMemo(() => cities.find(c => c.id === Number(selectedCityId)), [cities, selectedCityId]);
  const selectedAreaGroup = useMemo(() => areaGroups.find(ag => ag.id === Number(selectedAreaGroupId)), [areaGroups, selectedAreaGroupId]);
  
  // Fetch area groups when a city is selected
  useEffect(() => {
    if (selectedCity) {
      setIsLoading(true);
      setSelectedAreaGroupId(undefined);
      setMapCenter(selectedCity.map_center);
      setMapZoom(selectedCity.default_zoom);
      
      fetch(`/api/onboarding/area-groups?cityId=${selectedCity.id}`)
        .then(res => res.json())
        .then(data => {
          setAreaGroups(data);
          setIsLoading(false);
        });
    }
  }, [selectedCity]);

  const handleAreaGroupChange = (areaGroupId: string) => {
    const areaGroup = areaGroups.find(ag => ag.id === parseInt(areaGroupId));
    setSelectedAreaGroupId(areaGroupId);
    if (areaGroup?.location_center) {
      setMapCenter(areaGroup.location_center);
      setMapZoom(14);
    }
  };

  const handleSaveSelection = async () => {
    if (!selectedAreaGroupId) return;
    setIsSaving(true);
    
    // TODO: Create this API endpoint in Part 3
    const response = await fetch('/api/vendor/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaGroupId: parseInt(selectedAreaGroupId) }),
    });

    if (response.ok) {
      router.push('/vendor/dashboard');
    } else {
      console.error("Failed to save area group");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/3 p-8 flex flex-col bg-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Boli-Lagao</h1>
        <p className="text-muted-foreground mb-8">Let&apos;s set up your primary area of operation.</p>
        
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label>1. Select Your City</Label>
            <Combobox
              options={cities.map(city => ({ value: String(city.id), label: city.name }))}
              value={selectedCityId}
              onChange={setSelectedCityId}
              placeholder="Select a city..."
              searchPlaceholder="Search for a city..."
              emptyPlaceholder="No city found."
            />
          </div>

          <div className="grid gap-2">
            <Label>2. Select Your Area Group</Label>
            <Combobox
              options={areaGroups.map(group => ({ value: String(group.id), label: group.area_name }))}
              value={selectedAreaGroupId}
              onChange={handleAreaGroupChange}
              placeholder={isLoading ? "Loading..." : "Select an area..."}
              searchPlaceholder="Search for an area..."
              emptyPlaceholder="No area found."
              disabled={!selectedCity || isLoading}
            />
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSaveSelection}
            disabled={!selectedAreaGroupId || isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Confirm and Continue"}
          </Button>
        </div>
      </div>
      
      <div className="hidden md:block w-2/3 h-full">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedAreaGroup?.location_center && <Marker position={selectedAreaGroup.location_center} />}
        </MapContainer>
      </div>
    </div>
  );
}