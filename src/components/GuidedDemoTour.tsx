import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Minimize2, 
  Maximize2,
  TrendingUp,
  Package,
  Cpu,
  ShieldCheck,
  Building2,
  Navigation
} from 'lucide-react';
import { NavigationTab, UserRole } from '../types';

export interface TourStep {
  step: number;
  tab: NavigationTab;
  recommendedRole: UserRole;
  title: string;
  icon: React.ReactNode;
  tagline: string;
  evaluatorNote: string;
  keyMetric: string;
}

interface GuidedDemoTourProps {
  currentTab: NavigationTab;
  onNavigateTab: (tab: NavigationTab) => void;
  onSwitchRole?: (role: UserRole) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedDemoTour: React.FC<GuidedDemoTourProps> = ({
  currentTab,
  onNavigateTab,
  onSwitchRole,
  isOpen,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const steps: TourStep[] = [
    {
      step: 1,
      tab: 'demand-forecast',
      recommendedRole: 'Kitchen Staff',
      title: '1. AI Demand Forecasting',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      tagline: 'Prevent overproduction before cooking starts',
      evaluatorNote: 'Machine learning predicts student attendance based on exam schedules, weather, and day of week to recommend optimal preparation units.',
      keyMetric: '295 Forecasted vs 310 Prep Units (95.2% Accuracy)'
    },
    {
      step: 2,
      tab: 'food-batches',
      recommendedRole: 'Kitchen Staff',
      title: '2. Surplus Batch Registration',
      icon: <Package className="w-4 h-4 text-teal-400" />,
      tagline: 'Instant weight and meal equivalent logging',
      evaluatorNote: 'Kitchen managers log unconsumed surplus in seconds with dynamic remaining safe consumption countdown and packaging status.',
      keyMetric: 'Active Batch: 15.5 kg Mixed Veg Curry & Rice'
    },
    {
      step: 3,
      tab: 'iot-simulator',
      recommendedRole: 'Administrator',
      title: '3. Virtual IoT Sensor Telemetry',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      tagline: 'Real-time cold-chain & VOC freshness monitoring',
      evaluatorNote: 'Simulated smart containers measure internal core temperature, ambient humidity, and methane gas to prevent foodborne illness.',
      keyMetric: 'Core Temp: 62.4°C • Methane/VOC: 18 ppm (Safe)'
    },
    {
      step: 4,
      tab: 'quality-check',
      recommendedRole: 'Kitchen Staff',
      title: '4. Automated Safety & Quality Gate',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      tagline: 'FSSAI compliance scoring before NGO offer',
      evaluatorNote: 'Combines IoT telemetry and visual condition into a certified 0-100 safety score. Food below safe threshold is blocked from donation.',
      keyMetric: 'Quality Score: 94/100 (Safe for Redistribution)'
    },
    {
      step: 5,
      tab: 'ngo-matching',
      recommendedRole: 'NGO Partner',
      title: '5. Multi-Criteria Shelter Matching',
      icon: <Building2 className="w-4 h-4 text-teal-400" />,
      tagline: 'Optimal shelter pairing within safe radius',
      evaluatorNote: 'Matches batch size against verified local shelter beneficiary capacity, dietary requirements, and shortest transit times.',
      keyMetric: 'Matched: Hope Food Bank (3.2 km, 120 People)'
    },
    {
      step: 6,
      tab: 'route-planning',
      recommendedRole: 'Delivery Partner',
      title: '6. Live Route Dispatch & Transit',
      icon: <Navigation className="w-4 h-4 text-blue-400" />,
      tagline: 'Turn-by-turn navigation & recipient sign-off',
      evaluatorNote: 'Interactive Google Maps route from Canteen hub to shelter with live ETA countdown, traffic simulation, and digital handover.',
      keyMetric: 'ETA: 18 mins • Safe Delivery Window: 2h 45m left'
    }
  ];

  // Determine current active step index based on current tab
  const activeStepIndex = steps.findIndex(s => s.tab === currentTab);
  const currentStep = activeStepIndex !== -1 ? steps[activeStepIndex] : steps[0];
  const activeIndex = activeStepIndex !== -1 ? activeStepIndex : 0;

  if (!isOpen) return null;

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % steps.length;
    const nextStep = steps[nextIdx];
    onNavigateTab(nextStep.tab);
    if (onSwitchRole) onSwitchRole(nextStep.recommendedRole);
  };

  const handlePrev = () => {
    const prevIdx = activeIndex === 0 ? steps.length - 1 : activeIndex - 1;
    const prevStep = steps[prevIdx];
    onNavigateTab(prevStep.tab);
    if (onSwitchRole) onSwitchRole(prevStep.recommendedRole);
  };

  const handleJump = (step: TourStep) => {
    onNavigateTab(step.tab);
    if (onSwitchRole) onSwitchRole(step.recommendedRole);
  };

  // Minimized floating pill
  if (isMinimized) {
    return (
      <aside aria-label="Demo walkthrough controls" className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 text-white border border-emerald-500/40 shadow-2xl hover:bg-slate-800 transition-all group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400">SIH Walkthrough Mode</span>
          <span className="text-[11px] text-slate-400 font-mono">({activeIndex + 1}/6)</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-1" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Demo walkthrough controls" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-xl w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-5">
      {/* Glow highlight */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                SIH Evaluator Guided Tour
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                Step {activeIndex + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Step Indicators */}
      <div className="grid grid-cols-6 gap-1.5 my-3">
        {steps.map((st, i) => (
          <button
            key={st.step}
            onClick={() => handleJump(st)}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex
                ? 'bg-linear-to-r from-emerald-400 to-teal-400 shadow-xs shadow-emerald-400/50'
                : i < activeIndex
                ? 'bg-emerald-600/60'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title={st.title}
          />
        ))}
      </div>

      {/* Active Step Content */}
      <div className="py-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
            {currentStep.icon}
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-white">
              {currentStep.title}
            </h4>
            <div className="text-[11px] text-emerald-300 font-medium">
              {currentStep.tagline}
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <span className="font-bold text-slate-200">Judges Talking Point: </span>
          {currentStep.evaluatorNote}
        </p>

        {/* Live Scenario Metric Tag */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300">
          <span className="font-medium">Live Canonical State:</span>
          <span className="font-mono font-bold">{currentStep.keyMetric}</span>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Role: <span className="text-white font-medium">{currentStep.recommendedRole}</span>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <span>{activeIndex === steps.length - 1 ? 'Restart Walkthrough' : 'Next Stage'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
