
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/contexts/EventContext';
import { Car, PowerOff, TrafficCone } from 'lucide-react';
import { EventType } from '@/types/events';
import { cn } from '@/lib/utils';

const ReportForm: React.FC = () => {
  const { addEvent } = useEvents();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    addEvent(selectedType, description);
    setOpen(false);
    setSelectedType(null);
    setDescription('');
  };

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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-signaldude-text-muted">Event Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'power-outage' as EventType, label: 'Power Outage', icon: PowerOff, color: 'from-red-500/50 to-red-600/50' },
                { type: 'traffic-jam' as EventType, label: 'Traffic Jam', icon: TrafficCone, color: 'from-amber-500/50 to-amber-600/50' },
                { type: 'police-activity' as EventType, label: 'Police Activity', icon: Car, color: 'from-blue-500/50 to-blue-600/50' },
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
