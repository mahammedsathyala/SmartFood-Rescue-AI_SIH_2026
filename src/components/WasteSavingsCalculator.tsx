import React, { useState } from 'react';
import { Calculator, Utensils, IndianRupee, Leaf, Droplets, Sparkles, ArrowRight } from 'lucide-react';

interface WasteSavingsCalculatorProps {
  onExploreDemo?: () => void;
}

export const WasteSavingsCalculator: React.FC<WasteSavingsCalculatorProps> = ({ onExploreDemo }) => {
  const [peopleCount, setPeopleCount] = useState<number>(1500);
  const [mealsPerDay, setMealsPerDay] = useState<number>(2);
  const [surplusRate, setSurplusRate] = useState<number>(8); // percentage

  // Preset Configurations
  const applyPreset = (count: number, meals: number, surplus: number) => {
    setPeopleCount(count);
    setMealsPerDay(meals);
    setSurplusRate(surplus);
  };

  // Mathematical Projections
  // Standard meal portion ~ 0.4 kg
  const dailyTotalMeals = peopleCount * mealsPerDay;
  const dailySurplusMeals = Math.round(dailyTotalMeals * (surplusRate / 100));
  const monthlyRescuedMeals = dailySurplusMeals * 30;
  
  // Avg cost of institutional meal in India ~ ₹45
  const monthlyCostSavingsRupees = monthlyRescuedMeals * 45;
  
  // 1 kg food waste ~ 2.5 kg CO2e emissions avoided
  const dailySurplusKg = dailySurplusMeals * 0.4;
  const monthlyCO2AvoidedKg = Math.round(dailySurplusKg * 30 * 2.5);
  
  // 1 kg food ~ ~750L water embedded footprint saved
  const monthlyWaterSavedKL = Math.round((dailySurplusKg * 30 * 750) / 1000);

  return (
    <div className="w-full bg-linear-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-700/60 relative overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI & Carbon Calculator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Estimate Your Kitchen's Rescue Potential
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Simulate tangible environmental and financial returns for your canteen, mess, or institution with SmartFood Rescue AI.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset(1500, 2, 8)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              peopleCount === 1500 && mealsPerDay === 2
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            🎓 College Canteen
          </button>
          <button
            onClick={() => applyPreset(800, 1, 6)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              peopleCount === 800 && mealsPerDay === 1
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            🏢 Tech Park Cafe
          </button>
          <button
            onClick={() => applyPreset(3000, 3, 10)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              peopleCount === 3000 && mealsPerDay === 3
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            🏫 Mega Hostel Mess
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Projected Impact on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
        {/* Sliders Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* People Count Slider */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xs">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Daily Strength / Footfall</label>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                {peopleCount.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">people</span>
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>200</span>
              <span>2,500</span>
              <span>5,000</span>
            </div>
          </div>

          {/* Meals Per Day */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xs">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Meals Served Daily</label>
              <span className="text-sm font-extrabold text-teal-400 font-mono">
                {mealsPerDay} <span className="text-xs text-slate-400 font-normal">shifts</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMealsPerDay(num)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    mealsPerDay === num
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {num === 1 ? '1 (Lunch)' : num === 2 ? '2 (Lunch+Dinner)' : '3 (All Meals)'}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Surplus Rate Slider */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-xs">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Unconsumed Surplus Rate</label>
              <span className="text-sm font-extrabold text-cyan-400 font-mono">
                {surplusRate}% <span className="text-xs text-slate-400 font-normal">of prep</span>
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={surplusRate}
              onChange={(e) => setSurplusRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>3% (Tight)</span>
              <span>10% (Typical)</span>
              <span>20% (High)</span>
            </div>
          </div>
        </div>

        {/* Projected Impact Cards (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Meals Rescued */}
            <div className="bg-linear-to-br from-emerald-950/60 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 backdrop-blur-md relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Monthly Rescued Food
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Utensils className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {monthlyRescuedMeals.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-300/80 font-medium mt-1">
                  Healthy meals redirected to local shelters
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-500/20 text-[11px] text-slate-400">
                Daily surplus: <span className="text-white font-mono font-bold">{dailySurplusMeals} meals</span> (~{Math.round(dailySurplusKg)} kg)
              </div>
            </div>

            {/* Card 2: Cost Savings */}
            <div className="bg-linear-to-br from-teal-950/60 to-slate-900 p-5 rounded-2xl border border-teal-500/30 backdrop-blur-md relative overflow-hidden group hover:border-teal-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                  Cost Efficiency Saved
                </span>
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  ₹{monthlyCostSavingsRupees.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-teal-300/80 font-medium mt-1">
                  Recovered value & prevented procurement loss
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-teal-500/20 text-[11px] text-slate-400">
                Annual potential: <span className="text-white font-mono font-bold">₹{(monthlyCostSavingsRupees * 12).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Card 3: Carbon Offset */}
            <div className="bg-linear-to-br from-cyan-950/60 to-slate-900 p-5 rounded-2xl border border-cyan-500/30 backdrop-blur-md relative overflow-hidden group hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                  GHG Emissions Avoided
                </span>
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Leaf className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {monthlyCO2AvoidedKg.toLocaleString('en-IN')} <span className="text-lg font-normal text-cyan-300">kg</span>
                </div>
                <div className="text-xs text-cyan-300/80 font-medium mt-1">
                  CO₂e greenhouse gases diverted from landfill
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-cyan-500/20 text-[11px] text-slate-400">
                Equivalent to: <span className="text-white font-mono font-bold">{Math.round(monthlyCO2AvoidedKg / 22)} mature tree seedlings grown</span>
              </div>
            </div>

            {/* Card 4: Water Conserved */}
            <div className="bg-linear-to-br from-blue-950/60 to-slate-900 p-5 rounded-2xl border border-blue-500/30 backdrop-blur-md relative overflow-hidden group hover:border-blue-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Embedded Water Saved
                </span>
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {monthlyWaterSavedKL.toLocaleString('en-IN')} <span className="text-lg font-normal text-blue-300">kL</span>
                </div>
                <div className="text-xs text-blue-300/80 font-medium mt-1">
                  Freshwater agricultural footprint preserved
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-500/20 text-[11px] text-slate-400">
                Equals: <span className="text-white font-mono font-bold">~{(monthlyWaterSavedKL * 1000).toLocaleString('en-IN')} Liters</span> conserved
              </div>
            </div>
          </div>

          {/* Action Trigger in Calculator */}
          {onExploreDemo && (
            <div className="mt-5 p-4 rounded-2xl bg-linear-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ready to see how SmartFood Rescue AI automates this entire lifecycle?</span>
              </div>
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer shrink-0"
              >
                <span>Launch Live System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
