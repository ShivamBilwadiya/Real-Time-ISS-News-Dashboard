import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom ISS icon
const issIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
      <circle cx="32" cy="32" r="28" fill="#6366f1" opacity="0.2"/>
      <circle cx="32" cy="32" r="18" fill="#6366f1" opacity="0.4"/>
      <circle cx="32" cy="32" r="8" fill="#818cf8"/>
      <circle cx="32" cy="32" r="4" fill="#c7d2fe"/>
      <!-- Solar panels -->
      <rect x="2" y="28" width="18" height="8" rx="2" fill="#818cf8" opacity="0.8"/>
      <rect x="44" y="28" width="18" height="8" rx="2" fill="#818cf8" opacity="0.8"/>
      <rect x="28" y="2" width="8" height="18" rx="2" fill="#818cf8" opacity="0.8"/>
      <rect x="28" y="44" width="8" height="18" rx="2" fill="#818cf8" opacity="0.8"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Component to smoothly fly the map to the ISS position
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position?.latitude && position?.longitude) {
      map.flyTo([position.latitude, position.longitude], map.getZoom(), {
        duration: 1.5,
      });
    }
  }, [position, map]);

  return null;
}

export default function ISSMap({ position, trajectory, isDark }) {
  const lat = position?.latitude || 0;
  const lng = position?.longitude || 0;

  // Dark map tiles
  const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-full min-h-[350px] relative">
      {/* Glow effect behind map */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-cyan-500/10 -z-10 blur-xl" />

      <MapContainer
        center={[lat, lng]}
        zoom={3}
        scrollWheelZoom={true}
        className="rounded-2xl"
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={isDark ? darkTileUrl : lightTileUrl}
        />

        <MapUpdater position={position} />

        {/* ISS Marker */}
        {lat !== 0 && lng !== 0 && (
          <Marker position={[lat, lng]} icon={issIcon}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-sm">🛰️ ISS Position</p>
                <p className="text-xs mt-1">Lat: {lat.toFixed(4)}</p>
                <p className="text-xs">Lng: {lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Trajectory line */}
        {trajectory.length > 1 && (
          <Polyline
            positions={trajectory}
            pathOptions={{
              color: '#818cf8',
              weight: 2.5,
              opacity: 0.7,
              dashArray: '8, 8',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
