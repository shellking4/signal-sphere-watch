
import React from 'react';
import { EventProvider } from '@/contexts/EventContext';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import EventCard from '@/components/EventCard';
import ReportForm from '@/components/ReportForm';
import EventFilter from '@/components/EventFilter';
import { useEvents } from '@/contexts/EventContext';
import LeafletMapView from '@/components/LeafletMapView';

const EventsList: React.FC = () => {
  const { events, activeFilter } = useEvents();
  
  const filteredEvents = activeFilter === 'all' 
    ? events.filter(e => e.isActive) 
    : events.filter(e => e.isActive && e.type === activeFilter);

  if (filteredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-signaldude-text-muted">
        <p>No active events found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

const EventsContainer: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <EventFilter />
      </div>
      <div className="flex-1 p-4 overflow-hidden">
        <EventsList />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <EventProvider>
      <div className="min-h-screen flex flex-col bg-signaldude-bg-dark text-signaldude-text">
        <Header />
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
          {/* Map Section */}
          <div className="md:order-2 h-[300px] md:h-full rounded-xl overflow-hidden">
              <LeafletMapView />
          </div>
          
          {/* Events Section */}
          <div className="md:order-1 flex flex-col h-full overflow-hidden">
            <EventsContainer />
            
            <div className="p-4 flex justify-center">
              <ReportForm />
            </div>
          </div>
        </div>
      </div>
    </EventProvider>
  );
};

export default Index;
