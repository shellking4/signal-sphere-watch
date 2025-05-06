
import React from 'react';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/contexts/EventContext';
import { PowerOff, TrafficCone, PoliceCar, CircleEqual } from 'lucide-react';
import { cn } from '@/lib/utils';

const EventFilter: React.FC = () => {
  const { activeFilter, setActiveFilter } = useEvents();

  const filters = [
    { id: 'all', label: 'All Events', icon: CircleEqual },
    { id: 'power-outage', label: 'Power Outages', icon: PowerOff, color: 'text-red-500' },
    { id: 'traffic-jam', label: 'Traffic Jams', icon: TrafficCone, color: 'text-amber-500' },
    { id: 'police-arrest', label: 'Police Activity', icon: PoliceCar, color: 'text-blue-500' },
  ];

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
          <filter.icon size={16} />
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default EventFilter;
