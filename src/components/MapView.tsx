
import React, { useRef, useEffect, useState } from 'react';
import { useEvents } from '@/contexts/EventContext';
import { PowerOff, TrafficCone, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapView: React.FC = () => {
  const { events, activeFilter } = useEvents();
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  const filteredEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);
  
  // Function to initialize Google Maps
  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;
    
    const mapOptions = {
      center: { lat: 40.7128, lng: -74.006 }, // New York
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#000000" }, { lightness: 13 }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0e1626" }]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#08304b" }]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1a3646" }]
        }
      ]
    };
    
    googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    setMapLoaded(true);
  };
  
  // Load Google Maps API
  useEffect(() => {
    if (!apiKey) return;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);
  
  // Update markers when events or filter change
  useEffect(() => {
    if (!mapLoaded || !googleMapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Add new markers
    filteredEvents.forEach(event => {
      const markerIcon = getMarkerIcon(event.type);
      
      const marker = new window.google.maps.Marker({
        position: { lat: event.location.lat, lng: event.location.lng },
        map: googleMapRef.current,
        title: getEventTitle(event.type),
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerIcon.color,
          fillOpacity: 0.7,
          strokeWeight: 2,
          strokeColor: markerIcon.borderColor,
          scale: 10
        },
        animation: window.google.maps.Animation.DROP
      });
      
      const infoContent = `
        <div class="p-2">
          <h3 class="font-bold">${getEventTitle(event.type)}</h3>
          <p>${event.description || 'No description provided'}</p>
          <p class="text-sm text-gray-400">${event.location.address}</p>
        </div>
      `;
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent
      });
      
      marker.addListener('click', () => {
        infoWindow.open(googleMapRef.current, marker);
      });
      
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
  
  const getMarkerIcon = (type: string) => {
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

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Google Maps API Key Required</h3>
        <p className="text-sm text-gray-300 text-center">
          Please enter your Google Maps API key to enable map functionality
        </p>
        <input 
          type="text"
          placeholder="Enter Google Maps API Key"
          className="px-4 py-2 w-full max-w-md bg-slate-700 border border-slate-600 rounded text-white"
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div className="text-xs text-gray-400 text-center max-w-md">
          You can get an API key from the 
          <a 
            href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mx-1"
          >
            Google Cloud Console
          </a>
          (Maps JavaScript API and Geocoding API should be enabled)
        </div>
      </div>
    );
  }

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
