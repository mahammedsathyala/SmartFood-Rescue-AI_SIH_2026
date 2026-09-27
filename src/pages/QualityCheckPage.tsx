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
  Camera,
  Sliders,
  Video
} from 'lucide-react';
import { FoodBatch, VirtualIoTSensorData, UserRole, QualityStatus, SpoilageClass, SpoilageDetectionResult } from '../types';
import { evaluateFoodQuality } from '../services/storage';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { QualityCamera } from '../components/QualityCamera';
import { useAppContext } from '../context/AppContext';

interface QualityCheckPageProps {
  batches?: FoodBatch[];
  iotData?: Map<string, VirtualIoTSensorData> | VirtualIoTSensorData;
  activeRole?: UserRole;
  selectedBatchIdInitially?: string;
  onUpdateBatch?: (batch: FoodBatch) => void;
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
  const context = useAppContext();
  const effectiveBatches = batches || context.batches;
  const effectiveRole = activeRole || context.activeRole;
  const effectiveUpdateBatch = onUpdateBatch || context.handleUpdateBatch;

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    selectedBatchIdInitially || effectiveBatches.find(b => b.remainingKg > 0)?.id || effectiveBatches[0]?.id || ''
  );

  const selectedBatch = effectiveBatches.find(b => b.id === selectedBatchId) || effectiveBatches[0];
  const [reviewerNote, setReviewerNote] = useState<string>('Visual inspection and temperature check verified on-site.');
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [lastDetection, setLastDetection] = useState<SpoilageDetectionResult | null>(null);

  // Auto-set appearance field and apply YOLOv8 ONNX deduction to the quality score
  const handleAiDetection = React.useCallback((result: SpoilageDetectionResult) => {
    setLastDetection(result);
    if (!selectedBatch || isManualOverride) return;

    const newAppearance = result.spoilageClass === 'Fresh' ? 'Normal' : 'Suspicious';

    if (
      selectedBatch.appearance !== newAppearance ||
      selectedBatch.aiSpoilageClass !== result.spoilageClass ||
      selectedBatch.aiSpoilageConfidence !== result.confidence
    ) {
      const updatedBatch: FoodBatch = {
        ...selectedBatch,
        appearance: newAppearance,
        aiSpoilageClass: result.spoilageClass,
        aiSpoilageConfidence: result.confidence
      };
      effectiveUpdateBatch(updatedBatch);
    }
  }, [selectedBatch, isManualOverride, effectiveUpdateBatch]);

  // Handle manual dropdown selection when override is toggled
  const handleManualClassChange = (selectedClass: SpoilageClass) => {
    if (!selectedBatch) return;
    const newAppearance = selectedClass === 'Fresh' ? 'Normal' : 'Suspicious';
    const updatedBatch: FoodBatch = {
      ...selectedBatch,
      appearance: newAppearance,
      aiSpoilageClass: selectedClass,
      aiSpoilageConfidence: 100
    };
    effectiveUpdateBatch(updatedBatch);
    showToast(
      'Manual Appearance Updated',
      `Batch appearance set to ${selectedClass} (${selectedClass === 'Fresh' ? '0' : selectedClass === 'Slightly Spoiled' ? '-15' : '-30'} pts deduction).`,
      'info'
    );
  };

  const batchIoT = React.useMemo(() => {
    if (iotData instanceof Map) {
      return iotData.get(selectedBatch?.id || '') || context.getBatchIoT(selectedBatch?.id);
    }
    if (iotData && typeof iotData === 'object' && 'temperature' in iotData) {
      return iotData;
    }
    return context.getBatchIoT(selectedBatch?.id);
  }, [iotData, selectedBatch, context]);

  // Run evaluation formula using per-batch IoT readings
  const evaluation = selectedBatch 
    ? evaluateFoodQuality(selectedBatch, batchIoT, 8) 
    : { score: 100, status: 'Safe for Human Review' as QualityStatus, deductions: [], positives: [] };

  const isAuthorized = effectiveRole === 'Kitchen Staff' || effectiveRole === 'Administrator';

  // Handle Approve for Donation
  const handleApprove = () => {
    if (!isAuthorized) {
      showToast('Unauthorized Role', `Only Kitchen Staff or Administrator can formally approve food redistribution. (Current role: ${effectiveRole})`, 'error');
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
      notes: `${selectedBatch.notes || ''} [Approved by ${effectiveRole}: ${reviewerNote}]`
    };

    effectiveUpdateBatch(updatedBatch);
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

    effectiveUpdateBatch(updatedBatch);
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
            {effectiveBatches.map(b => (
              <option key={b.id} value={b.id}>
                {b.foodItem} ({b.remainingKg} kg) - {b.id.slice(-9)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Visual Inspection — Powered by YOLOv8 ONNX Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl border border-indigo-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                AI Visual Inspection — Powered by YOLOv8 ONNX
              </h3>
              <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Edge WASM In-Browser
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Continuous live webcam analysis: Classifies spoilage (Fresh 0pts, Slightly Spoiled -15pts, Spoiled -30pts) with automatic quality gate calibration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsManualOverride(!isManualOverride)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isManualOverride
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/40'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isManualOverride ? 'Switch to AI Camera' : 'Manual Override'}</span>
          </button>
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
              <span>Sign-off Role: <strong>{effectiveRole}</strong> ({isAuthorized ? 'Authorized' : 'Viewer Only'})</span>
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

            {/* Visual Inspection Section: QualityCamera component or Manual Override Dropdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Food Appearance & Spoilage Gate
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManualOverride(!isManualOverride)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isManualOverride ? 'Use AI Camera' : 'Manual Override'}</span>
                </button>
              </div>

              {!isManualOverride ? (
                <QualityCamera
                  onDetection={handleAiDetection}
                  onManualOverride={() => setIsManualOverride(true)}
                  isManualOverride={isManualOverride}
                />
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Manual Appearance Selection
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Camera unavailable or manual inspection requested by operator.
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                      Manual Mode
                    </span>
                  </div>

                  {/* 3 Classes options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        class: 'Fresh' as SpoilageClass,
                        deduction: 0,
                        title: 'Fresh',
                        desc: 'Normal appearance & aroma (0 pts)'
                      },
                      {
                        class: 'Slightly Spoiled' as SpoilageClass,
                        deduction: 15,
                        title: 'Slightly Spoiled',
                        desc: 'Minor discoloration (-15 pts)'
                      },
                      {
                        class: 'Spoiled' as SpoilageClass,
                        deduction: 30,
                        title: 'Spoiled',
                        desc: 'Critical spoilage (-30 pts)'
                      }
                    ].map(opt => {
                      const isSelected = selectedBatch.aiSpoilageClass === opt.class || 
                        (!selectedBatch.aiSpoilageClass && opt.class === 'Fresh' && selectedBatch.appearance === 'Normal');
                      return (
                        <button
                          key={opt.class}
                          type="button"
                          onClick={() => handleManualClassChange(opt.class)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? opt.class === 'Fresh'
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20'
                                : opt.class === 'Slightly Spoiled'
                                ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-500/20'
                                : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-xs">
                            <span>{opt.title}</span>
                            <span className={`text-[10px] font-mono font-bold ${
                              opt.deduction === 0 ? 'text-emerald-700' : opt.deduction === 15 ? 'text-amber-700' : 'text-rose-700'
                            }`}>
                              {opt.deduction === 0 ? '0 pts' : `-${opt.deduction} pts`}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <label className="text-xs text-slate-600 font-semibold whitespace-nowrap">
                      Appearance Dropdown:
                    </label>
                    <select
                      value={selectedBatch.aiSpoilageClass || (selectedBatch.appearance === 'Suspicious' ? 'Spoiled' : 'Fresh')}
                      onChange={(e) => handleManualClassChange(e.target.value as SpoilageClass)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Fresh">Fresh — Normal (0 pts deduction)</option>
                      <option value="Slightly Spoiled">Slightly Spoiled — Suspicious (-15 pts deduction)</option>
                      <option value="Spoiled">Spoiled — Suspicious (-30 pts deduction)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Inputs Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Sensor Temp</span>
                <span className={`font-bold ${batchIoT.temperature > 8 ? 'text-rose-600' : 'text-teal-700'}`}>
                  {batchIoT.temperature.toFixed(1)}°C (Limit ≤8°C)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Packaging</span>
                <span className={`font-bold ${selectedBatch.packagingStatus === 'Damaged' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedBatch.packagingStatus}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  Appearance ({isManualOverride ? 'Manual' : 'YOLOv8 AI'})
                </span>
                <span className={`font-bold flex items-center justify-between ${
                  selectedBatch.aiSpoilageClass === 'Spoiled' || selectedBatch.appearance === 'Suspicious'
                    ? 'text-rose-600'
                    : selectedBatch.aiSpoilageClass === 'Slightly Spoiled'
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}>
                  <span>{selectedBatch.aiSpoilageClass || selectedBatch.appearance}</span>
                  {selectedBatch.aiSpoilageConfidence && !isManualOverride && (
                    <span className="text-[10px] font-mono font-normal text-slate-500">
                      {selectedBatch.aiSpoilageConfidence}%
                    </span>
                  )}
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
                <span className={`font-bold ${batchIoT.deviceStatus === 'Offline' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {batchIoT.deviceStatus}
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
