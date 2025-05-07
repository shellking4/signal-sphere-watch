
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useEvents } from '@/contexts/EventContext';
import 'leaflet/dist/leaflet.css';

const getEventMarkerIcon = (type: string) => {
  // Define different marker colors based on event type
  let iconColor = '';
  
  switch (type) {
    case 'power-outage':
      iconColor = 'red';
      break;
    case 'traffic-jam':
      iconColor = 'orange';
      break;
    case 'police-activity':
      iconColor = 'blue';
      break;
    case 'long-queue':
      iconColor = 'gold';
      break;
    default:
      iconColor = 'gray';
  }
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const { events, activeFilter } = useEvents();
  
  // Filter active events
  const activeEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);

  useEffect(() => {
    // Only create the map if it doesn't exist yet
    if (!leafletMap.current && mapRef.current) {
      leafletMap.current = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
    }

    // Clean up function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when events or filter changes
  useEffect(() => {
    if (!leafletMap.current) return;

    // Clear existing markers
    leafletMap.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        leafletMap.current?.removeLayer(layer);
      }
    });

    // Add markers for active events
    activeEvents.forEach(event => {
      const marker = L.marker([event.location.lat, event.location.lng], {
        icon: getEventMarkerIcon(event.type)
      }).addTo(leafletMap.current!);
      
      marker.bindPopup(`
        <b>${event.type.replace('-', ' ').toUpperCase()}</b><br>
        ${event.description || 'No description'}<br>
        <small>${event.location.address || 'No address'}</small>
      `);
    });

    // Adjust map view to fit all markers if there are any
    if (activeEvents.length > 0) {
      const bounds = L.latLngBounds(activeEvents.map(e => [e.location.lat, e.location.lng]));
      leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, activeFilter, activeEvents]);

  return <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />;
};

export default MapView;
