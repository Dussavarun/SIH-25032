'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

export default function MapRoute({ coordinates = [], title = 'Route', height = 560 }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return; // init once

    const center = coordinates.length
      ? [coordinates[0].lat, coordinates[0].lng]
      : [23.6102, 85.2799];

    const map = L.map(containerRef.current).setView(center, 7);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    if (coordinates.length >= 2) {
      const control = L.Routing.control({
        waypoints: coordinates.map((c) => L.latLng(c.lat, c.lng)),
        routeWhileDragging: false,
        showAlternatives: true,
        addWaypoints: false,
        lineOptions: { styles: [{ color: 'blue', opacity: 0.85, weight: 5 }] },
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
        createMarker: (i, wp) => L.marker(wp.latLng, { title: coordinates[i]?.name || `Stop ${i + 1}` }),
      }).addTo(map);
      controlRef.current = control;
    }

    return () => {
      try {
        if (controlRef.current && controlRef.current._map) {
          controlRef.current.remove();
        }
      } catch {}
      try { map && map.remove && map.remove(); } catch {}
      mapRef.current = null;
      controlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If coordinates change after init, update route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Create control if missing
    if (!controlRef.current && coordinates.length >= 2) {
      controlRef.current = L.Routing.control({
        waypoints: coordinates.map((c) => L.latLng(c.lat, c.lng)),
        routeWhileDragging: false,
        showAlternatives: true,
        addWaypoints: false,
        lineOptions: { styles: [{ color: 'blue', opacity: 0.85, weight: 5 }] },
        router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
        createMarker: (i, wp) => L.marker(wp.latLng, { title: coordinates[i]?.name || `Stop ${i + 1}` }),
      }).addTo(map);
    }

    if (controlRef.current && coordinates.length >= 2) {
      try {
        controlRef.current.setWaypoints(coordinates.map((c) => L.latLng(c.lat, c.lng)));
        map.fitBounds(L.latLngBounds(coordinates.map((c) => [c.lat, c.lng])).pad(0.15));
      } catch {}
    }
  }, [coordinates]);

  return (
    <div className="w-full relative">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div
        ref={containerRef}
        className={isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}
        style={{ height: isFullscreen ? '100vh' : `${height}px`, width: '100%' }}
      />
      <div className="absolute right-3 -mt-12 flex gap-2">
        <button
          onClick={() => {
            setIsFullscreen((v) => !v);
            setTimeout(() => { try { mapRef.current && mapRef.current.invalidateSize(); } catch {} }, 250);
          }}
          className="rounded-md bg-white/90 border px-3 py-1 text-sm shadow hover:bg-white"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
}


