"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, Clock, Navigation, Route, Car, Calendar, Hotel, Map } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function JharkhandTourMap() {
  const [tourData, setTourData] = useState(null);
  const [selectedDay, setSelectedDay] = useState('day1');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapReady, setMapReady] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const routesRef = useRef([]);
  const L = useRef(null);

  // Load tour data from localStorage
  useEffect(() => {
    const loadTourData = () => {
      try {
        const stored = localStorage.getItem('jharkhand_travel_coordinates');
        if (stored) {
          const data = JSON.parse(stored);
          setTourData(data);
          console.log('Loaded tour data:', data);
        } else {
          console.log('No tour data found in localStorage');
          // Fallback data for demo
          const fallbackData = {
            day1: {
              hotels: [
                { name: "Radisson Blu Hotel Ranchi", coordinates: { lat: 23.3667, lng: 85.3167 } }
              ],
              locations: [
                { name: "Hundru Falls", coordinates: { lat: 23.45, lng: 85.65 }, type: "attraction" },
                { name: "Ranchi city center", coordinates: { lat: 23.3478, lng: 85.296013 }, type: "attraction" },
                { name: "Johar Swad Deshi Restaurant", coordinates: { lat: 23.35, lng: 85.3 }, type: "restaurant" },
              ]
            },
            day2: {
              hotels: [
                { name: "Radisson Blu Hotel Ranchi", coordinates: { lat: 23.3667, lng: 85.3167 } }
              ],
              locations: [
                { name: "Jonha Falls", coordinates: { lat: 23.34167, lng: 85.60833 }, type: "attraction" },
                { name: "Dassam Falls", coordinates: { lat: 23.3667, lng: 85.3167 }, type: "attraction" },
              ]
            },
            metadata: { totalDays: 2 }
          };
          setTourData(fallbackData);
        }
      } catch (error) {
        console.error('Error loading tour data:', error);
      }
    };

    loadTourData();
  }, []);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        const leaflet = await import('leaflet');
        L.current = leaflet.default;

        if (!mapRef.current || !L.current) return;
        // Prevent "Map container is already initialized" by short-circuiting
        if (leafletMap.current) {
          // Map already initialized for this container
          setMapReady(true);
          return;
        }

        // Fix default marker icons
        delete L.current.Icon.Default.prototype._getIconUrl;
        L.current.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create custom icons
        const hotelIcon = L.current.divIcon({
          className: 'custom-hotel-marker',
          html: '<div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"><span style="color: white; font-size: 16px;">🏨</span></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const attractionIcon = L.current.divIcon({
          className: 'custom-attraction-marker',
          html: '<div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"><span style="color: white; font-size: 14px;">🎯</span></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const restaurantIcon = L.current.divIcon({
          className: 'custom-restaurant-marker',
          html: '<div style="background-color: #059669; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"><span style="color: white; font-size: 14px;">🍽️</span></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marketIcon = L.current.divIcon({
          className: 'custom-market-marker',
          html: '<div style="background-color: #7c3aed; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);"><span style="color: white; font-size: 14px;">🛒</span></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        // Center map on Ranchi, Jharkhand
        const map = L.current.map(mapRef.current).setView([23.3441, 85.3096], 10);
        leafletMap.current = map;

        // Light theme tiles (OpenStreetMap)
        L.current.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Store icon references
        map.customIcons = {
          hotel: hotelIcon,
          attraction: attractionIcon,
          restaurant: restaurantIcon,
          market: marketIcon
        };

        setMapReady(true);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers and routes when day selection or tour data changes
  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !tourData || !L.current || !mapReady) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => map.removeLayer(marker));
    routesRef.current.forEach(route => {
      try {
        if (route.remove) {
          route.remove();
        } else if (route.removeFrom) {
          route.removeFrom(map);
        } else if (map.removeLayer) {
          map.removeLayer(route);
        }
      } catch {}
    });
    markersRef.current = [];
    routesRef.current = [];

    const dayData = tourData[selectedDay];
    if (!dayData) return;

    const markers = [];
    const allCoordinates = [];

    // Add hotel markers (red) - these are starting points
    if (dayData.hotels) {
      dayData.hotels.forEach(hotel => {
        if (hotel.coordinates && hotel.coordinates.lat && hotel.coordinates.lng) {
          const marker = L.current.marker([hotel.coordinates.lat, hotel.coordinates.lng], {
            icon: map.customIcons.hotel
          })
            .bindPopup(`
              <div style="min-width: 200px; padding: 12px;">
                <h3 style="margin: 0 0 8px 0; color: #dc2626; font-weight: bold;">🏨 ${hotel.name}</h3>
                <p style="margin: 4px 0; color: #666; font-size: 13px;">📍 Hotel Accommodation</p>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">Coordinates: ${hotel.coordinates.lat}, ${hotel.coordinates.lng}</p>
              </div>
            `)
            .addTo(map);
          markers.push(marker);
          allCoordinates.push([hotel.coordinates.lat, hotel.coordinates.lng]);
        }
      });
    }

    // Add location markers with different colors based on type
    if (dayData.locations) {
      dayData.locations.forEach((location, index) => {
        if (location.coordinates && location.coordinates.lat && location.coordinates.lng) {
          let icon = map.customIcons.attraction; // default
          let typeEmoji = '🎯';
          let typeColor = '#2563eb';

          switch (location.type) {
            case 'restaurant':
              icon = map.customIcons.restaurant;
              typeEmoji = '🍽️';
              typeColor = '#059669';
              break;
            case 'market':
              icon = map.customIcons.market;
              typeEmoji = '🛒';
              typeColor = '#7c3aed';
              break;
            case 'attraction':
            default:
              icon = map.customIcons.attraction;
              typeEmoji = '🎯';
              typeColor = '#2563eb';
              break;
          }

          const marker = L.current.marker([location.coordinates.lat, location.coordinates.lng], {
            icon: icon
          })
            .bindPopup(`
              <div style="min-width: 200px; padding: 12px;">
                <h3 style="margin: 0 0 8px 0; color: ${typeColor}; font-weight: bold;">${typeEmoji} ${location.name}</h3>
                <p style="margin: 4px 0; color: #666; font-size: 13px; text-transform: capitalize;">📍 ${location.type}</p>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">Coordinates: ${location.coordinates.lat}, ${location.coordinates.lng}</p>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">Stop ${index + 1}</p>
              </div>
            `)
            .addTo(map);
          markers.push(marker);
          allCoordinates.push([location.coordinates.lat, location.coordinates.lng]);
        }
      });
    }

    // Draw roads-following route between points using Leaflet Routing Machine
    if (showRoutes && allCoordinates.length > 1) {
      (async () => {
        try {
          // Ensure the plugin attaches to the same L instance
          if (typeof window !== 'undefined') {
            window.L = L.current;
          }
          await import('leaflet-routing-machine');

          const control = L.current.Routing.control({
            waypoints: allCoordinates.map(p => L.current.latLng(p[0], p[1])),
            router: L.current.Routing.osrmv1({
              serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: false,
            show: false,
            lineOptions: {
              styles: [{ color: '#2563eb', weight: 6, opacity: 0.9 }]
            }
          }).addTo(map);

          routesRef.current.push(control);
        } catch (e) {
          console.error('Routing load/draw failed:', e);
        }
      })();
    }

    markersRef.current = markers;

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.current.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [selectedDay, tourData, mapReady, showRoutes]);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const getDayData = (day) => tourData?.[day] || { locations: [], hotels: [] };

  if (!tourData) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour data from localStorage...</p>
          <p className="text-sm text-gray-400 mt-2">Make sure you have tour plan data saved</p>
        </div>
      </div>
    );
  }

  const availableDays = Object.keys(tourData).filter(key => key.startsWith('day'));
  const currentDayData = getDayData(selectedDay);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Dark Sidebar */}
      <div className="w-96 bg-gray-900 text-white shadow-xl border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-6 h-6 text-blue-400" />
            <h1 className="text-lg font-semibold">Jharkhand Tour Map</h1>
          </div>

          {/* Day Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">Select Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md text-sm bg-gray-800 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {availableDays.map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)} ({getDayData(day).locations?.length || 0} locations)
                </option>
              ))}
            </select>
          </div>

          {/* Route Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRoutes}
                onChange={(e) => setShowRoutes(e.target.checked)}
                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Show Routes</span>
            </label>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-900 p-3 rounded-lg text-center border border-blue-700">
              <div className="font-bold text-blue-300 text-lg">{currentDayData.locations?.length || 0}</div>
              <div className="text-xs text-blue-200">Locations</div>
            </div>
            <Link href="/hotels" className="bg-red-900 p-3 rounded-lg text-center border border-red-700 hover:bg-red-800 transition-colors cursor-pointer">
              <div className="font-bold text-red-300 text-lg">{currentDayData.hotels?.length || 0}</div>
              <div className="text-xs text-red-200">Hotels</div>
            </Link>
            <div className="bg-green-900 p-3 rounded-lg text-center border border-green-700">
              <div className="font-bold text-green-300 text-lg">{tourData.metadata?.totalDays || availableDays.length}</div>
              <div className="text-xs text-green-200">Total Days</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Hotels Section */}
          {currentDayData.hotels && currentDayData.hotels.length > 0 && (
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                <Hotel className="w-4 h-4 text-red-400" />
                Hotels ({currentDayData.hotels.length})
              </h3>
              <div className="space-y-2">
                {currentDayData.hotels.map((hotel, index) => (
                  <div key={index} className="p-3 bg-red-900/30 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">🏨</span>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{hotel.name}</div>
                        <div className="text-xs text-gray-300">
                          📍 {hotel.coordinates.lat}, {hotel.coordinates.lng}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locations Section */}
          <div className="p-4">
            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Locations ({currentDayData.locations?.length || 0})
            </h3>
            
            {currentDayData.locations && currentDayData.locations.length > 0 ? (
              <div className="space-y-2">
                {currentDayData.locations.map((location, index) => {
                  const typeColors = {
                    attraction: { bg: 'bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-300', emoji: '🎯' },
                    restaurant: { bg: 'bg-green-900/30', border: 'border-green-500', text: 'text-green-300', emoji: '🍽️' },
                    market: { bg: 'bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-300', emoji: '🛒' }
                  };
                  
                  const typeStyle = typeColors[location.type] || typeColors.attraction;
                  
                  return (
                    <div key={index} className={`p-3 ${typeStyle.bg} border-l-4 ${typeStyle.border} rounded-lg cursor-pointer hover:shadow-lg transition-all`}>
                      <div className="flex items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="mt-0.5">{typeStyle.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">{location.name}</div>
                          <div className={`text-xs ${typeStyle.text} capitalize font-medium mb-1`}>
                            {location.type}
                          </div>
                          <div className="text-xs text-gray-300">
                            📍 {location.coordinates.lat}, {location.coordinates.lng}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                <p>No locations found for {selectedDay}</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-700">
          <h4 className="font-medium text-white mb-3 text-sm">Map Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏨</span>
              </div>
              <span className="text-gray-300">Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎯</span>
              </div>
              <span className="text-gray-300">Attractions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🍽️</span>
              </div>
              <span className="text-gray-300">Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🛒</span>
              </div>
              <span className="text-gray-300">Markets</span>
            </div>
          </div>
          {showRoutes && (
            <div className="mt-2 pt-2 border-t border-gray-600">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-1 bg-blue-600 rounded" style={{background: 'repeating-linear-gradient(90deg, #3b82f6 0px, #3b82f6 10px, transparent 10px, transparent 15px)'}}></div>
                <span className="text-gray-300">Route Path</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* White Map */}
      <div className="flex-1 relative bg-white">
        <div ref={mapRef} className="w-full h-full" style={{ minHeight: "100vh" }} />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button 
            className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-300"
            onClick={() => {
              const map = leafletMap.current;
              if (map && markersRef.current.length > 0 && L.current) {
                const group = L.current.featureGroup(markersRef.current);
                map.fitBounds(group.getBounds().pad(0.1));
              }
            }}
          >
            <Navigation className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Time Display */}
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-300">
          <div className="text-sm font-medium text-blue-600">{formatTime(currentTime)}</div>
        </div>

        {/* Day Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 capitalize flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {selectedDay} - Jharkhand Tour
              </h3>
              <p className="text-sm text-gray-600">
                {currentDayData.locations?.length || 0} locations • {currentDayData.hotels?.length || 0} hotels
                {showRoutes && ' • Route enabled'}
              </p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-xl text-blue-600">
                {tourData.metadata?.totalDays || availableDays.length} Days
              </div>
              <div className="text-sm text-gray-600">Total Tour</div>
            </div>
          </div>
        </div>

        {!mapReady && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}