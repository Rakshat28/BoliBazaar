'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Fix for default Leaflet icon issue
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
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [areaGroups, setAreaGroups] = useState<AreaGroup[]>([]);
  const [selectedAreaGroup, setSelectedAreaGroup] = useState<AreaGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([28.6139, 77.2090]); // Default to Delhi
  const [mapZoom, setMapZoom] = useState(10);
  
  // Fetch area groups when a city is selected
  useEffect(() => {
    if (selectedCity) {
      setIsLoading(true);
      setSelectedAreaGroup(null);
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

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === parseInt(cityId));
    setSelectedCity(city || null);
  };

  const handleAreaGroupChange = (areaGroupId: string) => {
    const areaGroup = areaGroups.find(ag => ag.id === parseInt(areaGroupId));
    setSelectedAreaGroup(areaGroup || null);
    if (areaGroup?.location_center) {
      setMapCenter(areaGroup.location_center);
      setMapZoom(14); // Zoom in closer to the selected area
    }
  };

  const handleSaveSelection = async () => {
    if (!selectedAreaGroup) return;
    setIsSaving(true);
    
    // TODO: Create this API endpoint in Part 3
    const response = await fetch('/api/vendor/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaGroupId: selectedAreaGroup.id }),
    });

    if (response.ok) {
      // On success, redirect the user to their main dashboard
      router.push('/vendor/dashboard');
    } else {
      // TODO: Show an error message to the user
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
            <label className="text-sm font-medium">1. Select Your City</label>
            <Select onValueChange={handleCityChange}>
              <SelectTrigger><SelectValue placeholder="Choose a city..." /></SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">2. Select Your Area Group</label>
            <Select onValueChange={handleAreaGroupChange} disabled={!selectedCity || isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading areas..." : "Choose your main market area..."} />
              </SelectTrigger>
              <SelectContent>
                {areaGroups.map(group => (
                  <SelectItem key={group.id} value={String(group.id)}>{group.area_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSaveSelection}
            disabled={!selectedAreaGroup || isSaving}
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