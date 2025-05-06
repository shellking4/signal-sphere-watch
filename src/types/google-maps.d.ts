
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        InfoWindow: typeof google.maps.InfoWindow;
        Geocoder: typeof google.maps.Geocoder;
        LatLng: typeof google.maps.LatLng;
        SymbolPath: {
          CIRCLE: number;
          FORWARD_CLOSED_ARROW: number;
          FORWARD_OPEN_ARROW: number;
          BACKWARD_CLOSED_ARROW: number;
          BACKWARD_OPEN_ARROW: number;
        };
        Animation: {
          DROP: number;
          BOUNCE: number;
        };
        GeocoderStatus: {
          OK: string;
          ZERO_RESULTS: string;
          OVER_QUERY_LIMIT: string;
          REQUEST_DENIED: string;
          INVALID_REQUEST: string;
          UNKNOWN_ERROR: string;
        };
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
      };
    };
  }
}

export {};
