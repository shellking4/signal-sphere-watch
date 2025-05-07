
import React from 'react';
import { AlertTriangle, MapPin, Clock, TrafficCone, Car, PowerOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/events';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

// Format timestamp to a readable format
const formatTime = (timestamp: number): string => {
  const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

// Get icon based on event type
const getEventIcon = (type: Event['type']) => {
  switch (type) {
    case 'power-outage':
      return <PowerOff className="text-signaldude-danger" />;
    case 'traffic-jam':
      return <TrafficCone className="text-signaldude-warning" />;
    case 'police-activity':
      return <Car className="text-signaldude-primary" />;
    case 'long-queue':
      return <Users className="text-amber-400" />;
    default:
      return <AlertTriangle className="text-signaldude-accent" />;
  }
};

// Get color class based on event type
const getEventColorClass = (type: Event['type']) => {
  switch (type) {
    case 'power-outage':
      return 'bg-red-500/10 border-red-500/20';
    case 'traffic-jam':
      return 'bg-amber-500/10 border-amber-500/20';
    case 'police-activity':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'long-queue':
      return 'bg-amber-400/10 border-amber-400/20';
    default:
      return 'bg-slate-500/10 border-slate-500/20';
  }
};

// Get title based on event type
const getEventTitle = (type: Event['type']) => {
  switch (type) {
    case 'power-outage':
      return 'Power Outage';
    case 'traffic-jam':
      return 'Traffic Jam';
    case 'police-activity':
      return 'Police Activity';
    case 'long-queue':
      return 'Long Queue';
    default:
      return 'Unknown Event';
  }
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { resolveEvent } = useEvents();
  const { isAuthenticated } = useAuth();

  const handleResolveClick = () => {
    if (isAuthenticated) {
      resolveEvent(event.id);
    } else {
      toast.error("You need to sign in to resolve events", {
        className: "bg-signaldude-bg-light text-signaldude-text border-red-500/20"
      });
    }
  };

  return (
    <div className={`event-card animate-fade-in ${getEventColorClass(event.type)} ${!event.isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-signaldude-bg-dark">
            {getEventIcon(event.type)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{getEventTitle(event.type)}</h3>
            <div className="flex items-center gap-1 text-xs text-signaldude-text-muted">
              <Clock size={14} />
              <span>{formatTime(event.timestamp)}</span>
            </div>
          </div>
        </div>
        {event.isActive && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs h-8 ${!isAuthenticated ? 'opacity-50' : ''}`}
            onClick={handleResolveClick}
            disabled={!isAuthenticated}
          >
            Resolve
          </Button>
        )}
      </div>
      
      {event.description && (
        <p className="mt-2 text-sm text-signaldude-text-muted">{event.description}</p>
      )}
      
      <div className="flex items-center gap-1 mt-2 text-xs text-signaldude-text-muted">
        <MapPin size={14} />
        <span>{event.location.address}</span>
      </div>
    </div>
  );
};

export default EventCard;
