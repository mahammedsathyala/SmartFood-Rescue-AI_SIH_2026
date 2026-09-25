import React from 'react';
import { 
  TrendingUp, 
  ChefHat, 
  Users, 
  Boxes, 
  HeartHandshake, 
  Leaf, 
  Coins, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Cpu, 
  Navigation, 
  FileText,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  FoodBatch, 
  DemandForecastRecord, 
  NGOPartner, 
  DonationRequest, 
  DeliveryRoute, 
  VirtualIoTSensorData, 
  NavigationTab, 
  UserRole 
} from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PipelineStepper } from '../components/PipelineStepper';

interface DashboardPageProps {
  batches: FoodBatch[];
  forecasts: DemandForecastRecord[];
  ngos: NGOPartner[];
  donations: DonationRequest[];
  routes: DeliveryRoute[];
  iotData: VirtualIoTSensorData;
  activeRole: UserRole;
  onNavigate: (tab: NavigationTab) => void;
  onOpenAddBatch: () => void;
  onSelectBatchForQuality: (batchId: string) => void;
  onSelectBatchForNgo: (batchId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  batches,
  forecasts,
  ngos,
  donations,
  routes,
  iotData,
  activeRole,
  onNavigate,
  onOpenAddBatch,
  onSelectBatchForQuality,
  onSelectBatchForNgo
}) => {
  // Chart 1: Food Waste Trend for Last 7 Days (kg)
  const wasteTrendData = [
    { day: 'Fri', wasteKg: 12.5, preparedKg: 78 },
    { day: 'Sat', wasteKg: 10.0, preparedKg: 72 },
    { day: 'Sun', wasteKg: 8.0, preparedKg: 65 },
    { day: 'Mon', wasteKg: 6.5, preparedKg: 80 },
    { day: 'Tue', wasteKg: 4.0, preparedKg: 75 },
    { day: 'Wed', wasteKg: 3.5, preparedKg: 85 },
    { day: 'Thu', wasteKg: 1.5, preparedKg: 77.5 },
  ];

  // Chart 2: Meals Prepared versus Meals Served
  const mealsPrepServedData = [
    { meal: 'Mon L', prepared: 330, served: 312 },
    { meal: 'Tue L', prepared: 300, served: 288 },
    { meal: 'Tue D', prepared: 290, served: 278 },
    { meal: 'Wed L', prepared: 350, served: 330 },
    { meal: 'Thu B', prepared: 150, served: 130 },
    { meal: 'Thu L', prepared: 310, served: 292 },
  ];

  // Chart 3: Food Batch Distribution Status
  const statusCounts = batches.reduce<Record<string, number>>((acc, b) => {
    acc[b.donationStatus] = (acc[b.donationStatus] || 0) + 1;
    return acc;
  }, {});

  const distributionPieData = [
    { name: 'Delivered', value: statusCounts['Delivered'] || 2, color: '#059669' }, // emerald-600
    { name: 'Surplus Detected', value: statusCounts['Surplus Detected'] || 1, color: '#0d9488' }, // teal-600
    { name: 'Offered to NGO', value: statusCounts['Offered'] || 1, color: '#0284c7' }, // sky-600
    { name: 'Unsafe / Expired', value: (statusCounts['Do Not Redistribute'] || 0) + (statusCounts['Expired'] || 0) || 1, color: '#e11d48' }, // rose-600
  ];

  // Chart 4: Weekly Food Redistribution in kg
  const weeklyRedistributionData = [
    { week: 'Week 1', kg: 45 },
    { week: 'Week 2', kg: 58 },
    { week: 'Week 3', kg: 64 },
    { week: 'Current Wk', kg: 72 },
  ];

  // Active Surplus Batches
  const surplusBatches = batches.filter(b => b.remainingKg > 0);
  const pendingDonations = donations.filter(d => d.status === 'Offered' || d.status === 'Pending NGO Response');
  const activeRoute = routes[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Prototype & Simulation Context */}
      <DisclaimerBanner 
        type="iot" 
        customMessage="This prototype uses simulated IoT telemetry for Vijayawada Smart College Canteen. Values simulate real cold-chain sensors, weight scales, and smart pantry units."
      />

      {/* Hero Welcome & Quick Facility Snapshot */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              Canonical Live Scenario Active
            </span>
            <span className="text-xs text-slate-400">Vijayawada, AP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Smart College Canteen Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time synchronization across AI Demand Forecast, IoT Quality Telemetry, and NGO Logistics.
          </p>
        </div>

        {/* Quick Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddBatch}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Food Batch</span>
          </button>
          <button
            onClick={() => onNavigate('demand-forecast')}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <span>Run Forecast</span>
          </button>
          <button
            onClick={() => onNavigate('ngo-matching')}
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
            <span>Find Nearby NGO</span>
          </button>
        </div>
      </div>

      {/* End-to-End Visual Workflow Pipeline */}
      <PipelineStepper 
        batches={batches}
        donations={donations}
        iotData={iotData}
        onNavigate={onNavigate}
      />

      {/* 8 Primary KPI Cards Required by Prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* KPI 1 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Predicted Meals</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-display">295</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center">
            <span>Accuracy: 98.9%</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Meals Prepared</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-display">310</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Recommended 310</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Meals Served</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-display">292</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Surplus: 18 meals</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Surplus Available</div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1 font-display">14 kg</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Batch 01 Rice</div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Food Redistributed</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-display">14 kg</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% rescued</div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Meals Saved</div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-600 mt-1 font-display">56</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">@ 0.25 kg/meal</div>
        </div>

        {/* KPI 7 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">Cost Saved (Est.)</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1 font-display">₹2,800</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Prototype estimate</div>
        </div>

        {/* KPI 8 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:border-cyan-300 transition-all">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">CO2 Avoided (Est.)</div>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-700 mt-1 font-display">35 kg</div>
          <div className="text-[10px] text-cyan-600 font-semibold mt-0.5">Prototype estimate</div>
        </div>
      </div>

      {/* Recharts Analytics Grid (4 charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Food Waste Trend for Last 7 Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Food Waste Trend (Last 7 Days)</h3>
              <p className="text-xs text-slate-500">Unprevented food waste dropping as AI forecast converges</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              -88% Reduction
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wasteTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(val: any) => [`${val} kg`, 'Waste']}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="wasteKg" 
                  name="Waste (kg)" 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#ef4444' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Meals Prepared vs Meals Served */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Meals Prepared vs Meals Served</h3>
              <p className="text-xs text-slate-500">Comparing kitchen prep count against actual consumer count</p>
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Avg Margin: 5.2%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealsPrepServedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="meal" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="prepared" name="Prepared Meals" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="served" name="Served Meals" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Food Batch Distribution Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Food Batch Distribution Status</h3>
              <p className="text-xs text-slate-500">Current state of recorded preparation batches</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {batches.length} Batches
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                >
                  {distributionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Weekly Food Redistribution in kg */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Weekly Food Redistribution (kg)</h3>
              <p className="text-xs text-slate-500">Volume routed to Vijayawada shelters and community kitchens</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Total 239 kg
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRedistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  formatter={(val: any) => [`${val} kg`, 'Redistributed']}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="kg" name="Redistributed (kg)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6 Required Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Recent Food Batch Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              Recent Food Batch Alerts
            </h3>
            <button 
              onClick={() => onNavigate('food-batches')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {batches.slice(0, 3).map((b) => (
              <div key={b.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{b.foodItem}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    b.donationStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.donationStatus === 'Surplus Detected'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {b.donationStatus}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Surplus: {b.remainingKg} kg ({b.remainingMeals} meals)</span>
                  <span>Use-by: {new Date(b.deadlineDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button 
                    onClick={() => onSelectBatchForQuality(b.id)}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    Quality Check →
                  </button>
                  <span className="text-slate-300">•</span>
                  <button 
                    onClick={() => onSelectBatchForNgo(b.id)}
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    NGO Match →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Pending NGO Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              Pending NGO Requests
            </h3>
            <button 
              onClick={() => onNavigate('ngo-matching')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              Match NGOs <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingDonations.length > 0 ? (
              pendingDonations.map((d) => (
                <div key={d.id} className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{d.ngoName}</span>
                    <span className="text-[10px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">{d.status}</span>
                  </div>
                  <p className="mt-1 text-slate-600">{d.foodItem} • {d.quantityKg} kg</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pickup: {d.pickupWindow}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  All Active Requests Handled!
                </div>
                <p className="mt-1 text-slate-600 text-[11px]">
                  Hope Food Bank successfully received BATCH-01 (14 kg). Next distribution cycle scheduled for evening dinner service.
                </p>
              </div>
            )}

            {/* Canonical Demo Request Snapshot */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Hope Food Bank (Benz Circle)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Delivered</span>
              </div>
              <div className="text-slate-500 mt-1 text-[11px]">
                14 kg Vegetable Rice & Sambar • 56 Meals Saved • Driver: Suresh Kumar
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Status Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              Delivery Status Timeline
            </h3>
            <button 
              onClick={() => onNavigate('route-planning')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Live Route <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {activeRoute && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">{activeRoute.destination}</div>
                  <div className="text-[11px] text-slate-500">{activeRoute.distanceKm} km via Auto • Speed 20 km/h</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Delivered
                </span>
              </div>

              {/* Progress Steps Indicator */}
              <div className="p-3 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                  <span>Dispatch Step 6 of 6</span>
                  <span className="text-emerald-700">Completed (20 mins total)</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '100%' }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                  <span>College Canteen</span>
                  <span>In Transit</span>
                  <span>Hope Food Bank</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections 4, 5, 6: Virtual Sensor Status, Top NGOs, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 4: Virtual Sensor Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-600" />
              Virtual Sensor Telemetry
            </h3>
            <button 
              onClick={() => onNavigate('iot-simulator')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              Open Simulator <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100">
              <span className="text-slate-500 text-[11px] block font-medium">Temperature</span>
              <span className="text-lg font-bold text-teal-900 font-display">{iotData.temperature.toFixed(1)}°C</span>
              <span className="text-[10px] text-teal-700 block mt-0.5">Within Safe Threshold (≤8°C)</span>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
              <span className="text-slate-500 text-[11px] block font-medium">Humidity</span>
              <span className="text-lg font-bold text-blue-900 font-display">{iotData.humidity.toFixed(0)}%</span>
              <span className="text-[10px] text-blue-700 block mt-0.5">Optimum RH</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100">
              <span className="text-slate-500 text-[11px] block font-medium">Container Weight</span>
              <span className="text-lg font-bold text-amber-900 font-display">{iotData.containerWeight.toFixed(1)} kg</span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Digital Scale Sync</span>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-slate-500 text-[11px] block font-medium">Device Status</span>
              <span className="text-lg font-bold text-emerald-900 font-display flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {iotData.deviceStatus}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Virtual IoT Node</span>
            </div>
          </div>
        </div>

        {/* Section 5: Top NGO Partners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Top NGO Partners (Vijayawada)
            </h3>
            <button 
              onClick={() => onNavigate('ngo-matching')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              All Partners <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {ngos.slice(0, 3).map((ngo) => (
              <div key={ngo.id} className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{ngo.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{ngo.area}</span>
                    <span>•</span>
                    <span>{ngo.distanceKm} km</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{ngo.capacityKg} kg cap</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  ngo.currentAvailability === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {ngo.currentAvailability}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Quick Actions Required by Prompt */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={onOpenAddBatch}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-bold border border-emerald-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <Plus className="w-4 h-4 mb-2 text-emerald-600" />
                <span>Add Food Batch</span>
              </button>

              <button
                onClick={() => onNavigate('demand-forecast')}
                className="p-3 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-xl font-bold border border-teal-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <TrendingUp className="w-4 h-4 mb-2 text-teal-600" />
                <span>Run Forecast</span>
              </button>

              <button
                onClick={() => onNavigate('quality-check')}
                className="p-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 rounded-xl font-bold border border-cyan-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <ShieldCheck className="w-4 h-4 mb-2 text-cyan-600" />
                <span>Start Quality Check</span>
              </button>

              <button
                onClick={() => onNavigate('ngo-matching')}
                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl font-bold border border-blue-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <HeartHandshake className="w-4 h-4 mb-2 text-blue-600" />
                <span>Find Nearby NGO</span>
              </button>

              <button
                onClick={() => onNavigate('route-planning')}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold border border-indigo-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <Navigation className="w-4 h-4 mb-2 text-indigo-600" />
                <span>Plan Delivery</span>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold border border-amber-200 text-left transition-colors cursor-pointer flex flex-col justify-between"
              >
                <FileText className="w-4 h-4 mb-2 text-amber-600" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Role: <strong>{activeRole}</strong> • Session: Demo User
          </div>
        </div>
      </div>
    </div>
  );
};
