import React from 'react';
import { 
  Leaf, 
  Coins, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Building2, 
  Navigation, 
  Award,
  Globe,
  FileSpreadsheet
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
import { calculateSustainabilityImpact } from '../services/storage';

interface SustainabilityPageProps {
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ showToast }) => {
  const impact = calculateSustainabilityImpact();

  // Chart 1: Daily Food Waste Trend (kg)
  const dailyWasteData = [
    { day: 'Fri', waste: 12.5 },
    { day: 'Sat', waste: 10.0 },
    { day: 'Sun', waste: 8.0 },
    { day: 'Mon', waste: 6.5 },
    { day: 'Tue', waste: 4.0 },
    { day: 'Wed', waste: 3.5 },
    { day: 'Thu', waste: 1.5 },
  ];

  // Chart 2: Prepared vs Served Meals
  const prepVsServedData = [
    { meal: 'Mon L', prep: 330, served: 312 },
    { meal: 'Tue L', prep: 300, served: 288 },
    { meal: 'Tue D', prep: 290, served: 278 },
    { meal: 'Wed L', prep: 350, served: 330 },
    { meal: 'Thu B', prep: 150, served: 130 },
    { meal: 'Thu L', prep: 310, served: 292 },
  ];

  // Chart 3: Monthly Redistribution Volume (kg)
  const monthlyVolumeData = [
    { month: 'Jun', volumeKg: 140 },
    { month: 'Jul', volumeKg: 185 },
    { month: 'Aug', volumeKg: 210 },
    { month: 'Sep (Current)', volumeKg: 239 },
  ];

  // Chart 4: NGO-Wise Donation Distribution
  const ngoDistributionData = [
    { name: 'Hope Food Bank', value: 85, color: '#059669' },
    { name: 'Seva Shelter Home', value: 55, color: '#0d9488' },
    { name: 'Helping Hands', value: 65, color: '#0284c7' },
    { name: 'Community Kitchen', value: 34, color: '#f59e0b' },
  ];

  // Chart 5: Cost Savings Trend (₹)
  const costSavingsTrendData = [
    { day: 'Fri', savedRupees: 800 },
    { day: 'Sat', savedRupees: 1200 },
    { day: 'Sun', savedRupees: 1500 },
    { day: 'Mon', savedRupees: 1800 },
    { day: 'Tue', savedRupees: 2100 },
    { day: 'Wed', savedRupees: 2500 },
    { day: 'Thu', savedRupees: 2800 },
  ];

  // Chart 6: Carbon Savings Trend (kg CO2e)
  const carbonSavingsData = [
    { day: 'Fri', co2Avoided: 10.0 },
    { day: 'Sat', co2Avoided: 15.0 },
    { day: 'Sun', co2Avoided: 18.5 },
    { day: 'Mon', co2Avoided: 22.5 },
    { day: 'Tue', co2Avoided: 26.0 },
    { day: 'Wed', co2Avoided: 31.0 },
    { day: 'Thu', co2Avoided: 35.0 },
  ];

  // Chart 7: Food Category Surplus Distribution
  const categorySurplusData = [
    { name: 'Rice', value: 50, color: '#10b981' },
    { name: 'Curry / Dal', value: 30, color: '#06b6d4' },
    { name: 'Breakfast', value: 12, color: '#6366f1' },
    { name: 'Snacks / Other', value: 8, color: '#f97316' },
  ];

  // Chart 8: Prediction Accuracy Trend (%)
  const accuracyTrendData = [
    { day: 'Day 1', acc: 91.2 },
    { day: 'Day 2', acc: 93.5 },
    { day: 'Day 3', acc: 94.8 },
    { day: 'Day 4', acc: 96.2 },
    { day: 'Day 5', acc: 97.4 },
    { day: 'Day 6', acc: 98.2 },
    { day: 'Day 7', acc: 98.9 },
  ];

  // CSV Export for Sustainability Summary
  const handleExportSummaryCSV = () => {
    const dataRows = [
      ['Metric', 'Value', 'Unit', 'Formula Reference'],
      ['Food Waste Prevented', impact.foodRedistributedKg, 'kg', 'Direct kitchen waste divergence'],
      ['Food Redistributed', impact.foodRedistributedKg, 'kg', 'Delivered to vetted Vijayawada NGOs'],
      ['Meals Saved', impact.mealsSaved, 'meals', 'foodRedistributedKg / 0.25 kg portion'],
      ['Estimated Cost Savings', impact.costSaved, 'INR (₹)', 'wasteAvoidedKg * ₹200/kg'],
      ['Estimated CO2e Avoided', impact.carbonAvoided, 'kg CO2e', 'wasteAvoidedKg * 2.5 factor'],
      ['Waste Prevention Rate', `${impact.wastePreventionRate}%`, 'percentage', '((baseline - current) / baseline) * 100'],
      ['NGOs Supported', impact.ngosSupportedCount, 'organizations', 'Vijayawada active food partners'],
      ['Successful Donations', impact.successfulDonationsCount, 'dispatches', 'Delivered handover logs'],
      ['Route Distance Optimized', `${impact.routeDistanceOptimizedKm} km`, 'km', 'Delivery corridor routing'],
      ['Average Forecast Accuracy', `${impact.avgForecastAccuracy}%`, 'percentage', 'Actual vs AI predicted meals']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + dataRows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartFood_Sustainability_ESG_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ESG Report Exported', 'Downloaded sustainability and carbon savings CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              UN SDG 12.3 & ESG Reporting
            </span>
            <span className="text-xs text-slate-400">SIH26234 Impact Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Sustainability & Carbon Impact Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent environmental accounting: food waste prevention, community meals saved, rupee economies, and greenhouse gas avoidance.
          </p>
        </div>

        <button
          onClick={handleExportSummaryCSV}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export ESG Impact CSV</span>
        </button>
      </div>

      {/* 10 Required KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Waste Prevented</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1 font-display">
            {impact.foodRedistributedKg} kg
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Diverted from dump</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Redistributed</div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-700 mt-1 font-display">
            {impact.foodRedistributedKg} kg
          </div>
          <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">To partner shelters</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Meals Saved</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-display">
            {impact.mealsSaved}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Formula: kg / 0.25</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Successful Donations</div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-1 font-display">
            {impact.successfulDonationsCount}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Handover receipts</span>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Cost Savings</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-1 font-display">
            ₹{impact.costSaved.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">@ ₹200 / kg avoid</span>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-cyan-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">CO2e Avoided</div>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-700 mt-1 font-display">
            {impact.carbonAvoided} kg
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Factor: 2.5 kg CO2e</span>
        </div>

        {/* Card 7 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">NGOs Supported</div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-700 mt-1 font-display">
            {impact.ngosSupportedCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Vijayawada active</span>
        </div>

        {/* Card 8 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Route Distance Opt</div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 mt-1 font-display">
            {impact.routeDistanceOptimizedKm} km
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Transit corridor</span>
        </div>

        {/* Card 9 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Forecast Accuracy</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1 font-display">
            {impact.avgForecastAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">AI model precision</span>
        </div>

        {/* Card 10 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">Waste Prevention Rate</div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-700 mt-1 font-display">
            {impact.wastePreventionRate}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">vs baseline waste</span>
        </div>
      </div>

      {/* Comprehensive Sustainability Charts Grid (8 Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Daily Food Waste Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Daily Food Waste Trend (kg)</h3>
          <p className="text-xs text-slate-500 mb-4">Direct decrease in unconsumed waste destined for municipal bins</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyWasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip />
                <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Prepared vs Served Meals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Prepared vs Served Meals</h3>
          <p className="text-xs text-slate-500 mb-4">Tight convergence shows AI preventing kitchen overproduction</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepVsServedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="meal" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="prep" name="Prepared" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="served" name="Served" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Redistribution Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Monthly Redistribution Volume (kg)</h3>
          <p className="text-xs text-slate-500 mb-4">Cumulative food rescued for hunger relief programs</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip />
                <Bar dataKey="volumeKg" name="Redistributed (kg)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: NGO-Wise Donation Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">NGO-Wise Donation Distribution (kg)</h3>
          <p className="text-xs text-slate-500 mb-4">Equitable allocation across Vijayawada beneficiary shelters</p>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ngoDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                >
                  {ngoDistributionData.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Cost Savings Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Cost Savings Accumulation (₹)</h3>
          <p className="text-xs text-slate-500 mb-4">Formula: wasteAvoidedKg × ₹200 raw ingredient value</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costSavingsTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" ₹" />
                <Tooltip formatter={(val: any) => [`₹${val}`, 'Saved']} />
                <Line type="monotone" dataKey="savedRupees" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Carbon Savings Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Carbon Footprint Avoided (kg CO2e)</h3>
          <p className="text-xs text-slate-500 mb-4">Mitigating methane formation from anaerobic organic decay</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={carbonSavingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kg" />
                <Tooltip formatter={(val: any) => [`${val} kg CO2e`, 'Avoided']} />
                <Line type="monotone" dataKey="co2Avoided" stroke="#0891b2" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Food Category Surplus Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Surplus by Food Category (%)</h3>
          <p className="text-xs text-slate-500 mb-4">Composition of residual food by institutional kitchen menu group</p>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySurplusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
                >
                  {categorySurplusData.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Prediction Accuracy Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">AI Demand Forecast Accuracy (%)</h3>
          <p className="text-xs text-slate-500 mb-4">Model convergence over successive cooking cycles</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[85, 100]} unit="%" />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Accuracy']} />
                <Line type="monotone" dataKey="acc" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mandatory ESG Summary Section */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Executive ESG & Institutional Impact Statement
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display leading-tight">
            “SmartFood Rescue AI supports responsible consumption, food-waste prevention, community welfare, resource efficiency, and sustainability reporting.”
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            By automating pre-cooking demand prediction and pairing residual wholesome batches with verified Vijayawada shelter networks, the platform creates verifiable ESG audit trails compliant with SDG 12.3 (50% reduction in food waste by 2030) and university green-ranking accreditation frameworks.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-emerald-200">
            <div>✓ Net-Zero Landfill Commitment</div>
            <div>✓ Scope 3 GHG Carbon Avoidance</div>
            <div>✓ Local NGO Capacity Enhancement</div>
          </div>
        </div>
      </div>
    </div>
  );
};
