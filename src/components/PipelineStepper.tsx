import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShieldCheck, 
  Building2, 
  Navigation,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { NavigationTab, FoodBatch, DonationRequest, VirtualIoTSensorData } from '../types';

interface PipelineStepperProps {
  batches: FoodBatch[];
  donations: DonationRequest[];
  iotData: VirtualIoTSensorData | null;
  onNavigate: (tab: NavigationTab) => void;
  locationCity?: string;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  batches,
  donations,
  iotData,
  onNavigate,
  locationCity
}) => {
  const activeBatchesCount = batches.filter(b => b.remainingKg > 0).length;
  const pendingDonation = donations.find(d => d.status === 'Offered' || d.status === 'Pending NGO Response' || d.status === 'Accepted');
  const tempSafe = (iotData?.temperature || 62.4) >= 60 || (iotData?.temperature || 62.4) <= 5;

  const steps = [
    {
      num: 1,
      tab: 'demand-forecast' as NavigationTab,
      label: 'AI Forecast',
      sub: '295 Planned Meals',
      status: 'Ready',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
    },
    {
      num: 2,
      tab: 'food-batches' as NavigationTab,
      label: 'Surplus Batches',
      sub: `${activeBatchesCount} Active Batch${activeBatchesCount !== 1 ? 'es' : ''}`,
      status: activeBatchesCount > 0 ? 'Active' : 'Empty',
      icon: <Package className="w-4 h-4 text-teal-600" />,
      color: 'border-teal-500 bg-teal-50/50 text-teal-800'
    },
    {
      num: 3,
      tab: 'quality-check' as NavigationTab,
      label: 'IoT Safety Gate',
      sub: `${iotData?.temperature ? `${iotData.temperature}°C` : '62.4°C'} (${tempSafe ? 'Safe' : 'Check'})`,
      status: '94% Certified',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-600" />,
      color: 'border-cyan-500 bg-cyan-50/50 text-cyan-800'
    },
    {
      num: 4,
      tab: 'ngo-matching' as NavigationTab,
      label: 'Shelter Match',
      sub: pendingDonation?.ngoName || 'Hope Food Bank',
      status: pendingDonation ? pendingDonation.status : 'Matched',
      icon: <Building2 className="w-4 h-4 text-indigo-600" />,
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-800'
    },
    {
      num: 5,
      tab: 'route-planning' as NavigationTab,
      label: 'Route Dispatch',
      sub: `${locationCity || 'Hub'} Transit`,
      status: 'In Transit',
      icon: <Navigation className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-500 bg-blue-50/50 text-blue-800'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            End-to-End Food Rescue Pipeline
          </h4>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            (Click any stage to view live module)
          </span>
        </div>
        <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Sync Status: 100% Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {steps.map((st, idx) => (
          <button
            key={st.num}
            onClick={() => onNavigate(st.tab)}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {st.num}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {st.label}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-slate-100 shadow-2xs group-hover:scale-110 transition-transform">
                  {st.icon}
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-600 truncate">
                {st.sub}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-mono">
                {st.status}
              </span>
              <span className="text-emerald-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* Step connector arrow on desktop */}
            {idx < 4 && (
              <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-300">
                ›
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
