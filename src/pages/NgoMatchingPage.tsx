import React, { useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Snowflake, 
  Filter, 
  Sparkles, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  X,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import { 
  FoodBatch, 
  NGOPartner, 
  DonationRequest, 
  DonationStatus, 
  DeliveryRoute, 
  UserRole 
} from '../types';
import { matchNGOsForBatch } from '../services/storage';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface NgoMatchingPageProps {
  batches: FoodBatch[];
  ngos: NGOPartner[];
  donations: DonationRequest[];
  activeRole: UserRole;
  selectedBatchIdInitially?: string;
  onAddDonationRequest: (req: DonationRequest) => void;
  onUpdateDonationRequest: (req: DonationRequest) => void;
  onUpdateBatch: (batch: FoodBatch) => void;
  onProceedToRoutePlanning: (donationId: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const NgoMatchingPage: React.FC<NgoMatchingPageProps> = ({
  batches,
  ngos,
  donations,
  activeRole,
  selectedBatchIdInitially,
  onAddDonationRequest,
  onUpdateDonationRequest,
  onUpdateBatch,
  onProceedToRoutePlanning,
  showToast
}) => {
  // Find suitable batch
  const eligibleBatches = batches.filter(b => b.remainingKg > 0 && b.donationStatus !== 'Do Not Redistribute');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    selectedBatchIdInitially || eligibleBatches[0]?.id || batches[0]?.id || ''
  );

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  // Filters for NGOs
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL');
  const [requireRefrigeration, setRequireRefrigeration] = useState<boolean>(false);

  // Modal State for Sending Request
  const [requestModalNgo, setRequestModalNgo] = useState<NGOPartner | null>(null);
  const [pickupWindow, setPickupWindow] = useState('02:30 PM - 03:30 PM');
  const [notes, setNotes] = useState('Ground floor pantry loading ramp, insulated hot transport vessels.');

  // Run matching logic
  const rankedNGOs = selectedBatch ? matchNGOsForBatch(selectedBatch, ngos) : [];

  // Filtered Ranked NGOs
  const filteredNGOs = rankedNGOs.filter(ngo => {
    const withinDistance = ngo.distanceKm <= maxDistance;
    const matchesAvail = availabilityFilter === 'ALL' || ngo.currentAvailability === availabilityFilter;
    const matchesRef = !requireRefrigeration || ngo.hasRefrigeration;
    return withinDistance && matchesAvail && matchesRef;
  });

  const bestMatchNgo = filteredNGOs[0] || rankedNGOs[0];

  // Active donation request for current batch
  const currentDonation = donations.find(d => d.batchId === selectedBatchId);

  // Send Offer to NGO
  const handleOpenSendModal = (ngo: NGOPartner) => {
    setRequestModalNgo(ngo);
  };

  const handleConfirmSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalNgo || !selectedBatch) return;

    const newReqId = `REQ-${Date.now().toString().slice(-6)}`;
    const newDonation: DonationRequest = {
      id: newReqId,
      batchId: selectedBatch.id,
      ngoId: requestModalNgo.id,
      ngoName: requestModalNgo.name,
      foodItem: selectedBatch.foodItem,
      quantityKg: selectedBatch.remainingKg,
      preparationTime: selectedBatch.prepDateTime,
      deadline: selectedBatch.deadlineDateTime,
      pickupAddress: 'Smart College Canteen, MG Road, Vijayawada, AP',
      pickupWindow,
      qualityStatus: selectedBatch.qualityStatus,
      status: 'Offered',
      notes,
      createdAt: new Date().toISOString()
    };

    onAddDonationRequest(newDonation);
    onUpdateBatch({
      ...selectedBatch,
      donationStatus: 'Offered',
      matchedNgoId: requestModalNgo.id
    });

    setRequestModalNgo(null);
    showToast('Donation Offer Dispatched', `Surplus offer of ${selectedBatch.remainingKg} kg sent to ${requestModalNgo.name}.`, 'success');
  };

  // Simulate NGO Accept
  const handleSimulateAccept = (req: DonationRequest) => {
    const updated: DonationRequest = {
      ...req,
      status: 'Accepted'
    };
    onUpdateDonationRequest(updated);
    if (selectedBatch) {
      onUpdateBatch({
        ...selectedBatch,
        donationStatus: 'Accepted'
      });
    }
    showToast('NGO Accepted Offer!', `${req.ngoName} confirmed pickup of ${req.quantityKg} kg. Route dispatch unlocked.`, 'success');
  };

  // Simulate NGO Reject with automatic fallback to next best NGO
  const handleSimulateReject = (req: DonationRequest) => {
    // Find next best NGO
    const remainingEligible = rankedNGOs.filter(n => n.id !== req.ngoId && n.currentAvailability === 'Available');
    const fallbackNgo = remainingEligible[0] || rankedNGOs[1];

    const updated: DonationRequest = {
      ...req,
      status: 'Rejected',
      rejectionReason: 'Capacity filled with earlier donation / Volunteer team deployed elsewhere'
    };
    onUpdateDonationRequest(updated);

    showToast(
      'NGO Declined Offer',
      `${req.ngoName} unable to accept. AI re-routing to next best match: ${fallbackNgo?.name || 'Seva Shelter Home'} (Distance: ${fallbackNgo?.distanceKm} km).`,
      'warning'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Decision-Support Reminder */}
      <DisclaimerBanner 
        type="safety"
        customMessage="Surplus Redistribution Protocol: Verified Vijayawada partners receive notifications for batches marked 'Safe for Human Review'. Emergency fallback routing ensures zero food loss."
      />

      {/* Header and Batch Selection */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              Automated Redistribution Radar
            </span>
            <span className="text-xs text-slate-400">Vijayawada NGO Grid</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Surplus Food & NGO Partner Matching
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Algorithmically ranks verified food banks and shelters by distance (35%), capacity (25%), category (20%), and availability (20%).
          </p>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Selected Batch:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>
                {b.foodItem} ({b.remainingKg} kg) - {b.id.slice(-9)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Batch Summary & Current Request State */}
      {selectedBatch && (
        <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 sm:p-5 rounded-2xl border border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-800">{selectedBatch.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200">
                {selectedBatch.donationStatus}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {selectedBatch.foodItem} • {selectedBatch.remainingKg} kg ({selectedBatch.remainingMeals} Meals)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Prepared: {new Date(selectedBatch.prepDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
              Use-by Deadline: {new Date(selectedBatch.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
              Quality Status: <strong>{selectedBatch.qualityStatus}</strong>
            </p>
          </div>

          {/* Current Request Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentDonation && currentDonation.status === 'Offered' && (
              <>
                <button
                  type="button"
                  onClick={() => handleSimulateAccept(currentDonation)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simulate NGO Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateReject(currentDonation)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Simulate NGO Reject
                </button>
              </>
            )}

            {currentDonation && (currentDonation.status === 'Accepted' || currentDonation.status === 'Delivered') && (
              <button
                type="button"
                onClick={() => onProceedToRoutePlanning(currentDonation.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Delivery Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Max Distance:</span>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="accent-blue-600 cursor-pointer"
            />
            <span className="font-bold text-blue-700">{maxDistance} km</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={requireRefrigeration}
              onChange={(e) => setRequireRefrigeration(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-md"
            />
            <span>Requires Cold Storage Facility</span>
          </label>
        </div>

        <div className="text-slate-400 font-medium">
          Showing {filteredNGOs.length} ranked partners
        </div>
      </div>

      {/* Ranked NGO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNGOs.map((ngo, idx) => {
          const isTop = idx === 0 && (ngo.score || 0) >= 80;
          return (
            <div
              key={ngo.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative shadow-xs hover:shadow-md ${
                isTop 
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200'
              }`}
            >
              {isTop && (
                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Best Recommendation (Rank #1)</span>
                </div>
              )}

              {selectedBatch && ngo.capacityKg < selectedBatch.remainingKg && (
                <div className="mb-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Partial Capacity Available ({ngo.capacityKg} kg of {selectedBatch.remainingKg} kg) — suggest splitting batch between two NGOs.</span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 font-display">
                      {ngo.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{ngo.area}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-700">{ngo.distanceKm} km away</span>
                    </div>
                  </div>
                </div>

                {/* Score & Capacity Stats */}
                <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Match Score</span>
                    <span className="text-lg font-extrabold text-emerald-700 font-display">
                      {ngo.score}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Capacity</span>
                    <span className="text-lg font-extrabold text-teal-800 font-display">
                      {ngo.capacityKg} kg
                    </span>
                  </div>

                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Status</span>
                    <span className={`text-xs font-bold block mt-1 ${
                      ngo.currentAvailability === 'Available' ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {ngo.currentAvailability}
                    </span>
                  </div>
                </div>

                {/* Reasons for Recommendation */}
                {ngo.matchReasons && ngo.matchReasons.length > 0 && (
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Algorithm Matching Factors:
                    </span>
                    {ngo.matchReasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contact & Hours */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Contact: <strong>{ngo.contactPerson}</strong> <span className="text-[10px] text-slate-400 font-normal">(Demo / Simulated Contact)</span></span>
                    <span className="text-[11px] text-slate-400">★ {ngo.rating} Rating</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hours: {ngo.operatingHours}</span>
                    {ngo.hasRefrigeration && (
                      <span className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
                        <Snowflake className="w-3 h-3" /> Cold Storage
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${ngo.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Demo / Simulated Contact', `Simulated contact for ${ngo.contactPerson} at ${ngo.phone} (mock test only)`, 'info');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call NGO (Demo)</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenSendModal(ngo)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                    isTop
                      ? 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-900 hover:bg-emerald-600 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Donation Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Request Modal */}
      {requestModalNgo && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setRequestModalNgo(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dispatch Donation Offer
                </h3>
                <p className="text-xs text-slate-500">
                  Sending formal digital offer to <strong>{requestModalNgo.name}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSendRequest} className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Batch ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBatch.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Food Item:</span>
                  <span className="font-bold text-slate-900">{selectedBatch.foodItem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Offered Quantity:</span>
                  <span className="font-bold text-emerald-700">{selectedBatch.remainingKg} kg ({selectedBatch.remainingMeals} meals)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Safe Use-By Deadline:</span>
                  <span className="font-bold text-slate-800">{new Date(selectedBatch.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quality Assessment:</span>
                  <span className="font-bold text-teal-700">{selectedBatch.qualityStatus}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pickup Address (Kitchen Hub)
                </label>
                <input
                  type="text"
                  readOnly
                  value="Smart College Canteen, Near Kanaka Durga Varadhi, MG Road, Vijayawada"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Requested Pickup Window
                </label>
                <input
                  type="text"
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kitchen Dispatch Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRequestModalNgo(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Send Donation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
