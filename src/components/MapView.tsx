
import React, { useRef, useEffect, useState } from 'react';
import { useEvents } from '@/contexts/EventContext';
import { PowerOff, TrafficCone, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView: React.FC = () => {
  const { events, activeFilter } = useEvents();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  const filteredEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);
  
  // Function to initialize Leaflet map
  const initializeMap = () => {
    if (!mapRef.current || leafletMapRef.current) return;
    
    // Create the map instance
    const map = L.map(mapRef.current).setView([40.7128, -74.006], 12);
    
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Store the map reference
    leafletMapRef.current = map;
    setMapLoaded(true);
  };
  
  // Initialize the map on component mount
  useEffect(() => {
    initializeMap();
    
    // Clean up on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);
  
  // Update markers when events or filter change
  useEffect(() => {
    if (!mapLoaded || !leafletMapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers
    filteredEvents.forEach(event => {
      const markerColor = getMarkerColor(event.type);
      
      // Create a custom icon
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor.color}; border: 2px solid ${markerColor.borderColor}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5]
      });
      
      const marker = L.marker([event.location.lat, event.location.lng], {
        icon,
        title: getEventTitle(event.type)
      }).addTo(leafletMapRef.current!);
      
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${getEventTitle(event.type)}</h3>
          <p>${event.description || 'No description provided'}</p>
          <p class="text-sm text-gray-400">${event.location.address}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  }, [filteredEvents, mapLoaded]);
  
  const getEventTitle = (type: string) => {
    switch (type) {
      case 'power-outage':
        return 'Power Outage';
      case 'traffic-jam':
        return 'Traffic Jam';
      case 'police-activity':
        return 'Police Activity';
      default:
        return 'Event';
    }
  };
  
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'power-outage':
        return { color: '#ef4444', borderColor: '#b91c1c' };
      case 'traffic-jam':
        return { color: '#f59e0b', borderColor: '#d97706' };
      case 'police-activity':
        return { color: '#3b82f6', borderColor: '#2563eb' };
      default:
        return { color: '#6b7280', borderColor: '#4b5563' };
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0 rounded-xl overflow-hidden" />
      
      {/* Map overlay with event count */}
      <div className="absolute bottom-4 right-4 bg-signaldude-bg-dark/80 backdrop-blur rounded-lg p-2 text-sm z-10">
        <div className="flex items-center gap-2">
          <span className="text-signaldude-text-muted">Events:</span>
          <span className="font-semibold">{filteredEvents.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
