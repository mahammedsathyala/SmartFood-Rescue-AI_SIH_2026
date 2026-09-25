import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Bike, 
  Car, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Camera, 
  Upload, 
  Check, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Fuel
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DeliveryRoute, 
  FoodBatch, 
  DonationRequest, 
  NGOPartner, 
  RouteStep, 
  UserRole 
} from '../types';
import { calculateRouteTime } from '../services/storage';

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
    { step: 5, label: 'In Transit', desc: 'En route via Benz Circle corridor' },
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
            <span className="text-xs text-slate-400">Vijayawada Safe Corridor</span>
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
            {/* Mock Map View */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Live Transit Corridor Simulation (Vijayawada)
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Corridor Status: Safe
                </span>
              </div>

              {/* Graphical SVG / Mock Map Interface */}
              <div className="relative h-64 sm:h-72 bg-linear-to-br from-slate-900 via-slate-800 to-teal-950 p-6 flex flex-col justify-between overflow-hidden">
                {/* Background Street Grid Effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 80 180 Q 220 70 420 120"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Top Origin Marker */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase">Origin (Kitchen Hub)</span>
                    <span className="font-bold">{currentRoute.origin}</span>
                  </div>
                </div>

                {/* Floating Distance Badge on Route */}
                <div className="relative z-10 self-center bg-emerald-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{distanceKm} km • ~{timeCalc.totalTimeMinutes} mins</span>
                </div>

                {/* Bottom Destination Marker */}
                <div className="relative z-10 self-end flex items-center gap-3">
                  <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs text-right">
                    <span className="text-[10px] text-teal-400 font-bold block uppercase">Destination (Recipient NGO)</span>
                    <span className="font-bold">{currentRoute.destination}</span>
                  </div>
                  <div className="p-2.5 bg-teal-500 text-white rounded-2xl shadow-lg shadow-teal-500/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Route Computation Metrics Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Route Distance</span>
                  <span className="text-base font-extrabold text-slate-900 font-display">{distanceKm} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit Time</span>
                  <span className="text-base font-bold text-teal-700 font-display">{timeCalc.travelTimeMinutes} mins</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Handling Buffer</span>
                  <span className="text-base font-bold text-slate-700 font-display">{timeCalc.handlingTimeMinutes} mins</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Arrival</span>
                  <span className="text-base font-extrabold text-emerald-700 font-display">{timeCalc.estimatedArrival}</span>
                </div>
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
                <span className="text-[10px] text-emerald-700 font-bold">Auto AP 16 TX 4920</span>
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
