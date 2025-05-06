
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventType } from '@/types/events';
import { toast } from '@/components/ui/sonner';

interface EventContextProps {
  events: Event[];
  addEvent: (type: EventType, description?: string) => void;
  resolveEvent: (id: string) => void;
  activeFilter: EventType | 'all';
  setActiveFilter: (filter: EventType | 'all') => void;
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
    type: 'police-arrest',
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
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');

  const addEvent = (type: EventType, description?: string) => {
    // In a real app, we would get the user's actual location
    const mockLocation = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.02, 
      lng: -74.006 + (Math.random() - 0.5) * 0.02,
      address: 'New York, NY'
    };
    
    const newEvent: Event = {
      id: Date.now().toString(),
      type,
      location: mockLocation,
      reporter: 'Anonymous',
      timestamp: Date.now(),
      description,
      isActive: true,
    };

    setEvents(prev => [newEvent, ...prev]);
    toast.success("Event reported successfully!");
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
      setActiveFilter
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
