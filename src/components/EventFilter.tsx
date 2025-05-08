
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from 'lucide-react/dynamic'
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { EventType } from '@/types/events';
import { CircleEqual } from 'lucide-react';
import { useEvents } from '@/contexts/EventContext';


const EventFilter: React.FC = () => {
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);

  const { activeFilter, setActiveFilter } = useEvents();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchEventTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: eventTypesData, error: fetchError }: any = await supabase.from('event_types').select('*');
        if (fetchError) {
          throw new Error(fetchError.message);
        }
        let filters = []
        for (const eventType of eventTypesData) {
          const filter = {
            eventTypeId: eventType.id,
            id: eventType.name,
            label: eventType.label,
            icon: eventType.icon,
            color: eventType.color_class
          }
          filters.push(filter)
        }
        filters.unshift({ id: 'all', label: 'All Events', icon: 'circle-equal' });
        setFilters(filters);
        setEventTypes(eventTypesData || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
        setError(errorMessage);
        console.error('Error fetching events:', err);
        toast.error('Error fetching events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventTypes();
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full flex items-center gap-1.5 whitespace-nowrap",
            activeFilter === filter.id 
              ? "bg-signaldude-bg-light text-signaldude-text border-slate-600" 
              : "bg-transparent text-signaldude-text-muted",
            activeFilter === filter.id && filter.id !== 'all' && filter.color
          )}
          onClick={() => setActiveFilter(filter.id as any)}
        >
          <DynamicIcon name={filter.icon} size={16} />
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default EventFilter;
