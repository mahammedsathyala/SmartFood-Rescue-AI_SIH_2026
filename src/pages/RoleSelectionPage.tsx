import React from 'react';
import { 
  ChefHat, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => void;
  onBackToHome: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onSelectRole,
  onBackToHome
}) => {
  const roles: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    gradient: string;
    badgeColor: string;
  }[] = [
    {
      role: 'Kitchen Staff',
      title: 'Kitchen & Canteen Staff',
      description: 'Records food batches, runs forecasts, monitors alerts, and submits batches for review. Can record an authorised approval decision according to institutional policy.',
      icon: <ChefHat className="w-8 h-8 text-emerald-600" />,
      features: [
        'AI-Assisted Demand Forecasting Baseline',
        'Food Batch Registration & Surplus Tracking',
        'Virtual Storage Telemetry Monitoring',
        'Authorised Redistribution Review & Approval'
      ],
      gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      role: 'NGO Partner',
      title: 'NGO & Shelter Recipient',
      description: 'Receive real-time surplus notifications, review nutritional details, and accept/reject food offers.',
      icon: <HeartHandshake className="w-8 h-8 text-teal-600" />,
      features: [
        'Nearby Food Surplus Matching Radar',
        'Automated Acceptance & Rejection Simulation',
        'Capacity & Dietary Category Preferences',
        'Distribution Receipt Confirmations'
      ],
      gradient: 'from-teal-500/10 to-cyan-500/10 hover:border-teal-500',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      role: 'Delivery Partner',
      title: 'Logistics & Delivery Volunteer',
      description: 'Accept dispatch orders, review travel time vs use-by deadlines, and record handover proofs.',
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      features: [
        'Vijayawada Route Time Calculator',
        'Multi-Vehicle Selection (Auto/Van/Bike)',
        'Live 6-Step Transit State Machine',
        'Photo Proof Upload & Delivery Completion'
      ],
      gradient: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'Administrator',
      title: 'Sustainability Administrator',
      description: 'Supervisory access to configure policy thresholds, review compliance reports, and oversee the prototype approval workflow.',
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
      features: [
        'Executive Dashboard & 7-Day Analytics',
        'Estimated Economic & Carbon Impact Accounting',
        'Policy Thresholds & Temperature Limits',
        'Printable Compliance Audits & PDF/CSV Export'
      ],
      gradient: 'from-purple-500/10 to-pink-500/10 hover:border-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto w-full">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Location: Vijayawada, AP</span>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH26234 Role-Based Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Select Your Role to Continue
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Login as <strong className="text-slate-800">“Demo User”</strong> under any role to experience the complete institutional food rescue ecosystem.
          </p>
        </div>

        {/* 4 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((r) => (
            <div
              key={r.role}
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-slate-100/50 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                    {r.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${r.badgeColor}`}>
                    {r.role}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 font-display">
                  {r.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {r.description}
                </p>

                <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
                  {r.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => onSelectRole(r.role)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-emerald-600/20 cursor-pointer"
                >
                  <span>Continue as {r.role}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        SmartFood Rescue AI • Persistent localStorage State • Seamless Live Switching
      </div>
    </div>
  );
};
