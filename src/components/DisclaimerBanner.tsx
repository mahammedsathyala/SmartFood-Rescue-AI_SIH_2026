import React from 'react';
import { Cpu, ShieldAlert, AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'iot' | 'safety' | 'warning';
  customMessage?: string;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  type = 'iot',
  customMessage,
  className = ''
}) => {
  if (type === 'iot') {
    return (
      <div className={`bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border border-teal-200/80 rounded-xl p-3.5 sm:p-4 text-teal-950 flex items-start gap-3 shadow-xs ${className}`}>
        <div className="p-2 bg-teal-100 rounded-lg shrink-0 mt-0.5 text-teal-700">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold text-teal-900 block sm:inline mr-1">
            Software Simulation Mode:
          </span>
          {customMessage || "This prototype uses simulated IoT data. In real deployment, the platform can integrate with temperature sensors, weighing systems, smart cold-storage units, cameras, or existing kitchen-management APIs."}
        </div>
      </div>
    );
  }

  if (type === 'safety') {
    return (
      <div className={`bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 sm:p-4 text-amber-950 flex items-start gap-3 shadow-xs ${className}`}>
        <div className="p-2 bg-amber-100 rounded-lg shrink-0 mt-0.5 text-amber-700">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold text-amber-900 block sm:inline mr-1">
            Food Safety & Ethical Redistribution Notice:
          </span>
          {customMessage || "This AI-assisted quality indicator is a decision-support tool only. It does not certify food safety. Final approval for redistribution must be given by authorised kitchen staff or a qualified food-safety officer."}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-rose-50 border border-rose-200 rounded-xl p-3.5 sm:p-4 text-rose-950 flex items-start gap-3 ${className}`}>
      <div className="p-2 bg-rose-100 rounded-lg shrink-0 mt-0.5 text-rose-700">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm leading-relaxed">
        <span className="font-semibold text-rose-900 block sm:inline mr-1">
          Attention Required:
        </span>
        {customMessage}
      </div>
    </div>
  );
};
