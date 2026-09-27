import React, { useEffect, useRef } from 'react';
import { 
  Navigation, 
  Truck, 
  MapPin
} from 'lucide-react';
import L from 'leaflet';

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
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset previous instance if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // 1. Initialize Leaflet Map centered on Vijayawada corridor
      const map = L.map(mapContainerRef.current, {
        center: [16.5069, 80.6425],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // 2. OpenStreetMap High-Resolution Street Tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // 3. Custom Origin Marker (Kitchen Hub)
      const originIcon = L.divIcon({
        className: 'custom-origin-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(16, 185, 129, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #059669; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); color: white;">
              <span style="font-size: 16px;">👨‍🍳</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const originMarker = L.marker([CANONICAL_ORIGIN.lat, CANONICAL_ORIGIN.lng], { icon: originIcon }).addTo(map);
      originMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px 6px; min-width: 170px;">
          <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Origin (Kitchen Hub)</div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 3px;">${originName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">MG Road Transit Hub, Vijayawada</div>
        </div>
      `);

      // 4. Custom Destination Marker (Recipient NGO Shelter)
      const destIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(225, 29, 72, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 36px; height: 36px; border-radius: 12px; background: #e11d48; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); color: white;">
              <span style="font-size: 16px;">📍</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const destMarker = L.marker([CANONICAL_DESTINATION.lat, CANONICAL_DESTINATION.lng], { icon: destIcon }).addTo(map);
      destMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px 6px; min-width: 170px;">
          <div style="font-size: 10px; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 0.5px;">Destination (Recipient NGO)</div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 3px;">${destinationName}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Benz Circle Partner Shelter, Vijayawada</div>
        </div>
      `);

      // 5. In-Transit Delivery Vehicle Badge
      const midPoint = CANONICAL_ROUTE_PATH[1] || CANONICAL_ORIGIN;
      const vehicleIcon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: `
          <div style="display: flex; align-items: center; gap: 5px; background: #0f172a; color: white; padding: 5px 10px; border-radius: 9999px; border: 2px solid #10b981; box-shadow: 0 8px 16px rgba(0,0,0,0.35); font-size: 11px; font-weight: 800; white-space: nowrap;">
            <span>🚚</span>
            <span>${vehicleType} &bull; ${travelTimeMinutes} mins driving</span>
          </div>
        `,
        iconSize: [140, 28],
        iconAnchor: [70, 14],
      });
      L.marker([midPoint.lat, midPoint.lng], { icon: vehicleIcon }).addTo(map);

      // 6. Visual Route Polyline (Corridor through Vijayawada)
      const latLngs: [number, number][] = CANONICAL_ROUTE_PATH.map(p => [p.lat, p.lng]);
      const polyline = L.polyline(latLngs, {
        color: '#059669',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // 7. Auto-fit bounds
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      mapInstanceRef.current = map;

      // Invalidate size once rendered to ensure sharp, complete tile rendering
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn('Leaflet Live Map initialization error:', err);
    }
  }, [originName, destinationName, vehicleType, travelTimeMinutes]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed flex items-center flex-wrap gap-1.5">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">Transit Corridor:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 font-bold whitespace-normal">
              {originName}
            </span>
            <span className="text-slate-400 font-black px-0.5">&rarr;</span>
            <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200/80 font-bold whitespace-normal">
              {destinationName}
            </span>
          </div>
        </div>

        {/* Live Map Status Badge */}
        <div className="shrink-0 self-start sm:self-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Real Map &bull; Vijayawada
          </span>
        </div>
      </div>

      {/* Real Interactive Map Display */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden bg-slate-100">
        <div
          ref={mapContainerRef}
          className="w-full h-full z-10"
          aria-label="Interactive Live Map of Vijayawada"
        />
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
          <div className="text-[10px] text-slate-500 font-medium">
            Live Calculation: {distanceKm} km with {vehicleType} + {handlingTimeMinutes}m buffer = <strong className="text-emerald-700">{totalTimeMinutes} mins</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
