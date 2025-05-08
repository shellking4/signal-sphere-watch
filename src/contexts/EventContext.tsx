
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventType } from '@/types/events';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface EventContextProps {
  events: Event[];
  eventTypes: any[];
  filters: any[];
  addEvent: (type: EventType, description?: string) => void;
  resolveEvent: (id: string) => void;
  activeFilter: EventType | 'all';
  setActiveFilter: (filter: EventType | 'all') => void;
  reportEvent: (type: EventType, description?: string) => void;
  getCurrentLocation: () => Promise<{ lat: number, lng: number } | null>;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);


export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {

    supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Change received!', payload)
          fetchEvents();
        }
      ).subscribe();

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {

        const supabaseQuery = supabase
          .from('events')
          .select(`
          id,
          type,
          latitude,
          longitude,
          address,
          reporter,
          description,
          is_active,
          created_at,
          event_types (
            id,
            name,
            label,
            icon,
            color_class
          )
        `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .range(0, 99);

        if (activeFilter !== 'all') {
          const queryResult = await supabase
            .from('event_types')
            .select('*')
            .eq('name', activeFilter)
            .single();
          const eventType = queryResult.data;
          supabaseQuery.eq('type', eventType?.id);
        }

        const { data: eventsData, error: fetchError } = await supabaseQuery;
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        for (const event of eventsData) {
          (event as any).type = (event as any).event_types?.name ?? "Unknown";
          (event as any).isActive = (event as any).is_active;
          (event as any).location = {
            lat: (event as any).latitude,
            lng: (event as any).longitude,
            address: (event as any).address
          }
        }
        setEvents(eventsData || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
        setError(errorMessage);
        console.error('Error fetching events:', err);
        toast.error('Error fetching events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [activeFilter]);

  // Get user's current location
  const getCurrentLocation = (): Promise<{ lat: number, lng: number } | null> => {
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

      const newEvent = {
        id: Date.now().toString(),
        type,
        location: {
          lat: location.lat,
          lng: location.lng,
          address
        },
        reporter: user.id,
        timestamp: Date.now(),
        description,
        is_active: true,
      };

      const queryResult = await supabase
        .from('event_types')
        .select('*')
        .eq('name', type)
        .single();
      const eventType = queryResult.data;

      const newEventData = {
        type: eventType?.id,
        latitude: location.lat,
        longitude: location.lng,
        address,
        reporter: user.id,
        description,
        is_active: true,
      };
      const { data, error } = await supabase
        .from('events')
        .insert([
          newEventData
        ])
        .select();
      setActiveFilter(type);
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

  const resolveEvent = async (id: string) => {
    const { data, error } = await supabase
      .from('events')
      .update({ is_active: false })
      .eq('id', id)
      .select()
    toast.info("Event marked as resolved");
  };

  return (
    <EventContext.Provider value={{
      events,
      eventTypes,
      filters,
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
