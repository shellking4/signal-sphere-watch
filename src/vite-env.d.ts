/// <reference types="vite/client" />

declare module '*.png' {
    const value: string;
    export default value;
}

declare module 'leaflet' {
    interface DivIcon {
        // The DivIcon class is defined in Leaflet but we need to make sure TypeScript knows about it
    }
}