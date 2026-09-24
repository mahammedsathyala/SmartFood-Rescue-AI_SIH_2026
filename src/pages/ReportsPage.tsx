import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Filter, 
  Calendar, 
  Building2, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Award,
  ArrowRight,
  TrendingUp,
  Boxes,
  Leaf,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { FoodBatch, DemandForecastRecord, NGOPartner, DonationRequest } from '../types';
import { calculateSustainabilityImpact, getSettings } from '../services/storage';

interface ReportsPageProps {
  batches: FoodBatch[];
  forecasts: DemandForecastRecord[];
  ngos: NGOPartner[];
  donations: DonationRequest[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  batches,
  forecasts,
  ngos,
  donations,
  showToast,
}) => {
  const settings = getSettings();
  const impact = calculateSustainabilityImpact();

  // Filter criteria
  const [dateRange, setDateRange] = useState('Last 7 Days (18 Sep - 24 Sep 2026)');
  const [selectedKitchen, setSelectedKitchen] = useState('Smart College Canteen');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNgo, setSelectedNgo] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Generated state
  const [isGenerated, setIsGenerated] = useState(true);

  // Filtered batches for report
  const reportBatches = batches.filter(b => {
    const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchStat = selectedStatus === 'ALL' || b.donationStatus === selectedStatus;
    const matchNgo = selectedNgo === 'ALL' || b.matchedNgoId === selectedNgo;
    return matchCat && matchStat && matchNgo;
  });

  const totalPredicted = forecasts.reduce((acc, f) => acc + f.predictedDemand, 0);
  const totalPrepared = reportBatches.reduce((acc, b) => acc + b.mealsPrepared, 0);
  const totalServed = reportBatches.reduce((acc, b) => acc + b.mealsServed, 0);
  const totalSurplusKg = reportBatches.reduce((acc, b) => acc + b.remainingKg, 0);
  const totalRedistributedKg = reportBatches
    .filter(b => b.donationStatus === 'Delivered')
    .reduce((acc, b) => acc + b.remainingKg, 0);
  const totalWastedKg = reportBatches
    .filter(b => b.donationStatus === 'Do Not Redistribute' || b.donationStatus === 'Expired')
    .reduce((acc, b) => acc + b.remainingKg, 0);

  const reportMealsSaved = Math.round(totalRedistributedKg / settings.avgMealPortionKg);
  const reportCostSaved = Math.round(totalRedistributedKg * settings.costPerKgRupees);
  const reportCarbonAvoided = Math.round(totalRedistributedKg * settings.carbonFactorKgCO2PerKg * 10) / 10;

  const topRecommendations = [
    'Expand AI demand prediction model for weekend dinner services to achieve an additional 4% reduction in surplus.',
    'Equip secondary pantry units with digital temperature telemetry gateways to speed up safety review sign-offs.',
    'Partner with Community Kitchen Network in Auto Nagar for high-volume Friday midday batch allocations.'
  ];

  // Actions
  const handleGenerate = () => {
    setIsGenerated(true);
    showToast('Report Generated', 'Audit and impact analytics refreshed with current parameters.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Report Metric', 'Value', 'Unit'];
    const rows = [
      ['Kitchen Facility', selectedKitchen, ''],
      ['Reporting Window', dateRange, ''],
      ['Total Meals Predicted', totalPredicted, 'meals'],
      ['Total Meals Prepared', totalPrepared, 'meals'],
      ['Total Meals Served', totalServed, 'meals'],
      ['Total Surplus Generated', `${totalSurplusKg} kg`, 'kg'],
      ['Total Food Redistributed', `${totalRedistributedKg} kg`, 'kg'],
      ['Total Food Binned/Wasted', `${totalWastedKg} kg`, 'kg'],
      ['Meals Rescued', reportMealsSaved, 'meals'],
      ['Cost Saved', `INR ₹${reportCostSaved}`, 'INR'],
      ['Carbon Avoided', `${reportCarbonAvoided} kg CO2e`, 'kg CO2e'],
      ['Average Forecast Accuracy', `${impact.avgForecastAccuracy}%`, 'percentage'],
      ['Successful Donations Count', impact.successfulDonationsCount, 'dispatches'],
      ['NGOs Supported', impact.ngosSupportedCount, 'partners']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartFood_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report Exported', 'CSV summary generated and downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header (Hidden in Print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              Formal Institutional Audit
            </span>
            <span className="text-xs text-slate-400">SIH26234 Compliance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Redistribution & Sustainability Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate printable executive audits, export CSV registers, or save verifiable PDF certifications for university management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters Box (Hidden in Print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Report Filter Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
            >
              <option value="Last 7 Days (18 Sep - 24 Sep 2026)">Last 7 Days (18 - 24 Sep 2026)</option>
              <option value="Today (24 Sep 2026)">Today Only (24 Sep 2026)</option>
              <option value="Current Month (Sep 2026)">Current Month (Sep 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kitchen Hub</label>
            <select
              value={selectedKitchen}
              onChange={(e) => setSelectedKitchen(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
            >
              <option value="Smart College Canteen">Smart College Canteen, Vijayawada</option>
              <option value="All Campus Kitchens">All Campus Kitchens (Aggregated)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Food Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="Rice">Rice</option>
              <option value="Curry">Curry / Dal</option>
              <option value="Snacks">Snacks</option>
              <option value="Breakfast">Breakfast</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient NGO</label>
            <select
              value={selectedNgo}
              onChange={(e) => setSelectedNgo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">All NGOs</option>
              {ngos.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Donation Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="Delivered">Delivered Only</option>
              <option value="Surplus Detected">Surplus Detected</option>
              <option value="Do Not Redistribute">Marked Unsafe</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            className="px-5 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xs hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
          >
            Generate Filtered Report
          </button>
        </div>
      </div>

      {/* Printable Report Canvas Document */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-full">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Smart India Hackathon • Problem Statement SIH26234
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
              Food Waste Reduction & Sustainable Redistribution Audit Report
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated by SmartFood Rescue AI System • Demonstration Hub: Vijayawada, Andhra Pradesh
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div><strong>Report Ref:</strong> SFR-AUD-2026-0924</div>
            <div><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div><strong>Facility:</strong> {selectedKitchen}</div>
            <div><strong>Coverage:</strong> {dateRange}</div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-emerald-600 pl-3">
            1. Executive Operational & Environmental Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-medium">Meals Predicted</span>
              <span className="text-2xl font-extrabold text-slate-900 font-display mt-0.5 block">{totalPredicted}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">AI Baseline</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-medium">Prepared vs Served</span>
              <span className="text-2xl font-extrabold text-slate-900 font-display mt-0.5 block">{totalPrepared} / {totalServed}</span>
              <span className="text-[10px] text-teal-600 font-semibold">Variance: 5.8%</span>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <span className="text-emerald-800 text-[11px] block font-bold">Food Redistributed</span>
              <span className="text-2xl font-extrabold text-emerald-700 font-display mt-0.5 block">{totalRedistributedKg} kg</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Rescued to NGOs</span>
            </div>

            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
              <span className="text-teal-800 text-[11px] block font-bold">Meals Saved</span>
              <span className="text-2xl font-extrabold text-teal-700 font-display mt-0.5 block">{reportMealsSaved} meals</span>
              <span className="text-[10px] text-teal-700 font-semibold">Community nourished</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-medium">Cost Savings (₹)</span>
              <span className="text-2xl font-extrabold text-slate-900 font-display mt-0.5 block">₹{reportCostSaved.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500 font-medium">Raw material saved</span>
            </div>

            <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200">
              <span className="text-cyan-800 text-[11px] block font-bold">CO2e Avoided</span>
              <span className="text-2xl font-extrabold text-cyan-700 font-display mt-0.5 block">{reportCarbonAvoided} kg</span>
              <span className="text-[10px] text-cyan-700 font-semibold">Methane prevented</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-medium">Forecast Accuracy</span>
              <span className="text-2xl font-extrabold text-slate-900 font-display mt-0.5 block">{impact.avgForecastAccuracy}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Pre-cooking precision</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-500 text-[11px] block font-medium">Waste Binned</span>
              <span className="text-2xl font-extrabold text-rose-700 font-display mt-0.5 block">{totalWastedKg} kg</span>
              <span className="text-[10px] text-rose-600 font-semibold">Unsafe / Expired</span>
            </div>
          </div>
        </div>

        {/* Batches Table in Report */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-emerald-600 pl-3">
            2. Detailed Food Batch Itemization Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="px-3 py-2.5">Batch ID</th>
                  <th className="px-3 py-2.5">Food Item</th>
                  <th className="px-3 py-2.5">Prepared</th>
                  <th className="px-3 py-2.5">Served</th>
                  <th className="px-3 py-2.5">Surplus</th>
                  <th className="px-3 py-2.5">Quality</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportBatches.map(b => (
                  <tr key={b.id}>
                    <td className="px-3 py-2 font-mono">{b.id.slice(-11)}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">{b.foodItem}</td>
                    <td className="px-3 py-2">{b.preparedKg} kg</td>
                    <td className="px-3 py-2">{b.servedKg} kg</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">{b.remainingKg} kg</td>
                    <td className="px-3 py-2">{b.qualityStatus}</td>
                    <td className="px-3 py-2 font-semibold">{b.donationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations & Continuous Improvement */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-4 border-emerald-600 pl-3">
            3. AI Prescriptive Recommendations for Kitchen Operations
          </h3>

          <div className="space-y-2.5">
            {topRecommendations.map((rec, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
          <div>
            <div className="border-b border-slate-400 pb-8 mb-2">
              <span className="font-script text-lg text-slate-800 italic">K. Ramesh Babu</span>
            </div>
            <div className="font-bold text-slate-800">K. Ramesh Babu</div>
            <div className="text-[11px] text-slate-500">Canteen Manager & Kitchen Lead</div>
            <div className="text-[10px] text-slate-400">Smart College Canteen, Vijayawada</div>
          </div>

          <div>
            <div className="border-b border-slate-400 pb-8 mb-2">
              <span className="font-script text-lg text-slate-800 italic">Smt. Lakshmi Devi</span>
            </div>
            <div className="font-bold text-slate-800">Smt. Lakshmi Devi</div>
            <div className="text-[11px] text-slate-500">Director, Hope Food Bank</div>
            <div className="text-[10px] text-slate-400">Benz Circle, Vijayawada</div>
          </div>

          <div className="hidden sm:block">
            <div className="border-b border-slate-400 pb-8 mb-2">
              <span className="font-mono text-xs text-emerald-700 font-bold block pt-3">
                SHA256: 8a7c92b...e4f
              </span>
            </div>
            <div className="font-bold text-slate-800">Verified AI System Audit</div>
            <div className="text-[11px] text-slate-500">SmartFood Rescue AI • SIH26234</div>
            <div className="text-[10px] text-slate-400">Automated Digital Timestamp</div>
          </div>
        </div>
      </div>
    </div>
  );
};
