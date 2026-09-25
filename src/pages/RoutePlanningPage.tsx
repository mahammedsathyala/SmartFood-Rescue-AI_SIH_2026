import React, { useState } from 'react';
import { 
  Truck, 
  Bike, 
  Car, 
  Camera, 
  Check,
  MapPin,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DeliveryRoute, 
  FoodBatch, 
  DonationRequest, 
  NGOPartner, 
  RouteStep, 
  UserRole,
  AppSettings
} from '../types';
import { calculateRouteTime } from '../services/storage';
import { GoogleRouteMap } from '../components/GoogleRouteMap';

interface RoutePlanningPageProps {
  routes: DeliveryRoute[];
  batches: FoodBatch[];
  donations: DonationRequest[];
  ngos: NGOPartner[];
  activeRole: UserRole;
  selectedDonationIdInitially?: string;
  onUpdateRoute: (route: DeliveryRoute) => void;
  onUpdateBatch: (batch: FoodBatch) => void;
  onUpdateDonation: (donation: DonationRequest) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  settings?: AppSettings | null;
}

export const RoutePlanningPage: React.FC<RoutePlanningPageProps> = ({
  routes,
  batches,
  donations,
  ngos,
  activeRole,
  selectedDonationIdInitially,
  onUpdateRoute,
  onUpdateBatch,
  onUpdateDonation,
  showToast,
  settings
}) => {
  // Select active route or default canonical route
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    routes[0]?.id || 'ROUTE-2026-001'
  );

  const currentRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const currentBatch = batches.find(b => b.id === currentRoute?.batchId) || batches[0];
  const currentNgo = ngos.find(n => n.id === currentRoute?.ngoId) || ngos[0];

  // Vehicle selector
  const [vehicle, setVehicle] = useState<'Bike' | 'Auto' | 'Van' | 'Refrigerated Van'>(
    currentRoute?.vehicleType || 'Auto'
  );

  // Driver assign modal / fields
  const [driverName, setDriverName] = useState(currentRoute?.driverName || 'Suresh Kumar');
  const [driverPhone, setDriverPhone] = useState(currentRoute?.driverPhone || '+91 98499 12345');
  const [proofImage, setProofImage] = useState<string>(
    currentRoute?.proofImage || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'
  );

  // Speed matrix for vehicles (default 20 km/h)
  const vehicleSpeeds = {
    'Bike': 22,
    'Auto': 20,
    'Van': 25,
    'Refrigerated Van': 20
  };

  // Route calculation formula: (dist / 20) * 60 + 10
  const distanceKm = currentRoute?.distanceKm || 3.2;
  const speed = vehicleSpeeds[vehicle] || 20;
  const timeCalc = calculateRouteTime(distanceKm, speed, 10);

  // Steps definition
  const steps: { step: RouteStep; label: string; desc: string }[] = [
    { step: 1, label: 'Pickup Requested', desc: 'Kitchen triggered redistribution order' },
    { step: 2, label: 'NGO Accepted', desc: 'Shelter coordinator approved delivery slot' },
    { step: 3, label: 'Driver Assigned', desc: `${driverName} (${vehicle}) assigned` },
    { step: 4, label: 'Food Collected', desc: 'Insulated hot containers loaded at canteen' },
    { step: 5, label: 'In Transit', desc: `En route to ${currentRoute?.destination || 'Shelter'}` },
    { step: 6, label: 'Delivered', desc: 'Handover complete & receipt acknowledged' },
  ];

  const currentStep = currentRoute?.currentStep || 6;

  // Advance step handler
  const advanceStep = (targetStep: RouteStep) => {
    if (!currentRoute) return;

    const isDelivered = targetStep === 6;

    const updatedRoute: DeliveryRoute = {
      ...currentRoute,
      vehicleType: vehicle,
      driverName,
      driverPhone,
      currentStep: targetStep,
      completedAt: isDelivered ? new Date().toISOString() : currentRoute.completedAt
    };

    onUpdateRoute(updatedRoute);

    // Update batch and donation request status
    if (isDelivered) {
      if (currentBatch) {
        onUpdateBatch({
          ...currentBatch,
          donationStatus: 'Delivered',
          assignedDriver: `${driverName} (${vehicle})`
        });
      }
      const matchedDonation = donations.find(d => d.id === currentRoute.donationId || d.batchId === currentRoute.batchId);
      if (matchedDonation) {
        onUpdateDonation({
          ...matchedDonation,
          status: 'Delivered'
        });
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      showToast('Delivery Completed!', `14 kg of food delivered safely to ${currentRoute.ngoName}. 56 meals saved!`, 'success');
    } else {
      const stepNames = ['', 'Pickup Requested', 'NGO Accepted', 'Driver Assigned', 'Food Collected', 'In Transit', 'Delivered'];
      showToast('Dispatch Updated', `Step advanced to: ${stepNames[targetStep]}`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              Time-Critical Redistribution
            </span>
            <span className="text-xs text-slate-400">{settings?.city ? `${settings.city} Safe Corridor` : 'Safe Transit Corridor'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Time-Aware Route Planning & Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Time-Aware Route Planning estimates delivery feasibility before the configured redistribution deadline.
          </p>
        </div>

        {/* Route Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Select Dispatch Route:</label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
          >
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.destination} ({r.distanceKm} km) - {r.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Route Details, Mock Map & Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Google Map & Transit Corridor View (Interactive Google Maps when Demo Key is configured, Simulation Mode fallback) */}
            <GoogleRouteMap
              originName={currentRoute.origin}
              destinationName={currentRoute.destination}
              distanceKm={distanceKm}
              vehicleType={vehicle}
              travelTimeMinutes={timeCalc.travelTimeMinutes}
              handlingTimeMinutes={timeCalc.handlingTimeMinutes}
              totalTimeMinutes={timeCalc.totalTimeMinutes}
            />

            {/* Manual Origin & Destination Location Configurator */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Transit Corridor Endpoints & Distance (Manual Entry)</span>
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Custom Location & Distance Mode
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Origin (Kitchen Hub)
                  </label>
                  <input
                    type="text"
                    value={currentRoute.origin}
                    onChange={(e) => onUpdateRoute({ ...currentRoute, origin: e.target.value })}
                    placeholder="Enter pickup address..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Drop-off Destination (NGO Shelter)
                  </label>
                  <input
                    type="text"
                    value={currentRoute.destination}
                    onChange={(e) => onUpdateRoute({ ...currentRoute, destination: e.target.value })}
                    placeholder="Enter destination address..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corridor Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="100"
                    value={currentRoute.distanceKm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRoute({ ...currentRoute, distanceKm: isNaN(val) ? 0 : val });
                    }}
                    placeholder="e.g. 3.2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Quick Distance Presets */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500">Quick Distance Presets:</span>
                {[
                  { label: '2.0 km (Local)', val: 2.0 },
                  { label: '3.2 km (Standard)', val: 3.2 },
                  { label: '5.5 km (Cross-Town)', val: 5.5 },
                  { label: '8.0 km (Suburban)', val: 8.0 },
                  { label: '12.0 km (Express)', val: 12.0 },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => {
                      onUpdateRoute({ ...currentRoute, distanceKm: p.val });
                      showToast('Distance Updated', `Transit distance set to ${p.val} km. ETA recalculated!`, 'info');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      currentRoute.distanceKm === p.val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    onUpdateRoute({
                      ...currentRoute,
                      origin: 'Smart College Canteen, MG Road, Vijayawada',
                      destination: 'Hope Food Bank, Benz Circle, Vijayawada',
                      distanceKm: 3.2
                    });
                    showToast('Vijayawada Demo Loaded', 'Corridor set: MG Road → Benz Circle (3.2 km).', 'success');
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer sm:ml-auto flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>Load Vijayawada Demo Corridor (3.2 km)</span>
                </button>
              </div>
            </div>

            {/* Vehicle Selection & Specs */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Select Dispatch Vehicle Type
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { type: 'Auto' as const, label: 'Three-Wheeler Auto', speed: '20 km/h', icon: <Car className="w-5 h-5" /> },
                  { type: 'Bike' as const, label: 'Delivery Bike', speed: '22 km/h', icon: <Bike className="w-5 h-5" /> },
                  { type: 'Van' as const, label: 'Cargo Delivery Van', speed: '25 km/h', icon: <Truck className="w-5 h-5" /> },
                  { type: 'Refrigerated Van' as const, label: 'Cold-Chain Van', speed: '20 km/h', icon: <Truck className="w-5 h-5 text-teal-600" /> }
                ].map((v) => (
                  <button
                    key={v.type}
                    type="button"
                    onClick={() => {
                      setVehicle(v.type);
                      showToast('Vehicle Updated', `Selected ${v.label} (Base speed: ${v.speed}).`, 'info');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      vehicle === v.type
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="p-2 bg-white rounded-xl w-fit shadow-2xs text-slate-700 mb-2">
                      {v.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{v.label}</span>
                      <span className="text-[10px] text-slate-500">{v.speed} avg</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-slate-500 italic">
                Formula: <code className="font-mono text-emerald-700">travelTimeMinutes = (distanceKm / vehicleSpeedKmPerHour) × 60 + handlingBufferMinutes</code> (Default Auto: 3.2km @ 20 km/h + 10m buffer = 19.6m ≈ 20 mins)
              </div>
            </div>
          </div>

          {/* Right Column: 6-Step Timeline & Driver Control (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Progress State Machine */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Logistics Dispatch Timeline
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step {currentStep} of 6
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {steps.map((st) => {
                  const isDone = st.step <= currentStep;
                  const isCurrent = st.step === currentStep;

                  return (
                    <div key={st.step} className="flex items-start gap-3 relative">
                      {/* Step Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isDone ? <Check className="w-4 h-4" /> : st.step}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs sm:text-sm ${
                            isCurrent ? 'text-emerald-900' : isDone ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-md">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons to Advance Steps */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Dispatch Transition Controls:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => advanceStep(3)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    3. Assign Driver
                  </button>

                  <button
                    type="button"
                    onClick={() => advanceStep(4)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    4. Food Collected
                  </button>

                  <button
                    type="button"
                    onClick={() => advanceStep(5)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    5. Start Transit
                  </button>

                  <button
                    type="button"
                    onClick={() => advanceStep(6)}
                    className="p-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    6. Mark Delivered ✓
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Proof & Driver Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Driver & Delivery Proof</span>
                <span className="text-[10px] text-emerald-700 font-bold">{vehicle} • AP 16 TX 4920</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <span className="font-bold text-slate-800">{driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-bold text-slate-800">{driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Organization:</span>
                  <span className="font-bold text-teal-800">{currentRoute.ngoName}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Delivery Confirmation Photo:
                </label>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100 group">
                  <img
                    src={proofImage}
                    alt="Delivery Handover Proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold flex items-center gap-1">
                      <Camera className="w-4 h-4" /> Change Proof Photo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
