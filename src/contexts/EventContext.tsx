
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventType } from '@/types/events';
import { toast } from '@/components/ui/sonner';

interface EventContextProps {
  events: Event[];
  addEvent: (type: EventType, description?: string) => void;
  resolveEvent: (id: string) => void;
  activeFilter: EventType | 'all';
  setActiveFilter: (filter: EventType | 'all') => void;
  reportEvent: (type: EventType, description?: string) => void;
  getCurrentLocation: () => Promise<{lat: number, lng: number} | null>;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

// Mock initial data
const initialEvents: Event[] = [
  {
    id: '1',
    type: 'power-outage',
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: 'Downtown, New York, NY',
    },
    reporter: 'Anonymous',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    description: 'Entire block is without power',
    isActive: true,
  },
  {
    id: '2',
    type: 'traffic-jam',
    location: {
      lat: 40.7328,
      lng: -73.9874,
      address: 'Midtown, New York, NY',
    },
    reporter: 'Anonymous',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    description: 'Major congestion due to construction',
    isActive: true,
  },
  {
    id: '3',
    type: 'police-activity',
    location: {
      lat: 40.7223,
      lng: -73.9874,
      address: 'East Village, New York, NY',
    },
    reporter: 'Anonymous',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    description: 'Multiple police cars on site',
    isActive: true,
  },
  {
    id: '4',
    type: 'long-queue',
    location: {
      lat: 40.7433,
      lng: -73.9912,
      address: 'Financial District, New York, NY',
    },
    reporter: 'Anonymous',
    timestamp: Date.now() - 1000 * 60 * 2, // 2 minutes ago
    description: 'Over 50 people waiting in line at CitiBank',
    isActive: true,
  },
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');

  // Get user's current location
  const getCurrentLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
          resolve(null);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  // Get address from coordinates using OpenStreetMap Nominatim API
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      // Use Nominatim API to get address information (reverse geocoding)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      
      return "Unknown location";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Unknown location";
    }
  };

  // Report a new event with user's location
  const reportEvent = async (type: EventType, description?: string) => {
    try {
      const location = await getCurrentLocation();
      
      if (!location) {
        toast.error("Could not get your location to report event");
        return;
      }
      
      let address = "Unknown location";
      
      try {
        address = await getAddressFromCoordinates(location.lat, location.lng);
      } catch (error) {
        console.error("Error getting address:", error);
      }
      
      const newEvent: Event = {
        id: Date.now().toString(),
        type,
        location: {
          lat: location.lat,
          lng: location.lng,
          address
        },
        reporter: 'Anonymous',
        timestamp: Date.now(),
        description,
        isActive: true,
      };

      setEvents(prev => [newEvent, ...prev]);
      toast.success("Event reported successfully!");
    } catch (error) {
      console.error("Error reporting event:", error);
      toast.error("Error reporting event");
    }
  };

  const addEvent = (type: EventType, description?: string) => {
    // Keep compatibility with old code
    reportEvent(type, description);
  };

  const resolveEvent = (id: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, isActive: false } : event
      )
    );
    toast.info("Event marked as resolved");
  };

  return (
    <EventContext.Provider value={{
      events,
      addEvent,
      resolveEvent,
      activeFilter,
      setActiveFilter,
      reportEvent,
      getCurrentLocation
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
