import React, { createContext, useContext, useState } from 'react';

// Define types
export type EventType = 'power-outage' | 'traffic-jam' | 'police-activity';
export type FilterType = EventType | 'all';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Event {
  id: string;
  type: EventType;
  location: Location;
  description: string;
  isActive: boolean;
  reporter?: string;
  timestamp?: number;
}

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  activeFilter: FilterType;
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  addEvent?: (type: EventType, description?: string) => void;
  resolveEvent?: (id: string) => void;
  reportEvent?: (type: EventType, description?: string) => void;
  getCurrentLocation?: () => Promise<{lat: number, lng: number} | null>;
}

// Create context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Sample events data
const sampleEvents: Event[] = [
  {
    id: '1',
    type: 'power-outage',
    location: {
      lat: 40.712, 
      lng: -74.006,
      address: '123 Broadway, New York, NY'
    },
    description: 'Power outage affecting downtown area',
    isActive: true,
    timestamp: Date.now() - 1000 * 60 * 30
  },
  {
    id: '2',
    type: 'traffic-jam',
    location: {
      lat: 40.722, 
      lng: -73.996,
      address: 'FDR Drive, New York, NY'
    },
    description: 'Heavy traffic due to construction',
    isActive: true,
    timestamp: Date.now() - 1000 * 60 * 15
  },
  {
    id: '3',
    type: 'police-activity',
    location: {
      lat: 40.742, 
      lng: -74.016,
      address: 'Hudson Yards, New York, NY'
    },
    description: 'Police responding to incident',
    isActive: true,
    timestamp: Date.now() - 1000 * 60 * 5
  }
];

// Provider component
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  return (
    <EventContext.Provider value={{ events, setEvents, activeFilter, setActiveFilter }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the context
export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
