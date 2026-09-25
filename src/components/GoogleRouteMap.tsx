import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, Truck, Building2, AlertCircle, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

interface GoogleRouteMapProps {
  originName: string;
  destinationName: string;
  distanceKm: number;
  totalTimeMinutes: number;
  travelTimeMinutes: number;
  handlingTimeMinutes: number;
  vehicleType: string;
}

// Vijayawada Canonical Coordinates
// Smart College Canteen (MG Road area, Vijayawada)
const CANONICAL_ORIGIN = { lat: 16.5142, lng: 80.6315 };
// Hope Food Bank (Benz Circle, Vijayawada)
const CANONICAL_DESTINATION = { lat: 16.4996, lng: 80.6536 };

// Waypoints tracing the primary MG Road / Bandar Road transit corridor in Vijayawada
const CANONICAL_ROUTE_PATH = [
  { lat: 16.5142, lng: 80.6315 }, // Smart College Canteen, MG Road
  { lat: 16.5095, lng: 80.6390 }, // Governorpet / DV Manor transit corridor
  { lat: 16.5042, lng: 80.6472 }, // Bandar Road junction
  { lat: 16.4996, lng: 80.6536 }, // Hope Food Bank, Benz Circle
];

export const GoogleRouteMap: React.FC<GoogleRouteMapProps> = ({
  originName,
  destinationName,
  distanceKm,
  totalTimeMinutes,
  travelTimeMinutes,
  handlingTimeMinutes,
  vehicleType,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Read only the demo key from Vite environment
  const demoKey = import.meta.env.VITE_GOOGLE_MAPS_DEMO_KEY?.trim() || '';
  const isKeyPresent = Boolean(demoKey && demoKey !== 'your_google_maps_demo_key');

  const [mapState, setMapState] = useState<'loading' | 'ready' | 'simulation'>(
    isKeyPresent ? 'loading' : 'simulation'
  );

  useEffect(() => {
    // If no demo key or default placeholder, fallback to simulation mode immediately
    if (!isKeyPresent) {
      setMapState('simulation');
      return;
    }

    let isMounted = true;
    let timeoutId: number | undefined;

    // Safety handler for Google Maps authentication failures (invalid key, expired, unauthorized)
    window.gm_authFailure = () => {
      if (isMounted) {
        setMapState('simulation');
      }
    };

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current || !window.google?.maps) return;

      try {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 16.5069, lng: 80.6425 },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // 1. Green Origin Marker (Smart College Canteen, Vijayawada)
        const originMarker = new window.google.maps.Marker({
          position: CANONICAL_ORIGIN,
          map,
          title: `Smart College Canteen, Vijayawada`,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });

        const originInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: inherit; padding: 6px; color: #0f172a; max-width: 200px;">
              <span style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Origin (Kitchen Hub)</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">Smart College Canteen</div>
              <div style="font-size: 11px; color: #64748b;">Vijayawada, Andhra Pradesh</div>
            </div>
          `
        });

        originMarker.addListener('click', () => {
          originInfoWindow.open(map, originMarker);
        });

        // 2. Red Destination Marker (Hope Food Bank, Benz Circle, Vijayawada)
        const destinationMarker = new window.google.maps.Marker({
          position: CANONICAL_DESTINATION,
          map,
          title: `Hope Food Bank, Benz Circle, Vijayawada`,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });

        const destInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: inherit; padding: 6px; color: #0f172a; max-width: 200px;">
              <span style="font-size: 10px; font-weight: 800; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">Destination (Recipient NGO)</span>
              <div style="font-size: 13px; font-weight: 700; margin-top: 2px;">Hope Food Bank</div>
              <div style="font-size: 11px; color: #64748b;">Benz Circle, Vijayawada</div>
            </div>
          `
        });

        destinationMarker.addListener('click', () => {
          destInfoWindow.open(map, destinationMarker);
        });

        // 3. Visual Route Polyline between the two points
        const polyline = new window.google.maps.Polyline({
          path: CANONICAL_ROUTE_PATH,
          geodesic: true,
          strokeColor: '#059669',
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map
        });

        // Auto-fit bounds
        const bounds = new window.google.maps.LatLngBounds();
        CANONICAL_ROUTE_PATH.forEach((pt) => bounds.extend(pt));
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

        setMapState('ready');
      } catch (err) {
        console.warn('Google Maps initialization failed, falling back to Simulation Mode:', err);
        if (isMounted) setMapState('simulation');
      }
    };

    // If script is already loaded
    if (window.google?.maps) {
      initMap();
      return () => {
        isMounted = false;
      };
    }

    // Set timeout in case network blocks or key check hangs
    timeoutId = window.setTimeout(() => {
      if (isMounted && mapState !== 'ready') {
        setMapState('simulation');
      }
    }, 6000);

    // Dynamically inject script
    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(demoKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initMap();
      };
      script.onerror = () => {
        if (isMounted) setMapState('simulation');
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', initMap);
      existingScript.addEventListener('error', () => {
        if (isMounted) setMapState('simulation');
      });
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [demoKey, isKeyPresent]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header / Status Banner */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-xs sm:text-sm text-slate-900">
            Vijayawada Transit Corridor: Smart College Canteen → Benz Circle
          </span>
        </div>

        {/* Integration Mode Badge */}
        {mapState === 'ready' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Google Maps Demo Integration — testing/prototyping only.
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Map Simulation Mode — Google Maps demo key is unavailable.
          </span>
        )}
      </div>

      {/* Map Display Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden">
        {/* Real Interactive Google Map */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${mapState === 'ready' ? 'block' : 'hidden'}`}
          aria-label="Google Map View"
        />

        {/* Simulated Route Map Fallback (Shown when demo key missing, loading, or failed) */}
        {mapState !== 'ready' && (
          <div className="relative w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-teal-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* SVG Simulated Route Polyline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <path
                d="M 80 200 Q 220 80 420 140"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Top Origin Marker (Smart College Canteen, Vijayawada) */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Origin (Kitchen Hub)</span>
                </div>
                <span className="font-bold">{originName}</span>
              </div>
            </div>

            {/* Floating Distance Badge on Corridor */}
            <div className="relative z-10 self-center bg-emerald-600/95 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" />
              <span>{distanceKm} km • {vehicleType} • {travelTimeMinutes} mins driving</span>
            </div>

            {/* Bottom Destination Marker (Hope Food Bank, Benz Circle) */}
            <div className="relative z-10 self-end flex items-center gap-3">
              <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-rose-400 font-bold uppercase">Destination (Recipient NGO)</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <span className="font-bold">{destinationName}</span>
              </div>
              <div className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canonical Metrics & Calculation Formula Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Distance</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 font-display">{distanceKm} km</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle</span>
            <span className="text-sm sm:text-base font-bold text-slate-800 font-display">{vehicleType}</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Driving Time</span>
            <span className="text-sm sm:text-base font-bold text-teal-700 font-display">{travelTimeMinutes} minutes</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Handling Buffer</span>
            <span className="text-sm sm:text-base font-bold text-slate-700 font-display">{handlingTimeMinutes} minutes</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2 bg-emerald-50/80 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Total ETA</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-800 font-display">{totalTimeMinutes} minutes</span>
          </div>
        </div>

        {/* Local Formula Annotation */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1.5">
          <div>
            <span className="font-semibold text-slate-700">Route Formula: </span>
            <code className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
              totalMinutes = (distanceKm / vehicleSpeedKmPerHour) * 60 + 10
            </code>
          </div>
          <div className="text-[10px] text-slate-400">
            Canonical Scenario: 3.2 km @ 20 km/h + 10m buffer = 20 minutes
          </div>
        </div>
      </div>
    </div>
  );
};
