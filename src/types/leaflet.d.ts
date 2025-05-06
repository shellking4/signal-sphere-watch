
// This is just a supplementary type file - the main types come from @types/leaflet
// We're adding this to make sure our custom types are available

import L from 'leaflet';

declare global {
  interface Window {
    L: typeof L;
  }
}

export {};
