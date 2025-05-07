
import React from 'react';
import { useEvents } from '@/contexts/EventContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Monkey patch to fix the default icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom marker for events
const createCustomMarker = (color: string, borderColor: string) => {
  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid ${borderColor};
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    "></div>`
  });
};

const MapView: React.FC = () => {
  const { events, activeFilter } = useEvents();
  const defaultCenter: [number, number] = [40.7128, -74.006]; // New York
  const defaultZoom = 12;
  
  const filteredEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);
  
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

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}
        center={defaultCenter}
        zoom={defaultZoom}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredEvents.map((event, index) => {
          const markerIcon = getMarkerIcon(event.type);
          return (
            <Marker
              key={`event-${index}-${event.type}`}
              position={[event.location.lat, event.location.lng]}
              icon={createCustomMarker(markerIcon.color, markerIcon.borderColor)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{getEventTitle(event.type)}</h3>
                  <p>{event.description || 'No description provided'}</p>
                  <p className="text-sm text-gray-400">{event.location.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map overlay with event count */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur rounded-lg p-2 text-sm z-[1000]">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Events:</span>
          <span className="font-semibold text-white">{filteredEvents.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
