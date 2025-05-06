
export type EventType = 'power-outage' | 'traffic-jam' | 'police-arrest';

export interface Event {
  id: string;
  type: EventType;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  reporter: string;
  timestamp: number;
  description?: string;
  isActive: boolean;
}
