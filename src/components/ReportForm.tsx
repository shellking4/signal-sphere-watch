
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { Car, PowerOff, TrafficCone, Lock, MapPin, Loader2, Users } from 'lucide-react';
import { EventType } from '@/types/events';
import { cn } from '@/lib/utils';
import LoginDialog from './LoginDialog';

const ReportForm: React.FC = () => {
  const { reportEvent, getCurrentLocation } = useEvents();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [description, setDescription] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPreview, setLocationPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    reportEvent(selectedType, description);
    setOpen(false);
    setSelectedType(null);
    setDescription('');
    setLocationPreview(null);
  };

  const checkLocationPreview = async () => {
    setIsGettingLocation(true);
    setLocationPreview(null);
    
    try {
      const location = await getCurrentLocation();
      
      if (location) {
        try {
          // Use Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch address information');
          }
          
          const data = await response.json();
          
          if (data && data.display_name) {
            setLocationPreview(data.display_name);
          } else {
            setLocationPreview('Location found, but address information is not available');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setLocationPreview('Error getting address information');
        }
      } else {
        setLocationPreview('Unable to determine your location');
      }
    } catch (error) {
      console.error('Error getting location preview:', error);
      setLocationPreview('Error getting location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // If user is not authenticated, show login button instead
  if (!isAuthenticated) {
    return (
      <LoginDialog
        trigger={
          <Button size="lg" className="shadow-lg bg-signaldude-accent hover:bg-signaldude-accent/90 text-white font-semibold rounded-xl">
            <Lock size={16} className="mr-1" /> Sign In to Report
          </Button>
        }
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg bg-signaldude-accent hover:bg-signaldude-accent/90 text-white font-semibold rounded-xl">
          Report Event
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-signaldude-bg-light text-signaldude-text border-slate-700 w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl font-bold">Report New Event</DialogTitle>
          <DialogDescription className="text-signaldude-text-muted">
            Report an event at your current location
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location preview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-signaldude-text-muted">Your Location</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1"
                onClick={checkLocationPreview}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <MapPin size={14} />
                    <span>Check Location</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-signaldude-bg-dark rounded-lg border border-slate-700 p-3 min-h-[60px] flex items-center text-sm">
              {locationPreview ? (
                <div className="flex gap-2 items-center">
                  <MapPin size={16} className="text-signaldude-primary flex-shrink-0" />
                  <span>{locationPreview}</span>
                </div>
              ) : (
                <span className="text-signaldude-text-muted">
                  Click "Check Location" to verify where you're reporting from
                </span>
              )}
            </div>
          </div>
          
          {/* Event type selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-signaldude-text-muted">Event Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'power-outage' as EventType, label: 'Power Outage', icon: PowerOff, color: 'from-red-500/50 to-red-600/50' },
                { type: 'traffic-jam' as EventType, label: 'Traffic Jam', icon: TrafficCone, color: 'from-amber-500/50 to-amber-600/50' },
                { type: 'police-activity' as EventType, label: 'Police Activity', icon: Car, color: 'from-blue-500/50 to-blue-600/50' },
                { type: 'long-queue' as EventType, label: 'Long Queue', icon: Users, color: 'from-amber-400/50 to-amber-500/50' },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setSelectedType(option.type)}
                  className={cn(
                    'p-4 flex flex-col items-center rounded-lg border border-slate-700 hover:border-signaldude-primary transition-all',
                    selectedType === option.type ? 'bg-gradient-to-b ' + option.color + ' border-slate-500' : 'bg-signaldude-bg-dark'
                  )}
                >
                  <option.icon size={24} />
                  <span className="text-xs mt-1">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-signaldude-text-muted">Description (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're seeing..."
              className="bg-signaldude-bg-dark border-slate-700 text-signaldude-text resize-none h-24"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!selectedType} 
            className="w-full bg-signaldude-primary hover:bg-signaldude-primary/80"
          >
            Submit Report
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportForm;
