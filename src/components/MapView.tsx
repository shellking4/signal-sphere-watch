
import React from 'react';
import { useEvents } from '@/contexts/EventContext';
import { MapPin, PowerOff, TrafficCone, PoliceCar } from 'lucide-react';

const MapView: React.FC = () => {
  const { events, activeFilter } = useEvents();
  
  const filteredEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'power-outage':
        return <PowerOff size={18} className="text-red-500" />;
      case 'traffic-jam':
        return <TrafficCone size={18} className="text-amber-500" />;
      case 'police-arrest':
        return <PoliceCar size={18} className="text-blue-500" />;
      default:
        return <MapPin size={18} />;
    }
  };
  
  const getEventPinClass = (type: string) => {
    switch (type) {
      case 'power-outage':
        return 'bg-red-500/20 border-red-500';
      case 'traffic-jam':
        return 'bg-amber-500/20 border-amber-500';
      case 'police-arrest':
        return 'bg-blue-500/20 border-blue-500';
      default:
        return 'bg-gray-500/20 border-gray-500';
    }
  };

  return (
    <div className="map-container relative w-full h-full">
      {/* Placeholder map background */}
      <div className="absolute inset-0 bg-slate-800">
        {/* Grid lines to simulate a map */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />

        {/* NYC text as placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-600 text-6xl font-extrabold opacity-10">NEW YORK CITY</p>
        </div>

        {/* Event markers */}
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`absolute p-2 rounded-full border-2 shadow-lg animate-pulse-light ${getEventPinClass(event.type)}`}
            style={{
              // Add some random positioning for the mock map
              left: `${((event.location.lng + 74.006) * 1000) % 80 + 10}%`,
              top: `${((event.location.lat - 40.7128) * 1000) % 80 + 10}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {getEventIcon(event.type)}
          </div>
        ))}
      </div>
      
      {/* Map overlay with event count */}
      <div className="absolute bottom-4 right-4 bg-signaldude-bg-dark/80 backdrop-blur rounded-lg p-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-signaldude-text-muted">Events:</span>
          <span className="font-semibold">{filteredEvents.length}</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
