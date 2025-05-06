
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }
    
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
      setContent(content: string | Node): void;
      getContent(): string | Node;
    }
    
    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toString(): string;
      toJSON(): LatLngLiteral;
      equals(other: LatLng): boolean;
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      styles?: any[];
      disableDefaultUI?: boolean;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      scaleControl?: boolean;
      streetViewControl?: boolean;
      rotateControl?: boolean;
      fullscreenControl?: boolean;
      [key: string]: any;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: any;
      animation?: number;
      draggable?: boolean;
      visible?: boolean;
      zIndex?: number;
      [key: string]: any;
    }
    
    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
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
      bounds?: any;
      componentRestrictions?: any;
      region?: string;
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
        location_type?: string;
        bounds?: any;
        viewport?: any;
      };
      partial_match?: boolean;
      place_id?: string;
      postcode_localities?: string[];
      types?: string[];
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

// Make sure the Google namespace is available globally
declare global {
  interface Window {
    google: typeof google;
  }
}

export {};
