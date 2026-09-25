import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Building2, 
  Thermometer, 
  Coins, 
  Leaf, 
  Bell, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Phone,
  User,
  MapPin
} from 'lucide-react';
import { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../services/mockData';

interface SettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  onResetAllData,
  showToast,
}) => {
  const [form, setForm] = useState<AppSettings>(settings);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    showToast('Settings Saved', 'System configuration updated and persisted to localStorage.', 'success');
  };

  const handleResetDefaults = () => {
    setForm(DEFAULT_SETTINGS);
    onSaveSettings(DEFAULT_SETTINGS);
    showToast('Defaults Restored', 'Configuration restored to default Vijayawada canteen parameters.', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
              System Configuration
            </span>
            <span className="text-xs text-slate-400">SIH26234 Control Plane</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-1">
            Kitchen & Platform Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure institutional details, storage temperature safety limits, financial rate benchmarks, and notification protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Kitchen Facility Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Institutional Kitchen Facility Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kitchen / Canteen Name
              </label>
              <input
                type="text"
                value={form.kitchenName}
                onChange={(e) => handleChange('kitchenName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Demonstration City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Street Address
              </label>
              <input
                type="text"
                value={form.kitchenAddress}
                onChange={(e) => handleChange('kitchenAddress', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person / In-Charge
              </label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Safety & Metric Parameters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Thermometer className="w-5 h-5 text-teal-600" />
            <span>Thresholds & Calculation Factors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Safe Temp Threshold (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={form.safeTempThreshold}
                onChange={(e) => handleChange('safeTempThreshold', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-teal-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 8.0°C</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Redistribution Deadline (hrs)
              </label>
              <input
                type="number"
                value={form.defaultRedistributionDeadlineHours}
                onChange={(e) => handleChange('defaultRedistributionDeadlineHours', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 4 hours from cook</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avg Meal Portion (kg)
              </label>
              <input
                type="number"
                step="0.05"
                value={form.avgMealPortionKg}
                onChange={(e) => handleChange('avgMealPortionKg', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 0.25 kg / meal</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cost Factor (₹ per kg)
              </label>
              <input
                type="number"
                value={form.costPerKgRupees}
                onChange={(e) => handleChange('costPerKgRupees', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: ₹200 / kg</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carbon Factor (kg CO2e/kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.carbonFactorKgCO2PerKg}
                onChange={(e) => handleChange('carbonFactorKgCO2PerKg', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-cyan-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 2.5 kg CO2e / kg</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Vehicle Speed (km/h)
              </label>
              <input
                type="number"
                value={form.defaultVehicleSpeedKmh}
                onChange={(e) => handleChange('defaultVehicleSpeedKmh', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-blue-800 focus:outline-hidden"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: 20 km/h</span>
            </div>
          </div>
        </div>

        {/* Section 3: Notification & Broadcast Toggles */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Alerts & NGO Communication Protocols</span>
          </h3>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Automatic NGO Broadcast</span>
                <span className="text-[11px] text-slate-500">Automatically broadcast offers to top 3 ranked Vijayawada NGOs when quality score ≥ 80</span>
              </div>
              <input
                type="checkbox"
                checked={form.autoNgoBroadcast}
                onChange={(e) => handleChange('autoNgoBroadcast', e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded-md"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-800 block">SMS Volunteer Dispatches</span>
                <span className="text-[11px] text-slate-500">Send simulated SMS dispatch alerts to assigned vehicle drivers</span>
              </div>
              <input
                type="checkbox"
                checked={form.smsAlerts}
                onChange={(e) => handleChange('smsAlerts', e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded-md"
              />
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetAllData}
            className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Clear & Reset All LocalStorage Demo Data
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
