import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Save, 
  Calendar, 
  Users, 
  Utensils, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Search, 
  Trash2, 
  Filter, 
  ChevronDown, 
  Clock,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { DemandForecastRecord, FoodCategory } from '../types';
import { calculateDemandForecast } from '../services/storage';
import { useAppContext } from '../context/AppContext';

interface DemandForecastPageProps {
  forecasts?: DemandForecastRecord[];
  onAddForecast?: (forecast: DemandForecastRecord) => void;
  onDeleteForecast?: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const DemandForecastPage: React.FC<DemandForecastPageProps> = ({
  forecasts,
  onAddForecast,
  onDeleteForecast,
  showToast,
}) => {
  const context = useAppContext();
  const effectiveForecasts = forecasts || context.forecasts;
  const effectiveAddForecast = onAddForecast || context.handleAddForecast;
  const effectiveDeleteForecast = onDeleteForecast || context.handleDeleteForecast;
  // Form State initialized to the canonical demo scenario
  const [date, setDate] = useState<string>('2026-09-25');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Lunch');
  const [foodItem, setFoodItem] = useState<string>('Vegetable Rice');
  const [category, setCategory] = useState<FoodCategory>('Rice');
  const [expectedAttendance, setExpectedAttendance] = useState<number>(320);
  const [dayOfWeek, setDayOfWeek] = useState<string>('Friday');
  const [isHolidayOrEvent, setIsHolidayOrEvent] = useState<boolean>(false);
  const [isSpecialMenu, setIsSpecialMenu] = useState<boolean>(false);
  const [prevDayDemand, setPrevDayDemand] = useState<number>(295);
  const [avg7DayDemand, setAvg7DayDemand] = useState<number>(295);

  // Table Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMealType, setFilterMealType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'attendance' | 'predicted'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Real-time calculation using exact prompt formulas
  const calculation = calculateDemandForecast({
    expectedAttendance,
    isHolidayOrEvent,
    isSpecialMenu,
    prevDayDemand,
    avg7DayDemand
  });

  const handleSavePrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) {
      showToast('Validation Error', 'Please enter a food item name.', 'error');
      return;
    }
    if (expectedAttendance <= 0) {
      showToast('Validation Error', 'Expected attendance must be greater than 0.', 'error');
      return;
    }

    const newRecord: DemandForecastRecord = {
      id: `FC-${Date.now().toString().slice(-6)}`,
      date,
      mealType,
      foodItem,
      category,
      expectedAttendance,
      dayOfWeek,
      isHolidayOrEvent,
      isSpecialMenu,
      prevDayDemand,
      avg7DayDemand,
      predictedDemand: calculation.predictedDemand,
      recommendedPreparation: calculation.recommendedPreparation,
      actualMealsServed: undefined,
      confidenceScore: calculation.confidenceScore,
      overproductionRisk: calculation.overproductionRisk,
      aiRecommendation: calculation.aiRecommendation,
      status: 'Pending Actuals'
    };

    effectiveAddForecast(newRecord);
    showToast('Prediction Saved', `AI generated recommendation of ${calculation.recommendedPreparation} meals saved to history.`, 'success');
  };

  // Canonical scenario quick-fill
  const loadCanonicalScenario = () => {
    setDate('2026-09-24');
    setMealType('Lunch');
    setFoodItem('Vegetable Rice');
    setCategory('Rice');
    setExpectedAttendance(320);
    setDayOfWeek('Thursday');
    setIsHolidayOrEvent(false);
    setIsSpecialMenu(false);
    setPrevDayDemand(295);
    setAvg7DayDemand(295);
    showToast('Demo Preset Loaded', 'Loaded canonical Vijayawada Smart College Canteen scenario (320 attendance -> 295 predicted).', 'info');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Date', 'Meal Type', 'Food Item', 'Category', 'Expected Attendance', 'Predicted Meals', 'Recommended Prep', 'Actual Served', 'Accuracy %', 'Risk', 'Status'];
    const rows = effectiveForecasts.map(f => [
      f.date,
      f.mealType,
      `"${f.foodItem}"`,
      f.category,
      f.expectedAttendance,
      f.predictedDemand,
      f.recommendedPreparation,
      f.actualMealsServed ?? 'Pending',
      f.accuracy ? `${f.accuracy}%` : 'N/A',
      f.overproductionRisk,
      f.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartFood_Demand_Forecast_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'Demand forecast history exported successfully.', 'success');
  };

  // Filtered and Sorted Forecasts
  const filteredForecasts = effectiveForecasts.filter(f => {
    const matchesSearch = f.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeal = filterMealType === 'ALL' || f.mealType === filterMealType;
    return matchesSearch && matchesMeal;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'attendance') comparison = b.expectedAttendance - a.expectedAttendance;
    if (sortBy === 'predicted') comparison = b.predictedDemand - a.predictedDemand;
    return sortOrder === 'desc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
              Demand Forecasting Baseline
            </span>
            <span className="text-xs text-slate-400">AI Decision Support</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            AI-Assisted, Data-Informed Demand Forecasting
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Predict next-day meal requirements using attendance patterns, event calendars, and historical demand to eliminate overproduction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCanonicalScenario}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Load Vijayawada 320 attendance demo"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load Demo Scenario</span>
          </button>
          <button
            onClick={handleExportCSV}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Prototype Transparent Engineering Note */}
      <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 text-xs sm:text-sm text-teal-950 flex items-start gap-3 shadow-xs">
        <div className="p-2 bg-teal-100 rounded-xl shrink-0 mt-0.5 text-teal-700">
          <Info className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <span className="font-bold text-teal-900 block sm:inline mr-1">
            Prototype note:
          </span>
          The current release uses an explainable, configurable forecasting baseline based on expected attendance, event flags, previous-day demand, and seven-day average demand. In production, the same input pipeline can support a trained machine-learning model using institution-specific historical consumption data.
        </div>
      </div>

      {/* Grid: Forecast Input Form + Live AI Output Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-600" />
            Demand Prediction Input Parameters
          </h3>

          <form onSubmit={handleSavePrediction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forecast Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Day of Week */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Menu Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Menu Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoodCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Rice">Rice (Main)</option>
                  <option value="Curry">Curry / Dal</option>
                  <option value="Snacks">Snacks / Refreshment</option>
                  <option value="Breakfast">Breakfast Items</option>
                  <option value="Dessert">Dessert / Sweet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Food Item Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Food Item Planned
              </label>
              <input
                type="text"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="e.g. Vegetable Rice & Sambar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Numbers Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Attendance
                </label>
                <input
                  type="number"
                  min={1}
                  value={expectedAttendance}
                  onChange={(e) => setExpectedAttendance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-emerald-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Previous Day Demand
                </label>
                <input
                  type="number"
                  min={0}
                  value={prevDayDemand}
                  onChange={(e) => setPrevDayDemand(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  7-Day Avg Demand
                </label>
                <input
                  type="number"
                  min={0}
                  value={avg7DayDemand}
                  onChange={(e) => setAvg7DayDemand(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Checkboxes for Adjustments */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contextual Adjustments (Rule Modifiers)
              </div>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHolidayOrEvent}
                  onChange={(e) => setIsHolidayOrEvent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-medium">Holiday or Campus College Event (+8% demand adjustment)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpecialMenu}
                  onChange={(e) => setIsSpecialMenu(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
                />
                <span className="font-medium">Special / Feast Menu (+5% popularity adjustment)</span>
              </label>
            </div>

            {/* Submit / Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Prediction to History</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live AI Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live AI Forecast Result
                </span>
                <span className="text-[11px] bg-emerald-800/60 text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Confidence: {calculation.confidenceScore}%
                </span>
              </div>

              {/* Big Prediction Metrics */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-xs block">Predicted Demand</span>
                  <div className="text-3xl font-extrabold text-emerald-300 font-display mt-0.5">
                    {calculation.predictedDemand}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">meals expected</span>
                </div>

                <div className="p-3.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-200 text-xs block font-semibold">Recommended Prep</span>
                  <div className="text-3xl font-extrabold text-white font-display mt-0.5">
                    {calculation.recommendedPreparation}
                  </div>
                  <span className="text-[11px] text-emerald-300 block mt-0.5">+5% safety buffer</span>
                </div>
              </div>

              {/* Risk Badge */}
              <div className="mt-4 flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-300">Overproduction Risk:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  calculation.overproductionRisk === 'Low'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    : calculation.overproductionRisk === 'Medium'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                }`}>
                  {calculation.overproductionRisk} Risk
                </span>
              </div>

              {/* AI Recommendation Message */}
              <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/15 text-xs sm:text-sm leading-relaxed text-slate-200">
                <span className="font-bold text-emerald-400 block mb-1">
                  AI Kitchen Recommendation:
                </span>
                “{calculation.aiRecommendation}”
              </div>
            </div>

            {/* Formula Reference */}
            <div className="mt-6 pt-3 border-t border-emerald-800/60 text-[11px] text-slate-400 space-y-1">
              <div>Base Formula: <code className="text-emerald-300 font-mono">rawDemand = expectedAttendance × 0.92</code></div>
              <div>Smoothing: <code className="text-emerald-300 font-mono">predicted = round(0.90×raw + 0.05×prev + 0.05×avg7)</code></div>
              <div>Buffer: <code className="text-emerald-300 font-mono">recommendedPrep = round(predicted × 1.05)</code></div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Demand Prediction History & Accuracy
            </h3>
            <p className="text-xs text-slate-500">
              Comparing past AI recommendations against actual meals served
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search food item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={filterMealType}
              onChange={(e) => setFilterMealType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">All Meals</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date & Meal</th>
                <th className="px-4 py-3">Food Item</th>
                <th className="px-4 py-3">Expected</th>
                <th className="px-4 py-3">Predicted</th>
                <th className="px-4 py-3">Recommended</th>
                <th className="px-4 py-3">Actual Served</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredForecasts.length > 0 ? (
                filteredForecasts.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{f.date}</div>
                      <div className="text-[11px] text-slate-500">{f.mealType} ({f.dayOfWeek})</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{f.foodItem}</div>
                      <div className="text-[11px] text-slate-400">{f.category}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {f.expectedAttendance}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      {f.predictedDemand}
                    </td>
                    <td className="px-4 py-3 font-bold text-teal-800">
                      {f.recommendedPreparation}
                    </td>
                    <td className="px-4 py-3">
                      {f.actualMealsServed !== undefined ? (
                        <span className="font-bold text-slate-900">{f.actualMealsServed}</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending service</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {f.accuracy ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {f.accuracy}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        f.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => effectiveDeleteForecast(f.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete forecast record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No forecast records matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
