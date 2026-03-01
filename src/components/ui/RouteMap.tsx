import React, { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// UCI Main Campus coordinates
const UCI_COORDS = {
  lng: -117.8443,
  lat: 33.6405
};

interface RouteMapProps {
  origin: string;
  originCoords?: { lng: number; lat: number };
  destination?: string;
  destinationCoords?: { lng: number; lat: number };
  height?: string;
  showRoute?: boolean;
  interactive?: boolean;
}

interface RouteData {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  origin,
  originCoords,
  destination = 'UCI Main Campus',
  destinationCoords,
  height = '300px',
  showRoute = true,
  interactive = true
}) => {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [startCoords, setStartCoords] = useState<{ lng: number; lat: number } | null>(originCoords || null);
  const [endCoords, setEndCoords] = useState<{ lng: number; lat: number } | null>(destinationCoords || null);
  const [duration, setDuration] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const isTokenMissing = !MAPBOX_TOKEN;

  // Geocode origin address if no coordinates provided
  useEffect(() => {
    if (isTokenMissing) {
      setError('Map preview unavailable. Add VITE_MAPBOX_TOKEN to enable maps.');
      return;
    }
    if (originCoords) {
      setStartCoords(originCoords);
      return;
    }

    if (!origin) return;

    const controller = new AbortController();
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${MAPBOX_TOKEN}&country=US&proximity=-117.8443,33.6405`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Geocoding failed: ${response.status}`);
        }
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setStartCoords({ lng, lat });
          setError(null);
        } else {
          setError('Could not find origin location');
        }
      } catch (error) {
        if ((error as { name?: string }).name !== 'AbortError') {
          console.error('Geocoding error:', error);
          setError('Could not find origin location');
        }
      }
    };

    geocodeAddress();
    return () => controller.abort();
  }, [origin, originCoords, isTokenMissing]);

  // Geocode destination address if no coordinates provided
  useEffect(() => {
    if (isTokenMissing) {
      setError('Map preview unavailable. Add VITE_MAPBOX_TOKEN to enable maps.');
      return;
    }
    if (destinationCoords) {
      setEndCoords(destinationCoords);
      return;
    }

    if (!destination) {
      setEndCoords(UCI_COORDS);
      return;
    }

    // Check if destination is UCI-related
    const isUCI = destination.toLowerCase().includes('uci') ||
                  destination.toLowerCase().includes('irvine') ||
                  destination.toLowerCase() === 'uc irvine';

    if (isUCI) {
      setEndCoords(UCI_COORDS);
      return;
    }

    const controller = new AbortController();
    const geocodeDestination = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${MAPBOX_TOKEN}&country=US&proximity=-117.8443,33.6405`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Destination geocoding failed: ${response.status}`);
        }
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setEndCoords({ lng, lat });
          setError(null);
        } else {
          setEndCoords(UCI_COORDS);
          setError('Could not find destination, using UCI as default');
        }
      } catch (error) {
        if ((error as { name?: string }).name !== 'AbortError') {
          console.error('Destination geocoding error:', error);
          setEndCoords(UCI_COORDS);
          setError('Could not find destination, using UCI as default');
        }
      }
    };

    geocodeDestination();
    return () => controller.abort();
  }, [destination, destinationCoords, isTokenMissing]);

  // Fetch route when we have both coordinates
  useEffect(() => {
    if (isTokenMissing || !startCoords || !endCoords || !showRoute) return;

    const controller = new AbortController();
    const fetchRoute = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Directions failed: ${response.status}`);
        }
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const routeData: RouteData = {
            type: 'Feature',
            geometry: data.routes[0].geometry,
            properties: {}
          };
          setRoute(routeData);
          setDuration(Math.round(data.routes[0].duration / 60)); // Convert to minutes
          setDistance(Math.round(data.routes[0].distance / 1609.34 * 10) / 10); // Convert to miles
          setError(null);

          // Fit map to route bounds
          if (mapRef.current) {
            const coordinates = data.routes[0].geometry.coordinates;
            const bounds = coordinates.reduce(
              (bounds: any, coord: number[]) => {
                return bounds.extend(coord);
              },
              new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
            );

            mapRef.current.fitBounds(bounds, {
              padding: 50,
              duration: 1000
            });
          }
        } else {
          setError('Could not calculate route between locations');
        }
      } catch (error) {
        if ((error as { name?: string }).name !== 'AbortError') {
          console.error('Route fetching error:', error);
          setError('Could not calculate route');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
    return () => controller.abort();
  }, [startCoords, endCoords, showRoute, isTokenMissing]);

  const initialViewState = {
    longitude: startCoords?.lng || endCoords?.lng || UCI_COORDS.lng,
    latitude: startCoords?.lat || endCoords?.lat || UCI_COORDS.lat,
    zoom: 10
  };

  if (isTokenMissing) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height }}>
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-uci-blue/10 text-uci-blue flex items-center justify-center mx-auto mb-3">
              <MapPin size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-900">Map preview disabled</p>
            <p className="text-xs text-slate-500 mt-1">Add `VITE_MAPBOX_TOKEN` to enable route previews.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        interactive={interactive}
      >
        {interactive && <NavigationControl position="top-right" />}

        {/* Route line */}
        {route && (
          <Source id="route" type="geojson" data={route}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#0064A4',
                'line-width': 4,
                'line-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Origin marker */}
        {startCoords && (
          <Marker longitude={startCoords.lng} latitude={startCoords.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                <MapPin size={20} />
              </div>
            </div>
          </Marker>
        )}

        {/* Destination marker */}
        {endCoords && (
          <Marker longitude={endCoords.lng} latitude={endCoords.lat} anchor="bottom">
            <div className="flex flex-col items-center">
              <div className="bg-uci-blue text-white p-2 rounded-full shadow-lg">
                <Navigation size={20} />
              </div>
            </div>
          </Marker>
        )}
      </Map>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-uci-blue border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Route info overlay */}
      {duration && distance && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-slate-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-uci-blue rounded-full"></div>
              <span className="font-bold text-slate-900">{duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium text-slate-600">{distance} mi</span>
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && !isLoading && (
        <div className="absolute bottom-3 left-3 bg-amber-50/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-amber-200">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <AlertCircle size={16} />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};
