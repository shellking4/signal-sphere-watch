
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }
    
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      setContent(content: string | Node): void;
    }
    
    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      [key: string]: any;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: any;
      animation?: number;
      [key: string]: any;
    }
    
    interface InfoWindowOptions {
      content?: string | Node;
      [key: string]: any;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
    
    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      [key: string]: any;
    }
    
    interface GeocoderResult {
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      formatted_address: string;
      geometry: {
        location: LatLng;
      };
      [key: string]: any;
    }
    
    type GeocoderResponse = GeocoderResult[];
    
    const SymbolPath: {
      CIRCLE: number;
      FORWARD_CLOSED_ARROW: number;
      FORWARD_OPEN_ARROW: number;
      BACKWARD_CLOSED_ARROW: number;
      BACKWARD_OPEN_ARROW: number;
    };
    
    const Animation: {
      DROP: number;
      BOUNCE: number;
    };
    
    const GeocoderStatus: {
      OK: string;
      ZERO_RESULTS: string;
      OVER_QUERY_LIMIT: string;
      REQUEST_DENIED: string;
      INVALID_REQUEST: string;
      UNKNOWN_ERROR: string;
    };
    
    const MapTypeId: {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    };
  }
}

// We need to declare global to add properties to the window object
declare global {
  interface Window {
    google: typeof google;
  }
}

export {};
