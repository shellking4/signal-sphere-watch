
// This file is being kept for compatibility with existing code, 
// but we're now using Leaflet with OpenStreetMap instead of Google Maps.
// Most of the original Google Maps API methods we're using have equivalent Leaflet methods.

declare namespace google {
  namespace maps {
    // Empty declarations to maintain compatibility with existing code
    // These will be replaced with Leaflet equivalents in the components
    class Map {}
    class Marker {}
    class InfoWindow {}
    class Geocoder {}
    class LatLng {}
    
    interface MapOptions {}
    interface MarkerOptions {}
    interface InfoWindowOptions {}
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    interface MapsEventListener {}
    interface GeocoderRequest {}
    interface GeocoderResult {}
    
    const SymbolPath: any;
    const Animation: any;
    const GeocoderStatus: any;
    const MapTypeId: any;
  }
}

// Make sure the Google namespace is available globally
// This is just for compatibility
declare global {
  interface Window {
    google: typeof google;
  }
}

export {};
