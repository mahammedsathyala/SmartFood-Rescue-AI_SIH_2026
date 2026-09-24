import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Boxes, 
  ShieldCheck, 
  HeartHandshake, 
  Navigation, 
  Leaf, 
  Coins, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  MapPin,
  Clock,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDashboard: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDashboard,
  onSelectRole
}) => {
  const problems = [
    {
      num: '01',
      title: 'Uncertain Demand',
      desc: 'Institutional kitchens struggle with unpredictable daily student/staff attendance.',
      icon: <Users className="w-5 h-5 text-amber-600" />
    },
    {
      num: '02',
      title: 'Overproduction',
      desc: 'Fear of shortages leads canteens to cook 15-25% more food than consumed.',
      icon: <Boxes className="w-5 h-5 text-amber-600" />
    },
    {
      num: '03',
      title: 'Surplus & Spoilage',
      desc: 'Cooked meals sit in ambient temperatures without real-time shelf-life tracking.',
      icon: <Clock className="w-5 h-5 text-amber-600" />
    },
    {
      num: '04',
      title: 'No Easy Redistribution',
      desc: 'Lack of verified NGO network and logistical dispatch prevents rapid food rescue.',
      icon: <HeartHandshake className="w-5 h-5 text-amber-600" />
    },
    {
      num: '05',
      title: 'Food Waste',
      desc: 'Wholesome nutrition ends up in landfills, generating methane and high financial loss.',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />
    }
  ];

  const solutions = [
    {
      title: 'Demand Prediction',
      desc: 'AI algorithms predict daily meal quantities from historical attendance and event patterns.',
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200'
    },
    {
      title: 'Surplus Detection',
      desc: 'Instant meal-served audit identifies excess batches and calculates exact surplus in kg.',
      icon: <Boxes className="w-6 h-6 text-teal-600" />,
      color: 'from-teal-500/10 to-cyan-500/10 border-teal-200'
    },
    {
      title: 'Quality Check',
      desc: 'Virtual IoT telemetry evaluates cold-chain temperature, storage duration, and use-by limits.',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-600" />,
      color: 'from-cyan-500/10 to-blue-500/10 border-cyan-200'
    },
    {
      title: 'NGO Matching',
      desc: 'Multi-criteria matching algorithm pairs surplus with vetted Vijayawada shelters and food banks.',
      icon: <HeartHandshake className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200'
    },
    {
      title: 'Route Optimization',
      desc: 'Calculates travel time and pickup windows to guarantee food arrives before quality degrades.',
      icon: <Navigation className="w-6 h-6 text-emerald-600" />,
      color: 'from-emerald-500/10 to-green-500/10 border-emerald-200'
    },
    {
      title: 'Sustainability Analytics',
      desc: 'Measures meals saved, carbon avoided (kg CO2e), rupee savings, and ESG impact metrics.',
      icon: <Leaf className="w-6 h-6 text-teal-600" />,
      color: 'from-teal-500/10 to-emerald-500/10 border-teal-200'
    }
  ];

  const impactCards = [
    {
      metric: '40%+',
      title: 'Less Food Waste',
      desc: 'Drastically cuts kitchen binning through proactive forecast adjustments.',
      icon: <Leaf className="w-5 h-5 text-emerald-600" />
    },
    {
      metric: '500+ / wk',
      title: 'More People Fed',
      desc: 'Safe surplus reaches shelters, children homes, and community kitchens.',
      icon: <Users className="w-5 h-5 text-teal-600" />
    },
    {
      metric: '2.5 kg / kg',
      title: 'Lower Carbon Footprint',
      desc: 'Reduces potent methane greenhouse gas emissions from landfills.',
      icon: <Sparkles className="w-5 h-5 text-cyan-600" />
    },
    {
      metric: '₹200+ / kg',
      title: 'Cost Savings',
      desc: 'Direct reduction in institutional raw material budget and disposal costs.',
      icon: <Coins className="w-5 h-5 text-amber-600" />
    },
    {
      metric: '100% ESG',
      title: 'Sustainable Future',
      desc: 'Empowers colleges to achieve Net Zero waste and SDG 12.3 compliance.',
      icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />
    }
  ];

  const workflowSteps = [
    { name: 'Kitchen Data', sub: 'Attendance & Menus' },
    { name: 'AI Forecast', sub: 'Optimal Prep Units' },
    { name: 'Surplus Alert', sub: 'Weight & Meal Delta' },
    { name: 'Quality Assessment', sub: 'IoT Telemetry Score' },
    { name: 'NGO Match', sub: 'Ranked Vetted Shelters' },
    { name: 'Delivery Route', sub: 'Time-Safe Dispatch' },
    { name: 'Impact Report', sub: 'CO2e & Rupee Metrics' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner for SIH 2026 */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white text-xs py-2 px-4 text-center font-medium shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            SIH Problem Statement: SIH26234
          </span>
          <span>
            AI-Powered Smart Food Waste Reduction & Sustainable Redistribution Ecosystem • Prototype City: Vijayawada, AP
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs mb-6">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Predict. Rescue. Redistribute. Measure.</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
              SmartFood <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Rescue AI</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed">
              AI-Powered Food Waste Reduction and Sustainable Redistribution for College Canteens, Hostels, and Institutional Kitchens.
            </p>

            {/* City Demonstration Note */}
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Configured for Demonstration: Smart College Canteen, Vijayawada, Andhra Pradesh</span>
            </div>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get Started (Choose Role)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDashboard}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base border border-slate-300 shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span>Explore Live Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Canonical Demo Highlights Badge */}
            <div className="mt-12 p-4 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm max-w-4xl w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Demo Kitchen</span>
                <span className="text-sm font-bold text-slate-800">Smart College Canteen</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Canonical Prediction</span>
                <span className="text-sm font-bold text-emerald-700">295 Meals (310 Prep)</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Partner Matched</span>
                <span className="text-sm font-bold text-teal-700">Hope Food Bank (3.2 km)</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Delivered Savings</span>
                <span className="text-sm font-bold text-slate-900">₹2,800 • 35 kg CO2e</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Problem Section: Horizontal Workflow */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              The Food Waste Crisis in Institutional Kitchens
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Why Does Good Food End Up In The Bin?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The conventional breakdown from kitchen preparation to municipal landfill:
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {problems.map((prob, idx) => (
              <div 
                key={prob.num} 
                className="relative bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      STEP {prob.num}
                    </span>
                    <div className="p-2 bg-amber-50 rounded-xl">
                      {prob.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-slate-800">{prob.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{prob.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                      →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
              Our AI Ecosystem Solution
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">
              A Complete Closed-Loop Food Rescue Pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Transforming overproduction into guaranteed social welfare through automated decision support.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol, index) => (
              <div
                key={sol.title}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {sol.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600">0{index + 1}.</span>
                    <h3 className="font-bold text-lg text-slate-900">{sol.title}</h3>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{sol.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-3 py-1 rounded-full border border-teal-300">
              Operational Architecture
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">
              How SmartFood Rescue AI Operates
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              From morning raw material measurement to community kitchen handover:
            </p>
          </div>

          <div className="mt-12 bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 p-6 sm:p-8 rounded-3xl border border-teal-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {workflowSteps.map((st, i) => (
                <div key={st.name} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                    {i + 1}
                  </div>
                  <div className="font-bold text-xs text-slate-800">{st.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{st.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-xs font-semibold text-teal-900">
              Kitchen Data → AI Forecast → Surplus Alert → Quality Assessment → NGO Match → Delivery Route → Impact Report
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 px-3 py-1 rounded-full border border-cyan-300">
              Tangible Metrics
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-slate-900">
              Measurable Environmental & Economic Impact
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {impactCards.map((card) => (
              <div 
                key={card.title} 
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 bg-slate-50 rounded-xl w-fit mb-3">
                    {card.icon}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-display">
                    {card.metric}
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mt-1">{card.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Role Selection CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Ready to Experience the SIH26234 Prototype?
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Select one of the 4 operational roles to explore role-specific views or proceed to the main dashboard.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['Kitchen Staff', 'NGO Partner', 'Delivery Partner', 'Administrator'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 font-bold text-xs sm:text-sm text-slate-700 transition-all flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>{role}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
            >
              Go to Full Role Selection Page
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-200">
            SmartFood Rescue AI • SIH26234 Prototype
          </p>
          <p>
            Demonstrating AI Demand Forecasting & Surplus Redistribution in Vijayawada, Andhra Pradesh.
          </p>
          <p className="text-slate-500 text-[11px]">
            Software Simulation Mode • Virtual IoT Telemetry • Certified Human Food-Safety Verification Required
          </p>
        </div>
      </footer>
    </div>
  );
};
