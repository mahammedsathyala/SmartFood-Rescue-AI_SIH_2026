import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Thermometer, 
  Boxes, 
  FileText, 
  Lock, 
  UserCheck, 
  HeartHandshake, 
  Sparkles,
  ArrowRight,
  Eye,
  Camera
} from 'lucide-react';
import { FoodBatch, VirtualIoTSensorData, UserRole, QualityStatus } from '../types';
import { evaluateFoodQuality } from '../services/storage';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface QualityCheckPageProps {
  batches: FoodBatch[];
  iotData: VirtualIoTSensorData;
  activeRole: UserRole;
  selectedBatchIdInitially?: string;
  onUpdateBatch: (batch: FoodBatch) => void;
  onProceedToNgoMatching: (batchId: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const QualityCheckPage: React.FC<QualityCheckPageProps> = ({
  batches,
  iotData,
  activeRole,
  selectedBatchIdInitially,
  onUpdateBatch,
  onProceedToNgoMatching,
  showToast
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    selectedBatchIdInitially || batches.find(b => b.remainingKg > 0)?.id || batches[0]?.id || ''
  );

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const [reviewerNote, setReviewerNote] = useState<string>('Visual inspection and temperature check verified on-site.');

  // Run evaluation formula
  const evaluation = selectedBatch 
    ? evaluateFoodQuality(selectedBatch, iotData, 8) 
    : { score: 100, status: 'Safe for Human Review' as QualityStatus, deductions: [], positives: [] };

  const isAuthorized = activeRole === 'Kitchen Staff' || activeRole === 'Administrator';

  // Handle Approve for Donation
  const handleApprove = () => {
    if (!isAuthorized) {
      showToast('Unauthorized Role', `Only Kitchen Staff or Administrator can formally approve food redistribution. (Current role: ${activeRole})`, 'error');
      return;
    }

    if (evaluation.score < 50) {
      showToast('Quality Gate Blocked', 'Cannot approve food with safety score < 50. Mark as unsafe or re-inspect.', 'error');
      return;
    }

    const updatedBatch: FoodBatch = {
      ...selectedBatch,
      qualityScore: evaluation.score,
      qualityStatus: 'Safe for Human Review',
      donationStatus: selectedBatch.donationStatus === 'Delivered' ? 'Delivered' : 'Offered',
      notes: `${selectedBatch.notes || ''} [Approved by ${activeRole}: ${reviewerNote}]`
    };

    onUpdateBatch(updatedBatch);
    showToast('Quality Approval Granted', `Batch ${selectedBatch.id} marked eligible for NGO matching (Score: ${evaluation.score}/100).`, 'success');
  };

  // Handle Reject / Mark Unsafe
  const handleReject = () => {
    if (!isAuthorized) {
      showToast('Unauthorized Role', `Only Kitchen Staff or Administrator can reject food batches.`, 'error');
      return;
    }

    const updatedBatch: FoodBatch = {
      ...selectedBatch,
      qualityScore: evaluation.score,
      qualityStatus: 'Do Not Redistribute',
      donationStatus: 'Do Not Redistribute',
      notes: `${selectedBatch.notes || ''} [Rejected/Unsafe: ${reviewerNote}]`
    };

    onUpdateBatch(updatedBatch);
    showToast('Batch Rejected', `Batch ${selectedBatch.id} marked as unsafe for human consumption. Redistribution disabled.`, 'warning');
  };

  // Gauge circumference & stroke calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (evaluation.score / 100) * circumference;

  const scoreColor = evaluation.score >= 80 
    ? 'text-emerald-600 stroke-emerald-600' 
    : evaluation.score >= 50 
    ? 'text-amber-500 stroke-amber-500' 
    : 'text-rose-600 stroke-rose-600';

  return (
    <div className="space-y-6">
      {/* Mandatory Safety Notice Banner */}
      <DisclaimerBanner 
        type="safety"
        customMessage="This AI-assisted quality indicator is a decision-support tool only. It does not certify food safety. Final approval for redistribution must be given by authorised kitchen staff or a qualified food-safety officer."
      />

      {/* Header and Batch Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 px-2.5 py-0.5 rounded-full">
              Decision-Support Quality Engine
            </span>
            <span className="text-xs text-slate-400">Certified Safety Gate</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Food Quality Assessment & Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-references physical food attributes with virtual IoT sensor telemetry to evaluate redistribution safety.
          </p>
        </div>

        {/* Batch Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Select Batch to Inspect:
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

      {selectedBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quality Score Gauge & Status (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center relative">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Batch Quality Score
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {selectedBatch.id}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="relative my-6 flex items-center justify-center">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className={`transition-all duration-700 ${scoreColor}`}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-extrabold font-display ${evaluation.score >= 80 ? 'text-emerald-700' : evaluation.score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {evaluation.score}
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Out of 100
                </span>
              </div>
            </div>

            {/* Status Classification Badge */}
            <div className="w-full">
              <div className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border shadow-2xs ${
                evaluation.status === 'Safe for Human Review'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : evaluation.status === 'Needs Manual Inspection'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {evaluation.status}
              </div>

              {/* Action Recommendation */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 text-left">
                <strong>Recommended Next Step:</strong>{' '}
                {evaluation.score >= 80 ? (
                  <span>Batch passes all AI safety rules. Authorized kitchen staff may approve for immediate NGO matching.</span>
                ) : evaluation.score >= 50 ? (
                  <span>Temperature or packaging anomalies detected. Requires sensory physical verification prior to donation offer.</span>
                ) : (
                  <span>Critical safety violations identified. Strictly prohibit redistribution to protect recipient welfare.</span>
                )}
              </div>
            </div>

            {/* Role Verification Gate Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 w-full text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sign-off Role: <strong>{activeRole}</strong> ({isAuthorized ? 'Authorized' : 'Viewer Only'})</span>
            </div>
          </div>

          {/* Right: Inputs & Contributing Factors Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Quality Rule Engine Audit Breakdown
              </h3>
              <span className="text-xs text-slate-400">Baseline 100 Points</span>
            </div>

            {/* Inputs Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Sensor Temp</span>
                <span className={`font-bold ${iotData.temperature > 8 ? 'text-rose-600' : 'text-teal-700'}`}>
                  {iotData.temperature.toFixed(1)}°C (Limit ≤8°C)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Packaging</span>
                <span className={`font-bold ${selectedBatch.packagingStatus === 'Damaged' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedBatch.packagingStatus}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Appearance</span>
                <span className={`font-bold ${selectedBatch.appearance === 'Suspicious' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedBatch.appearance}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Storage Type</span>
                <span className={`font-bold ${selectedBatch.storageCondition === 'Improper' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedBatch.storageCondition}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Redistribution Deadline</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedBatch.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Sensor Gateway</span>
                <span className={`font-bold ${iotData.deviceStatus === 'Offline' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {iotData.deviceStatus}
                </span>
              </div>
            </div>

            {/* Deductions & Positives List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contributing Factor Deductions:
              </div>

              {evaluation.deductions.length > 0 ? (
                evaluation.deductions.map(d => (
                  <div key={d.id} className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold flex items-center justify-between">
                        <span>{d.name}</span>
                        <span className="text-rose-700 font-bold">-{d.points} pts</span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-0.5">{d.explanation}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No deduction penalties applied. Perfect cold-chain and packaging integrity.</span>
                </div>
              )}

              {/* Positives */}
              {evaluation.positives.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Verified Positive Quality Indicators:
                  </div>
                  <div className="space-y-1">
                    {evaluation.positives.map((pos, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviewer Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Inspector / Reviewer Note:
              </label>
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Log visual remarks, sensory comments, or recipient instructions..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Action Buttons for Authorized Roles */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {!isAuthorized && (
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Switch to Kitchen Staff or Admin to approve.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!isAuthorized}
                  className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Mark Unsafe (Reject)
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={!isAuthorized || evaluation.score < 50}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Approve for Donation
                </button>

                {selectedBatch.donationStatus !== 'Do Not Redistribute' && (
                  <button
                    type="button"
                    onClick={() => onProceedToNgoMatching(selectedBatch.id)}
                    className="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Proceed to NGO Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
