declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
    }

    enum TravelMode {
      DRIVING = 'DRIVING',
      WALKING = 'WALKING',
      BICYCLING = 'BICYCLING',
      TRANSIT = 'TRANSIT'
    }

    enum UnitSystem {
      METRIC = 0,
      IMPERIAL = 1
    }

    interface DistanceMatrixRequest {
      origins: LatLng[];
      destinations: LatLng[];
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    }

    interface DistanceMatrixResponse {
      rows: DistanceMatrixResponseRow[];
    }

    interface DistanceMatrixResponseRow {
      elements: DistanceMatrixResponseElement[];
    }

    interface DistanceMatrixResponseElement {
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }

    class DistanceMatrixService {
      getDistanceMatrix(
        request: DistanceMatrixRequest,
        callback: (response: DistanceMatrixResponse | null, status: string) => void
      ): void;
    }
  }
}

export {};
