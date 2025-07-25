'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


type LeafletIconPrototype = L.Icon.Default & {
  _getIconUrl?: unknown;
};

delete (L.Icon.Default.prototype as LeafletIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Define types for our data
interface City {
  id: number;
  name: string;
  map_center: [number, number];
  default_zoom: number;
}

interface AreaGroup {
  id: number;
  area_name: string;
  location_center: [number, number];
}

// Type declaration for the ChangeView component's props
type ChangeViewProps = {
  center: LatLngExpression;
  zoom: number;
};

// A helper component to programmatically control the map view
function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
}

export default function MapSelector() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [areaGroups, setAreaGroups] = useState<AreaGroup[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaGroup | null>(null);

  // Fetch all cities on component mount
  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  // Fetch area groups when a city is selected
  useEffect(() => {
    if (selectedCity) {
      fetch(`/api/area-groups?cityId=${selectedCity.id}`)
        .then((res) => res.json())
        .then((data) => {
          setAreaGroups(data);
          setSelectedArea(null); // Reset area selection
        });
    } else {
      setAreaGroups([]);
    }
  }, [selectedCity]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = cities.find((c) => c.id === Number(e.target.value));
    setSelectedCity(city || null);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = areaGroups.find((a) => a.id === Number(e.target.value));
    setSelectedArea(area || null);
  };

  const mapCenter: LatLngExpression = selectedArea?.location_center || selectedCity?.map_center || [28.6139, 77.2090];
  const mapZoom = selectedArea ? 14 : (selectedCity?.default_zoom || 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select onChange={handleCityChange} value={selectedCity?.id || ''}>
          <option value="" disabled>Select a City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>

        <select onChange={handleAreaChange} value={selectedArea?.id || ''} disabled={!selectedCity}>
          <option value="" disabled>Select an Area</option>
          {areaGroups.map((group) => (
            <option key={group.id} value={group.id}>{group.area_name}</option>
          ))}
        </select>
      </div>

      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '600px', width: '100%' }}>
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedArea && <Marker position={selectedArea.location_center} />}
      </MapContainer>
    </div>
  );
} 